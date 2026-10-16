import { agents } from "@/data/agents";
import { listings } from "@/data/listings";
import * as panel from "@/data/panel";
import { posts } from "@/data/posts";
import { regions } from "@/data/regions";
import type { Agent, Listing, Post, Region } from "@/data/types";
import {
  countLeadsSince,
  getAppointmentsForDates,
  getBookedSlots,
  getRecentLeads,
  getUpcomingAppointments,
} from "@/db/queries";
import { daysBetween } from "./format";
import {
  matchesFilters,
  PAGE_SIZE,
  sortListings,
  type ListingFilters,
} from "./listing-filters";

/**
 * Veri erişim katmanı (K10).
 * Demoda statik veriden okur. Üretimde bu fonksiyonların gövdesi Payload Local API
 * çağrılarıyla değiştirilir; imzalar aynı kalır, sayfalar değişmez (Bölüm 20.8).
 */

const isActive = (l: Listing) => l.status === "yayinda" || l.status === "opsiyonlu";
const isClosed = (l: Listing) => l.status === "satildi" || l.status === "kiralandi";

const regionBySlug = new Map(regions.map((r) => [r.slug, r]));
const agentBySlug = new Map(agents.map((a) => [a.slug, a]));
const listingBySlug = new Map(listings.map((l) => [l.slug, l]));

// ---------------------------------------------------------------- İlanlar

export async function getAllListings(): Promise<Listing[]> {
  return listings;
}

export async function getActiveListings(): Promise<Listing[]> {
  return sortListings(listings.filter(isActive), "yeni");
}

export interface ListingQueryResult {
  items: Listing[];
  total: number;
  page: number;
  pageCount: number;
}

export async function queryListings(filters: ListingFilters): Promise<ListingQueryResult> {
  const matched = listings.filter(
    (l) => isActive(l) && matchesFilters(l, filters, (slug) => regionBySlug.get(slug)?.name),
  );
  const sorted = sortListings(matched, filters.siralama);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(filters.sayfa, pageCount);
  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
  };
}

export async function getListing(slug: string): Promise<Listing | undefined> {
  return listingBySlug.get(slug);
}

export async function getListingByNo(no: string): Promise<Listing | undefined> {
  return listings.find((l) => l.no === no);
}

export async function getAllListingSlugs(): Promise<string[]> {
  return listings.map((l) => l.slug);
}

export async function getFeaturedListings(limit = 8): Promise<Listing[]> {
  return sortListings(listings.filter((l) => isActive(l) && l.featured), "yeni").slice(0, limit);
}

export async function getClosedListings(limit?: number): Promise<Listing[]> {
  const closed = listings
    .filter(isClosed)
    .sort((a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? ""));
  return limit ? closed.slice(0, limit) : closed;
}

export async function getSimilarListings(listing: Listing, limit = 3): Promise<Listing[]> {
  const score = (l: Listing) =>
    (l.transaction === listing.transaction ? 4 : 0) +
    (l.regionSlug === listing.regionSlug ? 3 : 0) +
    (l.type === listing.type ? 2 : 0) +
    (Math.abs(l.price - listing.price) / listing.price < 0.35 ? 2 : 0);
  return listings
    .filter((l) => isActive(l) && l.id !== listing.id)
    .map((l) => ({ l, s: score(l) }))
    .sort((a, b) => b.s - a.s || b.l.publishedAt.localeCompare(a.l.publishedAt))
    .slice(0, limit)
    .map(({ l }) => l);
}

export function daysOnMarket(listing: Listing) {
  return listing.closedAt ? daysBetween(listing.publishedAt, listing.closedAt) : undefined;
}

// ---------------------------------------------------------------- Bölgeler

export async function getRegions(): Promise<Region[]> {
  return regions;
}

export async function getRegion(slug: string): Promise<Region | undefined> {
  return regionBySlug.get(slug);
}

export function regionOf(listing: Listing): Region {
  const region = regionBySlug.get(listing.regionSlug);
  if (!region) throw new Error(`Bilinmeyen bölge: ${listing.regionSlug}`);
  return region;
}

export async function getRegionListingCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const l of listings.filter(isActive)) {
    counts[l.regionSlug] = (counts[l.regionSlug] ?? 0) + 1;
  }
  return counts;
}

export async function getRegionListings(slug: string): Promise<Listing[]> {
  return sortListings(
    listings.filter((l) => isActive(l) && l.regionSlug === slug),
    "yeni",
  );
}

// ---------------------------------------------------------------- Danışmanlar

export async function getAgents(): Promise<Agent[]> {
  return agents;
}

export async function getAgent(slug: string): Promise<Agent | undefined> {
  return agentBySlug.get(slug);
}

export function agentOf(listing: Listing): Agent {
  const agent = agentBySlug.get(listing.agentSlug);
  if (!agent) throw new Error(`Bilinmeyen danışman: ${listing.agentSlug}`);
  return agent;
}

export async function getAgentListings(slug: string) {
  const own = listings.filter((l) => l.agentSlug === slug);
  return {
    active: sortListings(own.filter(isActive), "yeni"),
    closed: own.filter(isClosed),
  };
}

// ---------------------------------------------------------------- Blog

export async function getPosts(): Promise<Post[]> {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return posts.find((p) => p.slug === slug);
}

export async function getRelatedPosts(post: Post, limit = 2): Promise<Post[]> {
  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  return [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}

// ---------------------------------------------------------------- Ofis paneli (demo)

export async function getPanelData() {
  return {
    contacts: panel.crmContacts,
    stages: panel.pipelineStages,
    leadsBySource: panel.leadsBySource,
    appointments: panel.panelAppointments,
    activities: panel.panelActivities,
    agentMonth: panel.agentMonth,
  };
}

// ---------------------------------------------------------------- Gerçek kayıtlar (K20)
// Veritabanından okur (src/db/queries.ts). "now"a bağlı tarihler çağıran yerde hesaplanır;
// bu dosya render sırasında new Date() çağırmaz (Cache Components kuralı).

export async function getRecentLeadsCount(sinceIso: string) {
  return countLeadsSince(sinceIso);
}

export async function getRecentLeadsList(limit?: number) {
  return getRecentLeads(limit);
}

export async function getAppointmentsOnDates(dates: string[]) {
  return getAppointmentsForDates(dates);
}

export async function getAllUpcomingAppointments(limit?: number) {
  return getUpcomingAppointments(limit);
}

export async function getBookedSlotsForAgent(agentSlug: string, fromDate: string) {
  return getBookedSlots(agentSlug, fromDate);
}

import { NextResponse, type NextRequest } from "next/server";
import { PANEL_SESSION_COOKIE, verifyPanelSessionToken } from "@/lib/panel-auth";

/** /panel korumalı alan (K20). Oturum yoksa /panel/giris'e yönlendirir. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/panel/giris") return NextResponse.next();

  const token = request.cookies.get(PANEL_SESSION_COOKIE)?.value;
  const valid = await verifyPanelSessionToken(token);
  if (valid) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/panel/giris";
  url.searchParams.set("sonra", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/panel/:path*"],
};

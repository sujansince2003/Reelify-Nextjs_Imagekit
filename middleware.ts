import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/login") ||
                    pathname === "/register"
                ) {
                    //Allow these paths without checking authentication:
                    return true
                }
                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    //Allow these  paths too without checking authentication:
                    return true;
                }
                /* 
               For all other routes: if there's a token → allow the request.
               If there's no token, the middleware blocks it (by redirecting to login automatically).    
               */
                return !!token;
            }
        }
    }
)
export const config = {
    //Run this middleware on all routes, except these following routes
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
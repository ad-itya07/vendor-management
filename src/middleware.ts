// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define your public routes here
const isPublicRoute = createRouteMatcher([
  "/",                  // Public home page
  "/about",             // Example additional public route
  "/api/webhook/clerk", // Your Clerk webhook route
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes
  if (isPublicRoute(req)) return NextResponse.next();

  // All other routes require authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

// Optional: apply middleware to all routes
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

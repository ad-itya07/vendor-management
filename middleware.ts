import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { clerkClient } from "@clerk/clerk-sdk-node";

const isPublicRoute = createRouteMatcher(["/", "/api/webhook/clerk"]);

export default clerkMiddleware(async (auth, req) => {
  // Skip for public routes
  if (isPublicRoute(req)) return NextResponse.next();

  const userId = (await auth()).userId;
  // If user is authenticated
  if (userId) {
    try {
      await dbConnect();

      let user = await User.findOne({ clerkId: userId });

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(userId); // ✅ Fix 2
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (email) {
          await User.create({
            email,
            clerkId: userId,
            role: "user", // default
          });
        }
      }
    } catch (error) {
      console.error("❌ Middleware error:", error);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }

  return NextResponse.next();
});

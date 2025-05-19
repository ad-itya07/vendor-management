import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { User } from "./src/models/User";
import dbConnect from "./src/lib/mongodb";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/clerk"],
  
  async afterAuth(auth, req) {
    // If the user is logged in and accessing a protected route
    if (auth.userId && !auth.isPublicRoute) {
      try {
        await dbConnect();
        
        // Check if user exists in our database
        let user = await User.findOne({ clerkId: auth.userId });
        
        // If not, create a new user (first-time login)
        if (!user) {
          const clerkUser = await clerkClient.users.getUser(auth.userId);
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          
          if (email) {
            // Create a new user in our database
            user = await User.create({
              email,
              clerkId: auth.userId,
              role: 'user' // Default role
            });
          }
        }
      } catch (error) {
        console.error("Error in auth middleware:", error);
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
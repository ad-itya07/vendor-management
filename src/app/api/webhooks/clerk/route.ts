import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET not set in env");
    return new Response("Server error", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  try {
    await dbConnect();
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    return new Response("Database connection error", { status: 500 });
  }

  const eventType = evt.type;

  // Handle user.created
  if (eventType === "user.created") {
    const { id: clerkId, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email || !clerkId) {
      return new Response("Missing user data", { status: 400 });
    }

    try {
      await User.create({
        clerkId,
        email,
        role: "user", // Matches your schema's default
      });

      return NextResponse.json({ message: "User created" });
    } catch (err) {
      console.error("Error creating user:", err);
      return new Response("Error creating user", { status: 500 });
    }
  }

  // Handle user.updated
  if (eventType === "user.updated") {
    const { id: clerkId, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email || !clerkId) {
      return new Response("Missing user data", { status: 400 });
    }

    try {
      await User.findOneAndUpdate(
        { clerkId },
        { email },
        { new: true }
      );

      return NextResponse.json({ message: "User updated" });
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Error updating user", { status: 500 });
    }
  }

  // Handle user.deleted
  if (eventType === "user.deleted") {
    const { id: clerkId } = evt.data;

    try {
      await User.findOneAndDelete({ clerkId });
      return NextResponse.json({ message: "User deleted" });
    } catch (err) {
      console.error("Error deleting user:", err);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  return NextResponse.json({ message: "Unhandled event type" });
}

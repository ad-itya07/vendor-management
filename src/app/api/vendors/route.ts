import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // ✅ Corrected import
import dbConnect from "@/lib/mongodb";
import { Vendor } from "@/models/Vendor";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const filter = searchParams.get("filter") || "";

    let query: any = {};

    if (user.role !== "admin") {
      query.createdBy = user._id;
    }

    if (filter) {
      query.name = { $regex: filter, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {}; // ✅ Corrected Record type
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const vendors = await Vendor.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "email")
      .lean();

    const totalCount = await Vendor.countDocuments(query);

    return NextResponse.json({
      vendors,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    if (
      !body.name ||
      !body.bankAccountNumber ||
      !body.bankName ||
      !body.addressLine1
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingVendor = await Vendor.findOne({
      name: body.name,
      createdBy: user._id,
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: "Vendor name must be unique" },
        { status: 400 }
      );
    }

    const newVendor = await Vendor.create({
      ...body,
      createdBy: user._id,
    });

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error: any) {
    console.error("Error creating vendor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

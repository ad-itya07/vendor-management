import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Vendor } from '@/models/Vendor';
import { User } from '@/models/User';

// GET a specific vendor
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const vendor = await Vendor.findById(params.id).populate('createdBy', 'email');
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Check ownership (admin can access all vendors, users only their own)
    if (user.role !== 'admin' && vendor.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(vendor);

  } catch (error: any) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE a vendor
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const vendor = await Vendor.findById(params.id);
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Check ownership (admin can edit all vendors, users only their own)
    if (user.role !== 'admin' && vendor.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.bankAccountNumber || !body.bankName || !body.addressLine1) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Check if updated vendor name already exists for another vendor of this user
    if (body.name !== vendor.name) {
      const existingVendor = await Vendor.findOne({ 
        name: body.name,
        createdBy: user._id,
        _id: { $ne: params.id }
      });

      if (existingVendor) {
        return NextResponse.json(
          { error: 'Vendor name must be unique' }, 
          { status: 400 }
        );
      }
    }

    // Update vendor
    const updatedVendor = await Vendor.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedVendor);

  } catch (error: any) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a vendor
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const vendor = await Vendor.findById(params.id);
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Check ownership (admin can delete all vendors, users only their own)
    if (user.role !== 'admin' && vendor.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Vendor.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Vendor deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting vendor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
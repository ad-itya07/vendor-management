import mongoose, { Schema } from "mongoose";

export interface IVendor {
  _id: string;
  name: string;
  bankAccountNumber: string;
  bankName: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  zip?: string;
  createdBy: Schema.Types.ObjectId;
}

const VendorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
    },
    bankAccountNumber: {
      type: String,
      required: [true, "Bank account number is required"],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
    },
    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    zip: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure vendor name is unique per user
VendorSchema.index({ name: 1, createdBy: 1 }, { unique: true });

export const Vendor =
  mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);

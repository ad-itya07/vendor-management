"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface VendorFormProps {
  initialData?: {
    _id?: string;
    name: string;
    bankAccountNumber: string;
    bankName: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

const VendorForm: React.FC<VendorFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: "",
      bankAccountNumber: "",
      bankName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "",
      zip: "",
    },
  });

  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Vendor Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Vendor Name*
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Vendor name is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">
            {errors.name.message as string}
          </p>
        )}
      </div>

      {/* Bank Account Number */}
      <div className="space-y-1">
        <label
          htmlFor="bankAccountNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Bank Account Number*
        </label>
        <input
          id="bankAccountNumber"
          type="text"
          {...register("bankAccountNumber", {
            required: "Bank account number is required",
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.bankAccountNumber && (
          <p className="text-red-500 text-sm">
            {errors.bankAccountNumber.message as string}
          </p>
        )}
      </div>

      {/* Bank Name */}
      <div className="space-y-1">
        <label
          htmlFor="bankName"
          className="block text-sm font-medium text-gray-700"
        >
          Bank Name*
        </label>
        <input
          id="bankName"
          type="text"
          {...register("bankName", { required: "Bank name is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.bankName && (
          <p className="text-red-500 text-sm">
            {errors.bankName.message as string}
          </p>
        )}
      </div>

      {/* Address Line 1 */}
      <div className="space-y-1">
        <label
          htmlFor="addressLine1"
          className="block text-sm font-medium text-gray-700"
        >
          Address Line 1*
        </label>
        <input
          id="addressLine1"
          type="text"
          {...register("addressLine1", {
            required: "Address line 1 is required",
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.addressLine1 && (
          <p className="text-red-500 text-sm">
            {errors.addressLine1.message as string}
          </p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="space-y-1">
        <label
          htmlFor="addressLine2"
          className="block text-sm font-medium text-gray-700"
        >
          Address Line 2
        </label>
        <input
          id="addressLine2"
          type="text"
          {...register("addressLine2")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* City, Country, Zip in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="space-y-1">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            {...register("city")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            id="country"
            type="text"
            {...register("country")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Zip Code */}
        <div className="space-y-1">
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </label>
          <input
            id="zip"
            type="text"
            {...register("zip")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialData?._id
            ? "Update Vendor"
            : "Create Vendor"}
        </button>
      </div>
    </form>
  );
};

export default VendorForm;

"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteConfirmation from "./DeleteConfirmation";

interface Vendor {
  id: string;
  name: string;
  bankAccountNumber: string;
  bankName: string;
  createdBy?: {
    email: string;
  };
}

interface VendorListItemProps {
  vendor: Vendor;
  isAdmin: boolean;
}

const VendorListItem: React.FC<VendorListItemProps> = ({ vendor, isAdmin }) => {
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete vendor");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert(error instanceof Error ? error.message : "Failed to delete vendor");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {vendor.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {vendor.bankAccountNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {vendor.bankName}
      </td>
      {isAdmin && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {vendor.createdBy?.email || "Unknown"}
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Link
            href={`/vendors/${vendor.id}/edit`}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="text-red-600 hover:text-red-900 font-medium"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>

      {showDeleteConfirmation && (
        <DeleteConfirmation
          title="Delete Vendor"
          message={`Are you sure you want to delete ${vendor.name}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </tr>
  );
};

export default VendorListItem;

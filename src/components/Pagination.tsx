"use client";

import type React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
}) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <Link
          href={`${baseUrl}${currentPage - 1}`}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50 cursor-pointer"
          }`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : 0}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        {pages.map((page) => (
          <Link
            key={page}
            href={`${baseUrl}${page}`}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              page === currentPage
                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        ))}

        <Link
          href={`${baseUrl}${currentPage + 1}`}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:bg-gray-50 cursor-pointer"
          }`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : 0}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterBar() {
  const filters = [
    {
      label: "Occassion",
      options: ["Birthday", "Wedding", "Anniversary", "Corporate", "Festival"],
    },
    {
      label: "Gift Type",
      options: [
        "Clothing",
        "Accessories",
        "Home Decor",
        "Electronics",
        "Personalized",
      ],
    },
    {
      label: "Price",
      options: [
        "Under ₦1,000",
        "₦1,000 - ₦5,000",
        "₦5,000 - ₦10,000",
        "Above ₦10,000",
      ],
    },
  ];

  const quickFilters = ["Discounts", "Made In Naija", "Delivery Date"];

  return (
    <div className="bg-white border-b border-gray-200 px-4 font-sans lg:px-8 py-4 hidden md:block">
      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <div key={filter.label} className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 shadow-xs rounded-lg hover:border-gray-400 transition-colors bg-white">
              <span className="text-md font-medium text-gray-900">
                {filter.label}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}

        {/* Quick Filters */}
        {quickFilters.map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 text-md font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

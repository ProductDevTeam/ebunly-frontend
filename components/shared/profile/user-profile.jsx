"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const UserProfile = ({
  name = "Adeoluwa Haastrup",
  email = "Example.Email@gmail.com",
  avatarUrl = null,
  defaultCountry = "NGN",
  onCountryChange = () => {},
}) => {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  const countries = [
    { code: "NGN", name: "Nigeria", flag: "/flags/ng.svg" },
    { code: "USD", name: "United States", flag: "/flags/us.svg" },
    { code: "GBP", name: "United Kingdom", flag: "/flags/gb.svg" },
    { code: "EUR", name: "Europe", flag: "/flags/eu.svg" },
  ];

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsCountryOpen(false);
    onCountryChange(countryCode);
  };

  const currentCountry =
    countries.find((c) => c.code === selectedCountry) || countries[0];

  return (
    <div className="flex flex-col items-center py-8 px-4 font-sans bg-[#FFF7F5]">
      {/* Avatar */}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-4 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {avatarUrl ? (
          <Image
            src="/avatars/profile.svg"
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
        )}
      </motion.div>

      {/* Name */}
      <motion.h2
        className="text-xl font-semibold text-gray-900 font-sans mb-1"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {name}
      </motion.h2>

      {/* Email */}
      <motion.p
        className="text-sm text-gray-500 mb-4"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {email}
      </motion.p>

      {/* Country Selector */}
      <motion.div
        className="relative"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <button
          onClick={() => setIsCountryOpen(!isCountryOpen)}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden">
            <Image
              src={currentCountry.flag}
              alt={currentCountry.name}
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
          <span className="text-sm font-semibold text-black">
            {currentCountry.code}
          </span>
          <motion.div
            animate={{ rotate: isCountryOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-black" />
          </motion.div>
        </button>

        {/* Dropdown */}
        {isCountryOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 min-w-45"
          >
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                  selectedCountry === country.code ? "bg-orange-50" : ""
                }`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={country.flag}
                    alt={country.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {country.code}
                  </span>
                  <span className="text-xs text-gray-500">{country.name}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Click outside to close dropdown */}
      {isCountryOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsCountryOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;

"use client";

import { useState } from "react";
import { Instagram, Mail, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const quickLinks = [
    {
      icon: <Instagram className="w-6 h-6" />,
      label: "Instagram",
      href: "https://instagram.com/ebunly",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: "X (Twitter)",
      href: "https://twitter.com/ebunly",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Send us an email",
      href: "mailto:support@ebunly.com",
      fullWidth: true,
    },
  ];

  const faqs = [
    {
      question: "What is Ebunly?",
      answer:
        "Ebunly is a curated marketplace for personalized, thoughtfully designed event souvenirs that people actually keep and use.",
    },
    {
      question: "Can I customize my souvenir?",
      answer:
        "Yes. Most Ebunly products can be personalized with details like names, dates, or locations. Customization options are shown on each product page.",
    },
    {
      question: "Who makes the souvenirs?",
      answer:
        "Our souvenirs are crafted by carefully selected vendors from around the world. Every item is reviewed by Ebunly before it is shipped to you.",
    },
    {
      question: "How long does production and delivery take?",
      answer:
        "Timelines vary by product and level of customization. Estimated delivery dates are provided at checkout.",
    },
    {
      question: "Can I return or exchange my order?",
      answer:
        "Because our products are customized, all sales are final unless the item arrives damaged or incorrect due to an error on our part.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes. We ship to multiple countries. Shipping options and costs are shown during checkout.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Support</h1>

        {/* Quick Links Section */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors ${
                  link.fullWidth ? "col-span-2" : ""
                }`}
              >
                <div className="text-gray-900">{link.icon}</div>
                <span className="text-sm text-gray-900 text-center">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-3 last:border-b-0"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-2 text-left group"
                >
                  <span
                    className={`text-base ${
                      openFaq === index
                        ? "font-semibold text-gray-900"
                        : "text-gray-900"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 ml-4">
                    {openFaq === index ? (
                      <Minus className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed pt-2 pb-3">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;

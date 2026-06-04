import Link from "next/link";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

export const metadata = {
  title: "Terms of Service",
  description: "Ebunly Terms of Service",
};

const sections = [
  {
    title: "About Ebunly:",
    content:
      "Ebunly offers personalized and customized souvenirs for events. We work with selected artisans and manage quality checks, packaging, shipping, and customer support.",
  },
  {
    title: "Eligibility:",
    content: "You must be at least 18 years old to place an order.",
  },
  {
    title: "Orders and Customization:",
    content:
      "All products are made to order. You are responsible for confirming that all customization details and delivery information are correct before placing your order. Once production begins, changes may not be possible.",
  },
  {
    title: "Pricing and Payments:",
    content:
      "Prices are listed on the website and may change at any time. Full payment is required before production begins. Ebunly may cancel or refuse orders at its discretion.",
  },
  {
    title: "Delivery:",
    content:
      "Delivery timelines are estimates and not guaranteed. Ebunly is not responsible for delays caused by couriers, customs, or incorrect information provided by the customer.",
  },
  {
    title: "Returns and Refunds:",
    content:
      "Because products are customized, all sales are final unless the item arrives damaged or incorrect due to an error on our part. Issues must be reported within 12-24 hours of delivery.",
    highlight: "12-24 hours",
  },
  {
    title: "Intellectual Property:",
    content:
      "All website content and designs belong to Ebunly or its partners",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navbar />

      <main className="mx-auto w-full max-w-[600px] flex-1 px-6 py-10 md:py-14">
        {/* Heading */}
        <h1 className="text-[22px] font-bold tracking-tight text-[#1A1A1A] md:text-[28px]">
          Terms of Service
        </h1>

        {/* Intro */}
        <p className="mt-5 text-[13px] leading-relaxed text-text-dark-gray md:text-[14px]">
          By using Ebunly, you agree to these Terms. If you do not agree, please
          do not use our services.
        </p>

        {/* Sections */}
        <div className="mt-5 space-y-4 md:space-y-5">
          {sections.map((section) => (
            <p
              key={section.title}
              className="text-[13px] leading-relaxed text-text-dark-gray md:text-[14px]"
            >
              <span className="font-semibold text-[#1A1A1A]">
                {section.title}
              </span>{" "}
              {section.highlight ? (
                <>
                  {section.content.split(section.highlight)[0]}
                  <span className="font-semibold text-[#1A1A1A]">
                    {section.highlight}
                  </span>
                  {section.content.split(section.highlight)[1]}
                </>
              ) : (
                section.content
              )}
            </p>
          ))}
        </div>

        {/* Go Home */}
        <div className="mt-10 flex justify-center md:mt-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-[15px] font-semibold text-white"
          >
            Go Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

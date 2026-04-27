"use client";

const TermsOfServicePage = () => {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Terms of Service
        </h1>

        {/* Intro Text */}
        <p className="text-gray-700 mb-8 leading-relaxed">
          By using Ebunly, you agree to these Terms. If you do not agree, please
          do not use our services.
        </p>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-semibold text-gray-900 mb-2">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.highlight ? (
                  <>
                    {section.content.split(section.highlight)[0]}
                    <span className="font-semibold">{section.highlight}</span>
                    {section.content.split(section.highlight)[1]}
                  </>
                ) : (
                  section.content
                )}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

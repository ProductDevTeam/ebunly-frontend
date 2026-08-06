/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  /*
   * /discover was the old search-and-filter page; that behaviour now lives on
   * /shop/categories/[id], with `all` as the unscoped shelf. Permanent so old
   * links, bookmarks and anything already indexed keep working — Next carries
   * the query string across, so /discover?q=bag lands filtered.
   */
  async redirects() {
    return [
      {
        source: "/discover",
        destination: "/shop/categories/all",
        permanent: true,
      },
      {
        source: "/shop/categories/fashion-accessories/jewelry-accessories",
        destination: "/shop/categories/fashion-accessories/jewellery-accessories",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

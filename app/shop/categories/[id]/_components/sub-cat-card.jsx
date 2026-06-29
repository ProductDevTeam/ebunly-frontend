import Image from "next/image";
import Link from "next/link";

export default function SubCatCard({ cat, categorySlug, hasChildren = false }) {
  const imageSrc =
    typeof cat.image === "object" ? cat.image?.url ?? "/product.png" : cat.image;

  return (
    <Link href={`/shop/categories/${categorySlug}/${cat.slug}`} className="block">
      <div className="relative rounded-[20px] overflow-hidden h-50 md:h-86.5">
        <Image
          src={imageSrc}
          alt={cat.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 94.56%)",
          }}
        />
        {hasChildren && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-3">
          <p className="font-semibold text-white text-[14px] leading-tight">
            {cat.name}
          </p>
          <p className="text-white/80 text-[12px] mt-0.5 leading-tight">
            {cat.desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

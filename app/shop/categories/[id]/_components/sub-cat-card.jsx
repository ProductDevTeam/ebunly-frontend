import Image from "next/image";
import Link from "next/link";

export default function SubCatCard({ cat }) {
  return (
    <Link href={`/shop/subcategory/${cat.id}`} className="block">
      <div className="relative rounded-[20px] overflow-hidden h-50 md:h-86.5">
        <Image
          src={cat.image}
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

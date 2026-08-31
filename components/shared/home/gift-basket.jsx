import Link from 'next/link';
import Image from 'next/image';
import { getOccasions } from '@/lib/api/categories';

const staggerDelays = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4', 'reveal-d5'];

function IconBadge({ emoji, size = 'lg' }) {
  const cls = size === 'lg' ? 'w-12 h-12 text-2xl' : 'w-7 h-7 text-base';
  return (
    <div
      className={`${cls} bg-white rounded-full flex items-center justify-center shadow-sm shrink-0`}
    >
      <span className="leading-none">{emoji || '🎁'}</span>
    </div>
  );
}

export default async function GiftBasketsSection() {
  const raw = await getOccasions();
  if (raw.length === 0) return null;

  const occasions = raw.map((occ) => ({
    id: occ._id ?? occ.id,
    name: occ.name,
    subtitle: occ.description || '',
    image: occ.image?.url || null,
    iconEmoji: occ.iconEmoji || '🎁',
    cardBg: occ.cardBg || '#F3F4F6',
    mobileBg: occ.mobileBg || occ.cardBg || '#F3F4F6',
    href: `/shop/categories/${occ.slug}`,
  }));

  const colCount = Math.min(occasions.length, 5);

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 ">
      <div className="max-w-7xl mx-auto bg-[#F5F8FA] rounded-xl px-2 md:px-8 py-8">
        {/* Title */}
        <div data-reveal className="reveal text-center mb-8 md:mb-10">
          <h2 className="inline leading-[96%]">
            <span
              className="font-playfair italic text-[26px] md:text-[34px] text-black"
              style={{ fontWeight: 400, letterSpacing: '-6%' }}
            >
              Gift Baskets{' '}
            </span>
            <span
              className="font-sans font-semibold text-[26px] md:text-[34px] text-black"
              style={{ letterSpacing: '-7%' }}
            >
              for any <br /> event or occasion
            </span>
          </h2>
        </div>

        {/*  Desktop: dynamic grid up to 5 cols  */}
        <div
          className="hidden md:grid gap-4 lg:gap-6"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {occasions.map((occ, i) => (
            <div key={occ.id} data-reveal className={`reveal ${staggerDelays[i] ?? ''}`}>
              <Link href={occ.href} className="group block">
                <div
                  className="w-full rounded-2xl p-2 overflow-hidden"
                  style={{ backgroundColor: occ.cardBg }}
                >
                  <div className="relative aspect-4/3">
                    {occ.image ? (
                      <Image
                        src={occ.image}
                        alt={occ.name}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 1280px) 20vw, 256px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 rounded-xl bg-black/5" />
                    )}
                    <div className="absolute bottom-0 left-3 translate-y-1/2 z-10">
                      <IconBadge emoji={occ.iconEmoji} size="lg" />
                    </div>
                  </div>
                  <div className="pt-9 px-3 pb-4">
                    <p
                      className="font-semibold text-[16px] text-[#0C0000] leading-snug"
                      style={{ lineHeight: '96%', letterSpacing: '-6%' }}
                    >
                      {occ.name}
                    </p>
                    <p
                      className="text-[12px] text-[#000000] opacity-65 mt-1"
                      style={{ lineHeight: '96%', letterSpacing: '-6%' }}
                    >
                      {occ.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/*  Mobile: bento layout  */}
        <div className="md:hidden flex flex-col gap-3">
          {/* First occasion — full-width hero with image */}
          <div data-reveal className="reveal">
            <Link href={occasions[0].href} className="block">
              <div
                className="rounded-2xl p-3 flex items-center gap-2 h-28"
                style={{ backgroundColor: occasions[0].cardBg }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[16px] text-gray-900 leading-tight">
                    {occasions[0].name}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1 leading-tight">
                    {occasions[0].subtitle}
                  </p>
                </div>
                <IconBadge emoji={occasions[0].iconEmoji} size="sm" />
                {occasions[0].image && (
                  <div className="self-stretch w-[48%] shrink-0 rounded-2xl overflow-hidden relative -my-2 -mr-2">
                    <Image
                      src={occasions[0].image}
                      alt={occasions[0].name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Remaining occasions — 2-column grid */}
          {occasions.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {occasions.slice(1).map((occ, i) => (
                <div key={occ.id} data-reveal className={`reveal ${staggerDelays[i] ?? ''}`}>
                  <Link href={occ.href} className="block h-full">
                    <div
                      className="rounded-2xl p-3 min-h-16 h-full flex flex-col justify-between relative"
                      style={{ backgroundColor: occ.mobileBg }}
                    >
                      <div className="self-end">
                        <IconBadge emoji={occ.iconEmoji} size="sm" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-gray-900 leading-tight">
                          {occ.name}
                        </p>
                        <p className="text-[12px] text-gray-500 mt-0.5 leading-tight">
                          {occ.subtitle}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

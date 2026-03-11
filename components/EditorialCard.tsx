import Image from 'next/image';

interface EditorialCardProps {
  imageUrl: string;
  alt: string;
  caption?: string;
}

const EDITORIAL_CONTENT: EditorialCardProps[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40e4ce7?w=800&q=80',
    alt: 'Morning glass at Neskowin',
    caption: 'Dawn patrol, Proposal Rock. Water temp 52F.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1455729552457-5c322f5f63e2?w=800&q=80',
    alt: 'Oregon coast fog',
    caption: 'Ghost forest at low tide. Tillamook County.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Cold water lineup',
    caption: 'North wind, offshore. The wait is worth it.',
  },
];

export function getEditorialByIndex(index: number): EditorialCardProps {
  return EDITORIAL_CONTENT[index % EDITORIAL_CONTENT.length];
}

export default function EditorialCard({
  imageUrl,
  alt,
  caption,
}: EditorialCardProps) {
  return (
    <article className="group border-[2.5px] border-forest bg-linen overflow-hidden transition-colors duration-200 hover:border-copper">
      {/* Dispatch header */}
      <div className="px-3 py-2 border-b border-forest/10 transition-colors duration-200 group-hover:border-copper/30">
        <p className="font-data text-xs tracking-[0.2em] text-copper uppercase">
          Dispatch
        </p>
      </div>

      {/* Full-bleed image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 py-3">
          <p className="font-body text-sm italic text-slate leading-relaxed">
            {caption}
          </p>
        </div>
      )}
    </article>
  );
}

interface TextMomentProps {
  header: string;
  body: string;
  variant?: 'forest' | 'linen';
}

const TEXT_MOMENTS: TextMomentProps[] = [
  {
    header: 'CURRENT INVENTORY',
    body: 'Coldwater essentials built for the Pacific Northwest. Tested at 45 degrees north, where the water runs cold and the lineups run empty.',
    variant: 'forest',
  },
  {
    header: 'FIELD REPORT',
    body: 'Winter swell season is in full effect. NW ground swell holding steady, water temps hovering at 50F. Full suits required.',
    variant: 'linen',
  },
  {
    header: 'STATION BULLETIN',
    body: 'New goods arriving monthly. Each piece is designed for durability in the elements. Made to last, not to trend.',
    variant: 'forest',
  },
  {
    header: 'TRANSMISSION',
    body: 'The ghost forest stands where the coast shifts. Salt air, cold water, and the sound of the Pacific. This is where we operate.',
    variant: 'linen',
  },
];

export function getTextMomentByIndex(index: number): TextMomentProps {
  return TEXT_MOMENTS[index % TEXT_MOMENTS.length];
}

export default function TextMoment({
  header,
  body,
  variant = 'forest',
}: TextMomentProps) {
  const isForest = variant === 'forest';

  return (
    <article
      className={`border-[2.5px] p-5 sm:p-6 ${
        isForest
          ? 'bg-forest border-forest text-linen'
          : 'bg-linen border-forest text-forest'
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className={`h-px flex-1 ${isForest ? 'bg-copper' : 'bg-copper'}`} />
        <h3
          className={`font-data text-[11px] tracking-[0.2em] uppercase shrink-0 ${
            isForest ? 'text-copper' : 'text-copper'
          }`}
        >
          {header}
        </h3>
        <div className={`h-px flex-1 ${isForest ? 'bg-copper' : 'bg-copper'}`} />
      </div>

      {/* Body */}
      <p
        className={`font-body text-sm leading-relaxed text-center ${
          isForest ? 'text-linen/85' : 'text-slate'
        }`}
      >
        {body}
      </p>
    </article>
  );
}

import { imageSrc } from '../../assets/images/registry'

/** A sample thumbnail with the two ghost frames behind it (the "stack of variants" look from the deck). */
export function ThumbStack({ imageKey, alt }: { imageKey: string; alt: string }) {
  return (
    <div className="relative h-[63px] w-[112px] shrink-0" aria-hidden={alt === '' ? true : undefined}>
      <div className="absolute left-[40px] top-[6px] h-[51px] w-[88px] rounded-lg bg-ghost-1/60" />
      <div className="absolute left-[28px] top-[3px] h-[57px] w-[92px] rounded-lg bg-ghost-2/70" />
      <img
        src={imageSrc(imageKey)}
        alt={alt}
        className="absolute inset-0 h-full w-[100px] rounded-lg object-cover shadow-thumb"
      />
    </div>
  )
}

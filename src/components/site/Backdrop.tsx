/** Organic background lighting that stays visible through every glass surface. */
export function Backdrop({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      ) : null}
      <div
        className="aurora absolute -left-[15%] top-[-10%] h-[60vw] w-[60vw] rounded-full opacity-50 blur-[120px]"
        style={{ background: "color-mix(in oklab, var(--primary) 55%, transparent)" }}
      />
      <div
        className="aurora absolute right-[-20%] top-[25%] h-[55vw] w-[55vw] rounded-full opacity-40 blur-[140px]"
        style={{
          background: "color-mix(in oklab, var(--accent2) 50%, transparent)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="aurora absolute bottom-[-25%] left-[25%] h-[50vw] w-[50vw] rounded-full opacity-30 blur-[150px]"
        style={{
          background: "color-mix(in oklab, var(--primary) 35%, var(--accent2))",
          animationDelay: "-14s",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 20%, var(--background) 92%)",
        }}
      />
    </div>
  );
}
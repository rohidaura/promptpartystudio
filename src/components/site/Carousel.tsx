import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Touch-swipe + mouse-drag horizontal rail with GPU-friendly scrolling. */
export function Carousel({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  function scrollByPage(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.8, 280), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        aria-label={ariaLabel}
        onScroll={measure}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          const el = ref.current!;
          drag.current = {
            active: true,
            startX: e.clientX,
            startScroll: el.scrollLeft,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return;
          const el = ref.current!;
          const delta = e.clientX - drag.current.startX;
          if (Math.abs(delta) > 4) drag.current.moved = true;
          el.scrollLeft = drag.current.startScroll - delta;
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onPointerLeave={() => {
          drag.current.active = false;
        }}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scroll-padding-inline:1px]"
      >
        {children}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Scroll left"
          disabled={edges.start}
          onClick={() => scrollByPage(-1)}
          className="glass-soft grid size-11 place-items-center rounded-full transition-opacity disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          disabled={edges.end}
          onClick={() => scrollByPage(1)}
          className="glass-soft grid size-11 place-items-center rounded-full transition-opacity disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
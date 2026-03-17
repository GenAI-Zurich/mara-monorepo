import { useRef, useEffect, useState, useCallback } from "react";
import type { Product } from "@/types/product";
import type { WishlistWithItems } from "@/hooks/useWishlists";
import type { ProjectWithItems } from "@/hooks/useProjects";
import ProductCard from "./ProductCard";

function sampleArc(t: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, t));
  const p0 = { x: 5, y: 90 };
  const p1 = { x: 22, y: 58 };
  const p2 = { x: 75, y: 22 };
  const p3 = { x: 90, y: 10 };
  const inv = 1 - clamped;
  return {
    x: inv*inv*inv*p0.x + 3*inv*inv*clamped*p1.x + 3*inv*clamped*clamped*p2.x + clamped*clamped*clamped*p3.x,
    y: inv*inv*inv*p0.y + 3*inv*inv*clamped*p1.y + 3*inv*clamped*clamped*p2.y + clamped*clamped*clamped*p3.y,
  };
}

const CARD_SPACING = 0.14;
const FADE_ZONE = 0.10;
const VISIBLE_SLOTS = Math.ceil(1 / CARD_SPACING) + 2;
const MIN_ITEMS_FOR_LOOP = 4;

interface ArcCarouselProps {
  products: Product[];
  wishlists: WishlistWithItems[];
  projects: ProjectWithItems[];
  getProjectColor: (index: number) => string;
  rejectedIds: Set<number>;
  onToggleWishlist: (wishlistId: number, articleId: number, isIn: boolean) => void;
  onReject: (articleId: number) => void;
  onAddToProject: (projectId: number, articleId: number, qty: number) => void;
  onCreateProject: () => void;
  onRequestDelivery: (articleIds: number[]) => void;
  onProductClick: (product: Product) => void;
}

function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

const ArcCarousel = ({ products, wishlists, projects, getProjectColor, rejectedIds, onToggleWishlist, onReject, onAddToProject, onCreateProject, onRequestDelivery, onProductClick }: ArcCarouselProps) => {
  const n = products.length;
  const [scrollPos, setScrollPos] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const touchXRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tick = useCallback(() => {
    const diff = targetRef.current - currentRef.current;
    if (Math.abs(diff) < 0.0005) {
      currentRef.current = targetRef.current;
      setScrollPos(currentRef.current);
      rafRef.current = null;
      return;
    }
    const speed = Math.min(0.35, 0.08 + Math.abs(diff) * 0.04);
    currentRef.current += diff * speed;
    setScrollPos(currentRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startAnim = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const scheduleSnap = useCallback(() => {
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      targetRef.current = Math.round(targetRef.current);
      startAnim();
    }, 150);
  }, [startAnim]);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (n === 0) return;
      e.preventDefault();
      const rawDelta = e.deltaY;
      const absDelta = Math.min(Math.abs(rawDelta), 200);
      const step = Math.sign(rawDelta) * (absDelta / 120) * 0.4;
      targetRef.current += step;
      startAnim();
      scheduleSnap();
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [n, startAnim, scheduleSnap]);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || n === 0) return;
      const dx = e.clientX - dragStartXRef.current;
      const dy = e.clientY - dragStartYRef.current;
      if (!hasDraggedRef.current && Math.abs(dx) + Math.abs(dy) < 5) return;
      hasDraggedRef.current = true;
      const delta = -(dx + dy) * 0.005;
      dragStartXRef.current = e.clientX;
      dragStartYRef.current = e.clientY;
      targetRef.current += delta;
      startAnim();
    };
    const onUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (hasDraggedRef.current) scheduleSnap();
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [n, startAnim, scheduleSnap]);

  const handleCardMouseDown = useCallback((e: React.MouseEvent) => {
    if (n === 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
  }, [n]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchXRef.current = e.touches[0].clientX;
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
    const onMove = (e: TouchEvent) => {
      if (n === 0) return;
      const dx = e.touches[0].clientX - touchXRef.current;
      touchXRef.current = e.touches[0].clientX;
      targetRef.current -= dx / 80;
      startAnim();
    };
    const onEnd = () => { scheduleSnap(); };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [n, startAnim]);

  useEffect(() => {
    targetRef.current = 0;
    currentRef.current = 0;
    setScrollPos(0);
  }, [products]);

  const [, setResizeTick] = useState(0);
  useEffect(() => {
    const handler = () => setResizeTick(v => v + 1);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (n === 0) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardW = 374;
  const cardH = 517;
  const slotsToRender = VISIBLE_SLOTS + 4;
  const canLoop = n >= MIN_ITEMS_FOR_LOOP;

  const cards: { key: string; product: Product; arcT: number }[] = [];
  const centerSlot = Math.round(scrollPos);
  const halfSlots = Math.ceil(slotsToRender / 2);

  for (let offset = -halfSlots; offset <= halfSlots; offset++) {
    const virtualIndex = centerSlot + offset;
    let productIndex: number;
    if (canLoop) {
      productIndex = mod(virtualIndex, n);
    } else {
      if (virtualIndex < 0 || virtualIndex >= n) continue;
      productIndex = virtualIndex;
    }
    const arcT = 0.5 + (virtualIndex - scrollPos) * CARD_SPACING;
    if (arcT < -0.15 || arcT > 1.15) continue;
    cards.push({ key: `${virtualIndex}`, product: products[productIndex], arcT });
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none max-[820px]:hidden">
      {cards.map(({ key, product, arcT }) => {
        const clampedT = Math.max(0, Math.min(1, arcT));
        const pos = sampleArc(clampedT);
        const px = (pos.x / 100) * vw;
        const py = (pos.y / 100) * vh;
        const distFromCenter = Math.abs(arcT - 0.5);
        const scale = Math.max(0.45, 1 - distFromCenter * 1.1);
        const z = Math.round((1 - distFromCenter) * 20);
        let opacity = Math.max(0.35, 1 - distFromCenter * 0.9);
        if (arcT < FADE_ZONE) opacity *= Math.max(0, arcT / FADE_ZONE);
        if (arcT > 1 - FADE_ZONE) opacity *= Math.max(0, (1 - arcT) / FADE_ZONE);
        if (arcT < 0 || arcT > 1) opacity = 0;
        if (opacity < 0.01) return null;

        return (
          <div key={key} onMouseDown={handleCardMouseDown} style={{ cursor: 'grab' }}>
            <ProductCard
              product={product}
              wishlists={wishlists}
              projects={projects}
              getProjectColor={getProjectColor}
              isRejected={rejectedIds.has(product.id)}
              onToggleWishlist={onToggleWishlist}
              onReject={onReject}
              onAddToProject={onAddToProject}
              onCreateProject={onCreateProject}
              onRequestDelivery={onRequestDelivery}
              onClick={(p) => { if (hasDraggedRef.current) return; onProductClick(p); }}
              isHero={distFromCenter < 0.07}
              style={{
                left: px - (cardW * scale) / 2,
                top: py - (cardH * scale) / 2,
                transform: `scale(${scale})`,
                opacity,
                zIndex: z,
                transition: 'opacity 0.3s ease-out',
                pointerEvents: opacity > 0.1 ? "auto" : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ArcCarousel;

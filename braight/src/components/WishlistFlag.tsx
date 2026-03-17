/**
 * A bookmark/flag icon where the inner "flag" area is filled with the wishlist color.
 * Small and elegant, used in header and on product cards.
 */

interface WishlistFlagProps {
  color: string;
  size?: number;
  filled?: boolean;
  count?: number;
  className?: string;
}

const WishlistFlag = ({ color, size = 18, filled = true, count, className = '' }: WishlistFlagProps) => {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer bookmark shape */}
        <path
          d="M3 2C3 1.44772 3.44772 1 4 1H16C16.5523 1 17 1.44772 17 2V22L10 18L3 22V2Z"
          fill={filled ? color : 'transparent'}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity={filled ? 0.85 : 0.5}
        />
      </svg>
      {count !== undefined && count > 0 && (
        <span
          className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full text-[8px] flex items-center justify-center font-bold font-body px-0.5"
          style={{ backgroundColor: color, color: isLightColor(color) ? '#1a1a1a' : '#ffffff' }}
        >
          {count}
        </span>
      )}
    </span>
  );
};

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export default WishlistFlag;

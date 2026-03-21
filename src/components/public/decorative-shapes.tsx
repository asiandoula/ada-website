/**
 * Decorative shapes matching Framer original site.
 * Used as floating accents in sections (rotated, positioned absolutely).
 * Colors from Framer: Blue #00aeef, Orange #f15a29, Green #8dc63f, Purple #662d91, Pink #ec008c, Red #ed1c24, Yellow #fff200
 */

export function ShapeHalfCircle({ className = '', color = '#00aeef' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50V0Z" fill={color} opacity="0.15" />
    </svg>
  );
}

export function ShapeHeart({ className = '', color = '#ec008c' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 88C50 88 10 62 10 35C10 20 22 10 35 10C42 10 48 14 50 18C52 14 58 10 65 10C78 10 90 20 90 35C90 62 50 88 50 88Z" fill={color} opacity="0.15" />
    </svg>
  );
}

export function ShapeFlower({ className = '', color = '#8dc63f' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="30" r="18" fill={color} opacity="0.12" />
      <circle cx="30" cy="50" r="18" fill={color} opacity="0.12" />
      <circle cx="70" cy="50" r="18" fill={color} opacity="0.12" />
      <circle cx="40" cy="70" r="18" fill={color} opacity="0.12" />
      <circle cx="60" cy="70" r="18" fill={color} opacity="0.12" />
      <circle cx="50" cy="50" r="10" fill={color} opacity="0.2" />
    </svg>
  );
}

export function ShapeStar({ className = '', color = '#f15a29' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5L61 39H97L68 59L79 93L50 73L21 93L32 59L3 39H39L50 5Z" fill={color} opacity="0.12" />
    </svg>
  );
}

export function ShapeSquare({ className = '', color = '#662d91' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="70" rx="12" fill={color} opacity="0.1" transform="rotate(15 50 50)" />
    </svg>
  );
}

export function ShapeCircle({ className = '', color = '#00aeef' }: { className?: string; color?: string }) {
  return (
    <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill={color} opacity="0.1" />
    </svg>
  );
}

import { FoodType } from "../lib/foodTypes";

/**
 * Clean, high-contrast vector icons for the four food categories
 * supported by Food_Guardian.ino.
 */

function MilkIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="milk-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="milk-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="25" y="4" width="14" height="6" rx="2" fill="url(#milk-cap)" stroke="#818cf8" strokeWidth="1.5" />
      {/* Bottle Gable / Neck */}
      <path
        d="M20 18 L24 10 L40 10 L44 18 Z"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Bottle Body */}
      <rect x="18" y="18" width="28" height="40" rx="4" fill="url(#milk-body)" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Label band */}
      <rect x="18" y="28" width="28" height="12" fill="#6366f1" fillOpacity="0.85" />
      <circle cx="32" cy="34" r="3.5" fill="#ffffff" />
      <text x="32" y="50" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="#64748b" fontWeight="700">
        MILK
      </text>
    </svg>
  );
}

function MeatIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="meat-steak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>
      {/* Steak Silhouette */}
      <path
        d="M16 38 C10 24 20 12 36 12 C48 12 56 22 54 36 C52 48 38 52 26 50 C18 48 14 44 16 38 Z"
        fill="url(#meat-steak)"
        stroke="#fda4af"
        strokeWidth="1.5"
      />
      {/* Bone marrow */}
      <circle cx="28" cy="28" r="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="2.5" fill="#e11d48" opacity="0.6" />
      {/* Marbling lines */}
      <path d="M36 20 C42 24 44 32 38 40" stroke="#fecdd3" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 26 C47 30 46 36 42 42" stroke="#fecdd3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FruitIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="apple-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="orange-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Apple Body */}
      <circle cx="25" cy="36" r="16" fill="url(#apple-grad)" stroke="#fda4af" strokeWidth="1.5" />
      {/* Stem & Leaf */}
      <path d="M25 20 C25 15 28 13 30 11" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 15 C33 13 35 17 33 20 C29 20 28 17 27 15 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
      {/* Orange Slice */}
      <circle cx="43" cy="40" r="13" fill="url(#orange-grad)" stroke="#fed7aa" strokeWidth="1.5" />
      <circle cx="43" cy="40" r="10" fill="#ffedd5" opacity="0.9" />
      <circle cx="43" cy="40" r="8.5" fill="#f97316" />
    </svg>
  );
}

function VegIcon() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none">
      <defs>
        <linearGradient id="carrot-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="broccoli-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      {/* Broccoli Head */}
      <circle cx="24" cy="24" r="8" fill="url(#broccoli-grad)" />
      <circle cx="34" cy="18" r="9" fill="url(#broccoli-grad)" />
      <circle cx="40" cy="26" r="8" fill="url(#broccoli-grad)" />
      <circle cx="31" cy="27" r="9" fill="url(#broccoli-grad)" />
      {/* Stalk */}
      <path d="M29 28 L28 42 L34 42 L33 28 Z" fill="#86efac" stroke="#16a34a" strokeWidth="1" />
      {/* Carrot */}
      <path d="M44 20 L56 50 L38 50 Z" fill="url(#carrot-grad)" stroke="#fdba74" strokeWidth="1.2" />
      <path d="M44 20 C42 14 47 11 50 15" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function FoodIcon({ food }: { food: FoodType }) {
  switch (food) {
    case FoodType.MILK:
      return <MilkIcon />;
    case FoodType.MEAT:
      return <MeatIcon />;
    case FoodType.FRUIT:
      return <FruitIcon />;
    default:
      return <VegIcon />;
  }
}

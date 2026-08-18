import React from 'react';

interface AgroPlanLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  variant?: 'full' | 'icon' | 'badge' | 'stacked';
  theme?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
}

/**
 * Official Logo for AgroPlan CI
 * Recreated from the official brand identity with cocoa pods, beans & leaves
 */
export const AgroPlanLogo: React.FC<AgroPlanLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'dark',
  showSubtitle = false,
}) => {
  // Dimensions helper
  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return { iconSize: 22, height: 26, fontSize: 'text-sm' };
      case 'sm':
        return { iconSize: 30, height: 34, fontSize: 'text-base' };
      case 'lg':
        return { iconSize: 52, height: 58, fontSize: 'text-2xl' };
      case 'xl':
        return { iconSize: 72, height: 80, fontSize: 'text-3xl' };
      case 'custom':
        return { iconSize: undefined, height: undefined, fontSize: '' };
      case 'md':
      default:
        return { iconSize: 38, height: 42, fontSize: 'text-lg' };
    }
  };

  const { iconSize, fontSize } = getDimensions();

  // Color tokens
  const podColor = theme === 'light' ? '#F5F5F0' : '#5D4037';
  const podAccent = theme === 'light' ? '#D7CCC8' : '#795548';
  const beanColor = theme === 'light' ? '#3E2723' : '#F9F8F6';
  const stripeColor = theme === 'light' ? '#3E2723' : '#F9F8F6';
  const leafColor = theme === 'light' ? '#81C784' : '#5D4037';
  const textColor = theme === 'light' ? 'text-white' : 'text-[#2D1E18]';
  const subtitleColor = theme === 'light' ? 'text-emerald-200' : 'text-[#2E7D32]';

  // SVG Cocoa Pods + Leaves Illustration (Exact match to official AgroPlan CI brand mark)
  const CocoaIcon = ({ customSize }: { customSize?: number }) => (
    <svg
      viewBox="0 0 200 160"
      width={customSize || iconSize || 38}
      height={((customSize || iconSize || 38) * 160) / 200}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs select-none transition-transform group-hover:scale-105"
    >
      {/* 2 Top Leaves */}
      <g id="leaves">
        {/* Left Leaf */}
        <path
          d="M78 52 C72 32 78 12 90 2 C100 15 104 35 98 55 Z"
          fill={leafColor}
        />
        <path
          d="M84 48 Q88 25 90 2"
          stroke={stripeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M85 36 Q80 32 76 34 M87 24 Q82 20 78 22 M89 12 Q85 8 82 10"
          stroke={stripeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right Leaf */}
        <path
          d="M100 52 C108 34 118 16 132 14 C128 32 118 48 102 56 Z"
          fill={leafColor}
        />
        <path
          d="M102 52 Q116 35 132 14"
          stroke={stripeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M108 42 Q115 41 122 46 M115 30 Q122 28 128 32"
          stroke={stripeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Right Open Cocoa Pod (with seeds / fèves) */}
      <g id="right-open-pod">
        {/* Outer Brown Pod Shell */}
        <path
          d="M96 55 C122 55 148 70 158 92 C168 114 158 135 142 142 C125 150 95 138 85 116 C78 100 84 75 96 55 Z"
          fill={podAccent}
        />
        <path
          d="M98 60 C120 60 144 74 152 94 C160 114 152 131 138 137 C122 144 96 133 88 114 C82 99 87 78 98 60 Z"
          fill={podColor}
        />

        {/* 10 Cocoa Beans (Fèves de cacao en 2 rangées) */}
        {/* Row 1 - Top */}
        <ellipse cx="112" cy="80" rx="6" ry="8" transform="rotate(-30 112 80)" fill={beanColor} />
        <ellipse cx="123" cy="87" rx="6" ry="8" transform="rotate(-30 123 87)" fill={beanColor} />
        <ellipse cx="134" cy="97" rx="6" ry="8" transform="rotate(-30 134 97)" fill={beanColor} />
        <ellipse cx="143" cy="109" rx="6" ry="8" transform="rotate(-30 143 109)" fill={beanColor} />
        <ellipse cx="149" cy="122" rx="5.5" ry="7.5" transform="rotate(-30 149 122)" fill={beanColor} />

        {/* Row 2 - Bottom */}
        <ellipse cx="103" cy="94" rx="5.5" ry="7.5" transform="rotate(-30 103 94)" fill={beanColor} />
        <ellipse cx="113" cy="104" rx="6" ry="8" transform="rotate(-30 113 104)" fill={beanColor} />
        <ellipse cx="123" cy="115" rx="6" ry="8" transform="rotate(-30 123 115)" fill={beanColor} />
        <ellipse cx="133" cy="126" rx="6" ry="8" transform="rotate(-30 133 126)" fill={beanColor} />
        <ellipse cx="140" cy="135" rx="5" ry="6.5" transform="rotate(-30 140 135)" fill={beanColor} />
      </g>

      {/* Left Whole Striped Cocoa Pod */}
      <g id="left-whole-pod">
        {/* Pod Outer Shape */}
        <path
          d="M88 52 C108 55 118 78 116 102 C114 125 92 144 68 142 C48 140 38 122 42 100 C46 76 68 49 88 52 Z"
          fill={podColor}
        />
        {/* Pod Tip / Stalk */}
        <path
          d="M40 125 C34 130 32 133 34 135 C38 137 44 135 48 131 Z"
          fill={podColor}
        />

        {/* Longitudinal Characteristic Stripes (Sillons de la cabosse) */}
        {/* Central Ridge Stripe */}
        <path
          d="M87 56 Q100 85 96 112 Q92 128 65 139"
          stroke={stripeColor}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Secondary Upper Stripe */}
        <path
          d="M82 62 Q72 88 64 112 Q58 126 48 132"
          stroke={stripeColor}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Outer Left Stripe */}
        <path
          d="M74 72 Q58 92 50 112"
          stroke={stripeColor}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );

  // Variant: ICON ONLY
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <CocoaIcon />
      </div>
    );
  }

  // Variant: BADGE (Icon inside soft round container)
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl p-2.5 ${
          theme === 'light'
            ? 'bg-white/10 border border-white/20'
            : 'bg-[#F9F8F6] border border-stone-200 shadow-xs'
        } ${className}`}
      >
        <CocoaIcon />
      </div>
    );
  }

  // Variant: STACKED (Icon on top of text, perfect for Hero or Auth)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center group ${className}`}>
        <CocoaIcon customSize={size === 'xl' ? 84 : 64} />
        <div className="mt-2">
          <span
            className={`font-serif tracking-tight font-extrabold ${fontSize} ${textColor} transition-colors group-hover:opacity-90`}
            style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}
          >
            Agro Plan CI
          </span>
          {showSubtitle && (
            <p className={`text-[10px] font-sans font-bold tracking-wider uppercase mt-0.5 ${subtitleColor}`}>
              Transition Agroécologique & Cacao Durable
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variant: FULL HORIZONTAL (Default: Icon + "Agro Plan CI")
  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <CocoaIcon />
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif tracking-tight font-black ${fontSize} ${textColor} transition-colors group-hover:opacity-90 flex items-center gap-1`}
          style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" }}
        >
          <span>Agro</span>
          <span>Plan</span>
          <span className={theme === 'light' ? 'text-[#81C784]' : 'text-[#2E7D32]'}>CI</span>
        </span>
        {showSubtitle && (
          <span className={`text-[9px] font-sans font-bold tracking-wider uppercase mt-0.5 ${subtitleColor}`}>
            Côte d'Ivoire
          </span>
        )}
      </div>
    </div>
  );
};

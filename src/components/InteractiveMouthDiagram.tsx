import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, Sparkles, MapPin } from 'lucide-react';
import { Language } from '../lib/i18n';

interface InteractiveMouthDiagramProps {
  selectedLocation: string; // 'UR' | 'FRONT_UP' | 'UL' | 'LR' | 'FRONT_DOWN' | 'LL' | 'ALL'
  onSelectLocation: (locId: string) => void;
  language?: Language;
}

export const InteractiveMouthDiagram: React.FC<InteractiveMouthDiagramProps> = ({
  selectedLocation,
  onSelectLocation,
  language = 'ko',
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const isSelected = (zoneId: string) => {
    if (selectedLocation === 'ALL') return true;
    return selectedLocation === zoneId;
  };

  const getZoneFill = (zoneId: string) => {
    const active = isSelected(zoneId);
    const hovered = hoveredZone === zoneId;

    if (selectedLocation === 'ALL') {
      return 'fill-amber-400 stroke-amber-600';
    }
    if (active) {
      return 'fill-blue-500 stroke-blue-700 filter drop-shadow(0 0 6px rgba(37,99,235,0.6))';
    }
    if (hovered) {
      return 'fill-blue-100 stroke-blue-400';
    }
    return 'fill-white stroke-slate-400';
  };

  const getGumFill = (arch: 'upper' | 'lower') => {
    return 'fill-[#FFE4E6] stroke-[#FDA4AF]';
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Perspective Orientation Banner */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 border-2 border-blue-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm">
        <div className="flex items-center gap-1.5 text-blue-800">
          <span className="text-base">👈</span>
          <span className="font-black">{language === 'en' ? "Patient's Right (UR / LR)" : '내 입의 오른쪽 (우측)'}</span>
        </div>
        <div className="text-xs bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200 shadow-xs font-semibold hidden sm:inline-block">
          {language === 'en' ? 'Mirror View' : '거울 보듯 입안 터치'}
        </div>
        <div className="flex items-center gap-1.5 text-blue-800">
          <span className="font-black">{language === 'en' ? "Patient's Left (UL / LL)" : '내 입의 왼쪽 (좌측)'}</span>
          <span className="text-base">👉</span>
        </div>
      </div>

      {/* Main Interactive Dental Arch SVG Container */}
      <div className="relative w-full max-w-md aspect-[1/1.08] bg-slate-50 border-3 border-slate-300 rounded-3xl p-3 shadow-inner flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Glow when ALL is selected */}
        {selectedLocation === 'ALL' && (
          <div className="absolute inset-0 bg-amber-200/20 pointer-events-none rounded-3xl animate-pulse" />
        )}

        <svg
          viewBox="0 0 460 490"
          className="w-full h-full max-w-[420px] drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for oral cavity depth */}
            <radialGradient id="oralDepth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="70%" stopColor="#FFE4E6" />
              <stop offset="100%" stopColor="#FECDD3" />
            </radialGradient>
            <radialGradient id="tongueGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.4" />
            </radialGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Mouth Background (Oral Cavity & Lips Contour) */}
          <path
            d="M 50 245 C 50 110, 150 45, 230 45 C 310 45, 410 110, 410 245 C 410 380, 310 445, 230 445 C 150 445, 50 380, 50 245 Z"
            fill="url(#oralDepth)"
            stroke="#FDA4AF"
            strokeWidth="4"
          />

          {/* Soft Tongue in Center */}
          <path
            d="M 130 250 C 130 290, 170 335, 230 335 C 290 335, 330 290, 330 250 C 330 220, 290 200, 230 200 C 170 200, 130 220, 130 250 Z"
            fill="url(#tongueGrad)"
            stroke="#FB7185"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d="M 230 215 L 230 270"
            stroke="#E11D48"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Midline Guide Line (Vertical) */}
          <line
            x1="230"
            y1="50"
            x2="230"
            y2="440"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Horizontal Occlusal Bite Line */}
          <line
            x1="65"
            y1="245"
            x2="395"
            y2="245"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Upper Gingiva (상악 잇몸 곡선 베이스) */}
          <path
            d="M 85 220 C 95 100, 180 65, 230 65 C 280 65, 365 100, 375 220 C 355 210, 290 170, 230 170 C 170 170, 105 210, 85 220 Z"
            className={getGumFill('upper')}
            strokeWidth="2"
          />

          {/* Lower Gingiva (하악 잇몸 곡선 베이스) */}
          <path
            d="M 85 270 C 95 390, 180 425, 230 425 C 280 425, 365 390, 375 270 C 355 280, 290 320, 230 320 C 170 320, 105 280, 85 270 Z"
            className={getGumFill('lower')}
            strokeWidth="2"
          />

          {/* ================================================================= */}
          {/* 🌟 ZONE 1: Upper Right Teeth (UR: 오른쪽 윗니 / 어금니 & 소구치) */}
          {/* ================================================================= */}
          <g
            id="zone-ur"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectLocation('UR')}
            onMouseEnter={() => setHoveredZone('UR')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {/* Click hit area overlay */}
            <path
              d="M 80 230 C 80 140, 120 80, 180 80 L 180 185 C 130 185, 95 215, 80 230 Z"
              fill={isSelected('UR') ? 'rgba(59,130,246,0.15)' : 'transparent'}
              className="hover:fill-blue-500/10"
            />
            {/* UR Molar 3 (사랑니/제2대구치) */}
            <rect
              x="92"
              y="180"
              width="24"
              height="28"
              rx="6"
              className={getZoneFill('UR')}
              strokeWidth="2.5"
            />
            {/* UR Molar 2 (제1대구치) */}
            <rect
              x="105"
              y="145"
              width="25"
              height="28"
              rx="6"
              className={getZoneFill('UR')}
              strokeWidth="2.5"
            />
            {/* UR Molar 1 (제2소구치) */}
            <rect
              x="125"
              y="118"
              width="22"
              height="24"
              rx="5"
              className={getZoneFill('UR')}
              strokeWidth="2.5"
            />
            {/* UR Premolar (제1소구치) */}
            <rect
              x="148"
              y="97"
              width="20"
              height="22"
              rx="5"
              className={getZoneFill('UR')}
              strokeWidth="2.5"
            />
            {/* UR Canine (송곳니) */}
            <path
              d="M 172 84 C 182 82, 188 90, 185 106 C 180 112, 170 110, 168 98 Z"
              className={getZoneFill('UR')}
              strokeWidth="2.5"
            />
          </g>

          {/* ================================================================= */}
          {/* 🌟 ZONE 2: Upper Front Incisors (FRONT_UP: 위쪽 앞니)           */}
          {/* ================================================================= */}
          <g
            id="zone-front-up"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectLocation('FRONT_UP')}
            onMouseEnter={() => setHoveredZone('FRONT_UP')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            {/* Click hit area */}
            <rect
              x="180"
              y="60"
              width="100"
              height="80"
              rx="12"
              fill={isSelected('FRONT_UP') ? 'rgba(59,130,246,0.15)' : 'transparent'}
              className="hover:fill-blue-500/10"
            />
            {/* UR Lateral Incisor (우측 측절치) */}
            <rect
              x="188"
              y="74"
              width="18"
              height="26"
              rx="4"
              className={getZoneFill('FRONT_UP')}
              strokeWidth="2.5"
            />
            {/* UR Central Incisor (우측 중절치) */}
            <rect
              x="208"
              y="70"
              width="21"
              height="30"
              rx="4"
              className={getZoneFill('FRONT_UP')}
              strokeWidth="2.5"
            />
            {/* UL Central Incisor (좌측 중절치) */}
            <rect
              x="231"
              y="70"
              width="21"
              height="30"
              rx="4"
              className={getZoneFill('FRONT_UP')}
              strokeWidth="2.5"
            />
            {/* UL Lateral Incisor (좌측 측절치) */}
            <rect
              x="254"
              y="74"
              width="18"
              height="26"
              rx="4"
              className={getZoneFill('FRONT_UP')}
              strokeWidth="2.5"
            />
          </g>

          {/* ================================================================= */}
          {/* 🌟 ZONE 3: Upper Left Teeth (UL: 왼쪽 윗니 / 어금니 & 소구치)   */}
          {/* ================================================================= */}
          <g
            id="zone-ul"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectLocation('UL')}
            onMouseEnter={() => setHoveredZone('UL')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <path
              d="M 280 80 C 340 80, 380 140, 380 230 C 365 215, 330 185, 280 185 Z"
              fill={isSelected('UL') ? 'rgba(59,130,246,0.15)' : 'transparent'}
              className="hover:fill-blue-500/10"
            />
            {/* UL Canine (송곳니) */}
            <path
              d="M 275 84 C 285 82, 292 98, 290 110 C 280 112, 272 100, 275 84 Z"
              className={getZoneFill('UL')}
              strokeWidth="2.5"
            />
            {/* UL Premolar 1 (제1소구치) */}
            <rect
              x="292"
              y="97"
              width="20"
              height="22"
              rx="5"
              className={getZoneFill('UL')}
              strokeWidth="2.5"
            />
            {/* UL Premolar 2 (제2소구치) */}
            <rect
              x="313"
              y="118"
              width="22"
              height="24"
              rx="5"
              className={getZoneFill('UL')}
              strokeWidth="2.5"
            />
            {/* UL Molar 1 (제1대구치) */}
            <rect
              x="330"
              y="145"
              width="25"
              height="28"
              rx="6"
              className={getZoneFill('UL')}
              strokeWidth="2.5"
            />
            {/* UL Molar 2 (사랑니/제2대구치) */}
            <rect
              x="344"
              y="180"
              width="24"
              height="28"
              rx="6"
              className={getZoneFill('UL')}
              strokeWidth="2.5"
            />
          </g>

          {/* ================================================================= */}
          {/* 🌟 ZONE 4: Lower Right Teeth (LR: 오른쪽 아랫니 / 어금니)         */}
          {/* ================================================================= */}
          <g
            id="zone-lr"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectLocation('LR')}
            onMouseEnter={() => setHoveredZone('LR')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <path
              d="M 80 260 C 95 275, 130 305, 180 305 L 180 410 C 120 410, 80 350, 80 260 Z"
              fill={isSelected('LR') ? 'rgba(59,130,246,0.15)' : 'transparent'}
              className="hover:fill-blue-500/10"
            />
            {/* LR Molar 3 (사랑니) */}
            <rect
              x="92"
              y="280"
              width="24"
              height="28"
              rx="6"
              className={getZoneFill('LR')}
              strokeWidth="2.5"
            />
            {/* LR Molar 2 (제1대구치) */}
            <rect
              x="105"
              y="315"
              width="25"
              height="28"
              rx="6"
              className={getZoneFill('LR')}
              strokeWidth="2.5"
            />
            {/* LR Premolar 2 */}
            <rect
              x="125"
              y="346"
              width="22"
              height="24"
              rx="5"
              className={getZoneFill('LR')}
              strokeWidth="2.5"
            />
            {/* LR Premolar 1 */}
            <rect
              x="148"
              y="370"
              width="20"
              height="22"
              rx="5"
              className={getZoneFill('LR')}
              strokeWidth="2.5"
            />
            {/* LR Canine */}
            <path
              d="M 172 404 C 182 406, 188 398, 185 382 C 180 376, 170 378, 168 390 Z"
              className={getZoneFill('LR')}
              strokeWidth="2.5"
            />
          </g>

          {/* ================================================================= */}
          {/* 🌟 ZONE 5: Lower Front Incisors (FRONT_DOWN: 아래쪽 앞니)       */}
          {/* ================================================================= */}
          <g
            id="zone-front-down"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectLocation('FRONT_DOWN')}
            onMouseEnter={() => setHoveredZone('FRONT_DOWN')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <rect
              x="180"
              y="350"
              width="100"
              height="80"
              rx="12"
              fill={isSelected('FRONT_DOWN') ? 'rgba(59,130,246,0.15)' : 'transparent'}
              className="hover:fill-blue-500/10"
            />
            {/* LR Lateral Incisor */}
            <rect
              x="190"
              y="390"
              width="16"
              height="24"
              rx="4"
              className={getZoneFill('FRONT_DOWN')}
              strokeWidth="2.5"
            />
            {/* LR Central Incisor */}
            <rect
              x="210"
              y="392"
              width="18"
              height="26"
              rx="4"
              className={getZoneFill('FRONT_DOWN')}
              strokeWidth="2.5"
            />
            {/* LL Central Incisor */}
            <rect
              x="232"
              y="392"
              width="18"
              height="26"
              rx="4"
              className={getZoneFill('FRONT_DOWN')}
              strokeWidth="2.5"
            />
            {/* LL Lateral Incisor */}
            <rect
              x="254"
              y="390"
              width="16"
              height="24"
              rx="4"
              className={getZoneFill('FRONT_DOWN')}
              strokeWidth="2.5"
            />
          </g>

          {/* ================================================================= */}
          {/* 🌟 ZONE 6: Lower Left Teeth (LL: 왼쪽 아랫니 / 어금니)          */}
          {/* ================================================================= */}
          <g
            id="zone-ll"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectLocation('LL')}
            onMouseEnter={() => setHoveredZone('LL')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <path
              d="M 280 305 C 330 305, 365 275, 380 260 C 380 350, 340 410, 280 410 Z"
              fill={isSelected('LL') ? 'rgba(59,130,246,0.15)' : 'transparent'}
              className="hover:fill-blue-500/10"
            />
            {/* LL Canine */}
            <path
              d="M 275 404 C 285 406, 292 390, 290 378 C 280 376, 272 388, 275 404 Z"
              className={getZoneFill('LL')}
              strokeWidth="2.5"
            />
            {/* LL Premolar 1 */}
            <rect
              x="292"
              y="370"
              width="20"
              height="22"
              rx="5"
              className={getZoneFill('LL')}
              strokeWidth="2.5"
            />
            {/* LL Premolar 2 */}
            <rect
              x="313"
              y="346"
              width="22"
              height="24"
              rx="5"
              className={getZoneFill('LL')}
              strokeWidth="2.5"
            />
            {/* LL Molar 1 */}
            <rect
              x="330"
              y="315"
              width="25"
              height="28"
              rx="6"
              className={getZoneFill('LL')}
              strokeWidth="2.5"
            />
            {/* LL Molar 2 (사랑니) */}
            <rect
              x="344"
              y="280"
              width="24"
              height="28"
              rx="6"
              className={getZoneFill('LL')}
              strokeWidth="2.5"
            />
          </g>

          {/* ================================================================= */}
          {/* 📍 Visual Pin Markers on Active Selection                         */}
          {/* ================================================================= */}
          {selectedLocation === 'UR' && (
            <g transform="translate(130, 140)">
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="12" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                콕!
              </text>
            </g>
          )}

          {selectedLocation === 'FRONT_UP' && (
            <g transform="translate(230, 85)">
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="12" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                콕!
              </text>
            </g>
          )}

          {selectedLocation === 'UL' && (
            <g transform="translate(330, 140)">
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="12" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                콕!
              </text>
            </g>
          )}

          {selectedLocation === 'LR' && (
            <g transform="translate(130, 350)">
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="12" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                콕!
              </text>
            </g>
          )}

          {selectedLocation === 'FRONT_DOWN' && (
            <g transform="translate(230, 400)">
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="12" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                콕!
              </text>
            </g>
          )}

          {selectedLocation === 'LL' && (
            <g transform="translate(330, 350)">
              <circle r="18" fill="#2563EB" opacity="0.25" className="animate-ping" />
              <circle r="12" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                콕!
              </text>
            </g>
          )}

          {selectedLocation === 'ALL' && (
            <g transform="translate(230, 245)">
              <rect
                x="-80"
                y="-24"
                width="160"
                height="48"
                rx="14"
                fill="#D97706"
                stroke="#FBBF24"
                strokeWidth="3"
                className="animate-pulse shadow-md"
              />
              <text
                x="0"
                y="5"
                fill="#FFFFFF"
                fontSize="14"
                fontWeight="900"
                textAnchor="middle"
              >
                입안 전체 / 고루 통증
              </text>
            </g>
          )}

          {/* Center Arch Section Labels */}
          <text
            x="230"
            y="170"
            fill="#475569"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            className="pointer-events-none"
          >
            윗니 (상악 치열궁)
          </text>
          <text
            x="230"
            y="325"
            fill="#475569"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            className="pointer-events-none"
          >
            아랫니 (하악 치열궁)
          </text>
        </svg>

        {/* Tactile prompt overlay on graphic */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-slate-300 px-4 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 pointer-events-none whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>아픈 치아 부위를 그림에서 직접 터치하세요</span>
        </div>
      </div>
    </div>
  );
};

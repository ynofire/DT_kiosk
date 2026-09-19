import React, { useState } from 'react';
import {
  Compass,
  Footprints,
  Clock,
  MapPin,
  Building,
  Volume2,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ArrowRight,
  Info,
  Layers,
  Wrench,
} from 'lucide-react';
import { speakText } from '../lib/tts';
import { HOSPITAL_CHAIR_UNITS } from '../lib/triageData';

interface HospitalWayfindingMapProps {
  department: string;
  floor: string;
  room: string;
  chair: string;
  lineColor: string;
  lineColorName: string;
  walkSteps: number;
  estimatedMinutes: number;
  patientName: string;
  compactMode?: boolean;
}

export const HospitalWayfindingMap: React.FC<HospitalWayfindingMapProps> = ({
  department,
  floor,
  room,
  chair,
  lineColor,
  lineColorName,
  walkSteps,
  estimatedMinutes,
  patientName,
  compactMode = false,
}) => {
  // Tabs: 'clinicFloor' (default, destination floor) | 'lobbyFloor' (1F) | 'all' (combined)
  const [activeTab, setActiveTab] = useState<'clinicFloor' | 'lobbyFloor' | 'all'>('clinicFloor');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const is2F = !floor.includes('3층');
  const floorName = floor || (chair.includes('특진') ? '본관 3층' : '본관 2층');

  // Determine room coordinate mappings for destination floors
  // SVG Canvas: width: 800, height: 420
  // Real Hospital Rooms & Chairs Destination Locator
  const getDestinationRoomCoords = () => {
    // 1. 제 1 진료실 (1번 체어, 2번 체어)
    if (
      chair.includes('1번') ||
      chair.includes('2번') ||
      room.includes('제 1 진료실') ||
      department.includes('제 1 진료실') ||
      department.includes('치주') ||
      department.includes('보철')
    ) {
      return { x: 520, y: 70, width: 220, height: 95, label: '제 1 진료실', sub: '1번·2번 체어', code: 'Clinic 1' };
    }
    // 2. 제 2 진료실 (3번 체어, 4번 체어)
    else if (
      chair.includes('3번') ||
      chair.includes('4번') ||
      room.includes('제 2 진료실') ||
      department.includes('제 2 진료실') ||
      department.includes('보존') ||
      department.includes('외과')
    ) {
      return { x: 520, y: 255, width: 220, height: 95, label: '제 2 진료실', sub: '3번·4번 체어', code: 'Clinic 2' };
    }
    // 3. 제 3 진료실 (5번 체어)
    else if (
      chair.includes('5번') ||
      room.includes('제 3 진료실') ||
      department.includes('제 3 진료실') ||
      department.includes('구강내과')
    ) {
      return { x: 185, y: 70, width: 155, height: 95, label: '제 3 진료실', sub: '5번 체어 (턱관절·점막)', code: 'Clinic 3' };
    }
    // 4. 중앙수술실(특진실) (특진체어)
    else if (
      chair.includes('특진') ||
      room.includes('수술실') ||
      room.includes('특진실') ||
      department.includes('수술')
    ) {
      return { x: 355, y: 70, width: 150, height: 95, label: '중앙수술실(특진실)', sub: '특진체어 (임플란트)', code: 'OR' };
    }
    // 5. 중앙대기실 (체어 미지정)
    else {
      return { x: 185, y: 255, width: 155, height: 95, label: '중앙 대기 라운지', sub: '체어 미지정 (호출대기)', code: 'Lounge' };
    }
  };

  const destRoom = getDestinationRoomCoords();

  // Route path for Clinic Floor: Elevator (x:170, y:210) ➔ Main Corridor ➔ Destination Room
  const getClinicFloorPath = () => {
    const startX = 170;
    const startY = 210;
    const targetX = destRoom.x + destRoom.width / 2;

    if (destRoom.y < 200) {
      // Top rooms (제 3 진료실, 중앙수술실, 제 1 진료실)
      return `M ${startX} ${startY} L ${targetX} 210 L ${targetX} ${destRoom.y + destRoom.height}`;
    } else {
      // Bottom rooms (중앙대기실, 제 2 진료실)
      return `M ${startX} ${startY} L ${targetX} 210 L ${targetX} ${destRoom.y}`;
    }
  };

  // Route path for 1F Lobby: Kiosk (x:140, y:310) ➔ Central Hall ➔ Elevator 2 (x:620, y:210)
  const getLobbyFloorPath = () => {
    return 'M 160 300 L 290 300 L 290 210 L 590 210';
  };

  const handleVoicePlay = () => {
    const text = `현재 위치 1층 안내창구에서 오른쪽 중앙 엘리베이터를 타시고, ${floor}에서 내리세요. 바닥의 ${lineColorName}을 따라오시면 ${room} ${chair}에 도착합니다. 약 ${estimatedMinutes}분, ${walkSteps}보 거리입니다.`;
    speakText(text);
  };

  return (
    <div
      className={`bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-md transition-all ${
        isExpanded ? 'fixed inset-4 z-50 p-4 max-w-6xl mx-auto overflow-y-auto' : 'p-4 sm:p-5'
      }`}
    >
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: lineColor }}
          >
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                원내 실내 길안내 지도 (Floor Map)
              </h3>
              <span
                className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full text-slate-950 shadow-2xs border"
                style={{ backgroundColor: `${lineColor}33`, borderColor: lineColor }}
              >
                {lineColorName} 따라가기
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
              현재 위치(1층 로비)에서 목적지({floor} {room})까지의 최적 도보 동선입니다.
            </p>
          </div>
        </div>

        {/* Action Controls: Floor Tabs & Voice */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-black">
            <button
              type="button"
              onClick={() => setActiveTab('clinicFloor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'clinicFloor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {floorName} (진료실 동선)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lobbyFloor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'lobbyFloor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1층 로비 (승강기 탑승)
            </button>
          </div>

          {/* Voice Guidance Button */}
          <button
            type="button"
            onClick={handleVoicePlay}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-xs sm:text-sm rounded-xl border border-blue-200 flex items-center gap-1.5 shadow-2xs transition-all"
            title="음성으로 길안내 듣기"
          >
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">음성안내</span>
          </button>

          {!compactMode && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-all"
              title={isExpanded ? '원래 크기로' : '지도 크게 보기'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Map Metrics Bar: Distance, Time, Target Chair */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
          <span className="text-[11px] font-bold text-slate-500 block">출발 위치</span>
          <span className="text-sm sm:text-base font-black text-slate-800">1층 중앙 로비</span>
        </div>
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 text-center">
          <span className="text-[11px] font-bold text-blue-600 block">이동 수단</span>
          <span className="text-sm sm:text-base font-black text-blue-900">중앙 엘리베이터 2호기</span>
        </div>
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-center">
          <span className="text-[11px] font-bold text-amber-700 block">예상 시간/거리</span>
          <span className="text-sm sm:text-base font-black text-amber-950">
            약 {estimatedMinutes}분 ({walkSteps}보)
          </span>
        </div>
        <div
          className="rounded-xl p-2.5 text-center border"
          style={{ backgroundColor: `${lineColor}15`, borderColor: lineColor }}
        >
          <span className="text-[11px] font-bold block" style={{ color: lineColor }}>
            도착 목적지
          </span>
          <span className="text-sm sm:text-base font-black text-slate-900">
            {room} ({chair})
          </span>
        </div>
      </div>

      {/* ===================== SVG Interactive Floor Map Canvas ===================== */}
      <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner">
        {/* Floor Label Badge in Top Left */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white px-3 py-1 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-black shadow">
          <Building className="w-4 h-4 text-blue-400" />
          <span>{activeTab === 'clinicFloor' ? `${floorName} 진료실 평면도` : '본관 1층 로비 평면도'}</span>
        </div>

        {/* Compass Badge in Top Right */}
        <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>N (북쪽/후문방향)</span>
        </div>

        {/* SVG Drawing Area */}
        <svg
          viewBox="0 0 800 420"
          className="w-full h-auto select-none"
          style={{ minHeight: compactMode ? '220px' : '300px' }}
        >
          <defs>
            {/* Animated glowing filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Pattern for corridor tiles */}
            <pattern id="gridFloor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="420" fill="#0B1120" />
          <rect width="800" height="420" fill="url(#gridFloor)" />

          {/* ========================================================================= */}
          {/* TAB 1: CLINIC FLOOR (2층 or 3층 진료층) */}
          {/* ========================================================================= */}
          {activeTab === 'clinicFloor' && (
            <g id="clinic-floor-group">
              {/* Outer Perimeter Wall */}
              <rect
                x="40"
                y="50"
                width="720"
                height="320"
                rx="16"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Main Central Corridor Floor Area */}
              <rect
                x="200"
                y="180"
                width="530"
                height="60"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />
              <rect
                x="370"
                y="70"
                width="60"
                height="280"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />

              {/* ----------------- ROOMS (Top Row) ----------------- */}
              {/* Room 1: 원내 영상치의학실 (CT / 파노라마) */}
              <rect
                x="50"
                y="70"
                width="120"
                height="95"
                rx="8"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="110" y="115" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                영상치의학실
              </text>
              <text x="110" y="135" fill="#64748B" fontSize="10" textAnchor="middle">
                (CT/파노라마)
              </text>

              {/* Room 2: 제 3 진료실 (5번 체어 - 턱관절 장애, 안면 통증, 구강점막질환) */}
              {(() => {
                const isMatch = destRoom.label.includes('제 3 진료실');
                return (
                  <g>
                    <rect
                      x="185"
                      y="70"
                      width="155"
                      height="95"
                      rx="8"
                      fill={isMatch ? `${lineColor}35` : '#1E293B'}
                      stroke={isMatch ? lineColor : '#475569'}
                      strokeWidth={isMatch ? '3' : '1.5'}
                    />
                    <text
                      x="262"
                      y="105"
                      fill={isMatch ? '#34D399' : '#94A3B8'}
                      fontSize="13"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      제 3 진료실
                    </text>
                    <text x="262" y="122" fill={isMatch ? '#E2E8F0' : '#64748B'} fontSize="10" fontWeight="bold" textAnchor="middle">
                      5번 체어 (턱관절·점막)
                    </text>
                    <text x="262" y="137" fill="#94A3B8" fontSize="9" textAnchor="middle">
                      저출력레이저·TENS
                    </text>
                    {isMatch && (
                      <g>
                        <rect x="207" y="145" width="110" height="16" rx="4" fill={lineColor} />
                        <text x="262" y="157" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">
                          ★ 배정: {chair}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* Room 3: 중앙수술실(특진실) (특진체어 - 임플란트 수술 및 고난이도 악안면 외과) */}
              {(() => {
                const isMatch = destRoom.label.includes('중앙수술실') || chair.includes('특진');
                return (
                  <g>
                    <rect
                      x="355"
                      y="70"
                      width="150"
                      height="95"
                      rx="8"
                      fill={isMatch ? `${lineColor}35` : '#1E293B'}
                      stroke={isMatch ? lineColor : '#475569'}
                      strokeWidth={isMatch ? '3' : '1.5'}
                    />
                    <text
                      x="430"
                      y="105"
                      fill={isMatch ? '#F87171' : '#94A3B8'}
                      fontSize="13"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      중앙수술실(특진실)
                    </text>
                    <text x="430" y="122" fill={isMatch ? '#E2E8F0' : '#64748B'} fontSize="10" fontWeight="bold" textAnchor="middle">
                      특진체어 (임플란트 수술)
                    </text>
                    <text x="430" y="137" fill="#94A3B8" fontSize="9" textAnchor="middle">
                      HEPA클린룸·생체모니터
                    </text>
                    {isMatch && (
                      <g>
                        <rect x="375" y="145" width="110" height="16" rx="4" fill={lineColor} />
                        <text x="430" y="157" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">
                          ★ 배정: {chair}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* Room 4: 제 1 진료실 (1번·2번 체어 - 1번 보존·치주, 2번 디지털 보철) */}
              {(() => {
                const isMatch = destRoom.label.includes('제 1 진료실');
                return (
                  <g>
                    <rect
                      x="520"
                      y="70"
                      width="230"
                      height="95"
                      rx="8"
                      fill={isMatch ? `${lineColor}35` : '#1E293B'}
                      stroke={isMatch ? lineColor : '#475569'}
                      strokeWidth={isMatch ? '3' : '1.5'}
                    />
                    <text
                      x="635"
                      y="105"
                      fill={isMatch ? '#FDE047' : '#94A3B8'}
                      fontSize="14"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      제 1 진료실
                    </text>
                    <text x="635" y="122" fill={isMatch ? '#FEF08A' : '#E2E8F0'} fontSize="11" fontWeight="bold" textAnchor="middle">
                      1번 체어(보존·치주) / 2번 체어(보철)
                    </text>
                    <text x="635" y="137" fill="#94A3B8" fontSize="9.5" textAnchor="middle">
                      초음파스케일러 · 3D트리오스 구강스캐너
                    </text>
                    {isMatch && (
                      <g>
                        <rect x="580" y="144" width="110" height="16" rx="4" fill={lineColor} />
                        <text x="635" y="156" fill="#000" fontSize="10.5" fontWeight="900" textAnchor="middle">
                          ★ 배정: {chair}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* ----------------- ROOMS (Bottom Row) ----------------- */}
              {/* Room 5: 원무 수납 / 처방 데스크 */}
              <rect
                x="50"
                y="255"
                width="120"
                height="95"
                rx="8"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="110" y="300" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                원무 수납 / 처방
              </text>
              <text x="110" y="320" fill="#64748B" fontSize="10" textAnchor="middle">
                안내 데스크
              </text>

              {/* Room 6: 중앙 대기 라운지 (체어 미지정 대기 구역) */}
              {(() => {
                const isMatch = destRoom.label.includes('중앙 대기') || chair.includes('미지정');
                return (
                  <g>
                    <rect
                      x="185"
                      y="255"
                      width="155"
                      height="95"
                      rx="8"
                      fill={isMatch ? `${lineColor}35` : '#1E293B'}
                      stroke={isMatch ? lineColor : '#334155'}
                      strokeWidth={isMatch ? '2.5' : '1'}
                    />
                    <text x="262" y="295" fill={isMatch ? '#38BDF8' : '#94A3B8'} fontSize="12" fontWeight="bold" textAnchor="middle">
                      중앙 대기 라운지
                    </text>
                    <text x="262" y="315" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      📺 스마트 호출 모니터
                    </text>
                    <text x="262" y="332" fill="#64748B" fontSize="9.5" textAnchor="middle">
                      (체어 배정 전 대기실)
                    </text>
                  </g>
                );
              })()}

              {/* Room 7: 편의시설 / 화장실 */}
              <rect
                x="355"
                y="255"
                width="150"
                height="95"
                rx="8"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="430" y="300" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                남/여 화장실
              </text>
              <text x="430" y="320" fill="#64748B" fontSize="10" textAnchor="middle">
                (장애인 편의시설)
              </text>

              {/* Room 8: 제 2 진료실 (3번·4번 체어 - 3번 미세현미경 신경치료, 4번 사랑니발치·소수술) */}
              {(() => {
                const isMatch = destRoom.label.includes('제 2 진료실');
                return (
                  <g>
                    <rect
                      x="520"
                      y="255"
                      width="230"
                      height="95"
                      rx="8"
                      fill={isMatch ? `${lineColor}35` : '#1E293B'}
                      stroke={isMatch ? lineColor : '#475569'}
                      strokeWidth={isMatch ? '3' : '1.5'}
                    />
                    <text
                      x="635"
                      y="290"
                      fill={isMatch ? '#C084FC' : '#94A3B8'}
                      fontSize="14"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      제 2 진료실
                    </text>
                    <text x="635" y="308" fill={isMatch ? '#E9D5FF' : '#E2E8F0'} fontSize="11" fontWeight="bold" textAnchor="middle">
                      3번 체어(신경치료) / 4번 체어(사랑니·외과)
                    </text>
                    <text x="635" y="324" fill="#94A3B8" fontSize="9.5" textAnchor="middle">
                      Zeiss 미세현미경 · 서지컬 모터 · 피에조
                    </text>
                    {isMatch && (
                      <g>
                        <rect x="580" y="331" width="110" height="16" rx="4" fill={lineColor} />
                        <text x="635" y="343" fill="#000" fontSize="10.5" fontWeight="900" textAnchor="middle">
                          ★ 배정: {chair}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* ----------------- CENTRAL ELEVATOR CORE ----------------- */}
              <rect
                x="60"
                y="180"
                width="110"
                height="60"
                rx="8"
                fill="#0284C7"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <text x="115" y="206" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">
                🛗 중앙 엘리베이터
              </text>
              <text x="115" y="226" fill="#E0F2FE" fontSize="10" fontWeight="bold" textAnchor="middle">
                [{floorName} 하차 지점]
              </text>

              {/* ----------------- DRAWN ROUTE LINE (동선) ----------------- */}
              {/* Base glowing line */}
              <path
                d={getClinicFloorPath()}
                fill="none"
                stroke={lineColor}
                strokeWidth="10"
                strokeOpacity="0.4"
                filter="url(#routeGlow)"
              />
              {/* Animated dashed line */}
              <path
                d={getClinicFloorPath()}
                fill="none"
                stroke={lineColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="10 6"
                className="animate-route-dash"
              />

              {/* Footprints along the corridor */}
              <g transform="translate(300, 203)">
                <circle cx="0" cy="0" r="10" fill={lineColor} fillOpacity="0.9" />
                <text x="0" y="4" fill="#000" fontSize="9" fontWeight="900" textAnchor="middle">
                  👣
                </text>
              </g>
              <g transform="translate(400, 203)">
                <circle cx="0" cy="0" r="10" fill={lineColor} fillOpacity="0.9" />
                <text x="0" y="4" fill="#000" fontSize="9" fontWeight="900" textAnchor="middle">
                  👣
                </text>
              </g>

              {/* START PIN: Elevator exit */}
              <g transform="translate(190, 210)">
                <circle cx="0" cy="0" r="14" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
                <rect x="-35" y="-30" width="70" height="18" rx="4" fill="#0284C7" />
                <text x="0" y="-18" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">
                  출발 (하차)
                </text>
              </g>

              {/* DESTINATION PIN: Target Room Door */}
              <g
                transform={`translate(${destRoom.x === 340 ? 340 : 530}, ${
                  destRoom.y < 200 ? 160 : 290
                })`}
              >
                {/* Pulsing Beacon Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="2.5"
                  className="animate-pulse-radar origin-center"
                />
                <circle cx="0" cy="0" r="14" fill={lineColor} stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="5" fill="#000000" fontSize="11" fontWeight="900" textAnchor="middle">
                  🎯
                </text>
                <rect x="-45" y="-32" width="90" height="20" rx="4" fill={lineColor} />
                <text x="0" y="-18" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">
                  도착 ({room})
                </text>
              </g>
            </g>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: 1F LOBBY FLOOR (1층 현재 위치 ➔ 엘리베이터 승강홀) */}
          {/* ========================================================================= */}
          {activeTab === 'lobbyFloor' && (
            <g id="lobby-floor-group">
              {/* Outer Perimeter Wall */}
              <rect
                x="40"
                y="50"
                width="720"
                height="320"
                rx="16"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Lobby Entrance (Bottom Left) */}
              <rect
                x="60"
                y="270"
                width="160"
                height="80"
                rx="8"
                fill="#0F172A"
                stroke="#22C55E"
                strokeWidth="2"
              />
              <text x="140" y="305" fill="#4ADE80" fontSize="13" fontWeight="900" textAnchor="middle">
                🚪 병원 주출입문 (1층 로비)
              </text>
              <text x="140" y="325" fill="#94A3B8" fontSize="10" textAnchor="middle">
                정문 출입구
              </text>

              {/* Information Desk */}
              <rect
                x="280"
                y="80"
                width="180"
                height="70"
                rx="8"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="370" y="115" fill="#94A3B8" fontSize="13" fontWeight="bold" textAnchor="middle">
                💁 1층 종합 안내데스크
              </text>
              <text x="370" y="135" fill="#64748B" fontSize="10" textAnchor="middle">
                (원내 도우미 상주)
              </text>

              {/* Outpatient Pharmacy / Reception */}
              <rect
                x="60"
                y="80"
                width="180"
                height="70"
                rx="8"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="150" y="115" fill="#94A3B8" fontSize="13" fontWeight="bold" textAnchor="middle">
                원내 약국 / 1층 수납창구
              </text>
              <text x="150" y="135" fill="#64748B" fontSize="10" textAnchor="middle">
                처방전 수령
              </text>

              {/* Waiting Lounge (Center) */}
              <rect
                x="280"
                y="250"
                width="180"
                height="100"
                rx="8"
                fill="#1E293B"
                stroke="#334155"
                strokeWidth="1"
              />
              <text x="370" y="295" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                1층 중앙 대기홀
              </text>
              <text x="370" y="315" fill="#64748B" fontSize="10" textAnchor="middle">
                휴게 의자 및 자판기
              </text>

              {/* Central Elevator 1 & 2 (Right Side) */}
              <rect
                x="560"
                y="150"
                width="180"
                height="130"
                rx="10"
                fill="#0284C7"
                stroke="#38BDF8"
                strokeWidth="3"
              />
              <text x="650" y="195" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle">
                🛗 중앙 엘리베이터
              </text>
              <text x="650" y="220" fill="#BAE6FD" fontSize="12" fontWeight="bold" textAnchor="middle">
                2호기 (어르신·휠체어 우선)
              </text>
              <rect x="590" y="235" width="120" height="24" rx="6" fill="#FACC15" />
              <text x="650" y="251" fill="#000000" fontSize="11" fontWeight="900" textAnchor="middle">
                탑승 ➔ [{floorName}] 이동
              </text>

              {/* Central Stairs */}
              <rect
                x="560"
                y="80"
                width="180"
                height="50"
                rx="6"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
              />
              <text x="650" y="110" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">
                중앙 계단 (2·3층 연결)
              </text>

              {/* ----------------- DRAWN ROUTE LINE (Lobby 1F) ----------------- */}
              <path
                d={getLobbyFloorPath()}
                fill="none"
                stroke="#FACC15"
                strokeWidth="10"
                strokeOpacity="0.4"
                filter="url(#routeGlow)"
              />
              <path
                d={getLobbyFloorPath()}
                fill="none"
                stroke="#FACC15"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="10 6"
                className="animate-route-dash"
              />

              {/* Start Pin: Present Location */}
              <g transform="translate(160, 300)">
                <circle cx="0" cy="0" r="16" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
                <rect x="-55" y="-36" width="110" height="22" rx="5" fill="#EF4444" />
                <text x="0" y="-21" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
                  📍 현재 위치
                </text>
              </g>

              {/* Mid Footprints */}
              <g transform="translate(290, 255)">
                <circle cx="0" cy="0" r="10" fill="#FACC15" />
                <text x="0" y="4" fill="#000" fontSize="9" fontWeight="900" textAnchor="middle">
                  👣
                </text>
              </g>
              <g transform="translate(440, 210)">
                <circle cx="0" cy="0" r="10" fill="#FACC15" />
                <text x="0" y="4" fill="#000" fontSize="9" fontWeight="900" textAnchor="middle">
                  👣
                </text>
              </g>

              {/* Elevator Arrival Pin */}
              <g transform="translate(585, 210)">
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  className="animate-pulse-radar origin-center"
                />
                <circle cx="0" cy="0" r="14" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                <text x="0" y="4" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">
                  🛗
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Map Legend (범례) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-2xs"></span>
            <span>현재 위치 (1층 로비)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white shadow-2xs"></span>
            <span>중앙 엘리베이터 2호기</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-5 h-2 rounded-full inline-block border"
              style={{ backgroundColor: lineColor, borderColor: lineColor }}
            ></span>
            <span>바닥 {lineColorName} (동선)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] text-white font-black"
              style={{ backgroundColor: lineColor }}
            >
              ★
            </span>
            <span className="text-slate-900 font-black">
              목적지: {room} ({chair})
            </span>
          </div>
        </div>

        <div className="text-slate-500 font-medium flex items-center gap-1 text-xs">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>바닥의 유도선 색상을 보면서 걸어가시면 편리합니다.</span>
        </div>
      </div>

      {/* Hospital Chair & Facility Directory */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-black text-slate-800">
              원내 진료실 & 체어 배치 기준
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            총 4개 진료실 + 중앙수술실 (전체 6개 체어 운용)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {HOSPITAL_CHAIR_UNITS.map((unit) => {
            const isPatientChair = chair.includes(unit.chairName.replace(' 체어', '').replace('체어', '')) ||
              (unit.chairName.includes('특진') && chair.includes('특진'));

            return (
              <div
                key={unit.id}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isPatientChair
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-500 text-[11px]">{unit.clinicRoom}</span>
                  {isPatientChair && (
                    <span className="bg-amber-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full">
                      ★ 내 배정 체어
                    </span>
                  )}
                </div>
                <div className="font-black text-slate-900 text-sm mb-0.5 flex items-center gap-1.5">
                  <span>{unit.chairName}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mb-1.5">
                  {unit.unitPurpose}
                </p>
                <div className="flex flex-wrap gap-1">
                  {unit.equippedTools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isPatientChair
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

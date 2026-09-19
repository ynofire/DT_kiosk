import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Tablet,
  Wifi,
  BatteryCharging,
  Bell,
  Globe,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Pill,
  ZoomIn,
  Volume2,
  MousePointerClick,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../lib/i18n';
import { speakText } from '../lib/tts';

interface KioskCoverPageProps {
  onStart: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenStaffCall: () => void;
}

export const KioskCoverPage: React.FC<KioskCoverPageProps> = ({
  onStart,
  language,
  onToggleLanguage,
  onOpenStaffCall,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const dayNames =
        language === 'en'
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          : ['일', '월', '화', '수', '목', '금', '토'];
      const day = dayNames[now.getDay()];
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      if (language === 'en') {
        setCurrentTime(`${month}/${date} (${day}) ${hours}:${minutes}`);
      } else {
        setCurrentTime(`${month}월 ${date}일 (${day}) ${hours}:${minutes}`);
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const handleStartReception = () => {
    speakText(
      language === 'en'
        ? 'Welcome to OZ Dental Hospital. Starting your check-in.'
        : '환영합니다. 오즈치과병원 스마트 접수를 시작합니다. 1단계 본인 확인을 진행해 주세요.',
      undefined,
      language
    );
    onStart();
  };

  return (
    <div
      id="kiosk-cover-page"
      onClick={handleStartReception}
      className="relative min-h-screen w-full bg-gradient-to-b from-[#0B1528] via-[#0F1E36] to-[#0A1324] text-white flex flex-col justify-between select-none cursor-pointer overflow-hidden transition-all duration-300"
    >
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] right-[15%] w-[350px] h-[350px] bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* 🌟 1. Top Tablet Status Strip */}
      <header
        className="relative z-20 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-2 text-xs font-semibold flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-blue-400">
            <Tablet className="w-4 h-4" />
            <span className="text-white font-black tracking-wide">
              {language === 'en' ? 'OZ Dental University Hospital' : '오즈치과대학교병원'}
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            {language === 'en' ? 'Smart Triage System' : '스마트 전자예진 시스템'}
          </span>
          <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {language === 'en' ? 'System Online' : '원내 전산 연동'}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-700 shadow-sm">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLanguage('ko');
                speakText('한국어가 선택되었습니다.', undefined, 'ko');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                language === 'ko'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇰🇷</span>
              <span>한국어</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLanguage('en');
                speakText('English mode selected.', undefined, 'en');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>

          {/* Quick Staff Call Button on Cover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenStaffCall();
            }}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>{language === 'en' ? 'Call Staff' : '직원 호출'}</span>
          </button>

          {/* Time & Battery */}
          <div className="hidden md:flex items-center gap-2.5 text-slate-300 font-mono text-xs">
            <span className="text-amber-300 flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5" />
              100%
            </span>
            <span className="text-slate-600">|</span>
            <span>{currentTime}</span>
          </div>
        </div>
      </header>

      {/* 🌟 2. Central Hero & Interactive Touch Screen Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full text-center">
        {/* Hospital Branding Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-bold mb-5 shadow-inner">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>
            {language === 'en'
              ? 'Premier Dental Care & Fast Electronic Reception'
              : '어르신·초진 환자 누구나 쉬운 스마트 전자 예진 안내'}
          </span>
        </div>

        {/* Hospital Emblem with Soft Pulse Ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl flex items-center justify-center border-2 border-blue-300/40">
            <div className="w-full h-full rounded-[22px] bg-slate-900/40 flex items-center justify-center">
              <Stethoscope className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl border-2 border-slate-900 shadow-md">
            <ShieldCheck className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Main Hospital & Kiosk Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-sm">
          {language === 'en' ? (
            <>
              OZ Dental <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">University Hospital</span>
            </>
          ) : (
            <>
              오즈치과대학교병원 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">스마트 안심 예진</span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed mb-8">
          {language === 'en'
            ? 'Safe, accurate, and comfortable dental care starts here. Touch the screen to begin your 3-minute smart reception.'
            : '안전하고 편안한 진료의 시작, 번거로운 종이 문진표 대신 터치 한 번으로 빠르고 정확하게 접수하세요.'}
        </p>

        {/* 🌟 3. Big Pulsating Interactive Touch Card (Call-To-Action) */}
        <div
          id="touch-start-button"
          onClick={handleStartReception}
          className="group relative w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white shadow-2xl shadow-blue-500/30 border-2 border-blue-200/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col items-center gap-3 text-center"
        >
          {/* Subtle animated border ping */}
          <span className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-blue-400 to-teal-400 opacity-40 blur-md group-hover:opacity-75 transition-opacity" />

          <div className="relative z-10 flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <MousePointerClick className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block leading-tight drop-shadow">
                {language === 'en' ? 'Touch Screen to Start' : '화면을 터치하여 접수 시작하기'}
              </span>
              <span className="text-xs sm:text-sm text-blue-100 font-semibold block mt-0.5">
                {language === 'en'
                  ? 'First-time & Returning Patients · Takes approx. 3 mins'
                  : '처음 오신 분(초진) · 재진 환자 모두 가능 (약 2~3분 소요)'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* 🌟 4. Three High-Contrast Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 text-left flex items-start gap-3 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">
                {language === 'en' ? 'Fast 3-Min Check-in' : '대기 시간 단축'}
              </span>
              <span className="text-xs text-slate-400 leading-snug block mt-0.5">
                {language === 'en'
                  ? 'Skip paper forms with easy digital touch'
                  : '원내 접수대 대기 없이 즉시 전산 접수'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 text-left flex items-start gap-3 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">
                {language === 'en' ? 'Specialist Matching' : '맞춤 진료과 배정'}
              </span>
              <span className="text-xs text-slate-400 leading-snug block mt-0.5">
                {language === 'en'
                  ? 'Direct routing to Oral Surgery, Perio, Endo'
                  : '증상별 구강외과·치주과·보존과 최적 연계'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 text-left flex items-start gap-3 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">
                {language === 'en' ? 'Medication Safety' : '약물·알러지 점검'}
              </span>
              <span className="text-xs text-slate-400 leading-snug block mt-0.5">
                {language === 'en'
                  ? 'Aspirin, bone drugs & allergy checks'
                  : '아스피린·골다공증약·항생제 사전 스크리닝'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 🌟 5. Bottom Accessible Information & Guidance Footer */}
      <footer
        className="relative z-20 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 py-3 px-4 sm:px-8 text-xs text-slate-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1 text-slate-300 font-bold">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              {language === 'en' ? '120% Large Text Mode' : '어르신 120% 큰 글씨 지원'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300 font-bold">
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              {language === 'en' ? 'Clear Voice Guide (TTS)' : '친절한 음성 안내 지원'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              {language === 'en'
                ? 'Please prepare your ID card or 13-digit Resident Registration Number'
                : '신분증(주민등록증, 운전면허증) 또는 주민등록번호를 준비해 주세요.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">
              {language === 'en' ? 'Emergency Desk: 02-2228-0114' : '원내 안내 및 문의: 02-2228-0114'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStaffCall();
              }}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors flex items-center gap-1"
            >
              <Bell className="w-3 h-3 text-amber-400" />
              <span>{language === 'en' ? 'Need Help?' : '도움 요청'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

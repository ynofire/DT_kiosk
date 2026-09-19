import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Bell,
  Activity,
  ChevronRight,
  Stethoscope,
  Wifi,
  BatteryCharging,
  Tablet,
  Globe,
} from 'lucide-react';
import { speakText, setAudioEnabled, stopSpeech } from '../lib/tts';
import { I18N_DATA, Language } from '../lib/i18n';

interface KioskHeaderProps {
  step: number;
  isZoom120: boolean;
  onToggleZoom120: () => void;
  onReset: () => void;
  onOpenStaffCall: () => void;
  onOpenQueueMonitor: () => void;
  currentSpeechText?: string;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  step,
  isZoom120,
  onToggleZoom120,
  onReset,
  onOpenStaffCall,
  onOpenQueueMonitor,
  currentSpeechText,
  language,
  onToggleLanguage,
}) => {
  const [audioOn, setAudioOn] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const t = I18N_DATA[language];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const dayNames = language === 'en' 
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

  const toggleSound = () => {
    const next = !audioOn;
    setAudioOn(next);
    setAudioEnabled(next);
    if (!next) {
      stopSpeech();
    } else {
      speakText(language === 'en' ? 'Voice guide is enabled.' : '음성 안내가 켜졌습니다.', undefined, language);
    }
  };

  const handleReplayVoice = () => {
    if (currentSpeechText) {
      speakText(currentSpeechText, undefined, language);
    } else {
      speakText(
        language === 'en'
          ? 'If you need help, please press the Call Staff button at the top.'
          : '환자분, 도움이 필요하시면 화면 상단의 직원 호출 버튼을 눌러주세요.',
        undefined,
        language
      );
    }
  };

  const handleLanguageSwitch = (newLang: Language) => {
    onToggleLanguage(newLang);
    speakText(
      newLang === 'en' ? 'English mode selected.' : '한국어 모드가 선택되었습니다.',
      undefined,
      newLang
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm text-slate-800 select-none flex-shrink-0">
      {/* 🌟 1. Top Tablet Status Strip (대형 태블릿 전용 상단 바) */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1 text-[11px] font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tablet className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-white font-black tracking-wide">
            {t.hospitalName}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">{t.hospitalSubtitle}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px]">{t.networkStatus}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span className="text-[10px]">{t.batteryStatus}</span>
          </div>
          <span className="text-slate-200 font-mono">{currentTime}</span>
        </div>
      </div>

      {/* 🌟 2. Unified Tablet Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex items-center justify-between gap-3">
        {/* Left: Hospital Brand & Step Counter */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow border border-blue-400">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
              {language === 'en' ? (
                <>Smart <span className="text-blue-600">Triage</span></>
              ) : (
                <>스마트 <span className="text-blue-600">전자예진</span></>
              )}
            </h1>
            <span className="text-xs font-bold text-slate-500">
              {t.stepOf} {step} / 5
            </span>
          </div>
        </div>

        {/* Center: 5-Step Process Indicator Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
          {t.steps.map((name, idx) => {
            const stepNum = idx + 1;
            const isCurrent = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <React.Fragment key={stepNum}>
                <div
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-300'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : 'bg-slate-100 text-slate-400 font-semibold'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-white text-blue-700'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </span>
                  <span>{name.includes('.') ? name.split('.')[1] : name}</span>
                </div>
                {idx < t.steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Language Switcher & Accessibility Toolbar */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* 🌐 Global Language Switcher (KO / EN) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300 mr-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleLanguageSwitch('ko')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                language === 'ko'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="한국어 모드"
            >
              <span>🇰🇷</span>
              <span>한국어</span>
            </button>
            <button
              type="button"
              onClick={() => handleLanguageSwitch('en')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English Mode"
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>

          {/* 음성 안내 토글 */}
          <button
            type="button"
            onClick={toggleSound}
            className={`min-h-[38px] px-2.5 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1 border transition-all active:scale-95 ${
              audioOn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                : 'bg-rose-50 text-rose-700 border-rose-300'
            }`}
            title="Voice Guide"
          >
            {audioOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-rose-600" />}
            <span className="hidden lg:inline">{audioOn ? t.voiceOn : t.voiceOff}</span>
          </button>

          {/* 다시 듣기 */}
          {audioOn && (
            <button
              type="button"
              onClick={handleReplayVoice}
              className="min-h-[38px] px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1"
              title="Replay Voice"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span className="hidden xl:inline">{t.replayVoice}</span>
            </button>
          )}

          {/* 직원 호출 */}
          <button
            type="button"
            onClick={onOpenStaffCall}
            className="min-h-[38px] px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm rounded-xl border border-rose-300 shadow flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Bell className="w-4 h-4 text-white" />
            <span>{t.callStaff}</span>
          </button>

          {/* 실시간 대기열 모니터 (원내 관리자용) */}
          <button
            type="button"
            onClick={onOpenQueueMonitor}
            className="min-h-[38px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all hidden 2xl:flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>대기열 관리</span>
          </button>

          {/* 처음으로 / 첫 화면 */}
          {step >= 1 && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[38px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
              title={t.resetToHome}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{t.resetToHome}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { QUADRANT_LOCATIONS } from '../lib/triageData';
import { speakText } from '../lib/tts';
import { InteractiveMouthDiagram } from './InteractiveMouthDiagram';
import { I18N_DATA, Language } from '../lib/i18n';

interface Step3MouthLocationProps {
  selectedLocation: string; // 'UR' | 'FRONT_UP' | 'UL' | 'LR' | 'FRONT_DOWN' | 'LL' | 'ALL'
  onSelectLocation: (locId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  fontSizeMode?: 'normal' | 'large' | 'extralarge';
  language?: Language;
}

export const Step3MouthLocation: React.FC<Step3MouthLocationProps> = ({
  selectedLocation,
  onSelectLocation,
  onNext,
  onPrev,
  language = 'ko',
}) => {
  const t = I18N_DATA[language];

  useEffect(() => {
    const text =
      language === 'en'
        ? 'Step 3. Please tap the approximate location of discomfort in the tooth diagram, or select from the list.'
        : '3단계입니다. 입안 그림에서 아프거나 불편한 치아 부위를 터치해 주세요. 잘 모르실 경우 아래의 [정확한 위치를 잘 모름] 버튼을 누르시면 됩니다.';
    speakText(text, undefined, language);
  }, [language]);

  const getLocationDisplayName = (locId: string) => {
    switch (locId) {
      case 'UR':
        return t.quadrantUR;
      case 'UL':
        return t.quadrantUL;
      case 'LR':
        return t.quadrantLR;
      case 'LL':
        return t.quadrantLL;
      case 'FRONT_UP':
        return t.quadrantFrontUp;
      case 'FRONT_DOWN':
        return t.quadrantFrontDown;
      case 'ALL':
        return t.quadrantAll;
      default:
        return locId;
    }
  };

  const handleSelect = (locId: string) => {
    onSelectLocation(locId);
    const displayName = getLocationDisplayName(locId);
    if (locId === 'ALL') {
      speakText(
        language === 'en'
          ? 'Not sure of exact location. We will examine with digital X-rays.'
          : '정확한 위치를 모르셔도 괜찮습니다. 진료실에서 정밀 검사로 확인해 드립니다.',
        undefined,
        language
      );
    } else {
      speakText(
        language === 'en'
          ? `${displayName} selected. Please tap Next Step.`
          : `${displayName}를 선택하셨습니다. 화면 아래 다음 단계 버튼을 눌러주세요.`,
        undefined,
        language
      );
    }
  };

  const selectedItem =
    QUADRANT_LOCATIONS.find((q) => q.id === selectedLocation) || QUADRANT_LOCATIONS[0];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col select-none pb-8 space-y-4">
      {/* Title & Guidance Header */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow flex-shrink-0">
            3
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">
              Step 3. {t.stepDesc[2]}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {t.step3Title}
            </h2>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm font-medium hidden md:block">
          {t.step3Subtitle}
        </p>
      </div>

      {/* Main Split: Left Dental Diagram (7 cols) + Right Location List (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Interactive Dental Arch Graphic */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 px-1 flex-shrink-0">
            <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {t.step3InteractiveHint}
            </span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
              {language === 'en' ? 'Maxilla (Upper) / Mandible (Lower)' : '상악(위) / 하악(아래)'}
            </span>
          </div>

          {/* SVG Dental Arch Diagram */}
          <div className="flex-1 flex items-center justify-center py-2">
            <InteractiveMouthDiagram
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelect}
              language={language}
            />
          </div>

          {/* Quick unknown button directly below diagram */}
          <button
            type="button"
            onClick={() => handleSelect('ALL')}
            className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:scale-95 shadow-sm flex-shrink-0 mt-3 ${
              selectedLocation === 'ALL'
                ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm">
                🤔
              </div>
              <div>
                <span className="text-sm sm:text-base font-black block leading-tight">
                  {t.step3EntireMouthBtn}
                </span>
                <span className="text-[11px] font-semibold text-amber-800">
                  {t.step3EntireMouthDesc}
                </span>
              </div>
            </div>
            {selectedLocation === 'ALL' ? (
              <CheckCircle2 className="w-6 h-6 text-amber-700 flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex-shrink-0" />
            )}
          </button>
        </div>

        {/* Right Column: Location Cards List & Selected Info */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col h-full">
          {/* Current Selection Status Card */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-2 border-blue-200 rounded-2xl shadow-xs flex-shrink-0 mb-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                {t.selectedLocationLabel}
              </span>
              <span className="bg-blue-600 text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                {language === 'en' ? 'Selected' : '선택됨'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-base sm:text-lg font-black text-slate-900">
                {getLocationDisplayName(selectedLocation)}
              </span>
            </div>
            <p className="text-slate-600 text-xs mt-1 leading-snug font-medium">
              {language === 'en' ? 'The dentist will examine this area first during your consultation.' : selectedItem.seniorExplanation}
            </p>
          </div>

          {/* Section Header with Enlarged Font */}
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block flex-shrink-0" />
              {language === 'en' ? 'Select directly from list:' : '목록에서 직접 선택:'}
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {language === 'en' ? '7 Zones' : '7개 부위'}
            </span>
          </div>

          {/* List of Specific Dental Zones - Vertically Filling the Card */}
          <div className="flex-1 flex flex-col justify-between gap-2 min-h-0">
            {QUADRANT_LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              const displayName = getLocationDisplayName(loc.id);
              const isAll = loc.id === 'ALL';

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc.id)}
                  className={`w-full flex-1 min-h-[50px] sm:min-h-[54px] px-3.5 py-2 sm:py-2.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:scale-[0.98] ${
                    isSelected
                      ? isAll
                        ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-300 text-amber-950 font-black'
                        : 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-300 text-blue-950 font-black'
                      : isAll
                      ? 'bg-amber-50/60 hover:bg-amber-100/70 border-amber-200 text-amber-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-xl flex items-center justify-center text-xs font-black shadow-xs flex-shrink-0 ${
                        isSelected
                          ? isAll
                            ? 'bg-amber-500 text-amber-950'
                            : 'bg-blue-600 text-white'
                          : isAll
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {loc.shortLabel}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold tracking-tight">
                      {displayName}
                    </span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 ${
                        isAll ? 'text-amber-700' : 'text-blue-600'
                      }`}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Controls: Prev / Next (Sticky Bottom Bar) */}
      <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between gap-4 flex-shrink-0 mt-6">
        <button
          type="button"
          onClick={onPrev}
          className="min-h-[52px] px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-base rounded-xl border border-slate-300 flex items-center gap-2 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.prevStep}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-base sm:text-lg rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md ring-2 ring-blue-200"
        >
          <span>{t.nextStep} ({t.stepDesc[3]})</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

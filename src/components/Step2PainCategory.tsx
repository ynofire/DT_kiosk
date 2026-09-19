import React, { useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Layers,
  SmilePlus,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { TriageAreaType } from '../types';
import { AREA_CATEGORIES } from '../lib/triageData';
import { speakText } from '../lib/tts';
import { I18N_DATA, Language } from '../lib/i18n';

interface Step2PainCategoryProps {
  selectedArea: TriageAreaType | null;
  selectedAreas?: TriageAreaType[];
  onSelectArea: (area: TriageAreaType) => void;
  onToggleArea?: (area: TriageAreaType) => void;
  onNext: () => void;
  onPrev: () => void;
  fontSizeMode?: 'normal' | 'large' | 'extralarge';
  language?: Language;
}

interface AreaDisplay {
  id: TriageAreaType;
  iconName: string;
  title: string;
  subtitle: string;
  description: string;
  targetDepartment: string;
}

export const Step2PainCategory: React.FC<Step2PainCategoryProps> = ({
  selectedArea,
  selectedAreas = [],
  onSelectArea,
  onToggleArea,
  onNext,
  onPrev,
  language = 'ko',
}) => {
  const t = I18N_DATA[language];

  // If selectedAreas is populated, use it, else wrap selectedArea
  const currentAreas =
    selectedAreas.length > 0
      ? selectedAreas
      : selectedArea
      ? [selectedArea]
      : [];

  useEffect(() => {
    const text =
      language === 'en'
        ? 'Step 2. Please select where you feel the most discomfort. You may select multiple areas or choose Not Sure.'
        : '2단계입니다. 아프신 부위를 골라주세요. 여러 곳이 아프시다면 모두 누르실 수 있으며, 잘 모르시겠다면 잘 모르겠음을 눌러주세요.';
    speakText(text, undefined, language);
  }, [language]);

  const areas: AreaDisplay[] = [
    {
      id: 'teeth',
      iconName: 'Sparkles',
      title: t.areaTeethTitle,
      subtitle: t.areaTeethSubtitle,
      description: t.areaTeethDesc,
      targetDepartment: language === 'en' ? 'Endodontics / Conservative' : '보존과 (충치·신경)',
    },
    {
      id: 'gum',
      iconName: 'ShieldAlert',
      title: t.areaGumTitle,
      subtitle: t.areaGumSubtitle,
      description: t.areaGumDesc,
      targetDepartment: language === 'en' ? 'Periodontics' : '치주과 (잇몸치료)',
    },
    {
      id: 'implant_denture',
      iconName: 'Layers',
      title: t.areaProstheticTitle,
      subtitle: t.areaProstheticSubtitle,
      description: t.areaProstheticDesc,
      targetDepartment: language === 'en' ? 'Prosthodontics' : '보철과 (틀니·임플란트)',
    },
    {
      id: 'jaw_mucosa',
      iconName: 'SmilePlus',
      title: t.areaJawTitle,
      subtitle: t.areaJawSubtitle,
      description: t.areaJawDesc,
      targetDepartment: language === 'en' ? 'Oral Surgery / Medicine' : '구강외과 / 구강내과',
    },
    {
      id: 'unknown_general',
      iconName: 'HelpCircle',
      title: t.areaUnknownTitle,
      subtitle: t.areaUnknownSubtitle,
      description: t.areaUnknownDesc,
      targetDepartment: language === 'en' ? 'Oral Medicine / General' : '구강내과 (종합검진)',
    },
  ];

  const handleCardClick = (area: AreaDisplay) => {
    if (onToggleArea) {
      onToggleArea(area.id);
    } else {
      onSelectArea(area.id);
    }

    if (area.id === 'unknown_general') {
      speakText(
        language === 'en'
          ? 'Not sure selected. General oral examination will be arranged.'
          : '잘 모르겠음, 종합 구강 검진을 선택하셨습니다.',
        undefined,
        language
      );
    } else {
      speakText(
        language === 'en'
          ? `${area.title} selected.`
          : `${area.title}를 선택하셨습니다.`,
        undefined,
        language
      );
    }
  };

  const getIcon = (iconName: string, isSelected: boolean) => {
    const cls = `w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 ${
      isSelected ? 'text-blue-600' : 'text-slate-600'
    }`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={cls} />;
      case 'ShieldAlert':
        return <ShieldAlert className={cls} />;
      case 'Layers':
        return <Layers className={cls} />;
      case 'SmilePlus':
        return <SmilePlus className={cls} />;
      case 'HelpCircle':
        return <HelpCircle className={cls} />;
      default:
        return <Sparkles className={cls} />;
    }
  };

  const hasSelection = currentAreas.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col select-none pb-8 space-y-4">
      {/* Title & Guidance Header */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow flex-shrink-0">
            2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Step 2. {t.stepDesc[1]}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                {t.step2MultiBadge}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {t.step2Title}
            </h2>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm font-medium">
          {t.step2MultiGuidance}
        </p>
      </div>

      {/* Symptom Cards Grid (4 specific cards + 1 full-width "Not Sure" card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.slice(0, 4).map((area) => {
          const isSelected = currentAreas.includes(area.id);

          return (
            <div
              key={area.id}
              onClick={() => handleCardClick(area)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 select-none shadow-sm relative flex flex-col justify-between min-h-[160px] ${
                isSelected
                  ? 'bg-blue-50/90 border-blue-600 shadow-md ring-4 ring-blue-200'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              {/* Top Row: Icon + Title + Check */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 p-2 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {getIcon(area.iconName, isSelected)}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {area.title}
                    </h3>
                    <p className="text-blue-700 font-bold text-xs sm:text-sm">
                      {area.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="bg-blue-600 text-white p-1 rounded-full flex-shrink-0 shadow">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0" />
                )}
              </div>

              {/* Description & Recommended Dept */}
              <div className="border-t border-slate-200/80 pt-2.5 flex items-center justify-between gap-2">
                <p className="text-slate-600 text-xs sm:text-sm leading-snug">
                  {area.description}
                </p>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-black text-xs px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                  {t.recommendedDeptLabel}: {area.targetDepartment}
                </span>
              </div>
            </div>
          );
        })}

        {/* 5th Option: Full-width "잘 모르겠음 / 복합 통증" Card */}
        {(() => {
          const area = areas[4];
          const isSelected = currentAreas.includes(area.id);
          return (
            <div
              key={area.id}
              onClick={() => handleCardClick(area)}
              className={`md:col-span-2 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 select-none shadow-sm relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-slate-100 border-slate-700 shadow-md ring-4 ring-slate-300'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 p-2 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {getIcon(area.iconName, isSelected)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {area.title}
                    </h3>
                    <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-md">
                      {language === 'en' ? 'Unsure' : '모름'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-bold text-xs sm:text-sm">
                    {area.subtitle}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {area.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="bg-slate-200 text-slate-800 border border-slate-300 font-black text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                  {t.recommendedDeptLabel}: {area.targetDepartment}
                </span>
                {isSelected ? (
                  <div className="bg-slate-800 text-white p-1 rounded-full flex-shrink-0 shadow">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })()}
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
          onClick={() => {
            if (!hasSelection) {
              speakText(
                language === 'en'
                  ? 'Please select at least one area or choose Not Sure.'
                  : '아프신 부위를 골라주시거나, 잘 모르겠음을 눌러주세요.',
                undefined,
                language
              );
              return;
            }
            onNext();
          }}
          disabled={!hasSelection}
          className={`min-h-[52px] px-8 font-black text-base sm:text-lg rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md ${
            hasSelection
              ? 'bg-blue-600 hover:bg-blue-500 text-white ring-2 ring-blue-200 cursor-pointer'
              : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
          }`}
        >
          <span>
            {t.nextStep}
            {currentAreas.length > 1
              ? ` (${currentAreas.length}${language === 'en' ? ' areas selected' : '개 부위 선택'})`
              : ` (${t.stepDesc[2]})`}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


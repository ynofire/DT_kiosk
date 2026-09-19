import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Flame,
  AlertCircle,
  Pill,
  Heart,
  Activity,
  FileCheck,
  Smile,
  Meh,
  Frown,
  HelpCircle,
  AlertTriangle,
  Syringe,
  FileText,
  X,
  Plus,
  ShieldAlert,
  Edit3,
} from 'lucide-react';
import { speakText } from '../lib/tts';
import { TriageAreaType } from '../types';
import { I18N_DATA, Language } from '../lib/i18n';

interface Step4DetailedSurveyProps {
  selectedArea: TriageAreaType | null;
  onsetPeriod: string;
  onChangeOnset: (val: string) => void;
  painType: string;
  onChangePainType: (val: string) => void;
  selectedSymptoms?: string[];
  onChangeSelectedSymptoms?: (val: string[]) => void;
  dailyImpact: string;
  onChangeDailyImpact: (val: string) => void;
  painScale: number;
  onChangePainScale: (val: number) => void;
  medicalAlerts: string[];
  onToggleMedicalAlert: (val: string) => void;

  // 상세 복용 약물 및 알러지 (치과의사 수술/처방/마취 사전확인)
  medicationsList?: string[];
  onToggleMedication?: (val: string) => void;
  otherMedicationText?: string;
  onChangeOtherMedicationText?: (val: string) => void;
  drugAllergies?: string[];
  onToggleDrugAllergy?: (val: string) => void;
  otherAllergyText?: string;
  onChangeOtherAllergyText?: (val: string) => void;
  hasNoMedications?: boolean;
  onSelectNoMedications?: () => void;
  hasNoAllergies?: boolean;
  onSelectNoAllergies?: () => void;

  specificSymptomDetail: string;
  onChangeSpecificSymptomDetail: (val: string) => void;

  ulcerDuration: 'none' | 'under_2weeks' | 'over_2weeks';
  onChangeUlcerDuration: (val: 'none' | 'under_2weeks' | 'over_2weeks') => void;
  hasWhiteOrRedPatches: boolean;
  onChangeHasWhiteOrRedPatches: (val: boolean) => void;
  hasAngularCheilitis: boolean;
  onChangeHasAngularCheilitis: (val: boolean) => void;
  hasSevereToothMobility: boolean;
  onChangeHasSevereToothMobility: (val: boolean) => void;

  hasDysphagia: boolean;
  onChangeHasDysphagia: (val: boolean) => void;

  dentureStatus: 'none' | 'partial' | 'complete';
  onChangeDentureStatus: (val: 'none' | 'partial' | 'complete') => void;
  dentureWornAtNight: boolean;
  onChangeDentureWornAtNight: (val: boolean) => void;
  dentureComplaint: string;
  onChangeDentureComplaint: (val: string) => void;
  implantStatus: 'none' | 'completed' | 'in_progress';
  onChangeImplantStatus: (val: 'none' | 'completed' | 'in_progress') => void;

  cancerTreatmentHistory: 'none' | 'radiation_past' | 'radiation_current' | 'chemo_other';
  onChangeCancerTreatmentHistory: (
    val: 'none' | 'radiation_past' | 'radiation_current' | 'chemo_other'
  ) => void;
  hasDryMouth: boolean;
  onChangeHasDryMouth: (val: boolean) => void;
  dryMouthSeverity: 'mild' | 'severe';
  onChangeDryMouthSeverity: (val: 'mild' | 'severe') => void;

  hasAcidReflux: boolean;
  onChangeHasAcidReflux: (val: boolean) => void;
  hasHeartCondition: boolean;
  onChangeHasHeartCondition: (val: boolean) => void;

  onNext: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
  language?: Language;
}

export const Step4DetailedSurvey: React.FC<Step4DetailedSurveyProps> = ({
  selectedArea,
  onsetPeriod,
  onChangeOnset,
  painType,
  onChangePainType,
  selectedSymptoms = [],
  onChangeSelectedSymptoms,
  dailyImpact,
  onChangeDailyImpact,
  painScale,
  onChangePainScale,
  medicalAlerts,
  onToggleMedicalAlert,
  medicationsList = [],
  onToggleMedication,
  otherMedicationText = '',
  onChangeOtherMedicationText,
  drugAllergies = [],
  onToggleDrugAllergy,
  otherAllergyText = '',
  onChangeOtherAllergyText,
  hasNoMedications = false,
  onSelectNoMedications,
  hasNoAllergies = false,
  onSelectNoAllergies,
  specificSymptomDetail,
  onChangeSpecificSymptomDetail,
  ulcerDuration,
  onChangeUlcerDuration,
  hasWhiteOrRedPatches,
  onChangeHasWhiteOrRedPatches,
  hasAngularCheilitis,
  onChangeHasAngularCheilitis,
  hasSevereToothMobility,
  onChangeHasSevereToothMobility,
  hasDysphagia,
  onChangeHasDysphagia,
  dentureStatus,
  onChangeDentureStatus,
  dentureWornAtNight,
  onChangeDentureWornAtNight,
  dentureComplaint,
  onChangeDentureComplaint,
  implantStatus,
  onChangeImplantStatus,
  cancerTreatmentHistory,
  onChangeCancerTreatmentHistory,
  hasDryMouth,
  onChangeHasDryMouth,
  dryMouthSeverity,
  onChangeDryMouthSeverity,
  hasAcidReflux,
  onChangeHasAcidReflux,
  hasHeartCondition,
  onChangeHasHeartCondition,
  onNext,
  onPrev,
  isSubmitting = false,
  language = 'ko',
}) => {
  const [subStep, setSubStep] = useState<number>(1);
  const [showOtherMedInput, setShowOtherMedInput] = useState<boolean>(Boolean(otherMedicationText));
  const [showOtherAllergyInput, setShowOtherAllergyInput] = useState<boolean>(Boolean(otherAllergyText));
  const t = I18N_DATA[language];

  const subStepTitles = [
    {
      num: 1,
      tab: t.subStep1Label,
      title: language === 'en' ? 'Step 1: Onset & Discomfort Trigger' : '1단계: 증상 발병 시기 및 통증 자극 요인',
      desc: language === 'en' ? 'When did the pain start and what makes it worse?' : '언제부터 아프셨고, 어떤 상황에서 통증이 느껴지시나요?',
    },
    {
      num: 2,
      tab: t.subStep2Label,
      title: language === 'en' ? 'Step 2: Mouth Sores & Swallowing Safety' : '2단계: 입안 궤양·헐음 및 삼킴 안전',
      desc: language === 'en' ? 'Mucosal health and choking prevention during treatment' : '입안 점막 상태와 진료 중 사레들림 방지를 확인합니다.',
    },
    {
      num: 3,
      tab: t.subStep3Label,
      title: language === 'en' ? 'Step 3: Prosthetics & Oral Moisture' : '3단계: 보철물·틀니 및 구강 건조감',
      desc: language === 'en' ? 'Status of dentures, implants, and salivary flow' : '현재 사용 중이신 틀니, 임플란트 및 입마름 증상을 확인합니다.',
    },
    {
      num: 4,
      tab: language === 'en' ? 'Medications & Allergies' : '복용약·알러지',
      title: language === 'en' ? 'Step 4: Medications & Drug Allergies' : '4단계: 복용 약물 및 약물 알러지·부작용 확인',
      desc: language === 'en' ? 'Critical for doctor to know: bleeding risk, anesthesia safety, and drug allergies' : '치과의사가 수술, 마취, 약 처방 전 반드시 알아야 하는 복용약과 알러지를 확인합니다.',
    },
    {
      num: 5,
      tab: t.subStep5Label,
      title: language === 'en' ? 'Step 5: Pain Intensity Scale & Review' : '5단계: 현재 느끼시는 통증 강도 (1~5점)',
      desc: language === 'en' ? 'Select your pain intensity and review your questionnaire' : '통증 점수를 선택하시고 문진 내용을 최종 확인해 주세요.',
    },
  ];

  useEffect(() => {
    const current = subStepTitles[subStep - 1];
    speakText(`${current.title}. ${current.desc}`, undefined, language);
  }, [subStep, language]);

  // Onset options (including don't know / unclear)
  const onsetOptions = [
    {
      id: '오늘 갑자기 아픔',
      label: language === 'en' ? 'Started suddenly today' : '오늘 갑자기 아파요',
      desc: language === 'en' ? 'Acute onset' : '갑작스러운 통증 발생',
    },
    {
      id: '2~3일 전부터 시작됨',
      label: language === 'en' ? 'Started 2-3 days ago' : '2~3일 전부터 시작됨',
      desc: language === 'en' ? 'Few days ago' : '며칠 전부터 불편함',
    },
    {
      id: '1~2주 전부터 지속됨',
      label: language === 'en' ? 'Past 1-2 weeks' : '1~2주 전부터 지속됨',
      desc: language === 'en' ? 'Subacute duration' : '서서히 심해진 통증',
    },
    {
      id: '1달 이상 만성 불편',
      label: language === 'en' ? 'Over 1 month' : '1달 이상 만성 불편',
      desc: language === 'en' ? 'Chronic discomfort' : '오랫동안 지속된 불편감',
    },
    {
      id: '잘 기억나지 않음 / 불분명함',
      label: language === 'en' ? 'Not sure / Unclear onset' : '잘 기억나지 않음 / 불분명함',
      desc: language === 'en' ? 'Cannot recall exact timeframe' : '시작 시점을 정확히 알기 어려움',
      isDontKnow: true,
    },
  ];

  // Trigger options (multi-select supported + don't know option)
  const triggerOptions = [
    {
      id: '찬물이나 뜨거운 음식',
      label: language === 'en' ? 'Cold or hot foods / drinks' : '찬물이나 뜨거운 음식 마실 때',
      desc: language === 'en' ? 'Temperature sensitivity' : '온도 변화에 찌릿하고 시림',
    },
    {
      id: '음식을 씹을 때 깜짝 놀람',
      label: language === 'en' ? 'Biting or chewing food' : '음식을 씹을 때 깜짝 놀람',
      desc: language === 'en' ? 'Occlusal pain' : '치아에 힘이 가해질 때 찌릿한 격통',
    },
    {
      id: '가만히 있어도 욱신거림',
      label: language === 'en' ? 'Spontaneous throbbing ache' : '가만히 있어도 욱신거리고 아픔',
      desc: language === 'en' ? 'Pulpitis / Spontaneous pain' : '자극 없이도 지속적인 욱신거림',
    },
    {
      id: '잇몸이 붓고 피가 남',
      label: language === 'en' ? 'Gums swollen & bleeding' : '잇몸이 붓고 피가 나요',
      desc: language === 'en' ? 'Periodontal issue' : '양치 시 피나거나 고름 냄새',
    },
    {
      id: '치아가 흔들리거나 들뜸',
      label: language === 'en' ? 'Loose or floating tooth' : '치아가 흔들리거나 들뜬 느낌',
      desc: language === 'en' ? 'Tooth mobility' : '치아가 솟구치거나 흔들림',
    },
    {
      id: '턱관절 뻐근함 / 개구 장애',
      label: language === 'en' ? 'Stiff jaw / Hard to open' : '턱관절 뻐근함 / 입 벌리기 힘듦',
      desc: language === 'en' ? 'TMJ / Jaw stiffness' : '턱에서 소리가 나거나 뻐근함',
    },
    {
      id: '정확히 잘 모르겠음',
      label: language === 'en' ? 'Not sure / Vague discomfort' : '정확히 잘 모르겠음 (원인 불분명)',
      desc: language === 'en' ? 'Hard to pinpoint specific trigger' : '특정 상황 없이 애매하게 아프거나 원인을 잘 모름',
      isDontKnow: true,
    },
  ];

  // Active symptom list derived from selectedSymptoms or painType
  const activeSymptomIds = useMemo(() => {
    if (selectedSymptoms && selectedSymptoms.length > 0) {
      return selectedSymptoms;
    }
    if (painType) {
      const parts = painType.split(',').map((s) => s.trim()).filter(Boolean);
      return parts.map((part) => {
        const found = triggerOptions.find((opt) => opt.id === part || opt.label === part);
        return found ? found.id : part;
      });
    }
    return [];
  }, [selectedSymptoms, painType]);

  const handleToggleSymptom = (opt: (typeof triggerOptions)[0]) => {
    let nextIds: string[] = [];

    if (opt.id === '정확히 잘 모르겠음') {
      // Toggle "모름" as sole selection
      nextIds = activeSymptomIds.includes('정확히 잘 모르겠음') ? [] : ['정확히 잘 모르겠음'];
      if (nextIds.length > 0) {
        speakText(
          language === 'en'
            ? 'Not sure selected. Dentist will perform a comprehensive diagnostic exam.'
            : '증상 원인 불분명(모름)을 선택하셨습니다. 종합 감별 진료가 배정됩니다.',
          undefined,
          language
        );
      }
    } else {
      // Specific symptom clicked: remove "모름" first
      const cleaned = activeSymptomIds.filter((id) => id !== '정확히 잘 모르겠음');
      if (cleaned.includes(opt.id)) {
        nextIds = cleaned.filter((id) => id !== opt.id);
      } else {
        nextIds = [...cleaned, opt.id];
        speakText(
          language === 'en' ? `${opt.label} added` : `${opt.label} 증상이 추가되었습니다.`,
          undefined,
          language
        );
      }
    }

    if (onChangeSelectedSymptoms) {
      onChangeSelectedSymptoms(nextIds);
    }
    const combinedStr = nextIds.join(', ');
    onChangePainType(combinedStr || (language === 'en' ? 'Unspecified' : '증상 미선택'));
    onChangeSpecificSymptomDetail(combinedStr || (language === 'en' ? 'Unspecified' : '증상 미선택'));
  };

  const handleNextSubStep = () => {
    if (subStep < 5) {
      setSubStep(subStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNext();
    }
  };

  const handlePrevSubStep = () => {
    if (subStep > 1) {
      setSubStep(subStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onPrev();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col select-none pb-8 space-y-4">
      {/* 🌟 1. Top Tablet Progress Bar & Clear SubStep Indicator */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        {/* Step Header Title with Step Counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
              {subStep}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                  Question {subStep} / 5
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {language === 'en' ? 'Survey Step' : '세부 문진 단계'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {subStepTitles[subStep - 1].title}
              </h2>
            </div>
          </div>

          <div className="text-right sm:block hidden">
            <span className="text-xs font-bold text-slate-400 block">
              {language === 'en' ? 'Progress' : '진행률'}
            </span>
            <span className="text-lg font-black text-blue-600">
              {subStep * 20}%
            </span>
          </div>
        </div>

        {/* 5 Prominent Step Pills Navigation */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
          {subStepTitles.map((st) => {
            const isActive = subStep === st.num;
            const isDone = subStep > st.num;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setSubStep(st.num)}
                className={`p-2 sm:p-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-3 ring-blue-100'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="hidden sm:inline-block">
                  {isDone ? '✓' : `${st.num}.`}
                </span>
                <span className="truncate">{st.tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 2. Page Content - Rich, Filled, No Empty Space */}
      <div className="w-full flex-1">
        {/* ======================= SUB-STEP 1: Onset & Trigger ======================= */}
        {subStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 1-A: Onset */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                    Q1
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {language === 'en' ? 'Onset Period' : '발병 시기'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {t.qOnset}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.qOnsetDesc}
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                <div className="grid grid-cols-2 gap-2.5">
                  {onsetOptions.slice(0, 4).map((opt) => {
                    const isSelected = onsetPeriod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onChangeOnset(opt.id);
                          speakText(
                            language === 'en' ? `${opt.label} selected` : `${opt.label}을 선택하셨습니다.`,
                            undefined,
                            language
                          );
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-300'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Clock className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>
                        <span className={`text-base sm:text-lg font-black block ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold mt-0.5">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 5th Onset Option: Not sure / Unclear */}
                {(() => {
                  const opt = onsetOptions[4];
                  const isSelected = onsetPeriod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onChangeOnset(opt.id);
                        speakText(
                          language === 'en'
                            ? 'Onset timeframe not sure selected'
                            : '발병 시기 잘 기억나지 않음을 선택하셨습니다.',
                          undefined,
                          language
                        );
                      }}
                      className={`w-full p-3 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-100 border-slate-700 shadow-md ring-2 ring-slate-300'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className={`w-5 h-5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                        <div>
                          <span className={`text-sm sm:text-base font-black block ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold block">
                            {opt.desc}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                      )}
                    </button>
                  );
                })()}
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-600 text-center font-medium">
                {language === 'en'
                  ? 'Helps determine whether prompt or routine care is needed.'
                  : '증상 발병 시기에 맞춰 진료 일정을 최적화합니다.'}
              </div>
            </div>

            {/* 1-B: Trigger / Discomfort pattern (Multi-Select & Don't Know) */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full">
                      Q2
                    </span>
                    <span className="text-xs text-amber-800 font-bold">
                      {language === 'en' ? 'Discomfort Trigger' : '불편 양상'}
                    </span>
                    <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                      {t.qTriggerMultiBadge}
                    </span>
                  </div>
                  {activeSymptomIds.length > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                      {t.symptomSelectedCount.replace('{count}', String(activeSymptomIds.length))}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {t.qTrigger}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.qTriggerMultiGuidance}
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {triggerOptions.slice(0, 6).map((opt) => {
                    const isSelected = activeSymptomIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleSymptom(opt)}
                        className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm sm:text-base font-black block truncate ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-500 font-medium block truncate mt-0.5">
                            {opt.desc}
                          </span>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 rounded-md border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 7th Option: Don't Know / Vague */}
                {(() => {
                  const opt = triggerOptions[6];
                  const isSelected = activeSymptomIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleSymptom(opt)}
                      className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-100 border-slate-700 shadow-md ring-2 ring-slate-300'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className={`w-5 h-5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                        <div>
                          <span className={`text-sm sm:text-base font-black block ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold block">
                            {opt.desc}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 flex-shrink-0" />
                      )}
                    </button>
                  );
                })()}
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-600 text-center font-medium">
                {language === 'en'
                  ? 'Matched with the appropriate dental specialty clinic based on all selected symptoms.'
                  : '선택하신 모든 증상을 복합 분석하여 최적의 전문 진료과로 배정됩니다.'}
              </div>
            </div>
          </div>
        )}

        {/* ======================= SUB-STEP 2: Mouth Sores & Swallowing ======================= */}
        {subStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 2-A: Ulcer Duration */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                    Q3
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {language === 'en' ? 'Mouth Sores' : '입안 궤양·헐음'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {t.qUlcer}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.qUlcerDesc}
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                <button
                  type="button"
                  onClick={() => {
                    onChangeUlcerDuration('none');
                    speakText(
                      language === 'en' ? 'No sores' : '입안에 헐은 곳 없음을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    ulcerDuration === 'none'
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'No mouth sores or ulcers' : '입안에 헐거나 아픈 곳 없음'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Normal mouth lining' : '구강 점막 정상 상태'}
                    </span>
                  </div>
                  {ulcerDuration === 'none' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeUlcerDuration('under_2weeks');
                    speakText(
                      language === 'en' ? 'Less than 2 weeks' : '2주 미만 헐음을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    ulcerDuration === 'under_2weeks'
                      ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'Recent sores (Less than 2 weeks)' : '최근에 헐었음 (2주 미만)'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Common mouth sore / canker sore' : '단순 혓바늘 또는 구내염'}
                    </span>
                  </div>
                  {ulcerDuration === 'under_2weeks' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeUlcerDuration('over_2weeks');
                    speakText(
                      language === 'en' ? 'Over 2 weeks' : '2주 이상 지속됨을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    ulcerDuration === 'over_2weeks'
                      ? 'bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'Lasted for 2 weeks or longer' : '2주 이상 낫지 않고 지속됨'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Doctor will examine mucosal area' : '진료 시 점막 상태를 세심하게 살펴봅니다'}
                    </span>
                  </div>
                  {ulcerDuration === 'over_2weeks' && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-600 text-center font-medium">
                {language === 'en' ? 'Checks for oral mucosal disease' : '구강 연조직 질환의 조기 감별에 활용됩니다.'}
              </div>
            </div>

            {/* 2-B: Swallowing & Safety */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                    Q4
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {language === 'en' ? 'Swallowing & Choking' : '삼킴 안전'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {t.qSwallowing}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.qSwallowingDesc}
                </p>
              </div>

              <div className="space-y-3 my-auto">
                <button
                  type="button"
                  onClick={() => {
                    onChangeHasDysphagia(false);
                    speakText(
                      language === 'en' ? 'No swallowing difficulties' : '사레들림 없음을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    !hasDysphagia
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'No, I swallow comfortably' : '아니오, 편하게 잘 삼킵니다'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Standard dental chair setup' : '치과 체어 일반 각도 진료 가능'}
                    </span>
                  </div>
                  {!hasDysphagia && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeHasDysphagia(true);
                    speakText(
                      language === 'en' ? 'Choke often' : '사레가 자주 들림을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    hasDysphagia
                      ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'Yes, I choke or cough frequently' : '예, 물이나 음식에 사레가 자주 들려요'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Chair angle adjusted (30-45°) for safety' : '체어를 덜 눕히고 흡인(석션)을 철저히 준비합니다'}
                    </span>
                  </div>
                  {hasDysphagia && <CheckCircle2 className="w-6 h-6 text-amber-600" />}
                </button>
              </div>

              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-xs text-amber-900 text-center font-bold">
                {language === 'en'
                  ? 'Prevents aspiration pneumonia by alerting dental staff in advance.'
                  : '고령 환자분의 진료 중 기도 흡인(사레들림) 예방을 위한 필수 안전 질문입니다.'}
              </div>
            </div>
          </div>
        )}

        {/* ======================= SUB-STEP 3: Dentures & Dry Mouth ======================= */}
        {subStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 3-A: Dentures & Implants */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                    Q5
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {language === 'en' ? 'Prosthetics' : '틀니·임플란트'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {t.qProsthetics}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.qProstheticsDesc}
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                <button
                  type="button"
                  onClick={() => {
                    onChangeDentureStatus('none');
                    onChangeImplantStatus('none');
                    speakText(
                      language === 'en' ? 'Natural teeth' : '틀니나 임플란트 없음을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    dentureStatus === 'none' && implantStatus === 'none'
                      ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className="text-base sm:text-lg font-black text-slate-900">
                    {language === 'en' ? 'Natural teeth only (No dentures/implants)' : '자연치아 (틀니·임플란트 없음)'}
                  </span>
                  {dentureStatus === 'none' && implantStatus === 'none' && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeDentureStatus('complete');
                    speakText(
                      language === 'en' ? 'Denture user' : '틀니 사용 중을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    dentureStatus !== 'none'
                      ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'Currently using dentures' : '현재 틀니를 사용하고 있어요'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Full or partial dentures' : '전체 틀니 또는 부분 틀니'}
                    </span>
                  </div>
                  {dentureStatus !== 'none' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeImplantStatus('completed');
                    speakText(
                      language === 'en' ? 'Implant patient' : '임플란트 치료를 받으셨음을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    implantStatus !== 'none'
                      ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'Have dental implants' : '임플란트 치료를 받았어요'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Implant crowns or bridges' : '치아 자리에 심은 인공치아'}
                    </span>
                  </div>
                  {implantStatus !== 'none' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-600 text-center font-medium">
                {language === 'en' ? 'Helps assess prosthetic fit and hygiene.' : '틀니 및 보철물 관리 상담에 반영됩니다.'}
              </div>
            </div>

            {/* 3-B: Dry Mouth */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                    Q6
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {language === 'en' ? 'Mouth Moisture' : '구강 건조감'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {t.qDryMouth}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.qDryMouthDesc}
                </p>
              </div>

              <div className="space-y-3 my-auto">
                <button
                  type="button"
                  onClick={() => {
                    onChangeHasDryMouth(false);
                    speakText(
                      language === 'en' ? 'No dry mouth' : '입마름 없음을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    !hasDryMouth
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'No, normal saliva flow' : '아니오, 침이 잘 나오고 촉촉합니다'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Comfortable eating' : '음식 드실 때 물 없이도 편안함'}
                    </span>
                  </div>
                  {!hasDryMouth && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeHasDryMouth(true);
                    speakText(
                      language === 'en' ? 'Dry mouth experienced' : '입안이 바짝 마름을 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    hasDryMouth
                      ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {language === 'en' ? 'Yes, dry mouth is severe' : '예, 입안이 자주 마르고 건조합니다'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {language === 'en' ? 'Water needed during meals' : '식사할 때 물이 꼭 필요함'}
                    </span>
                  </div>
                  {hasDryMouth && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-600 text-center font-medium">
                {language === 'en'
                  ? 'Doctor can prescribe dry mouth relief options if needed.'
                  : '구강 건조 완화를 위한 양치액 및 보습 안내를 함께 제공해 드립니다.'}
              </div>
            </div>
          </div>
        )}

        {/* ======================= SUB-STEP 4: Regular Medications & Drug Allergies (Comprehensive Clinical Survey) ======================= */}
        {subStep === 4 && (
          <div className="space-y-4">
            {/* Top Main Card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              {/* Header Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                      Q7
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {language === 'en'
                        ? 'Medications & Drug Allergies (Multi-select)'
                        : '복용 약물 및 약물 알러지 확인 (다중 중복 선택 가능)'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {language === 'en'
                      ? 'Do you take any regular medications or have drug allergies?'
                      : '현재 복용 중인 약물이나 약물 알러지·부작용이 있으신가요?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {language === 'en'
                      ? 'Crucial clinical safety check for surgery, local anesthesia, and prescriptions.'
                      : '치과의사가 발치·임플란트 수술, 마취 주사, 약 처방 시 사전에 반드시 알아야 하는 필수 안전 항목입니다.'}
                  </p>
                </div>
              </div>

              {/* ======================= SECTION 1: MEDICATIONS ======================= */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-700" />
                    <div>
                      <span className="text-sm sm:text-base font-black text-blue-950 block">
                        {language === 'en'
                          ? '1. Regular Medications (Doctors need to know)'
                          : '1. 복용 중인 약물 (의사가 미리 알아야 하는 약물)'}
                      </span>
                      <span className="text-[11px] text-blue-800 font-medium">
                        {language === 'en'
                          ? 'Select all that apply. Tap "Other" to type custom meds.'
                          : '해당되는 약물을 모두 선택해 주세요. 없을 경우 "복용 약 없음"을 눌러주세요.'}
                      </span>
                    </div>
                  </div>

                  {/* No Medications Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectNoMedications) {
                        onSelectNoMedications();
                      } else if (medicalAlerts.length > 0) {
                        medicalAlerts.forEach((m) => onToggleMedicalAlert(m));
                      }
                      speakText(
                        language === 'en'
                          ? 'Selected no regular medications'
                          : '복용 중인 약물이 없음을 선택하셨습니다.',
                        undefined,
                        language
                      );
                    }}
                    className={`px-3.5 py-2 rounded-xl border-2 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 flex-shrink-0 ${
                      (hasNoMedications || (medicationsList.length === 0 && !otherMedicationText && medicalAlerts.filter(a => !a.startsWith('알러지:')).length === 0))
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-200'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'en' ? 'No Medications (Healthy)' : '복용 약 없음 (건강함)'}</span>
                  </button>
                </div>

                {/* 8 Medication Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: '고혈압약',
                      title: language === 'en' ? 'Blood Pressure Medication' : '고혈압약 / 심혈관약',
                      desc: language === 'en'
                        ? 'Antihypertensives, vasodilators (BP stability for anesthesia)'
                        : '혈압 조절제 복용 중 (국소마취 시 혈압 급변 및 기립성 저혈압 주의)',
                      badge: language === 'en' ? 'Anesthesia Safety' : '마취 안전',
                      badgeColor: 'bg-blue-100 text-blue-800',
                    },
                    {
                      id: '당뇨약',
                      title: language === 'en' ? 'Diabetes Medication / Insulin' : '당뇨약 / 인슐린 주사',
                      desc: language === 'en'
                        ? 'Oral hypoglycemics, insulin (wound healing, hypoglycemia)'
                        : '혈당 조절 중 (식사 여부 확인 저혈당 쇼크 방지, 술후 상처치유 관리)',
                      badge: language === 'en' ? 'Infection & Healing' : '상처 치유',
                      badgeColor: 'bg-amber-100 text-amber-900',
                    },
                    {
                      id: '아스피린',
                      title: language === 'en' ? 'Aspirin / Blood Thinners' : '아스피린 / 항응고제 (피 묽게 하는 약)',
                      desc: language === 'en'
                        ? 'Aspirin, Warfarin, NOAC, Plavix (bleeding risk for extraction/surgery)'
                        : '와파린, 플라빅스, 자렐토 등 복용 (발치·스케일링·수술 시 지혈 필수관리)',
                      badge: language === 'en' ? 'Bleeding Control' : '지혈 관리',
                      badgeColor: 'bg-rose-100 text-rose-800',
                    },
                    {
                      id: '골다공증약',
                      title: language === 'en' ? 'Osteoporosis Medication' : '골다공증약 (알약 / 정기 주사제)',
                      desc: language === 'en'
                        ? 'Bisphosphonate pills, Prolia 6-month injections (MRONJ prevention)'
                        : '비스포스포네이트 알약, 6개월 프롤리아 주사 (발치 후 턱뼈괴사 MRONJ 예방)',
                      badge: language === 'en' ? 'Jaw Bone Safety' : '턱뼈 안전',
                      badgeColor: 'bg-purple-100 text-purple-800',
                    },
                    {
                      id: '스테로이드/면역억제제',
                      title: language === 'en' ? 'Steroids / Immunosuppressants' : '스테로이드제 / 면역억제제',
                      desc: language === 'en'
                        ? 'Rheumatoid, organ transplant (adrenal crisis & infection vulnerability)'
                        : '류마티스, 장기이식, 피부질환 등 장기 복용 (부신 기능 저하 및 술후 감염 취약)',
                      badge: language === 'en' ? 'Immunity Alert' : '면역/감염',
                      badgeColor: 'bg-orange-100 text-orange-900',
                    },
                    {
                      id: '신장질환/혈액투석',
                      title: language === 'en' ? 'Kidney Disease / Dialysis' : '신장 질환 / 혈액투석 약물',
                      desc: language === 'en'
                        ? 'Chronic renal failure (heparin bleeding, drug dosage adjustment)'
                        : '만성 신부전, 혈액투석 (투석 당일 헤파린 출혈 주의, 투석 다음날 진료 권장)',
                      badge: language === 'en' ? 'Dialysis Check' : '투석 일정',
                      badgeColor: 'bg-indigo-100 text-indigo-900',
                    },
                    {
                      id: '전립선비대증약',
                      title: language === 'en' ? 'Prostate Medication' : '전립선비대증약 / 혈관확장제',
                      desc: language === 'en'
                        ? 'Alpha-blockers (orthostatic hypotension upon standing up from dental chair)'
                        : '하루날디 등 알파차단제 복용 (진료 체어에서 일어설 때 급격한 어지럼증·실신 주의)',
                      badge: language === 'en' ? 'Dizziness Alert' : '낙상 주의',
                      badgeColor: 'bg-teal-100 text-teal-900',
                    },
                    {
                      id: '기타복용약',
                      title: language === 'en' ? 'Other Medications (Custom Entry)' : '기타 복용 약물 (직접 입력)',
                      desc: language === 'en'
                        ? 'Thyroid, sleeping pills, gastric meds, pain relievers, herbal meds'
                        : '갑상선약, 수면제, 위장약, 고지혈증약, 천식약, 한약 등 직접 기재',
                      badge: language === 'en' ? 'Custom Input' : '직접 기재',
                      badgeColor: 'bg-slate-200 text-slate-800',
                      isCustom: true,
                    },
                  ].map((med) => {
                    const isSelected = med.isCustom
                      ? showOtherMedInput || Boolean(otherMedicationText)
                      : (medicationsList.includes(med.id) || medicalAlerts.includes(med.id));

                    return (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => {
                          if (med.isCustom) {
                            setShowOtherMedInput((prev) => !prev);
                            speakText(
                              language === 'en'
                                ? 'Other medication input toggled'
                                : '기타 약물 직접 입력란을 선택하셨습니다.',
                              undefined,
                              language
                            );
                            return;
                          }

                          if (onToggleMedication) {
                            onToggleMedication(med.id);
                          } else {
                            onToggleMedicalAlert(med.id);
                          }

                          speakText(
                            language === 'en' ? `${med.title} selected` : `${med.title}을 선택하셨습니다.`,
                            undefined,
                            language
                          );
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-start justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-sm ring-2 ring-blue-200'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm sm:text-base font-black text-slate-900 truncate">
                              {med.title}
                            </span>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${med.badgeColor}`}>
                              {med.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium block leading-snug">
                            {med.desc}
                          </span>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Other Medication Text Input (With Quick Tags) */}
                {showOtherMedInput && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-blue-300 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                        <span>
                          {language === 'en'
                            ? 'Specify Other Medications:'
                            : '기타 복용 중이신 약물 이름을 입력해 주세요:'}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowOtherMedInput(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={otherMedicationText}
                      onChange={(e) => {
                        if (onChangeOtherMedicationText) {
                          onChangeOtherMedicationText(e.target.value);
                        }
                      }}
                      placeholder={
                        language === 'en'
                          ? 'e.g., Synthroid (Thyroid), Sleeping pills, Antacid, Cholesterol pills'
                          : '예: 신지로이드(갑상선약), 수면제, 고지혈증약, 위장약, 한약 등'
                      }
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />

                    {/* Quick Suggestion Tags */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        {language === 'en' ? '💡 Tap to add common meds:' : '💡 자주 찾는 복용 약물 (터치 시 자동 입력):'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          '갑상선약(신지로이드)',
                          '고지혈증(콜레스테롤)약',
                          '수면제 / 신경안정제',
                          '위장약 / 제산제',
                          '천식 흡입제',
                          '한약 / 건강보조식품',
                          '우울증약',
                          '통풍약',
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const current = otherMedicationText ? otherMedicationText.trim() : '';
                              const updated = current ? `${current}, ${tag}` : tag;
                              if (onChangeOtherMedicationText) {
                                onChangeOtherMedicationText(updated);
                              }
                              speakText(`${tag} 추가`, undefined, language);
                            }}
                            className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-300 hover:border-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg transition-all shadow-2xs flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-blue-600" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ======================= SECTION 2: DRUG ALLERGIES ======================= */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-rose-50/70 p-3 rounded-2xl border border-rose-200">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-700" />
                    <div>
                      <span className="text-sm sm:text-base font-black text-rose-950 block">
                        {language === 'en'
                          ? '2. Drug Allergies & Adverse Reactions (Doctor Alert)'
                          : '2. 약물 알러지 및 부작용·이상반응 (의사 필수 확인)'}
                      </span>
                      <span className="text-[11px] text-rose-800 font-medium">
                        {language === 'en'
                          ? 'Prevents anaphylaxis and dangerous drug reactions before prescription'
                          : '항생제 쇼크, 진통제 천식, 마취제 어지럼증 등 위험을 예방합니다.'}
                      </span>
                    </div>
                  </div>

                  {/* No Allergies Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectNoAllergies) {
                        onSelectNoAllergies();
                      }
                      speakText(
                        language === 'en'
                          ? 'Selected no drug allergies'
                          : '약물 알러지 및 부작용이 없음을 선택하셨습니다.',
                        undefined,
                        language
                      );
                    }}
                    className={`px-3.5 py-2 rounded-xl border-2 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 flex-shrink-0 ${
                      (hasNoAllergies || (drugAllergies.length === 0 && !otherAllergyText))
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-200'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'en' ? 'No Allergies (Safe)' : '약물 알러지 없음 (안전)'}</span>
                  </button>
                </div>

                {/* 4 Drug Allergy Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: '항생제 알러지 (페니실린/세파)',
                      title: language === 'en'
                        ? 'Antibiotic Allergy (Penicillin / Cepha)'
                        : '항생제 알러지 (페니실린 / 세파계)',
                      desc: language === 'en'
                        ? 'Hives, swelling, rash, breathing difficulty after penicillin or amoxicillin'
                        : '페니실린, 아목시실린 복용 후 두드러기, 눈/입술 부종, 쌕쌕거림, 호흡곤란',
                      badge: language === 'en' ? 'NO Penicillin' : '🚨 페니실린 금기',
                      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300',
                    },
                    {
                      id: '소염진통제(NSAIDs)/아스피린 알러지',
                      title: language === 'en'
                        ? 'Painkiller (NSAIDs / Aspirin) Allergy'
                        : '소염진통제(NSAIDs) / 아스피린 알러지',
                      desc: language === 'en'
                        ? 'Facial edema, asthma attack, rash after ibuprofen or pain relievers'
                        : '이부프로펜, 낙센 등 복용 시 혈관부종, 천식 발작, 피부 발진 (타이레놀 대체)',
                      badge: language === 'en' ? 'NO NSAIDs' : '🚨 NSAIDs 금기',
                      badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300',
                    },
                    {
                      id: '치과 국소마취제(리도카인) 이상반응',
                      title: language === 'en'
                        ? 'Dental Local Anesthetic Reaction'
                        : '치과 국소마취제(리도카인) 이상 반응',
                      desc: language === 'en'
                        ? 'Severe dizziness, palpitations, fainting after dental injection'
                        : '치과 마취 주사 후 극심한 어지러움, 가슴 두근거림, 혈압 급변, 실신 경험',
                      badge: language === 'en' ? 'Anesthesia Alert' : '🚨 국소마취 주의',
                      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
                    },
                    {
                      id: '기타 약물 알러지',
                      title: language === 'en'
                        ? 'Other Drug Allergies (Custom Entry)'
                        : '기타 약물 알러지 / 부작용 (직접 입력)',
                      desc: language === 'en'
                        ? 'Reactions to sulfa drugs, CT contrast dye, digestive pills, patches'
                        : '설파제, CT 조영제, 특정 소화제, 파스/반창고 등 특이 체질 반응 직접 기재',
                      badge: language === 'en' ? 'Custom Allergy' : '⚠️ 직접 기재',
                      badgeColor: 'bg-slate-200 text-slate-800 border border-slate-300',
                      isCustom: true,
                    },
                  ].map((allergy) => {
                    const isSelected = allergy.isCustom
                      ? showOtherAllergyInput || Boolean(otherAllergyText)
                      : drugAllergies.includes(allergy.id);

                    return (
                      <button
                        key={allergy.id}
                        type="button"
                        onClick={() => {
                          if (allergy.isCustom) {
                            setShowOtherAllergyInput((prev) => !prev);
                            speakText(
                              language === 'en'
                                ? 'Other allergy input toggled'
                                : '기타 약물 알러지 직접 입력란을 선택하셨습니다.',
                              undefined,
                              language
                            );
                            return;
                          }

                          if (onToggleDrugAllergy) {
                            onToggleDrugAllergy(allergy.id);
                          }
                          speakText(
                            language === 'en' ? `${allergy.title} alert selected` : `${allergy.title}을 선택하셨습니다.`,
                            undefined,
                            language
                          );
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-start justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 shadow-sm ring-2 ring-rose-200'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm sm:text-base font-black text-slate-900 truncate">
                              {allergy.title}
                            </span>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${allergy.badgeColor}`}>
                              {allergy.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium block leading-snug">
                            {allergy.desc}
                          </span>
                        </div>
                        {isSelected ? (
                          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Other Allergy Text Input (With Quick Allergy Tags) */}
                {showOtherAllergyInput && (
                  <div className="bg-rose-50/50 p-3.5 rounded-2xl border-2 border-rose-300 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                        <span>
                          {language === 'en'
                            ? 'Specify Other Drug Allergies or Reactions:'
                            : '기타 알러지 약물명이나 부작용 증상을 입력해 주세요:'}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowOtherAllergyInput(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={otherAllergyText}
                      onChange={(e) => {
                        if (onChangeOtherAllergyText) {
                          onChangeOtherAllergyText(e.target.value);
                        }
                      }}
                      placeholder={
                        language === 'en'
                          ? 'e.g., Sulfa drugs, CT contrast dye, Patch rash, Codeine nausea'
                          : '예: 설파제 알러지, CT 조영제 부작용, 파스 접촉성 피부염, 특정 진통제 구토 등'
                      }
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-rose-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
                    />

                    {/* Quick Allergy Suggestion Tags */}
                    <div>
                      <span className="text-[11px] font-bold text-rose-900 block mb-1">
                        {language === 'en' ? '💡 Tap to add common allergy:' : '💡 흔한 약물 알러지 예시 (터치 시 자동 입력):'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          '설파제(Sulfa) 알러지',
                          'CT 조영제 이상반응',
                          '파스 / 반창고 피부 발진',
                          '마약성 진통제(코데인) 구토·어지럼',
                          '소화제 두드러기',
                          '금속(치과 니켈) 알러지',
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const current = otherAllergyText ? otherAllergyText.trim() : '';
                              const updated = current ? `${current}, ${tag}` : tag;
                              if (onChangeOtherAllergyText) {
                                onChangeOtherAllergyText(updated);
                              }
                              speakText(`${tag} 추가`, undefined, language);
                            }}
                            className="bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-300 hover:border-rose-400 text-xs font-bold px-2.5 py-1 rounded-lg transition-all shadow-2xs flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-rose-600" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ======================= LIVE SELECTION SUMMARY & DOCTOR NOTICE ======================= */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-800 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {language === 'en' ? 'Current Triage Safety Summary:' : '현재 선택된 임상 안전 문진 요약 (의무기록 실시간 전송):'}
                </span>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Medications summary */}
                  <span className="font-bold text-slate-600">
                    💊 {language === 'en' ? 'Meds:' : '복용약:'}
                  </span>
                  {(medicationsList.length > 0 || otherMedicationText || medicalAlerts.filter(a => !a.startsWith('알러지:')).length > 0) ? (
                    <>
                      {Array.from(new Set([...medicationsList, ...medicalAlerts.filter(a => !a.startsWith('알러지:'))])).map((m, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md border border-blue-200">
                          {m}
                        </span>
                      ))}
                      {otherMedicationText && (
                        <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-md border border-blue-200">
                          기타: {otherMedicationText}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {language === 'en' ? 'None (Healthy)' : '복용 약 없음'}
                    </span>
                  )}

                  <span className="text-slate-300 mx-1">|</span>

                  {/* Allergies summary */}
                  <span className="font-bold text-slate-600">
                    🚨 {language === 'en' ? 'Allergies:' : '알러지:'}
                  </span>
                  {(drugAllergies.length > 0 || otherAllergyText) ? (
                    <>
                      {drugAllergies.map((a, idx) => (
                        <span key={idx} className="bg-rose-100 text-rose-900 font-black px-2 py-0.5 rounded-md border border-rose-300">
                          {a}
                        </span>
                      ))}
                      {otherAllergyText && (
                        <span className="bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded-md border border-rose-200">
                          기타: {otherAllergyText}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {language === 'en' ? 'None (Safe)' : '특이 알러지 없음 (안전)'}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  {language === 'en'
                    ? '★ This information is securely routed directly to your assigned doctor and dental hygienist before your consult.'
                    : '★ 입력하신 복용 약물 및 알러지 내역은 담당 치과의사 및 치위생사 화면에 붉은색 경고로 즉시 전달되어 안전한 진료가 보장됩니다.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================= SUB-STEP 5: Pain Intensity Scale & Review (No Empty Space!) ======================= */}
        {subStep === 5 && (
          <div className="space-y-4">
            {/* Top Pain Rating Card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-800 text-xs font-black px-2 py-0.5 rounded-full">
                      Q8 · {language === 'en' ? 'Pain Scale' : '통증 강도'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {language === 'en' ? 'Wong-Baker FACES Pain Scale' : '시각적 통증 척도 (FACES Scale)'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {language === 'en' ? `Selected: ${painScale} / 5` : `선택된 통증: ${painScale}점`}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
                  {t.painScaleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {t.painScaleDesc}
                </p>
              </div>

              {/* 5 Tactile Pain Level Cards (Large, colorful, expressive) */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {[
                  {
                    score: 1,
                    label: language === 'en' ? '1. Mild' : '1점. 경미함',
                    desc: language === 'en' ? 'Barely noticeable' : '약간 거슬리는 정도',
                    emoji: '😊',
                    borderCls: 'hover:border-emerald-300',
                    selectedBg: 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-4 ring-emerald-100',
                  },
                  {
                    score: 2,
                    label: language === 'en' ? '2. Moderate' : '2점. 뻐근함',
                    desc: language === 'en' ? 'Chewing discomfort' : '씹을 때 은은한 통증',
                    emoji: '😐',
                    borderCls: 'hover:border-blue-300',
                    selectedBg: 'bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-100',
                  },
                  {
                    score: 3,
                    label: language === 'en' ? '3. Aching' : '3점. 찌릿함',
                    desc: language === 'en' ? 'Sharp noticeable pain' : '찬물 마실 때 찌릿',
                    emoji: '😣',
                    borderCls: 'hover:border-amber-300',
                    selectedBg: 'bg-amber-600 text-white border-amber-600 shadow-md ring-4 ring-amber-100',
                  },
                  {
                    score: 4,
                    label: language === 'en' ? '4. Throbbing' : '4점. 욱신거림',
                    desc: language === 'en' ? 'Pain at rest' : '가만히 있어도 쑤심',
                    emoji: '😫',
                    borderCls: 'hover:border-orange-300',
                    selectedBg: 'bg-orange-600 text-white border-orange-600 shadow-md ring-4 ring-orange-100',
                  },
                  {
                    score: 5,
                    label: language === 'en' ? '5. Severe' : '5점. 극심함',
                    desc: language === 'en' ? 'Cannot sleep' : '밤에 잠 못 잘 정도',
                    emoji: '😭',
                    borderCls: 'hover:border-rose-300',
                    selectedBg: 'bg-rose-600 text-white border-rose-600 shadow-md ring-4 ring-rose-100',
                  },
                ].map((item) => {
                  const isSelected = painScale === item.score;
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => {
                        onChangePainScale(item.score);
                        speakText(
                          language === 'en'
                            ? `Pain level ${item.score} selected: ${item.label}.`
                            : `통증 ${item.score}점 ${item.label}을 선택하셨습니다.`,
                          undefined,
                          language
                        );
                      }}
                      className={`min-h-[105px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all active:scale-95 ${
                        isSelected
                          ? item.selectedBg
                          : `bg-slate-50 ${item.borderCls} border-slate-200 text-slate-800`
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mb-1 select-none">
                        {item.emoji}
                      </span>
                      <span className="text-sm sm:text-base font-black block leading-tight">
                        {item.label}
                      </span>
                      <span
                        className={`text-[11px] mt-0.5 block ${
                          isSelected ? 'text-white/90' : 'text-slate-500'
                        }`}
                      >
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Pain Feedback Banner */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  painScale >= 4
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : painScale >= 3
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <Flame
                  className={`w-6 h-6 flex-shrink-0 ${
                    painScale >= 4
                      ? 'text-rose-600'
                      : painScale >= 3
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div className="text-xs sm:text-sm font-medium">
                  {painScale >= 4
                    ? language === 'en'
                      ? 'Severe acute pain noted. Our clinical staff will prioritize pain-relief management for you.'
                      : '※ 극심한 통증(4~5점)으로 체크하셨습니다. 진료실에서 급성 통증 완화 및 진통 처치를 우선적으로 검토합니다.'
                    : painScale === 3
                    ? language === 'en'
                      ? 'Moderate sensitivity noted. Examination of dental pulp or caries will be performed.'
                      : '※ 찌릿한 통증(3점)입니다. 신경 염증 및 충치 부위를 정밀 검진하여 원인을 치료합니다.'
                    : language === 'en'
                    ? 'Mild symptoms. Comprehensive oral and periodontal examination will be carried out.'
                    : '※ 경미한 증상(1~2점)입니다. 구강 검진 및 정기 검사를 편안하게 진행해 드립니다.'}
                </div>
              </div>
            </div>

            {/* Bottom Full Survey Summary Card (Fills space, gives patients final review confidence) */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  {language === 'en' ? 'Pre-Registration Summary Review' : '최종 문진 요약 검토'}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {language === 'en' ? 'Ready to Submit' : '접수 준비 완료'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-0.5">
                    {language === 'en' ? 'Onset' : '발병 시기'}
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {onsetPeriod || (language === 'en' ? 'Recent' : '최근 시작')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-0.5">
                    {language === 'en' ? 'Trigger' : '통증 양상'}
                  </span>
                  <span className="font-black text-slate-900 text-sm truncate block">
                    {painType || (language === 'en' ? 'General' : '전반적 통증')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-0.5">
                    {language === 'en' ? 'Medications' : '복용 약물'}
                  </span>
                  <span className="font-black text-slate-900 text-sm truncate block">
                    {(medicationsList.length > 0 || otherMedicationText)
                      ? [...medicationsList, ...(otherMedicationText ? [`기타:${otherMedicationText}`] : [])].join(', ')
                      : (medicalAlerts.filter(a => !a.startsWith('알러지:')).length > 0)
                      ? medicalAlerts.filter(a => !a.startsWith('알러지:')).join(', ')
                      : language === 'en'
                      ? 'None'
                      : '복용 약 없음'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-0.5">
                    {language === 'en' ? 'Drug Allergies' : '약물 알러지'}
                  </span>
                  <span className={`text-sm font-black truncate block ${
                    (drugAllergies.length > 0 || otherAllergyText) ? 'text-rose-600' : 'text-emerald-700'
                  }`}>
                    {(drugAllergies.length > 0 || otherAllergyText)
                      ? `🚨 ${[...drugAllergies, ...(otherAllergyText ? [otherAllergyText] : [])].join(', ')}`
                      : language === 'en'
                      ? 'None (Safe)'
                      : '없음 (안전)'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block mb-0.5">
                    {language === 'en' ? 'Pain Scale' : '통증 강도'}
                  </span>
                  <span className="font-black text-rose-600 text-sm">
                    {painScale} / 5점
                  </span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 font-medium">
                {language === 'en'
                  ? 'Please tap [Complete Survey & Register] below to print your waiting ticket and map.'
                  : '아래의 [문진 완료 및 접수하기] 버튼을 누르시면 외래 접수가 완료되고 진료실 길안내 지도가 표시됩니다.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 3. Bottom Sticky Navigation Bar */}
      <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between gap-4 flex-shrink-0 mt-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevSubStep}
          className="min-h-[52px] px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-base sm:text-lg rounded-xl flex items-center gap-2 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>
            {subStep > 1
              ? `${t.prevStep} (${subStep - 1}/5)`
              : `${t.prevStep} (${t.stepDesc[2]})`}
          </span>
        </button>

        {/* Current SubStep Indicator */}
        <div className="text-center hidden sm:block">
          <span className="text-xs font-bold text-slate-500 block">
            {language === 'en' ? 'Survey Progress' : '문진 진행 단계'}
          </span>
          <span className="text-base font-black text-blue-700">
            {subStep} / 5 ({subStepTitles[subStep - 1].tab})
          </span>
        </div>

        {/* Next / Submit Button */}
        <button
          type="button"
          onClick={handleNextSubStep}
          disabled={isSubmitting}
          className={`min-h-[52px] px-8 font-black text-base sm:text-lg rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all text-white ${
            subStep === 5
              ? 'bg-emerald-600 hover:bg-emerald-500 ring-4 ring-emerald-200'
              : 'bg-blue-600 hover:bg-blue-500 ring-2 ring-blue-200'
          }`}
        >
          <span>
            {subStep < 5
              ? `${t.nextStep} (${subStep + 1}/5)`
              : isSubmitting
              ? language === 'en'
                ? 'Registering...'
                : '접수 처리 중...'
              : t.submitSurveyBtn}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

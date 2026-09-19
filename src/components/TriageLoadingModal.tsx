import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Building2,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { speakText } from '../lib/tts';

interface TriageLoadingModalProps {
  patientName: string;
  chiefComplaint: string;
  recommendedDept: string;
  onComplete: () => void;
  language?: 'ko' | 'en';
}

export const TriageLoadingModal: React.FC<TriageLoadingModalProps> = ({
  patientName,
  chiefComplaint,
  recommendedDept,
  onComplete,
  language = 'ko',
}) => {
  const [progress, setProgress] = useState<number>(10);
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Audio guide upon starting analysis
  useEffect(() => {
    const text =
      language === 'en'
        ? 'Processing your questionnaire to assign the appropriate dental department and generate your navigation map. Please wait a moment.'
        : '문진 내용을 정밀 분석하여 전문 진료과 배정 및 이동 동선 지도를 생성하고 있습니다. 잠시만 기다려 주세요.';
    speakText(text, undefined, language);
  }, [language]);

  // 5-second realistic clinical analysis progress (Total 5000ms)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5.0 seconds as requested by user

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 75) {
        setCurrentStage(4);
      } else if (pct >= 50) {
        setCurrentStage(3);
      } else if (pct >= 25) {
        setCurrentStage(2);
      } else {
        setCurrentStage(1);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border-4 border-blue-500 space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Top Decorative Hospital Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500" />

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full">
            <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>오즈치과대학교병원 AI 스마트 임상 예진 엔진</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            환자 맞춤 진료과 및 이동 동선 분석 중
          </h3>

          <p className="text-slate-600 text-sm sm:text-base font-medium">
            <strong className="text-blue-700 font-bold">{patientName} 님</strong>의 문진 데이터를 바탕으로 최적의 전문 분과와 대기 체어를 배정합니다.
          </p>
        </div>

        {/* Center Visual Radar Scanning */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3 relative">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Outer Pulsing Wave */}
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-200 z-10">
              <Stethoscope className="w-9 h-9" />
            </div>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 px-1">
              <span className="text-blue-700">진행률</span>
              <span className="text-blue-700 font-mono text-base">{progress}%</span>
            </div>
            <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4-Stage Progress Checklist */}
        <div className="space-y-2">
          {/* Stage 1 */}
          <div
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
              currentStage >= 1
                ? 'bg-blue-50/90 border-blue-300 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                currentStage > 1
                  ? 'bg-emerald-600 text-white'
                  : currentStage === 1
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStage > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-black block">주호소(C.C) 및 통증 유발 양상 임상 분석</span>
              <span className="text-slate-500 text-xs font-medium">선택 부위 및 자극 요인 정밀 분석 완료</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
              currentStage >= 2
                ? 'bg-blue-50/90 border-blue-300 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                currentStage > 2
                  ? 'bg-emerald-600 text-white'
                  : currentStage === 2
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStage > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '2'}
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-black block">전신질환·방사선치료(구강건조)·골다공증 위험도 스크리닝</span>
              <span className="text-slate-500 text-xs font-medium">다발성 우식 및 골괴사(MRONJ/ORN) 예방 알고리즘 가동</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
              currentStage >= 3
                ? 'bg-blue-50/90 border-blue-300 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                currentStage > 3
                  ? 'bg-emerald-600 text-white'
                  : currentStage === 3
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStage > 3 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '3'}
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-black block">치과 5대 전문 분과 협진 알고리즘 매칭</span>
              <span className="text-slate-500 text-xs font-medium">보존과·치주과·구강외과·구강내과·보철과 배정</span>
            </div>
          </div>

          {/* Stage 4 */}
          <div
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
              currentStage >= 4
                ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                currentStage === 4
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-black block">대기 체어 배정 및 1층 로비 이동 동선 지도 렌더링</span>
              <span className="text-slate-500 text-xs font-medium">승강기 위치 및 바닥 유도선 경로 생성 완료</span>
            </div>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>의료법 기준에 따른 안전한 원내 EMR 전산 암호화 전송</span>
        </div>
      </div>
    </div>
  );
};

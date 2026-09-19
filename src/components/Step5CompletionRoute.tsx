import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Printer,
  Compass,
  Footprints,
  Clock,
  MapPin,
  Barcode,
  RotateCcw,
  Volume2,
  PhoneCall,
  ShieldCheck,
  Building2,
  Navigation,
  FileText,
  Map,
  Sparkles,
} from 'lucide-react';
import { DentalTriageQueueItem } from '../types';
import { speakText } from '../lib/tts';
import { DEPARTMENT_ROUTES } from '../lib/triageData';
import { HospitalWayfindingMap } from './HospitalWayfindingMap';
import { I18N_DATA, Language } from '../lib/i18n';

interface Step5CompletionRouteProps {
  triageRecord: DentalTriageQueueItem;
  firestoreDocId?: string;
  onReset: () => void;
  fontSizeMode?: 'normal' | 'large' | 'extralarge';
  language?: Language;
}

export const Step5CompletionRoute: React.FC<Step5CompletionRouteProps> = ({
  triageRecord,
  firestoreDocId,
  onReset,
  language = 'ko',
}) => {
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [autoResetSeconds, setAutoResetSeconds] = useState<number>(60);
  const [activeTab, setActiveTab] = useState<'map' | 'ticket'>('map');
  const t = I18N_DATA[language];

  const deptRoute =
    DEPARTMENT_ROUTES[triageRecord.recommendedDepartment] ||
    DEPARTMENT_ROUTES['보존과'] ||
    DEPARTMENT_ROUTES['치과보존과'] ||
    DEPARTMENT_ROUTES['제 1 진료실'];

  // Speak reception guidance upon loading
  useEffect(() => {
    const speechText =
      language === 'en'
        ? `Check-in complete for ${triageRecord.patient.name}. You are assigned to ${triageRecord.recommendedDepartment}, ${triageRecord.recommendedRoom}. Please follow the floor navigation guide.`
        : `${triageRecord.patient.name} 님, 접수가 정상적으로 완료되었습니다. 대기번호는 ${triageRecord.waitingOrder}번이며, ${triageRecord.recommendedDepartment} ${triageRecord.recommendedRoom}으로 안내되었습니다. 바닥의 ${deptRoute.lineColorName}을 따라 이동하시면 됩니다.`;
    speakText(speechText, undefined, language);
  }, [triageRecord, deptRoute, language]);

  // Auto-reset timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoResetSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onReset]);

  const handlePrintTicket = () => {
    setShowPrintModal(true);
    speakText(
      language === 'en'
        ? 'Printing reception ticket.'
        : '접수증을 화면에 표시하였습니다. 인쇄 버튼을 누르시면 출력됩니다.',
      undefined,
      language
    );
  };

  const handleNativePrint = () => {
    window.print();
  };

  const deptNameDisplay =
    language === 'en'
      ? triageRecord.recommendedDepartment.includes('보존')
        ? 'Department of Conservative Dentistry'
        : triageRecord.recommendedDepartment.includes('치주')
        ? 'Department of Periodontology'
        : triageRecord.recommendedDepartment.includes('보철')
        ? 'Department of Prosthodontics'
        : triageRecord.recommendedDepartment.includes('내과')
        ? 'Department of Oral Medicine'
        : 'Department of Oral Surgery'
      : triageRecord.recommendedDepartment;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col select-none pb-12 space-y-4">
      {/* 🌟 1. Top Success Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                {language === 'en' ? 'Check-in Completed' : '접수 완료'}
              </span>
              <span className="text-slate-600 text-xs font-bold">
                {t.waitingNumber}{' '}
                <strong className="text-emerald-700 text-lg font-black">
                  #{triageRecord.waitingOrder}
                </strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              <span className="text-blue-700">{triageRecord.patient.name}</span>{' '}
              {language === 'en' ? '➔ ' : '님 ➔ '}
              <span className="text-emerald-700">{deptNameDisplay}</span>{' '}
              <span className="text-slate-600 text-base font-semibold">
                ({triageRecord.recommendedRoom} · {language === 'en' ? 'Chair' : '체어'} {triageRecord.assignedChair})
              </span>
            </h2>
          </div>
        </div>

        {/* View Switchers & Print button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Tab 1: Map */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('map');
              speakText(
                language === 'en' ? 'Showing navigation map' : '진료실 찾아오시는 길 지도 화면입니다.',
                undefined,
                language
              );
            }}
            className={`flex-1 md:flex-none min-h-[46px] px-4 py-2 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{t.tabMap}</span>
          </button>

          {/* Tab 2: Ticket & Summary */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('ticket');
              speakText(
                language === 'en' ? 'Showing reception pass' : '전자 접수증 및 문진 내역 화면입니다.',
                undefined,
                language
              );
            }}
            className={`flex-1 md:flex-none min-h-[46px] px-4 py-2 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
              activeTab === 'ticket'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabTicket}</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrintTicket}
            className="min-h-[46px] px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-xl border-2 border-amber-300 shadow flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printReceiptBtn}</span>
          </button>
        </div>
      </div>

      {/* 🌟 2. Tab Content View */}
      <div className="w-full flex-1">
        {/* ====================== TAB 1: Wayfinding Map ====================== */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left 8 cols: Interactive Hospital Wayfinding Map */}
            <div className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {t.hospitalMapTitle}
                  </h3>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full">
                  {language === 'en'
                    ? `Floor Guide Line: ${deptRoute.lineColorName}`
                    : `바닥 유도선: ${deptRoute.lineColorName}`}
                </span>
              </div>

              {/* Wayfinding Canvas Map */}
              <div className="flex-1 flex items-center justify-center min-h-[360px] sm:min-h-[420px] py-2">
                <HospitalWayfindingMap
                  department={triageRecord.recommendedDepartment}
                  floor={deptRoute.floor}
                  room={deptRoute.room}
                  chair={triageRecord.assignedChair}
                  lineColor={deptRoute.lineColor}
                  lineColorName={deptRoute.lineColorName}
                  walkSteps={deptRoute.walkSteps}
                  estimatedMinutes={deptRoute.estimatedMinutes}
                  patientName={triageRecord.patient.name}
                />
              </div>

              {/* Bottom Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 text-center">
                <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {t.destFloor}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-blue-900">
                    {deptRoute.floor}
                  </span>
                </div>
                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {t.walkDistance}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-emerald-900">
                    {language === 'en' ? `~${deptRoute.walkSteps} steps` : `약 ${deptRoute.walkSteps}보`}
                  </span>
                </div>
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {t.estTime}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-900">
                    {language === 'en' ? `~${deptRoute.estimatedMinutes} min` : `약 ${deptRoute.estimatedMinutes}분`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 4 cols: Step-by-Step Walking Route Cards */}
            <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">
                  {language === 'en' ? 'Walking Directions' : '단계별 상세 이동 순서'}
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {language === 'en' ? 'From Lobby to Dental Clinic' : '로비에서 진료실까지'}
                </h4>
              </div>

              <div className="space-y-2.5 my-auto">
                <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block">
                      {language === 'en' ? 'Main Lobby Elevator' : '1층 중앙 엘리베이터 이동'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {language === 'en'
                        ? 'Head to the elevator bank on the right side of the kiosk.'
                        : '키오스크 화면 오른쪽 승강홀로 향합니다.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                    2
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-blue-900 block">
                      {language === 'en'
                        ? `Take elevator to [${deptRoute.floor}]`
                        : `[${deptRoute.floor}] 탑승 후 하차`}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {deptRoute.elevatorTip}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div
                    className="w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow"
                    style={{ backgroundColor: deptRoute.lineColor }}
                  >
                    3
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-emerald-900 block">
                      {language === 'en'
                        ? `Follow the [${deptRoute.lineColorName}] floor line`
                        : `바닥 [${deptRoute.lineColorName}] 따라 80보`}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {deptRoute.room} ({language === 'en' ? 'Chair' : '체어'}: {triageRecord.assignedChair})
                    </span>
                  </div>
                </div>
              </div>

              {/* Volunteer Assistance Card */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-amber-950 font-medium">
                <PhoneCall className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Need mobility assistance? Tap [Staff Call] above for volunteer escort.'
                    : '거동이 불편하시면 상단 [직원 호출] 시 자원봉사자가 즉시 동행해 드립니다.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================== TAB 2: Check-in Ticket & Survey Summary ====================== */}
        {activeTab === 'ticket' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left 5 cols: Official Patient Ticket */}
            <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-center space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  {language === 'en'
                    ? 'OZ Dental Hospital · Outpatient Check-in Ticket'
                    : '오즈치과대학교병원 · 외래 전자 접수증'}
                </span>
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4">
                  <span className="text-xs font-bold text-slate-600 block">
                    {t.waitingNumber}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-emerald-700 tracking-wider">
                    #{triageRecord.waitingOrder}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm my-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.patientNameLabel}:</span>
                  <strong className="text-slate-900">
                    {triageRecord.patient.name} ({language === 'en' ? `Age ${triageRecord.patient.age}` : `만 ${triageRecord.patient.age}세`})
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">환자번호:</span>
                  <strong className="text-blue-900 font-mono font-black bg-blue-100/70 px-2 py-0.5 rounded text-xs">
                    {triageRecord.patient.patientId || (triageRecord.id.includes('_') ? triageRecord.id.split('_')[0] : triageRecord.id)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.assignedDeptLabel}:</span>
                  <strong className="text-blue-700 font-black">
                    {deptNameDisplay}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.clinicRoomLabel}:</span>
                  <strong className="text-emerald-700 font-black">
                    {triageRecord.recommendedRoom} ({language === 'en' ? 'Chair' : '체어'} {triageRecord.assignedChair})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'en' ? 'Issue Time:' : '접수 일시:'}</span>
                  <span className="text-slate-700 font-bold">{triageRecord.createdAt}</span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="border-t border-slate-200 pt-3 text-center">
                <div className="flex justify-center items-center gap-1 h-8 mb-1">
                  {[...Array(32)].map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-slate-900"
                      style={{
                        width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '2px',
                        opacity: i % 5 === 0 ? 0.7 : 1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-black text-slate-700">
                  {triageRecord.patient.patientId || (triageRecord.id.includes('_') ? triageRecord.id.split('_')[0] : triageRecord.id)}
                </span>
              </div>
            </div>

            {/* Right 7 cols: Patient-submitted survey summary (no clinical/medical advice) */}
            <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {language === 'en' ? 'Submitted Pre-Examination Summary' : '환자 작성 사전 문진 요약'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Transmitted securely to the dental clinic electronic chart.'
                    : '작성하신 내용은 진료실 의료진 차트로 안전하게 전송되었습니다.'}
                </p>
              </div>

              <div className="space-y-3 my-auto">
                {/* Location */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block">
                    {t.selectedLocationLabel}:
                  </span>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {triageRecord.locationTitle}
                  </p>
                </div>

                {/* Primary Symptom */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block">
                    {language === 'en' ? 'Reported Discomfort / Symptom:' : '주요 불편 증상:'}
                  </span>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {triageRecord.chiefComplaint}
                  </p>
                </div>

                {/* Patient Reassurance Note */}
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {language === 'en'
                      ? 'Your preliminary survey responses have been safely sent to your assigned doctor. Please relax in the waiting area in front of the clinic room; you will be called by name shortly.'
                      : '작성하신 문진표가 담당 진료실로 안전하게 전달되었습니다. 해당 진료실 앞 대기 공간에서 편안히 대기해 주시면 순서에 맞춰 성함을 호명해 드립니다.'}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-200 text-xs text-blue-900 text-center font-medium">
                {language === 'en'
                  ? 'A mobile reception ticket has also been sent to your registered phone number.'
                  : '등록하신 휴대폰 번호로 모바일 접수증 및 길안내 지도가 발송되었습니다.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 3. Bottom Auto-Reset & Finish Bar */}
      <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between gap-4 flex-shrink-0 mt-6">
        <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
          <RotateCcw className="w-4 h-4 text-amber-500 animate-spin" />
          <span>
            {language === 'en' ? (
              <>
                Screen will reset in{' '}
                <strong className="text-blue-700 text-base sm:text-lg font-black">
                  {autoResetSeconds}s
                </strong>{' '}
                for the next patient.
              </>
            ) : (
              <>
                다음 환자를 위해{' '}
                <strong className="text-blue-700 text-base sm:text-lg font-black">
                  {autoResetSeconds}초
                </strong>{' '}
                뒤 첫 화면으로 자동 전환됩니다.
              </>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="min-h-[46px] px-6 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm sm:text-base rounded-xl active:scale-95 transition-all shadow"
        >
          {t.finishBtn}
        </button>
      </div>

      {/* 🌟 4. Print Ticket Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-3">
              <span className="text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                {language === 'en' ? 'OZ Dental University Hospital' : '오즈치과대학교병원'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {language === 'en' ? 'Outpatient Check-in Ticket' : '외래 진료 접수증'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en' ? 'Issued:' : '발행일시:'} {triageRecord.createdAt}
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-slate-600 block">
                {t.waitingNumber}
              </span>
              <span className="text-4xl font-black text-emerald-700">
                #{triageRecord.waitingOrder}
              </span>
            </div>

            <div className="space-y-2 text-sm font-bold border-b-2 border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.patientNameLabel}:</span>
                <span>
                  {triageRecord.patient.name} ({language === 'en' ? `Age ${triageRecord.patient.age}` : `만 ${triageRecord.patient.age}세`})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">환자번호:</span>
                <span className="font-mono text-blue-800 font-black">
                  {triageRecord.patient.patientId || (triageRecord.id.includes('_') ? triageRecord.id.split('_')[0] : triageRecord.id)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.assignedDeptLabel}:</span>
                <span className="text-blue-700 font-black">{deptNameDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.clinicRoomLabel}:</span>
                <span>
                  {triageRecord.recommendedRoom} ({language === 'en' ? 'Chair' : '체어'} {triageRecord.assignedChair})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleNativePrint}
                className="flex-1 min-h-[48px] bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-xl flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all"
              >
                <Printer className="w-5 h-5" />
                <span>{language === 'en' ? 'Print Paper Ticket' : '종이 접수증 인쇄'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="min-h-[48px] px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl active:scale-95 transition-all"
              >
                {language === 'en' ? 'Close' : '닫기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

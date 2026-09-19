import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Users,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Database,
  ExternalLink,
  ShieldCheck,
  Save,
  Check,
  Layers,
  HelpCircle,
  Armchair,
} from 'lucide-react';
import { DentalTriageQueueItem, TriageAreaType } from '../types';
import { subscribeToQueue, updatePatientStatus, updatePatientRecord, db, FIREBASE_PROJECT_ID } from '../firebase';
import { HOSPITAL_CHAIR_UNITS, normalizeEmrDepartment, EMR_STANDARD_DEPARTMENTS } from '../lib/triageData';

interface StaffQueueMonitorProps {
  onClose: () => void;
}

const AREA_LABELS: Record<TriageAreaType, string> = {
  teeth: '치아 / 어금니',
  gum: '잇몸 / 붓기·출혈',
  jaw_mucosa: '턱 / 입안 점막 / 사랑니',
  implant_denture: '틀니 / 임플란트 불편',
  unknown_general: '잘 모르겠음 / 전체적 불편',
};

export const StaffQueueMonitor: React.FC<StaffQueueMonitorProps> = ({ onClose }) => {
  const [queueList, setQueueList] = useState<DentalTriageQueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterDept, setFilterDept] = useState<string>('전체');
  const [selectedItem, setSelectedItem] = useState<DentalTriageQueueItem | null>(null);

  // Doctor Notes State
  const [doctorDiagnosisNote, setDoctorDiagnosisNote] = useState<string>('');
  const [treatmentPlan, setTreatmentPlan] = useState<string>('');
  const [prescriptions, setPrescriptions] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToQueue((items) => {
      setQueueList(items);
      setLoading(false);
      setIsRefreshing(false);
      if (items.length > 0) {
        setSelectedItem((prev) => {
          if (!prev) return items[0];
          const matched = items.find((i) => i.id === prev.id);
          return matched || items[0];
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Update local form state when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setDoctorDiagnosisNote(selectedItem.doctorDiagnosisNote || '');
      setTreatmentPlan(selectedItem.treatmentPlan || '');
      setPrescriptions(selectedItem.prescriptions || '');
      setSaveSuccessMsg(false);
    }
  }, [selectedItem?.id]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    // Trigger local and Firestore re-sync
    const unsubscribe = subscribeToQueue((items) => {
      setQueueList(items);
      setIsRefreshing(false);
      unsubscribe();
    });
  };

  const handleStatusChange = async (docId: string, newStatus: '진료대기' | '진료중' | '진료완료') => {
    await updatePatientStatus(docId, newStatus);
    if (selectedItem && selectedItem.id === docId) {
      setSelectedItem({ ...selectedItem, status: newStatus });
    }
  };

  const handleReassignChair = async (docId: string, chairId: string) => {
    const chairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === chairId);
    if (!chairUnit) return;

    const updates: Partial<DentalTriageQueueItem> = {
      assignedChair: chairUnit.chairName,
      assignedChairUnit: chairUnit,
      recommendedRoom: chairUnit.clinicRoom,
    };

    await updatePatientRecord(docId, updates);
    setQueueList((prev) =>
      prev.map((item) => (item.id === docId ? { ...item, ...updates } : item))
    );
    if (selectedItem && selectedItem.id === docId) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const handleReassignDepartment = async (docId: string, rawDept: string) => {
    const stdDept = normalizeEmrDepartment(rawDept);
    const updates: Partial<DentalTriageQueueItem> = {
      recommendedDepartment: stdDept,
    };

    await updatePatientRecord(docId, updates);
    setQueueList((prev) =>
      prev.map((item) => (item.id === docId ? { ...item, ...updates } : item))
    );
    if (selectedItem && selectedItem.id === docId) {
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const handleSaveDoctorNotes = async () => {
    if (!selectedItem?.id) return;
    setIsSavingNote(true);
    try {
      await updatePatientRecord(selectedItem.id, {
        doctorDiagnosisNote,
        treatmentPlan,
        prescriptions,
      });
      setSelectedItem({
        ...selectedItem,
        doctorDiagnosisNote,
        treatmentPlan,
        prescriptions,
      });
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2500);
    } catch (err) {
      console.error('Failed to save doctor notes:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  // 표준 5대 진료과 필터
  const departments = ['전체', ...EMR_STANDARD_DEPARTMENTS];

  const filteredItems = queueList.filter((item) => {
    if (filterDept === '전체') return true;
    const itemDept = normalizeEmrDepartment(item.recommendedDepartment);
    return itemDept === filterDept || item.recommendedDepartment === filterDept;
  });

  const waitingCount = queueList.filter((i) => i.status === '진료대기').length;
  const inProgressCount = queueList.filter((i) => i.status === '진료중').length;
  const completedCount = queueList.filter((i) => i.status === '진료완료').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="bg-white border-3 border-slate-300 text-slate-800 rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {db ? `Firestore 실시간 연동: ${FIREBASE_PROJECT_ID}` : '로컬 모드'}
                </span>
                <span className="text-slate-500 text-xs font-bold hidden sm:inline">
                  컬렉션: dental_triage_queue
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                오즈치과대학교병원 외래 예진 접수 현황 모니터
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
              title="DB 새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">DB 새로고침</span>
            </button>

            {/* Counts */}
            <div className="hidden md:flex items-center gap-2">
              <span className="bg-blue-100 text-blue-900 text-sm font-black px-3 py-1 rounded-xl">
                대기 {waitingCount}명
              </span>
              <span className="bg-amber-100 text-amber-900 text-sm font-black px-3 py-1 rounded-xl">
                진료중 {inProgressCount}명
              </span>
              <span className="bg-emerald-100 text-emerald-900 text-sm font-black px-3 py-1 rounded-xl">
                완료 {completedCount}명
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all active:scale-95"
              title="모니터 닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center gap-2 overflow-x-auto border-b border-slate-200">
          <span className="text-xs font-black text-slate-500 whitespace-nowrap mr-1">
            진료과 필터:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setFilterDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filterDept === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Main Split Layout: Left Queue Table (6 cols) + Right Patient Detail (6 cols) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50">
          {/* Left: Queue List */}
          <div className="lg:col-span-6 border-r border-slate-200 overflow-y-auto p-4 space-y-2.5">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mb-2 text-blue-600" />
                <span className="font-bold">접수 내역 동기화 중...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-bold text-lg">
                접수된 환자가 없습니다. 태블릿에서 예진을 진행해 주세요.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100'
                        : 'bg-white hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-sm font-black px-2.5 py-0.5 rounded-md">
                          {item.waitingOrder ? `${item.waitingOrder}번` : (item.id.includes('_') ? `${item.id.split('_')[2]}번` : (item.id.startsWith('DEN-') ? `${parseInt(item.id.slice(-3), 10)}번` : item.id))}
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          {item.patient.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.patient?.patientId || (item.id.includes('_') ? item.id.split('_')[0] : item.id)}
                        </span>
                        {item.patient.isForeigner && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-1.5 py-0.5 rounded border border-purple-200">
                            🌐 외국인 ({item.patient.nationality || 'Foreigner'})
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-bold">
                          (만 {item.patient.age}세, {item.patient.gender})
                        </span>
                      </div>

                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          item.status === '진료대기'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === '진료중'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        ● {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                        <Stethoscope className="w-4 h-4" />
                        <span>
                          {normalizeEmrDepartment(item.recommendedDepartment)} ({item.recommendedRoom})
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs font-medium">{item.createdAt}</span>
                    </div>

                    {/* Multi-Area & Multi-Symptoms Tags in List */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {item.selectedAreas && item.selectedAreas.length > 1 && (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          복수 부위 ({item.selectedAreas.length})
                        </span>
                      )}

                      {item.selectedSymptoms && item.selectedSymptoms.length > 0 && (
                        item.selectedSymptoms.slice(0, 2).map((sym, sIdx) => (
                          <span
                            key={sIdx}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                              sym.includes('모르') || sym.includes('불분명')
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {sym}
                          </span>
                        ))
                      )}

                      {item.selectedSymptoms && item.selectedSymptoms.length > 2 && (
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          +{item.selectedSymptoms.length - 2}개 더보기
                        </span>
                      )}

                      {/* Drug Allergy Alert Badge in List */}
                      {(item.drugAllergies && item.drugAllergies.length > 0 || item.otherAllergyText) && (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                          🚨 약물 알러지 주의
                        </span>
                      )}

                      {/* Medication Badge in List */}
                      {((item.medicationsList && item.medicationsList.length > 0) || item.otherMedicationText || (item.medicalAlerts && item.medicalAlerts.filter(a => !a.startsWith('알러지:')).length > 0)) && (
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          💊 복용약 {(item.medicationsList?.length || item.medicalAlerts?.filter(a => !a.startsWith('알러지:')).length || 1)}건
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs mt-1.5 line-clamp-1">
                      주호소: {item.chiefComplaint}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Selected Patient Details & Status Controller */}
          <div className="lg:col-span-6 bg-white p-5 overflow-y-auto space-y-4">
            {selectedItem ? (
              <>
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        차트번호: {selectedItem.patient?.patientId || (selectedItem.id.includes('_') ? selectedItem.id.split('_')[0] : selectedItem.id)}
                      </span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        대기순번: {selectedItem.waitingOrder ? `${selectedItem.waitingOrder}번` : (selectedItem.id.includes('_') ? `${selectedItem.id.split('_')[2]}번` : '-')}
                      </span>
                      {selectedItem.id.includes('_') && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200" title="Firestore 내원 이력 문서 ID">
                          접수ID: {selectedItem.id}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{selectedItem.createdAt}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {selectedItem.patient.name} 환자 차트
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedItem.mcmRiskLevel && (
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          selectedItem.mcmRiskLevel === 'HIGH'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : selectedItem.mcmRiskLevel === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        MCM: {selectedItem.mcmRiskLevel === 'HIGH' ? '🔴 고위험군' : selectedItem.mcmRiskLevel === 'MEDIUM' ? '🟡 중위험군' : '🟢 저위험군'}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-semibold">
                      (만 {selectedItem.patient.age}세, {selectedItem.patient.gender})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {selectedItem.patient.isForeigner ? (
                      <>
                        국적: {selectedItem.patient.nationality || '미지정'} · 생년월일: {selectedItem.patient.birthDate || selectedItem.patient.rrnFront || '-'} · 신분번호: {selectedItem.patient.passportOrArc || '미입력'} · 연락처: {selectedItem.patient.phone || selectedItem.patient.phoneNumber || '-'}
                      </>
                    ) : (
                      <>
                        주민번호: {selectedItem.patient.rrnFront || selectedItem.patient.residentNumberFront}-******* · 연락처: {selectedItem.patient.phone || selectedItem.patient.phoneNumber || '-'}
                      </>
                    )}
                  </p>
                </div>

                {/* Status Switcher Buttons */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1.5">
                    진료 상태 변경:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['진료대기', '진료중', '진료완료'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedItem.id, st)}
                        className={`py-2 px-2 rounded-xl font-black text-sm border-2 transition-all ${
                          selectedItem.status === st
                            ? 'bg-blue-600 text-white border-blue-500 shadow'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-Select & Don't Know Badges (NEW) */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 space-y-2.5">
                  <div>
                    <span className="text-xs font-black text-blue-900 block mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-700" />
                      불편 부위 (다중 선택):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.selectedAreas && selectedItem.selectedAreas.length > 0 ? (
                        selectedItem.selectedAreas.map((areaKey, idx) => (
                          <span
                            key={idx}
                            className="bg-white text-blue-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-300 shadow-sm"
                          >
                            {AREA_LABELS[areaKey] || areaKey}
                          </span>
                        ))
                      ) : (
                        <span className="bg-white text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                          {selectedItem.areaTitle || '치아 / 어금니'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-black text-blue-900 block mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      선택된 세부 증상 및 모름 여부 (DB 반영):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.selectedSymptoms && selectedItem.selectedSymptoms.length > 0 ? (
                        selectedItem.selectedSymptoms.map((symptom, idx) => {
                          const isUnknown = symptom.includes('모르') || symptom.includes('불분명');
                          return (
                            <span
                              key={idx}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm flex items-center gap-1 ${
                                isUnknown
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-white text-slate-800 border-blue-200'
                              }`}
                            >
                              {isUnknown && <HelpCircle className="w-3 h-3 text-amber-700" />}
                              {symptom}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">기본 증상 호소</span>
                      )}
                    </div>
                  </div>

                  {/* Onset Period & Pain Scale */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100 text-xs">
                    <div>
                      <span className="text-slate-500 font-bold block">발병 시기:</span>
                      <span className="font-bold text-slate-800">
                        {selectedItem.onsetPeriod || '미입력'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block">통증 척도 (NRS):</span>
                      <span className="font-black text-rose-600">
                        {selectedItem.painScale ? `${selectedItem.painScale}점 / 5점` : '해당 없음'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 💊 상세 복용 약물 및 🚨 약물 알러지 임상 문진 (처방/시술 전 사전 확인) */}
                <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-3.5 space-y-3">
                  {/* Medications Section */}
                  <div>
                    <span className="text-xs font-black text-blue-900 flex items-center gap-1.5 mb-1.5">
                      <span className="text-base">💊</span>
                      복용 중인 약물 (의사 사전 확인):
                    </span>
                    {((selectedItem.medicationsList && selectedItem.medicationsList.length > 0) ||
                      selectedItem.otherMedicationText ||
                      (selectedItem.medicalAlerts && selectedItem.medicalAlerts.filter(a => !a.startsWith('알러지:')).length > 0)) ? (
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(new Set([
                          ...(selectedItem.medicationsList || []),
                          ...(selectedItem.medicalAlerts ? selectedItem.medicalAlerts.filter(a => !a.startsWith('알러지:')) : []),
                        ])).map((med, idx) => {
                          const isHighRisk = med.includes('아스피린') || med.includes('골다공증') || med.includes('혈액투석') || med.includes('스테로이드');
                          return (
                            <span
                              key={idx}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-2xs flex items-center gap-1 ${
                                isHighRisk
                                  ? 'bg-amber-100 text-amber-950 border-amber-300 font-black'
                                  : 'bg-white text-blue-950 border-blue-200'
                              }`}
                            >
                              {isHighRisk && <span>⚠️</span>}
                              {med}
                            </span>
                          );
                        })}
                        {selectedItem.otherMedicationText && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-300">
                            기타 복용약: {selectedItem.otherMedicationText}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ 복용 중인 약물 없음 (건강함)
                      </span>
                    )}
                  </div>

                  {/* Drug Allergies Section */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs font-black text-rose-900 flex items-center gap-1.5 mb-1.5">
                      <span className="text-base">🚨</span>
                      약물 알러지 및 부작용 (처방 금기/마취 주의):
                    </span>
                    {((selectedItem.drugAllergies && selectedItem.drugAllergies.length > 0) ||
                      selectedItem.otherAllergyText ||
                      (selectedItem.medicalAlerts && selectedItem.medicalAlerts.some(a => a.startsWith('알러지:')))) ? (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from(new Set([
                            ...(selectedItem.drugAllergies || []),
                            ...(selectedItem.medicalAlerts
                              ? selectedItem.medicalAlerts.filter(a => a.startsWith('알러지:')).map(a => a.replace('알러지:', ''))
                              : []),
                          ])).map((allergy, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-black px-2.5 py-1 rounded-lg bg-rose-600 text-white shadow-xs flex items-center gap-1"
                            >
                              <span>🚫</span>
                              {allergy}
                            </span>
                          ))}
                          {selectedItem.otherAllergyText && (
                            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
                              기타 알러지: {selectedItem.otherAllergyText}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-rose-700 leading-tight">
                          ※ 해당 성분(페니실린, NSAIDs 진통제 등) 및 교차 반응 약물 원내/원외 처방 금지 확인 요망
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        ✓ 특이 약물 알러지 없음 (안전)
                      </span>
                    )}
                  </div>
                </div>

                {/* Red Flags Alert if present */}
                {selectedItem.redFlags && selectedItem.redFlags.length > 0 && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 space-y-1">
                    <span className="text-xs font-black text-rose-800 block">
                      🚨 임상 주의 경고문 (NHS MCM Red Flags):
                    </span>
                    {selectedItem.redFlags.map((flag, idx) => (
                      <div key={idx} className="text-xs text-rose-950 font-bold bg-white p-1.5 rounded border border-rose-200">
                        {flag}
                      </div>
                    ))}
                  </div>
                )}

                {/* Patient Chart Details */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm">
                  {/* Department & Assigned Room & Chair Unit Details */}
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-2">
                      <div>
                        <span className="text-xs font-bold text-blue-950 block">전송 진료과 (5대 표준 분과):</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-black bg-blue-600 text-white shadow-xs">
                            {normalizeEmrDepartment(selectedItem.recommendedDepartment)}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">원내 전산 호환</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">진료과 변경:</span>
                        <select
                          value={normalizeEmrDepartment(selectedItem.recommendedDepartment)}
                          onChange={(e) => handleReassignDepartment(selectedItem.id, e.target.value)}
                          className="bg-white border border-blue-300 text-blue-900 text-xs font-black rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {EMR_STANDARD_DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                      <div>
                        <span className="text-xs font-bold text-blue-900 block">배정 진료실 및 체어 유닛:</span>
                        <p className="text-base font-black text-blue-900">
                          {selectedItem.recommendedRoom || selectedItem.assignedChairUnit?.clinicRoom} ·{' '}
                          <span className="text-blue-700 font-extrabold">{selectedItem.assignedChair}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">체어 변경:</span>
                        <select
                          value={
                            HOSPITAL_CHAIR_UNITS.find(
                              (u) =>
                                u.chairName === selectedItem.assignedChair ||
                                selectedItem.assignedChair.includes(u.chairName)
                            )?.id || 'waiting_room'
                          }
                          onChange={(e) => handleReassignChair(selectedItem.id, e.target.value)}
                          className="bg-white border border-blue-300 text-blue-900 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {HOSPITAL_CHAIR_UNITS.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.clinicRoom} - {unit.chairName} ({unit.unitPurpose})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Show equipped tools for the current chair */}
                    {(() => {
                      const matchedUnit =
                        selectedItem.assignedChairUnit ||
                        HOSPITAL_CHAIR_UNITS.find(
                          (u) =>
                            u.chairName === selectedItem.assignedChair ||
                            selectedItem.assignedChair.includes(u.chairName)
                        );

                      if (!matchedUnit) return null;

                      return (
                        <div className="text-xs text-blue-950 bg-white/80 p-2 rounded-lg border border-blue-100 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-blue-900">
                            <Armchair className="w-3.5 h-3.5 text-blue-600" />
                            <span>체어 목적: {matchedUnit.unitPurpose}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[11px] font-bold text-slate-500">구비 장비:</span>
                            {matchedUnit.equippedTools.map((tool, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 block">주호소 (C.C):</span>
                    <p className="font-bold text-slate-800">{selectedItem.chiefComplaint}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 block">추정 의심 질환:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedItem.suspectedConditions.map((cond, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-md"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 block">현병력 (Hx) 및 MCM 소견:</span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-2 rounded-lg border border-slate-200 whitespace-pre-line">
                      {selectedItem.historyOfPresentIllness}
                    </p>
                  </div>

                  {selectedItem.clinicalRecommendations && selectedItem.clinicalRecommendations.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-emerald-800 block mb-1">
                        📋 NHS MCM 간호/치위생 권고사항:
                      </span>
                      <ul className="text-xs text-emerald-950 space-y-1 bg-emerald-50 p-2 rounded border border-emerald-200">
                        {selectedItem.clinicalRecommendations.map((rec, idx) => (
                          <li key={idx}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">환자 안내 요약:</span>
                    <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                      "{selectedItem.seniorPatientMessage}"
                    </p>
                  </div>

                  {selectedItem.medicalAlerts && selectedItem.medicalAlerts.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-rose-600 block mb-1">
                        ⚠️ 복용 약물 안전 주의:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.medicalAlerts.map((alert, idx) => (
                          <span
                            key={idx}
                            className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-md"
                          >
                            {alert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Doctor Diagnosis & Treatment Notes (Firestore Sync) */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-blue-700" />
                      의료진 진료 소견 작성 & DB 실시간 저장
                    </span>
                    {saveSuccessMsg && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Firestore 저장 완료!
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      의사 진단 소견 (Doctor Diagnosis Note):
                    </label>
                    <textarea
                      value={doctorDiagnosisNote}
                      onChange={(e) => setDoctorDiagnosisNote(e.target.value)}
                      placeholder="진단 소견을 입력하세요 (예: #16 치아 균열로 인한 비가역적 치수염 의증)..."
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-blue-600 min-h-[55px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      치료 계획 (Treatment Plan):
                    </label>
                    <input
                      type="text"
                      value={treatmentPlan}
                      onChange={(e) => setTreatmentPlan(e.target.value)}
                      placeholder="치료 계획 (예: 근관치료 후 크라운 수복 예정)..."
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      처방 및 원내 조치 (Prescriptions):
                    </label>
                    <input
                      type="text"
                      value={prescriptions}
                      onChange={(e) => setPrescriptions(e.target.value)}
                      placeholder="처방 내역 (예: 아목시실린 500mg, 이부프로펜 400mg 3일분)..."
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-blue-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveDoctorNotes}
                    disabled={isSavingNote}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs flex items-center justify-center gap-2 shadow transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingNote ? 'Firestore 클라우드 동기화 중...' : '의료진 차트 Firestore DB에 저장하기'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400">
                좌측 목록에서 환자를 선택해 주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

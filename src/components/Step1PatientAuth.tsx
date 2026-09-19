import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wand2,
  ShieldCheck,
  Globe2,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { PatientInfo } from '../types';
import { speakText } from '../lib/tts';
import { I18N_DATA, Language } from '../lib/i18n';

interface Step1PatientAuthProps {
  patient: PatientInfo;
  onUpdatePatient: (patient: PatientInfo) => void;
  onNext: () => void;
  fontSizeMode?: 'normal' | 'large' | 'extralarge';
  language?: Language;
}

// 72세 김영수 님 (내국인 예시)
const PRESET_KOREAN = {
  name: '김영수',
  rrnFront: '540812',
  rrnBack: '1******',
  gender: '남성' as const,
  phone: '010-3829-1942',
  age: 72,
  isForeigner: false,
};

// 66세 John Smith 님 (외국인 예시)
const PRESET_FOREIGNER = {
  name: 'John Smith',
  rrnFront: '600415',
  rrnBack: '5******',
  gender: '남성' as const,
  phone: '010-9182-3719',
  age: 66,
  isForeigner: true,
  birthDate: '1960-04-15',
  passportOrArc: 'M29481928',
};

export const Step1PatientAuth: React.FC<Step1PatientAuthProps> = ({
  patient,
  onUpdatePatient,
  onNext,
  language = 'ko',
}) => {
  const [isForeigner, setIsForeigner] = useState<boolean>(
    Boolean(patient.isForeigner || (language === 'en' && !patient.rrnFront))
  );
  const [foreignBirth, setForeignBirth] = useState<string>(patient.birthDate || '');
  const [foreignPassport, setForeignPassport] = useState<string>(patient.passportOrArc || '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const t = I18N_DATA[language];

  // 뒷자리 첫 번째 숫자
  const backFirstDigit =
    patient.rrnBack && patient.rrnBack.length > 0 && patient.rrnBack.charAt(0) !== '*'
      ? patient.rrnBack.charAt(0)
      : '';

  // 언어가 변경되었을 때 기본 탭 동기화 (단, 기존 입력이 없을 때)
  useEffect(() => {
    if (language === 'en' && !patient.name) {
      setIsForeigner(true);
    }
  }, [language, patient.name]);

  // TTS 안내 (마운트 시)
  useEffect(() => {
    const text =
      language === 'en'
        ? 'Step 1: Patient Verification. Please enter your name, date of birth, and phone number using your tablet keyboard.'
        : '1단계 본인 확인입니다. 성함과 생년월일, 연락처를 입력해 주세요. 화면을 누르면 자판이 나타납니다.';
    speakText(text, undefined, language);
  }, [language]);

  // 내국인 만 나이 계산
  const calculateKoreanAge = (rrn6: string, back1?: string): number => {
    if (rrn6.length !== 6) return 72;
    const yy = parseInt(rrn6.substring(0, 2), 10);
    let birthYear = 1900 + yy;
    if (back1) {
      if (['1', '2', '5', '6'].includes(back1)) {
        birthYear = 1900 + yy;
      } else if (['3', '4', '7', '8'].includes(back1)) {
        birthYear = 2000 + yy;
      } else if (['9', '0'].includes(back1)) {
        birthYear = 1800 + yy;
      }
    } else {
      birthYear = yy <= 26 ? 2000 + yy : 1900 + yy;
    }
    const currentYear = 2026;
    return Math.max(1, currentYear - birthYear);
  };

  // 외국인 만 나이 계산 (YYYY-MM-DD)
  const calculateForeignAge = (birthDateStr: string): number => {
    if (!birthDateStr || birthDateStr.length < 4) return 65;
    const birthYear = parseInt(birthDateStr.substring(0, 4), 10);
    if (isNaN(birthYear) || birthYear < 1900 || birthYear > 2026) return 65;
    return 2026 - birthYear;
  };

  const handleApplyPreset = () => {
    const preset = isForeigner ? PRESET_FOREIGNER : PRESET_KOREAN;
    const updated: PatientInfo = {
      ...patient,
      name: preset.name,
      rrnFront: preset.rrnFront,
      rrnBack: preset.rrnBack,
      gender: preset.gender,
      phone: preset.phone,
      age: preset.age,
      isForeigner: preset.isForeigner,
      birthDate: (preset as typeof PRESET_FOREIGNER).birthDate || '',
      passportOrArc: (preset as typeof PRESET_FOREIGNER).passportOrArc || '',
      patientId: patient.patientId && /^DEN-\d{4}-\d{3,5}$/.test(patient.patientId) ? patient.patientId : '',
    };
    if (isForeigner) {
      setForeignBirth((preset as typeof PRESET_FOREIGNER).birthDate || '');
      setForeignPassport((preset as typeof PRESET_FOREIGNER).passportOrArc || '');
    }
    onUpdatePatient(updated);
    setPrivacyAgreed(true);
    setErrorMessage('');
    speakText(
      language === 'en'
        ? `${preset.name}'s information has been applied. Please proceed to the next step.`
        : `${preset.name} 님의 정보가 입력되었습니다. 다음 단계 버튼을 눌러주세요.`,
      undefined,
      language
    );
  };

  const formatPhoneNumber = (digits: string): string => {
    const clean = digits.replace(/[^0-9]/g, '');
    if (clean.length <= 3) return clean;
    if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
  };

  const handleValidateAndNext = () => {
    if (!patient.name.trim()) {
      setErrorMessage(t.step1ErrorName);
      speakText(t.step1ErrorName, undefined, language);
      return;
    }

    if (!isForeigner) {
      // 내국인 검증: 생년월일 6자리 + 뒷자리 첫 숫자 필수
      if (patient.rrnFront.length !== 6 || !backFirstDigit) {
        setErrorMessage(t.step1ErrorRrn);
        speakText(t.step1ErrorRrn, undefined, language);
        return;
      }
    } else {
      // 외국인 검증: 생년월일 필수
      if (!foreignBirth || foreignBirth.trim().length < 8) {
        setErrorMessage(t.step1ErrorForeignerBirth);
        speakText(t.step1ErrorForeignerBirth, undefined, language);
        return;
      }
    }

    if (!patient.phone || patient.phone.replace(/[^0-9]/g, '').length < 9) {
      setErrorMessage(t.step1ErrorPhone);
      speakText(t.step1ErrorPhone, undefined, language);
      return;
    }

    if (!privacyAgreed) {
      setErrorMessage(t.step1ErrorPrivacy);
      speakText(t.step1ErrorPrivacy, undefined, language);
      return;
    }

    let calculatedAge = patient.age || 72;
    if (!isForeigner) {
      calculatedAge = calculateKoreanAge(patient.rrnFront, backFirstDigit);
    } else {
      calculatedAge = calculateForeignAge(foreignBirth);
    }

    const finalPatient: PatientInfo = {
      ...patient,
      isForeigner,
      age: calculatedAge,
      birthDate: isForeigner ? (foreignBirth || '') : (patient.birthDate || ''),
      passportOrArc: isForeigner ? (foreignPassport || '') : (patient.passportOrArc || ''),
      nationality: isForeigner ? (patient.nationality || 'Foreigner') : '대한민국',
      patientId: patient.patientId && /^DEN-\d{4}-\d{3,5}$/.test(patient.patientId) ? patient.patientId : '',
      rrnBack: !isForeigner ? `${backFirstDigit}******` : patient.rrnBack || '',
    };
    onUpdatePatient(finalPatient);
    onNext();
  };

  // 실시간 계산된 나이 표시
  const currentCalculatedAge = !isForeigner
    ? patient.rrnFront.length === 6
      ? calculateKoreanAge(patient.rrnFront, backFirstDigit)
      : null
    : foreignBirth && foreignBirth.length >= 4
    ? calculateForeignAge(foreignBirth)
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col select-none pb-8 space-y-4">
      {/* 🌟 1. Top Tablet Step Header */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow flex-shrink-0">
            1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded-full">
                Step 1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.step1Title}
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {t.step1Subtitle}
            </p>
          </div>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          onClick={handleApplyPreset}
          className="min-h-[46px] px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl border-2 border-amber-300 shadow-sm flex items-center gap-2 active:scale-95 transition-all flex-shrink-0"
        >
          <Wand2 className="w-4 h-4 text-slate-950" />
          <span>
            {isForeigner
              ? language === 'en'
                ? '[Sample: John Smith (Age 66)]'
                : '[외국인 예시 환자: John Smith]'
              : t.samplePatientBtn}
          </span>
        </button>
      </div>

      {/* 🌟 2. Balanced 2-Card Layout (No bulky keypad, balanced spacing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left 7 cols: Form Inputs (Touch to open native tablet OS keyboard) */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Citizen vs Foreigner Mode Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsForeigner(false);
                    onUpdatePatient({
                      ...patient,
                      isForeigner: false,
                      birthDate: '',
                      passportOrArc: '',
                      nationality: '대한민국',
                    });
                    speakText(
                      language === 'en' ? 'Korean citizen selected' : '내국인 접수를 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all ${
                    !isForeigner
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇰🇷 {t.citizenTabKorean}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForeigner(true);
                    onUpdatePatient({
                      ...patient,
                      isForeigner: true,
                      birthDate: foreignBirth || '',
                      passportOrArc: foreignPassport || '',
                      nationality: patient.nationality || 'Foreigner',
                    });
                    speakText(
                      language === 'en'
                        ? 'Foreigner / International patient selected'
                        : '외국인 환자 접수를 선택하셨습니다.',
                      undefined,
                      language
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all ${
                    isForeigner
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌐 {t.citizenTabForeigner}
                </button>
              </div>

              <span className="text-xs text-slate-500 font-bold">
                * {t.required}
              </span>
            </div>

            {/* Field 1: Patient Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              {/* Name */}
              <div className="sm:col-span-7">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-800 font-black text-sm sm:text-base flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    {isForeigner ? t.foreignerFullNameLabel : t.patientNameLabel} *
                  </label>
                  {patient.name && (
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t.complete}
                    </span>
                  )}
                </div>
                <div className="w-full min-h-[52px] rounded-xl border-2 border-slate-300 bg-slate-50 focus-within:border-blue-600 focus-within:bg-blue-50/30 focus-within:ring-3 focus-within:ring-blue-100 px-3.5 py-2 flex items-center transition-all">
                  <input
                    type="text"
                    inputMode="text"
                    value={patient.name}
                    onChange={(e) => {
                      setErrorMessage('');
                      onUpdatePatient({ ...patient, name: e.target.value });
                    }}
                    placeholder={
                      isForeigner ? t.foreignerFullNamePlaceholder : t.patientNamePlaceholder
                    }
                    className="w-full bg-transparent text-slate-900 text-lg sm:text-xl font-black outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="sm:col-span-5 flex flex-col justify-between">
                <label className="text-slate-800 font-black text-sm sm:text-base block mb-1.5">
                  {t.genderLabel} *
                </label>
                <div className="grid grid-cols-2 gap-1.5 h-[52px]">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePatient({ ...patient, gender: '남성' });
                      speakText(language === 'en' ? 'Male selected' : '남성을 선택하셨습니다.', undefined, language);
                    }}
                    className={`h-full rounded-xl border-2 font-black text-base flex items-center justify-center transition-all active:scale-95 ${
                      patient.gender === '남성'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-200'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {t.male}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePatient({ ...patient, gender: '여성' });
                      speakText(language === 'en' ? 'Female selected' : '여성을 선택하셨습니다.', undefined, language);
                    }}
                    className={`h-full rounded-xl border-2 font-black text-base flex items-center justify-center transition-all active:scale-95 ${
                      patient.gender === '여성'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-200'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {t.female}
                  </button>
                </div>
              </div>
            </div>

            {/* Field 2: Identification (Resident ID for Koreans, Birthdate & Passport/ARC for Foreigners) */}
            {!isForeigner ? (
              // 내국인: 주민등록번호 앞 6자리 + 뒷자리 첫 숫자
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-800 font-black text-sm sm:text-base flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {t.rrnLabel} *
                  </label>
                  {currentCalculatedAge !== null && backFirstDigit ? (
                    <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t.ageCalculated.replace('{age}', String(currentCalculatedAge))}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-semibold">
                      {language === 'en' ? 'Auto age calculation' : '나이 자동 계산'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 w-full">
                  {/* Front 6 digits */}
                  <div className="min-h-[52px] rounded-xl border-2 border-slate-300 bg-slate-50 focus-within:border-blue-600 focus-within:bg-blue-50/30 focus-within:ring-3 focus-within:ring-blue-100 px-3 py-1 flex items-center justify-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={patient.rrnFront}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                        const age = calculateKoreanAge(val, backFirstDigit);
                        onUpdatePatient({ ...patient, rrnFront: val, age });
                        setErrorMessage('');
                      }}
                      placeholder={t.rrnFrontPlaceholder}
                      className="w-full bg-transparent text-center text-slate-900 text-xl font-black outline-none tracking-widest placeholder:tracking-normal placeholder:text-sm placeholder:text-slate-400"
                    />
                  </div>

                  <span className="text-slate-400 font-black text-2xl select-none px-0.5">-</span>

                  {/* Back 1 digit + 6 masked */}
                  <div className="min-h-[52px] rounded-xl border-2 border-slate-300 bg-slate-50 focus-within:border-blue-600 focus-within:bg-blue-50/30 focus-within:ring-3 focus-within:ring-blue-100 px-3 py-1 flex items-center justify-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={backFirstDigit}
                      onChange={(e) => {
                        const digit = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
                        let newGender = patient.gender;
                        if (['1', '3', '5', '7'].includes(digit)) newGender = '남성';
                        if (['2', '4', '6', '8'].includes(digit)) newGender = '여성';
                        const age = calculateKoreanAge(patient.rrnFront, digit);
                        onUpdatePatient({
                          ...patient,
                          rrnBack: digit ? `${digit}******` : '',
                          gender: newGender,
                          age,
                        });
                        setErrorMessage('');
                      }}
                      placeholder="1"
                      className="w-8 text-center text-slate-900 text-xl font-black outline-none bg-transparent mr-1"
                    />
                    <span className="tracking-widest text-slate-400 text-lg select-none">●●●●●●</span>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  {t.rrnDesc}
                </p>
              </div>
            ) : (
              // 외국인: 생년월일 (YYYY-MM-DD) + 여권번호/외국인등록번호(선택)
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Date of Birth */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-800 font-black text-sm sm:text-base flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {t.foreignerBirthDateLabel} *
                    </label>
                    {currentCalculatedAge !== null && (
                      <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {t.ageCalculated.replace('{age}', String(currentCalculatedAge))}
                      </span>
                    )}
                  </div>
                  <div className="w-full min-h-[52px] rounded-xl border-2 border-slate-300 bg-slate-50 focus-within:border-blue-600 focus-within:bg-blue-50/30 focus-within:ring-3 focus-within:ring-blue-100 px-3.5 py-2 flex items-center">
                    <input
                      type="date"
                      value={foreignBirth}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForeignBirth(val);
                        const age = calculateForeignAge(val);
                        onUpdatePatient({
                          ...patient,
                          isForeigner: true,
                          birthDate: val,
                          age,
                        });
                        setErrorMessage('');
                      }}
                      className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-black outline-none"
                    />
                  </div>
                </div>

                {/* Passport / ARC (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-800 font-black text-sm sm:text-base flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      {t.foreignerPassportOrArcLabel}
                    </label>
                    <span className="text-slate-400 text-xs font-semibold">{t.optional}</span>
                  </div>
                  <div className="w-full min-h-[52px] rounded-xl border-2 border-slate-300 bg-slate-50 focus-within:border-blue-600 focus-within:bg-blue-50/30 focus-within:ring-3 focus-within:ring-blue-100 px-3.5 py-2 flex items-center">
                    <input
                      type="text"
                      inputMode="text"
                      value={foreignPassport}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setForeignPassport(val);
                        onUpdatePatient({ ...patient, passportOrArc: val });
                      }}
                      placeholder={t.foreignerPassportOrArcPlaceholder}
                      className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-black outline-none placeholder:text-slate-400 uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Field 3: Mobile Phone Number */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-800 font-black text-sm sm:text-base flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {t.phoneLabel} *
                </label>
                {patient.phone.length >= 10 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t.complete}
                  </span>
                )}
              </div>
              <div className="w-full min-h-[52px] rounded-xl border-2 border-slate-300 bg-slate-50 focus-within:border-blue-600 focus-within:bg-blue-50/30 focus-within:ring-3 focus-within:ring-blue-100 px-4 py-2 flex items-center">
                <input
                  type="tel"
                  inputMode="tel"
                  value={patient.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    onUpdatePatient({ ...patient, phone: formatted });
                    setErrorMessage('');
                  }}
                  placeholder={t.phonePlaceholder}
                  className="w-full bg-transparent text-slate-900 text-xl sm:text-2xl font-black outline-none tracking-wider placeholder:text-slate-400 placeholder:tracking-normal"
                />
              </div>
              <p className="text-slate-500 text-xs mt-1">
                {t.phoneHint}
              </p>
            </div>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <div className="bg-rose-50 border-2 border-rose-300 p-3 rounded-xl flex items-center gap-2 text-rose-800 text-xs sm:text-sm font-bold animate-pulse">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right 5 cols: Verification Summary Card & Consent (Tight, well-composed, no empty space) */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Real-Time Patient Info Live Card */}
            <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 border-2 border-blue-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200/80 mb-3">
                <span className="text-xs font-black text-blue-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  {language === 'en' ? 'Live Check-in Summary' : '실시간 본인확인 정보 요약'}
                </span>
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {isForeigner ? (language === 'en' ? 'Foreigner' : '외국인 접수') : (language === 'en' ? 'Citizen' : '국민건강보험')}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">{language === 'en' ? 'Patient Name' : '환자 성명'}:</span>
                  <span className="font-black text-slate-900 text-base">
                    {patient.name || (language === 'en' ? 'Not entered' : '미입력')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">{language === 'en' ? 'Age & Gender' : '나이 및 성별'}:</span>
                  <span className="font-black text-slate-900">
                    {currentCalculatedAge ? `만 ${currentCalculatedAge}세` : '-'} · {patient.gender}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">{language === 'en' ? 'Contact' : '연락처'}:</span>
                  <span className="font-bold text-slate-800">
                    {patient.phone || (language === 'en' ? 'Not entered' : '미입력')}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-blue-100">
                  <span className="text-slate-500 font-bold">{language === 'en' ? 'ID Status' : '신원 확인'}:</span>
                  <span className="font-black text-blue-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    {isForeigner
                      ? foreignBirth
                        ? (language === 'en' ? 'Verified (Passport/Birth)' : '외국인 확인 완료')
                        : (language === 'en' ? 'Pending' : '생년월일 확인 필요')
                      : patient.rrnFront.length === 6 && backFirstDigit
                      ? (language === 'en' ? 'Verified (NHIS EMR)' : '주민등록 확인 완료')
                      : (language === 'en' ? 'Pending' : '주민번호 확인 필요')}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Insurance & Clinical Integration Badge */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-600 font-medium leading-relaxed">
                <span className="font-black text-slate-900 block mb-0.5">
                  {isForeigner
                    ? (language === 'en' ? 'International Patient Support' : '외국인 환자 전용 안내')
                    : (language === 'en' ? 'NHIS Real-Time Eligibility Verification' : '국민건강보험공단 실시간 자격 조회')}
                </span>
                {isForeigner
                  ? (language === 'en'
                      ? 'Passport or foreign registration info will be transmitted securely to the International Health Care Center.'
                      : '외국인 환자분은 여권 또는 여행자보험 관련 서류를 진료 시 제시하실 수 있습니다.')
                  : (language === 'en'
                      ? 'Automatically verified with the National Health Insurance Service for prompt outpatient coverage.'
                      : '본인확인 의무화 제도에 따라 건강보험 자격이 실시간으로 확인됩니다.')}
              </div>
            </div>

            {/* Privacy Agreement Checkbox */}
            <div
              onClick={() => {
                const next = !privacyAgreed;
                setPrivacyAgreed(next);
                if (next) {
                  speakText(
                    language === 'en'
                      ? 'Privacy consent agreed.'
                      : '개인정보 수집 및 진료 접수 동의를 확인하셨습니다.',
                    undefined,
                    language
                  );
                  setErrorMessage('');
                }
              }}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] select-none ${
                privacyAgreed
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-100'
                  : 'bg-slate-50 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${
                    privacyAgreed
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-slate-400 text-transparent'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${privacyAgreed ? 'text-white' : 'text-slate-300'}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-red-700 font-black text-[11px] bg-red-100 border border-red-200 px-1.5 py-0.2 rounded">
                      {t.required}
                    </span>
                    <span className="text-slate-900 font-bold text-xs sm:text-sm leading-snug">
                      {t.privacyAgreementTitle}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-medium mt-1">
                    {t.privacyAgreementItems}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100/70 rounded-xl p-2.5 text-center text-xs text-slate-500 font-medium border border-slate-200">
            {language === 'en'
              ? 'Tap any input field to type using your tablet touch screen keyboard'
              : '입력창을 터치하시면 태블릿 자체 키보드가 화면에 올라옵니다.'}
          </div>
        </div>
      </div>

      {/* 🌟 3. Sticky Bottom Navigation Bar */}
      <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-end gap-4 flex-shrink-0 mt-4">
        <button
          type="button"
          onClick={handleValidateAndNext}
          className="min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-base sm:text-lg rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md ring-2 ring-blue-200"
        >
          <span>{language === 'en' ? 'Next Step (Select Symptom Area)' : '다음 단계 (증상 부위 선택)'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

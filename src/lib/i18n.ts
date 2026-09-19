export type Language = 'ko' | 'en';

export interface TranslationStrings {
  // Common & Header
  hospitalName: string;
  hospitalSubtitle: string;
  kioskTitle: string;
  stepOf: string; // e.g. "Step {current} / 5"
  steps: [string, string, string, string, string];
  stepDesc: [string, string, string, string, string];
  networkStatus: string;
  batteryStatus: string;
  magnifier: string;
  magnifierActive: string;
  voiceGuide: string;
  voiceOn: string;
  voiceOff: string;
  replayVoice: string;
  callStaff: string;
  resetToHome: string;
  nextStep: string;
  prevStep: string;
  complete: string;
  required: string;
  optional: string;

  // Step 1: Patient Auth
  step1Title: string;
  step1Subtitle: string;
  samplePatientBtn: string;
  samplePatientDesc: string;
  citizenTabKorean: string;
  citizenTabForeigner: string;
  foreignerFullNameLabel: string;
  foreignerFullNamePlaceholder: string;
  foreignerBirthDateLabel: string;
  foreignerPassportOrArcLabel: string;
  foreignerPassportOrArcPlaceholder: string;
  step1ErrorForeignerBirth: string;
  patientAuthBoxTitle: string;
  patientNameLabel: string;
  patientNamePlaceholder: string;
  genderLabel: string;
  male: string;
  female: string;
  rrnLabel: string;
  rrnFrontPlaceholder: string;
  rrnDesc: string;
  ageCalculated: string; // "만 {age}세"
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHint: string;
  privacyAgreementTitle: string;
  privacyAgreementDesc: string;
  privacyAgreementItems: string;
  directTouchKeypadTitle: string;
  keypadClear: string;
  keypadDel: string;
  step1ErrorName: string;
  step1ErrorRrn: string;
  step1ErrorPhone: string;
  step1ErrorPrivacy: string;

  // Step 2: Pain Category
  step2Title: string;
  step2Subtitle: string;
  step2Guidance: string;
  recommendedDeptLabel: string;
  areaTeethTitle: string;
  areaTeethSubtitle: string;
  areaTeethDesc: string;
  areaGumTitle: string;
  areaGumSubtitle: string;
  areaGumDesc: string;
  areaProstheticTitle: string;
  areaProstheticSubtitle: string;
  areaProstheticDesc: string;
  areaJawTitle: string;
  areaJawSubtitle: string;
  areaJawDesc: string;
  areaUnknownTitle: string;
  areaUnknownSubtitle: string;
  areaUnknownDesc: string;
  areaUnknownDept: string;
  step2MultiBadge: string;
  step2MultiGuidance: string;

  // Step 3: Location
  step3Title: string;
  step3Subtitle: string;
  step3InteractiveHint: string;
  step3EntireMouthBtn: string;
  step3EntireMouthDesc: string;
  selectedLocationLabel: string;
  quadrantUR: string;
  quadrantUL: string;
  quadrantLR: string;
  quadrantLL: string;
  quadrantFrontUp: string;
  quadrantFrontDown: string;
  quadrantAll: string;

  // Step 4: Detailed Questions
  step4Title: string;
  step4Subtitle: string;
  subStep1Label: string;
  subStep2Label: string;
  subStep3Label: string;
  subStep4Label: string;
  subStep5Label: string;
  qOnset: string;
  qOnsetDesc: string;
  qOnsetUnknown: string;
  qTrigger: string;
  qTriggerDesc: string;
  qTriggerMultiBadge: string;
  qTriggerMultiGuidance: string;
  symptomSelectedCount: string;
  qUlcer: string;
  qUlcerDesc: string;
  qSwallowing: string;
  qSwallowingDesc: string;
  qProsthetics: string;
  qProstheticsDesc: string;
  qDryMouth: string;
  qDryMouthDesc: string;
  qHealthCheck: string;
  qHealthCheckDesc: string;
  painScaleTitle: string;
  painScaleDesc: string;
  submitSurveyBtn: string;

  // Step 5: Registration & Route
  step5Title: string;
  step5SuccessBadge: string;
  waitingOrderLabel: string;
  tabWayfinding: string;
  tabTicket: string;
  printTicketBtn: string;
  mapTitle: string;
  floorGuide: string;
  walkingSteps: string;
  estMinutes: string;
  stepByStepWalkingTitle: string;
  patientCareNoticeTitle: string;
  patientCareNotice1: string;
  patientCareNotice2: string;
  patientCareNotice3: string;
  patientCareNotice4: string;
  autoResetNotice: string;
  finishAndHome: string;

  // Staff Call Modal
  staffCallTitle: string;
  staffCallDesc: string;
  staffCallRequestSuccess: string;
  staffCallClose: string;
}

export const I18N_DATA: Record<Language, TranslationStrings> = {
  ko: {
    hospitalName: '오즈치과대학교병원',
    hospitalSubtitle: '원내 스마트 예진 태블릿',
    kioskTitle: '스마트 전자예진',
    stepOf: '단계',
    steps: ['1.본인확인', '2.증상부위', '3.치아위치', '4.세부문진', '5.접수·길안내'],
    stepDesc: [
      '환자 인적사항 확인',
      '주요 불편 부위 선택',
      '치아 및 입안 위치 선택',
      '환자 맞춤 세부 질문',
      '외래 접수증 및 길안내',
    ],
    networkStatus: '원내망 5G 연결',
    batteryStatus: '98% 충전 중',
    magnifier: '돋보기',
    magnifierActive: '확대 중',
    voiceGuide: '음성 안내',
    voiceOn: '음성 켬',
    voiceOff: '음성 끔',
    replayVoice: '다시듣기',
    callStaff: '직원 호출',
    resetToHome: '처음으로',
    nextStep: '다음 단계',
    prevStep: '이전 단계',
    complete: '완료',
    required: '필수',
    optional: '선택',

    // Step 1
    step1Title: '환자 본인 확인 및 인적사항 확인',
    step1Subtitle: '외래 접수를 위해 성함과 생년월일, 연락처를 확인해 주세요.',
    samplePatientBtn: '[예시 환자 원터치 입력: 김영수 님 (만 72세)]',
    samplePatientDesc: '클릭 시 예시 환자 정보가 즉시 입력됩니다.',
    citizenTabKorean: '내국인 (Korean Citizen)',
    citizenTabForeigner: '외국인 (Foreigner / International)',
    foreignerFullNameLabel: '1. 영문 성명 (Full Name as in Passport)',
    foreignerFullNamePlaceholder: '여권상 영문 성명을 입력하세요 (예: JOHN DOE)',
    foreignerBirthDateLabel: '2. 생년월일 (Date of Birth)',
    foreignerPassportOrArcLabel: '3. 여권번호 또는 외국인등록번호 (선택)',
    foreignerPassportOrArcPlaceholder: '여권번호 / 외국인등록번호 (선택 입력)',
    step1ErrorForeignerBirth: '생년월일을 올바르게 입력해 주세요.',
    patientAuthBoxTitle: '환자 인적사항 입력',
    patientNameLabel: '1. 환자 성함',
    patientNamePlaceholder: '성함을 입력해 주세요',
    genderLabel: '성별 선택',
    male: '남성',
    female: '여성',
    rrnLabel: '2. 주민등록번호 (앞 6자리 + 뒷자리 첫 번째 숫자)',
    rrnFrontPlaceholder: '생년월일 6자리 (YYMMDD)',
    rrnDesc: '※ 생년월일 6자리와 성별 식별용 뒷자리 첫 번째 숫자만 입력합니다.',
    ageCalculated: '만 {age}세',
    phoneLabel: '3. 휴대전화번호 (진료순서 안내)',
    phonePlaceholder: '010-0000-0000',
    phoneHint: '진료 대기 순서 및 진료실 알림 문자가 발송됩니다.',
    privacyAgreementTitle: '[필수] 개인정보 수집 및 진료 접수 동의',
    privacyAgreementDesc: '국민건강보험 본인확인 및 외래 진료 예진을 위한 개인정보 수집에 동의합니다.',
    privacyAgreementItems: '수집 항목: 성명, 주민등록번호, 연락처 (보유 기간: 의료법 기준 준수)',
    directTouchKeypadTitle: '키보드 입력',
    keypadClear: '전체지움',
    keypadDel: '지우기',
    step1ErrorName: '환자분의 성함을 입력해 주세요.',
    step1ErrorRrn: '생년월일 6자리와 뒷자리 첫 번째 숫자를 입력해 주세요.',
    step1ErrorPhone: '진료 안내를 받으실 휴대전화번호를 입력해 주세요.',
    step1ErrorPrivacy: '개인정보 수집 및 진료 접수 동의에 체크해 주세요.',

    // Step 2
    step2Title: '가장 불편하신 부위를 선택해 주세요',
    step2Subtitle: '선택하신 증상에 따라 가장 적합한 치과 전문 진료과로 배정됩니다.',
    step2Guidance: '화면의 큰 카드 중 현재 가장 불편한 곳을 터치해 주세요.',
    recommendedDeptLabel: '추천 진료과',
    areaTeethTitle: '어금니 / 앞니 통증',
    areaTeethSubtitle: '치아가 시리거나 씹을 때 찌릿하고 아파요',
    areaTeethDesc: '찬물 마실 때 통증, 씹을 때 깜짝 놀람, 충치, 때운 곳 탈락',
    areaGumTitle: '잇몸 통증 및 출혈',
    areaGumSubtitle: '잇몸에서 피가 나거나 붓고 고름이 나와요',
    areaGumDesc: '양치 시 잇몸 출혈, 잇몸이 빨갛게 부어오름, 치아 흔들림, 입냄새',
    areaProstheticTitle: '틀니 / 임플란트 불편',
    areaProstheticSubtitle: '틀니가 헐겁거나 잇몸이 아프고 임플란트가 흔들려요',
    areaProstheticDesc: '틀니에 잇몸 짓무름, 임플란트 나사 풀림, 새 틀니/임플란트 상담',
    areaJawTitle: '턱관절 / 입안 점막 / 혀',
    areaJawSubtitle: '턱에서 딱 소리가 나거나 입안·혀가 헐었어요',
    areaJawDesc: '턱관절 통증 및 입 벌리기 어려움, 혓바늘/구내염, 사랑니 부위 통증',
    areaUnknownTitle: '잘 모르겠음 / 복합 통증',
    areaUnknownSubtitle: '치아인지 잇몸인지 애매하거나 전체가 아파요',
    areaUnknownDesc: '어디가 문제인지 정확히 모르겠거나 복합적인 구강 불편감',
    areaUnknownDept: '종합 진료 / 구강내과',
    step2MultiBadge: '복수 선택 가능',
    step2MultiGuidance: '불편한 부위가 여러 곳이라면 모두 선택해 주세요. 원인을 잘 모르시겠다면 \'잘 모르겠음\'을 선택하세요.',

    // Step 3
    step3Title: '불편한 치아의 대략적인 위치를 터치해 주세요',
    step3Subtitle: '아래 치아 그림에서 아픈 부위를 누르시거나, 우측 목록에서 선택해 주세요.',
    step3InteractiveHint: '입안 치아 그림을 손가락으로 직접 누르실 수 있습니다',
    step3EntireMouthBtn: '정확한 위치를 잘 모름 / 입안 전체가 아픔',
    step3EntireMouthDesc: '어느 치아인지 정확히 짚기 어렵거나 전반적으로 퍼져서 아픈 경우',
    selectedLocationLabel: '선택된 위치',
    quadrantUR: '오른쪽 윗니 (환자 기준)',
    quadrantUL: '왼쪽 윗니 (환자 기준)',
    quadrantLR: '오른쪽 아랫니 (환자 기준)',
    quadrantLL: '왼쪽 아랫니 (환자 기준)',
    quadrantFrontUp: '위 앞니 (앞쪽)',
    quadrantFrontDown: '아래 앞니 (앞쪽)',
    quadrantAll: '입안 전체 / 위치 잘 모름',

    // Step 4
    step4Title: '환자분 상태를 알려주세요',
    step4Subtitle: '의사 선생님이 진료 전 참고할 수 있도록 편안하게 답변해 주세요.',
    subStep1Label: '1. 발병·자극',
    subStep2Label: '2. 궤양·삼킴',
    subStep3Label: '3. 보철·건조',
    subStep4Label: '4. 복용 약물',
    subStep5Label: '5. 통증 강도',
    qOnset: '언제부터 증상이 시작되셨나요?',
    qOnsetDesc: '가장 가까운 기간을 선택해 주세요.',
    qOnsetUnknown: '잘 기억나지 않음 / 불분명함',
    qTrigger: '어떤 상황에서 가장 불편하신가요?',
    qTriggerDesc: '현재 느끼시는 증상을 모두 선택해 주세요 (복수 선택 가능, 잘 모르실 경우 모름 선택).',
    qTriggerMultiBadge: '복수 선택 가능',
    qTriggerMultiGuidance: '증상이 여러 개 나타나신다면 모두 눌러주세요. 정확히 모르시겠다면 \'잘 모르겠음\'을 선택하시면 됩니다.',
    symptomSelectedCount: '{count}개 증상 선택됨',
    qUlcer: '입안이 헐거나 통증이 있는 부위가 2주 이상 지속되나요?',
    qUlcerDesc: '단순 혓바늘인지, 오래 지속되는 헐음인지 확인합니다.',
    qSwallowing: '물이나 음식을 삼킬 때 사레가 자주 들리시나요?',
    qSwallowingDesc: '치과 진료 시 의자 각도와 흡인기(석션) 준비에 참고합니다.',
    qProsthetics: '틀니나 임플란트 치료를 받으신 적이 있나요?',
    qProstheticsDesc: '현재 사용 중이신 보철물이 있다면 알려주세요.',
    qDryMouth: '평소 입안이 바짝 마르는 느낌이 심하신가요?',
    qDryMouthDesc: '식사 시 물이 꼭 필요한지 확인합니다.',
    qHealthCheck: '현재 정기적으로 복용 중인 약물이 있으신가요?',
    qHealthCheckDesc: '발치나 잇몸 치료 시 출혈 및 안전을 위해 확인합니다 (복수 선택 가능).',
    painScaleTitle: '현재 통증 정도 (1~5점)',
    painScaleDesc: '1점(약한 불편)부터 5점(극심한 통증) 중 선택해 주세요.',
    submitSurveyBtn: '문진 완료 및 접수하기',

    // Step 5
    step5Title: '외래 접수가 완료되었습니다',
    step5SuccessBadge: '접수 완료',
    waitingOrderLabel: '오늘의 대기 번호',
    tabWayfinding: '1. 진료실 찾아오는 길 (지도)',
    tabTicket: '2. 외래 접수증 및 안내',
    printTicketBtn: '종이 접수증 출력',
    mapTitle: '병원 층별 길안내 지도',
    floorGuide: '도착 층수',
    walkingSteps: '도보 걸음수',
    estMinutes: '예상 소요시간',
    stepByStepWalkingTitle: '진료실 찾아오시는 순서',
    patientCareNoticeTitle: '환자분 진료 전 안내사항',
    patientCareNotice1: '배정된 진료실 앞 대기 의자에서 잠시 기다려 주세요.',
    patientCareNotice2: '간호사 선생님이 성함을 호명하면 진료실로 입장해 주시기 바랍니다.',
    patientCareNotice3: '혈압약, 당뇨약, 아스피린 등 복용 중인 약물이 있다면 진료 전 의사에게 말씀해 주세요.',
    patientCareNotice4: '거동이 불편하시거나 도움이 필요하시면 상단의 [직원 호출] 버튼을 눌러주세요.',
    autoResetNotice: '다음 환자를 위해 {seconds}초 후 첫 화면으로 자동 전환됩니다.',
    finishAndHome: '확인 완료 (처음으로)',

    // Staff Call
    staffCallTitle: '병원 안내직원 호출',
    staffCallDesc: '작성이 어려우시거나 거동에 도움이 필요하시면 직원이 즉시 찾아뵙겠습니다.',
    staffCallRequestSuccess: '직원 호출이 완료되었습니다. 잠시만 기다려 주세요.',
    staffCallClose: '닫기',
  },
  en: {
    hospitalName: 'OZ Dental University Hospital',
    hospitalSubtitle: 'Smart Dental Triage System',
    kioskTitle: 'Smart Triage',
    stepOf: 'Step',
    steps: ['1. Identity', '2. Symptoms', '3. Location', '4. Questionnaire', '5. Route & Ticket'],
    stepDesc: [
      'Verify patient details',
      'Select main discomfort area',
      'Select mouth & tooth location',
      'Answer customized questions',
      'Clinic ticket & wayfinding',
    ],
    networkStatus: 'Hospital 5G Connected',
    batteryStatus: '98% Charging',
    magnifier: 'Zoom',
    magnifierActive: 'Zoomed',
    voiceGuide: 'Voice',
    voiceOn: 'Voice On',
    voiceOff: 'Voice Off',
    replayVoice: 'Replay',
    callStaff: 'Call Staff',
    resetToHome: 'Home',
    nextStep: 'Next Step',
    prevStep: 'Previous',
    complete: 'Done',
    required: 'Required',
    optional: 'Optional',

    // Step 1
    step1Title: 'Patient Verification & Personal Information',
    step1Subtitle: 'Please verify your name, date of birth, and mobile number for outpatient registration.',
    samplePatientBtn: '[Tap Sample Patient: Young-Soo Kim (Age 72)]',
    samplePatientDesc: 'Click to automatically fill in sample patient data.',
    citizenTabKorean: 'Korean Citizen',
    citizenTabForeigner: 'Foreigner / International',
    foreignerFullNameLabel: '1. Full Name (as shown in Passport)',
    foreignerFullNamePlaceholder: 'e.g. JOHN DOE',
    foreignerBirthDateLabel: '2. Date of Birth',
    foreignerPassportOrArcLabel: '3. Passport No. or Alien Reg. No. (Optional)',
    foreignerPassportOrArcPlaceholder: 'e.g. M12345678 (Optional)',
    step1ErrorForeignerBirth: 'Please enter a valid date of birth.',
    patientAuthBoxTitle: 'Enter Patient Information',
    patientNameLabel: '1. Patient Name',
    patientNamePlaceholder: 'Enter your full name',
    genderLabel: 'Gender',
    male: 'Male',
    female: 'Female',
    rrnLabel: '2. Resident Registration / Birth Date (6 digits + 1 digit)',
    rrnFrontPlaceholder: 'YYMMDD (6 digits)',
    rrnDesc: '※ Enter 6 digits of birth date and the 1st digit of the second half for gender identification.',
    ageCalculated: 'Age {age}',
    phoneLabel: '3. Mobile Phone Number (For Queue Notifications)',
    phonePlaceholder: '010-0000-0000',
    phoneHint: 'You will receive SMS notifications when your turn is approaching.',
    privacyAgreementTitle: '[Required] Consent to Personal Data Collection for Medical Care',
    privacyAgreementDesc: 'I agree to the collection of personal information for health insurance verification and outpatient dental care.',
    privacyAgreementItems: 'Items: Name, Registration number, Mobile number (Stored according to Medical Law)',
    directTouchKeypadTitle: 'Keyboard Entry',
    keypadClear: 'Clear',
    keypadDel: 'Del',
    step1ErrorName: 'Please enter your name.',
    step1ErrorRrn: 'Please enter your 6-digit birth date and first digit of ID.',
    step1ErrorPhone: 'Please enter your mobile phone number.',
    step1ErrorPrivacy: 'Please check the consent to personal data collection.',

    // Step 2
    step2Title: 'Please select where you feel the most discomfort',
    step2Subtitle: 'You will be assigned to the most appropriate dental department based on your symptoms.',
    step2Guidance: 'Please tap the large card that best describes your current issue.',
    recommendedDeptLabel: 'Recommended Dept',
    areaTeethTitle: 'Tooth Pain & Cavities',
    areaTeethSubtitle: 'Sensitive to cold/hot, pain when chewing, or throbbing ache',
    areaTeethDesc: 'Pain with cold water, sharp pain when biting, broken filling, cavity',
    areaGumTitle: 'Gum Pain & Bleeding',
    areaGumSubtitle: 'Gums bleed when brushing, swollen, or pus discharge',
    areaGumDesc: 'Bleeding gums, swollen reddish gum, loose teeth, bad breath',
    areaProstheticTitle: 'Denture & Implant Issues',
    areaProstheticSubtitle: 'Loose dentures, sore spots, or wobbly implants',
    areaProstheticDesc: 'Denture rubs gums, loose implant screw, new denture consultation',
    areaJawTitle: 'Jaw Joint / Tongue / Mucosa',
    areaJawSubtitle: 'Clicking sound in jaw, mouth sores, or wisdom tooth ache',
    areaJawDesc: 'Jaw pain, difficulty opening mouth, mouth ulcers, wisdom tooth ache',
    areaUnknownTitle: 'Not Sure / Generalized Discomfort',
    areaUnknownSubtitle: 'Unclear whether tooth or gum, or generalized pain',
    areaUnknownDesc: 'Hard to pinpoint cause, multi-area pain, general oral checkup',
    areaUnknownDept: 'General Clinic / Oral Medicine',
    step2MultiBadge: 'Multiple Selection Allowed',
    step2MultiGuidance: 'Please select all areas if discomfort is in multiple spots, or choose \'Not Sure\'.',

    // Step 3
    step3Title: 'Please tap the approximate location of discomfort',
    step3Subtitle: 'Tap on the dental diagram below, or select from the list on the right.',
    step3InteractiveHint: 'You can tap directly on the tooth diagram',
    step3EntireMouthBtn: 'Not sure of exact spot / Entire mouth hurts',
    step3EntireMouthDesc: 'Hard to pinpoint single tooth, or generalized discomfort',
    selectedLocationLabel: 'Selected Location',
    quadrantUR: 'Upper Right (Patient side)',
    quadrantUL: 'Upper Left (Patient side)',
    quadrantLR: 'Lower Right (Patient side)',
    quadrantLL: 'Lower Left (Patient side)',
    quadrantFrontUp: 'Upper Front Teeth',
    quadrantFrontDown: 'Lower Front Teeth',
    quadrantAll: 'Entire Mouth / Unsure',

    // Step 4
    step4Title: 'Please tell us more about your symptoms',
    step4Subtitle: 'Answer comfortably so your dentist can review your symptoms before treatment.',
    subStep1Label: '1. Onset & Trigger',
    subStep2Label: '2. Sores & Swallowing',
    subStep3Label: '3. Prosthetics & Dryness',
    subStep4Label: '4. Medications',
    subStep5Label: '5. Pain Scale',
    qOnset: 'When did your symptoms start?',
    qOnsetDesc: 'Select the timeframe closest to your condition.',
    qOnsetUnknown: 'Not sure / Unclear onset',
    qTrigger: 'In what situation do you feel the most discomfort?',
    qTriggerDesc: 'Select all symptoms that apply (Multiple selections allowed, or select Not Sure).',
    qTriggerMultiBadge: 'Multiple Selection',
    qTriggerMultiGuidance: 'Please select all symptoms that apply. If uncertain, choose \'Not sure\'.',
    symptomSelectedCount: '{count} symptoms selected',
    qUlcer: 'Have mouth ulcers or sores lasted for 2 weeks or longer?',
    qUlcerDesc: 'Helps check whether sores are healing normally.',
    qSwallowing: 'Do you cough or choke often when drinking or eating?',
    qSwallowingDesc: 'Helps us adjust the dental chair angle and suction equipment for safety.',
    qProsthetics: 'Do you currently wear dentures or have dental implants?',
    qProstheticsDesc: 'Let us know if you have prosthetics in your mouth.',
    qDryMouth: 'Do you frequently experience severe dry mouth?',
    qDryMouthDesc: 'Checks if you need water to swallow meals comfortably.',
    qHealthCheck: 'Do you regularly take any of the following medications?',
    qHealthCheckDesc: 'Important for safety during extractions or gum care (Multiple selections allowed).',
    painScaleTitle: 'Current Pain Level (1 to 5)',
    painScaleDesc: 'Select from 1 (Mild discomfort) to 5 (Severe acute pain).',
    submitSurveyBtn: 'Complete Survey & Register',

    // Step 5
    step5Title: 'Outpatient Registration Completed',
    step5SuccessBadge: 'Registered',
    waitingOrderLabel: 'Waiting Queue Number',
    tabWayfinding: '1. Wayfinding Map (Directions)',
    tabTicket: '2. Registration Ticket & Notice',
    printTicketBtn: 'Print Paper Ticket',
    mapTitle: 'Hospital Floor Navigation Map',
    floorGuide: 'Destination Floor',
    walkingSteps: 'Walking Steps',
    estMinutes: 'Estimated Time',
    stepByStepWalkingTitle: 'Step-by-Step Directions to Clinic',
    patientCareNoticeTitle: 'Pre-Treatment Notice for Patients',
    patientCareNotice1: 'Please take a seat in the waiting area right outside your assigned clinic room.',
    patientCareNotice2: 'When the dental nurse calls your name, please enter the clinic room.',
    patientCareNotice3: 'If you take blood pressure, diabetes, or blood thinner medications, please remind your dentist.',
    patientCareNotice4: 'If you need any physical assistance, please press the [Call Staff] button at the top.',
    autoResetNotice: 'Screen will automatically reset to home in {seconds} seconds for the next patient.',
    finishAndHome: 'Done (Return to Home)',

    // Staff Call
    staffCallTitle: 'Call Hospital Staff',
    staffCallDesc: 'If you have difficulty with the screen or need physical assistance, a staff member will assist you immediately.',
    staffCallRequestSuccess: 'Staff has been called. Please wait a moment.',
    staffCallClose: 'Close',
  },
};

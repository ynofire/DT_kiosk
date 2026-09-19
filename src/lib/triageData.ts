import { AreaCategory, DentalChairUnit, QuadrantLocation, TriageAreaType, TriageLevel } from '../types';

export const HOSPITAL_CHAIR_UNITS: DentalChairUnit[] = [
  {
    id: 'chair_1',
    chairName: '1번 체어',
    clinicRoom: '제 1 진료실',
    unitPurpose: '일반 치과 보존 및 치주 치료 전용 유닛',
    equippedTools: ['초음파 스케일러', '고광도 LED 광중합기', '구강내 카메라'],
  },
  {
    id: 'chair_2',
    chairName: '2번 체어',
    clinicRoom: '제 1 진료실',
    unitPurpose: '디지털 보철 프렙 및 인상 채득 특화 유닛',
    equippedTools: ['3D 디지털 구강스캐너(트리오스)', '보철 CAD/CAM 연동'],
  },
  {
    id: 'chair_3',
    chairName: '3번 체어',
    clinicRoom: '제 2 진료실',
    unitPurpose: '미세 현미경 신경치료 및 근관 성형 유닛',
    equippedTools: ['치과 미세수술 현미경(Zeiss)', 'Ni-Ti 전동 엔도 모터'],
  },
  {
    id: 'chair_4',
    chairName: '4번 체어',
    clinicRoom: '제 2 진료실',
    unitPurpose: '매복 사랑니 발치 및 소치조골 수술 전문 유닛',
    equippedTools: ['서지컬 모터', '초음파 피에조 본 수술기', '무영등'],
  },
  {
    id: 'chair_5',
    chairName: '5번 체어',
    clinicRoom: '제 3 진료실',
    unitPurpose: '턱관절 장애, 안면 통증, 구강점막질환 전용 유닛',
    equippedTools: ['저출력 턱관절 레이저', 'TENS 물리치료기', '구강건조 측정기'],
  },
  {
    id: 'chair_special',
    chairName: '특진체어',
    clinicRoom: '중앙수술실(특진실)',
    unitPurpose: '임플란트 수술 및 고난이도 악안면 외과 수술실',
    equippedTools: ['HEPA 클린룸 공조', '환자 생체 징후(V/S) 모니터', 'C-Arm 연동'],
  },
  {
    id: 'unassigned',
    chairName: '체어 미지정',
    clinicRoom: '중앙대기실',
    unitPurpose: '체어 배정 전 대기실 대기 또는 임시 체어 해제 상태',
    equippedTools: ['대기 전광판 및 스마트 호출 연동'],
  },
];

export const AREA_CATEGORIES: AreaCategory[] = [
  {
    id: 'teeth',
    title: '어금니 / 앞니',
    subtitle: '치아가 시리거나 씹을 때 찌릿하고 욱신거려요',
    description: '찬물 마실 때 통증, 씹을 때 통증, 썩은 이, 때운 곳 탈락',
    iconName: 'Sparkles',
    color: '#D97706', // Golden amber
    bgGradient: 'from-amber-950/40 via-amber-900/20 to-slate-900',
    targetDepartment: '보존과',
    commonSymptoms: ['찬물/뜨거운 음식 시림', '씹을 때 깜짝 놀람', '밤에 욱신거려 잠 못 잠', '치아 구멍/변색'],
  },
  {
    id: 'gum',
    title: '잇몸 통증 및 출혈',
    subtitle: '잇몸에서 피가 나거나 붓고 고름이 생겨요',
    description: '양치 시 출혈, 잇몸이 빨갛게 붓고 들뜸, 이가 흔들림, 구취',
    iconName: 'ShieldAlert',
    color: '#E11D48', // Rose red / coral
    bgGradient: 'from-rose-950/40 via-rose-900/20 to-slate-900',
    targetDepartment: '치주과',
    commonSymptoms: ['양치할 때 피가 남', '잇몸이 부어올라 욱신거림', '치아가 흔들리고 벌어짐', '잇몸이 내려앉아 뿌리 보임'],
  },
  {
    id: 'implant_denture',
    title: '빠진 이 / 틀니 / 임플란트',
    subtitle: '틀니가 헐겁거나 잇몸이 찔리고 임플란트가 흔들려요',
    description: '틀니 잇몸 상처, 임플란트 나사 풀림, 빠진 치아 수복 상담',
    iconName: 'Layers',
    color: '#0284C7', // Sky cyan
    bgGradient: 'from-sky-950/40 via-sky-900/20 to-slate-900',
    targetDepartment: '보철과',
    commonSymptoms: ['틀니가 헐거워 씹기 어려움', '틀니에 잇몸이 짓무르고 아픔', '임플란트 나사가 덜렁거림', '새 틀니/임플란트 제작 상담'],
  },
  {
    id: 'jaw_mucosa',
    title: '턱 / 입안 점막 / 사랑니',
    subtitle: '턱관절에서 딱 소리가 나거나 혀·입안이 헐었어요',
    description: '턱 통증 및 입 안 벌어짐, 혓바늘/구내염, 삐뚤어진 사랑니',
    iconName: 'SmilePlus',
    color: '#8B5CF6', // Purple / Violet
    bgGradient: 'from-violet-950/40 via-violet-900/20 to-slate-900',
    targetDepartment: '구강외과 / 구강내과',
    commonSymptoms: ['입 벌릴 때 턱에서 딱 소리 및 통증', '입안 점막 궤양/혓바늘', '맨 안쪽 사랑니 붓기와 통증', '얼굴이나 뺨이 부어오름'],
  },
  {
    id: 'unknown_general',
    title: '잘 모르겠음 / 복합 통증',
    subtitle: '치아인지 잇몸인지 애매하거나 입안 전체가 아파요',
    description: '원인을 특정하기 어렵거나 복합적인 불편감, 종합 구강 검진',
    iconName: 'HelpCircle',
    color: '#64748B', // Slate
    bgGradient: 'from-slate-950/40 via-slate-900/20 to-slate-900',
    targetDepartment: '구강내과',
    commonSymptoms: ['정확한 통증 위치 불분명', '치아와 잇몸이 동시에 불편함', '전체적인 둔통', '원인 모를 구강 불편'],
  },
];

export const QUADRANT_LOCATIONS: QuadrantLocation[] = [
  {
    id: 'UR',
    title: '오른쪽 위 치아/어금니 (우측 상악)',
    koreanName: '오른쪽 위 치아',
    seniorExplanation: '환자 본인 기준 오른쪽 위의 치아 또는 잇몸',
    shortLabel: '오른쪽 윗니',
  },
  {
    id: 'FRONT_UP',
    title: '위쪽 앞니 (상악 전치부)',
    koreanName: '위쪽 앞니',
    seniorExplanation: '웃거나 말할 때 보이는 위쪽 앞니 및 잇몸',
    shortLabel: '위 앞니',
  },
  {
    id: 'UL',
    title: '왼쪽 위 치아/어금니 (좌측 상악)',
    koreanName: '왼쪽 위 치아',
    seniorExplanation: '환자 본인 기준 왼쪽 위의 치아 또는 잇몸',
    shortLabel: '왼쪽 윗니',
  },
  {
    id: 'LR',
    title: '오른쪽 아래 치아/어금니 (우측 하악)',
    koreanName: '오른쪽 아래 치아',
    seniorExplanation: '환자 본인 기준 오른쪽 아래의 치아 또는 잇몸',
    shortLabel: '오른쪽 아랫니',
  },
  {
    id: 'FRONT_DOWN',
    title: '아래쪽 앞니 (하악 전치부)',
    koreanName: '아래쪽 앞니',
    seniorExplanation: '아래쪽 가운데 앞니 및 잇몸',
    shortLabel: '아래 앞니',
  },
  {
    id: 'LL',
    title: '왼쪽 아래 치아/어금니 (좌측 하악)',
    koreanName: '왼쪽 아래 치아',
    seniorExplanation: '환자 본인 기준 왼쪽 아래의 치아 또는 잇몸',
    shortLabel: '왼쪽 아랫니',
  },
  {
    id: 'ALL',
    title: '위치를 잘 모름 / 입안 전체',
    koreanName: '정확한 위치를 잘 모름 (입안 전체)',
    seniorExplanation: '어느 치아인지 정확히 짚기 어렵거나 전반적으로 퍼지는 통증',
    shortLabel: '잘 모름/전체',
  },
];

export interface HospitalDepartmentInfo {
  department: string;
  floor: string;
  room: string;
  chairName?: string;
  lineColor: string;
  lineColorName: string;
  walkSteps: number;
  estimatedMinutes: number;
  directionGuide: string;
  elevatorTip: string;
}

/**
 * 치과대학병원 표준 5대 진료과 목록
 * '보존과', '치주과', '구강외과', '구강내과', '보철과' 이 5개 명칭만 사용
 */
export const EMR_STANDARD_DEPARTMENTS = [
  '보존과',
  '치주과',
  '구강외과',
  '구강내과',
  '보철과',
] as const;

export type EMRStandardDepartment = (typeof EMR_STANDARD_DEPARTMENTS)[number];

/**
 * 표준 진료과명으로 정규화하는 헬퍼 함수
 */
export function normalizeEmrDepartment(dept?: string): EMRStandardDepartment {
  if (!dept) return '보존과';
  const clean = dept.trim();
  if (clean.includes('치주')) return '치주과';
  if (clean.includes('외과') || clean.includes('수술')) return '구강외과';
  if (clean.includes('구강내과') || clean.includes('내과') || clean.includes('턱관절') || clean.includes('점막')) return '구강내과';
  if (clean.includes('보철') || clean.includes('틀니') || clean.includes('임플란트')) return '보철과';
  if (clean.includes('보존') || clean.includes('충치') || clean.includes('신경')) return '보존과';
  return '보존과';
}

export const DEPARTMENT_ROUTES: Record<string, HospitalDepartmentInfo> = {
  // 1) 표준 5대 진료과
  '보존과': {
    department: '보존과',
    floor: '본관 2층',
    room: '제 1 진료실 / 제 2 진료실',
    chairName: '1번·3번 체어',
    lineColor: '#F59E0B',
    lineColorName: '노란색 유도선',
    walkSteps: 110,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 노란색 바닥 유도선을 따라 이동 (1번·3번 체어)',
    elevatorTip: '일반 보존 치료는 1번 체어, 미세현미경 신경치료는 3번 체어로 배정됩니다.',
  },
  '치주과': {
    department: '치주과',
    floor: '본관 2층',
    room: '제 1 진료실',
    chairName: '1번 체어',
    lineColor: '#F59E0B',
    lineColorName: '노란색 유도선',
    walkSteps: 110,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 우측 노란색 바닥 유도선을 따라 이동 (1번 체어)',
    elevatorTip: '초음파 스케일러 및 치주 전용 기구가 구비된 1번 체어입니다.',
  },
  '구강외과': {
    department: '구강외과',
    floor: '본관 2층',
    room: '제 2 진료실 / 특진실',
    chairName: '4번 체어 / 특진체어',
    lineColor: '#8B5CF6',
    lineColorName: '보라색 유도선',
    walkSteps: 130,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 보라색 바닥 유도선을 따라 이동 (4번 체어)',
    elevatorTip: '매복 사랑니 발치 및 소치조골 수술 전문 유닛(서지컬 모터, 피에조)이 구비되어 있습니다.',
  },
  '구강내과': {
    department: '구강내과',
    floor: '본관 2층',
    room: '제 3 진료실',
    chairName: '5번 체어',
    lineColor: '#10B981',
    lineColorName: '초록색 유도선',
    walkSteps: 95,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 초록색 바닥 유도선을 따라 이동 (5번 체어)',
    elevatorTip: '저출력 턱관절 레이저, TENS 물리치료기가 구비된 5번 체어입니다.',
  },
  '보철과': {
    department: '보철과',
    floor: '본관 2층',
    room: '제 1 진료실',
    chairName: '2번 체어',
    lineColor: '#0EA5E9',
    lineColorName: '파란색 유도선',
    walkSteps: 110,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 파란색 바닥 유도선을 따라 이동 (2번 체어)',
    elevatorTip: '3D 구강스캐너(트리오스) 및 CAD/CAM이 연동된 디지털 보철 2번 체어입니다.',
  },

  // 2) 진료실명 키 지원
  '제 1 진료실': {
    department: '보존과',
    floor: '본관 2층',
    room: '제 1 진료실',
    lineColor: '#F59E0B', // Amber
    lineColorName: '노란색 유도선',
    walkSteps: 110,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 우측 노란색 바닥 유도선을 따라 30m 이동 (1번·2번 체어)',
    elevatorTip: '초음파 스케일러·광중합기(1번 체어) 및 3D 구강스캐너(2번 체어)가 구비되어 있습니다.',
  },
  '제 2 진료실': {
    department: '구강외과',
    floor: '본관 2층',
    room: '제 2 진료실',
    lineColor: '#8B5CF6', // Purple
    lineColorName: '보라색 유도선',
    walkSteps: 130,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 좌측 보라색 바닥 유도선을 따라 40m 이동 (3번·4번 체어)',
    elevatorTip: 'Zeiss 미세수술현미경(3번 체어) 및 서지컬 모터·피에조 수술기(4번 체어)가 구비되어 있습니다.',
  },
  '제 3 진료실': {
    department: '구강내과',
    floor: '본관 2층',
    room: '제 3 진료실',
    lineColor: '#10B981', // Green
    lineColorName: '초록색 유도선',
    walkSteps: 95,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 바로 앞 초록색 바닥 유도선을 따라 20m 이동 (5번 체어)',
    elevatorTip: '저출력 턱관절 레이저, TENS 물리치료기 및 구강건조 측정기가 완비된 5번 체어입니다.',
  },
  '중앙수술실(특진실)': {
    department: '구강외과',
    floor: '본관 3층',
    room: '중앙수술실(특진실)',
    lineColor: '#EF4444', // Red
    lineColorName: '빨간색 유도선',
    walkSteps: 150,
    estimatedMinutes: 3,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 3층 하차 후 빨간색 바닥 유도선을 따라 직진 45m 이동 (특진체어)',
    elevatorTip: 'HEPA 클린룸 무균 공조, 생체 징후(V/S) 모니터 및 C-Arm이 구비된 특진체어입니다.',
  },
  '중앙대기실': {
    department: '보존과',
    floor: '본관 1층',
    room: '중앙대기실',
    lineColor: '#0EA5E9', // Blue
    lineColorName: '파란색 유도선',
    walkSteps: 30,
    estimatedMinutes: 1,
    directionGuide: '1층 로비 중앙 대기실 소파에서 대기 전광판 호출 시 해당 진료실로 이동해 주세요.',
    elevatorTip: '대기 전광판 및 스마트 호출과 연동되어 있습니다.',
  },

  // 3) 과거 별칭 호환 키
  '치과보존과': {
    department: '보존과',
    floor: '본관 2층',
    room: '제 1 진료실 / 제 2 진료실',
    lineColor: '#F59E0B',
    lineColorName: '노란색 유도선',
    walkSteps: 110,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 노란색 바닥 유도선을 따라 이동',
    elevatorTip: '일반 보존 치료는 1번 체어, 미세현미경 신경치료는 3번 체어로 배정됩니다.',
  },
  '치과보철과': {
    department: '보철과',
    floor: '본관 2층',
    room: '제 1 진료실',
    lineColor: '#0EA5E9',
    lineColorName: '파란색 유도선',
    walkSteps: 110,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 파란색 바닥 유도선을 따라 이동 (2번 체어)',
    elevatorTip: '3D 구강스캐너(트리오스) 및 CAD/CAM이 연동된 디지털 보철 2번 체어입니다.',
  },
  '구강악안면외과': {
    department: '구강외과',
    floor: '본관 2층',
    room: '제 2 진료실 4번 체어',
    lineColor: '#8B5CF6',
    lineColorName: '보라색 유도선',
    walkSteps: 130,
    estimatedMinutes: 2,
    directionGuide: '1층 로비 중앙 엘리베이터 탑승 ➔ 2층 하차 후 보라색 바닥 유도선을 따라 이동 (4번 체어)',
    elevatorTip: '매복 사랑니 발치 및 소치조골 수술 전문 유닛(서지컬 모터, 피에조)이 구비되어 있습니다.',
  },
};

/**
 * Generate medical documentation (C.C, Hx, Suspected Conditions, Routing) based on questionnaire
 */
export function buildClinicalTriage(params: {
  areaType: TriageAreaType;
  selectedAreas?: TriageAreaType[];
  selectedSymptoms?: string[];
  locationId: string;
  onsetPeriod: string;
  painType: string;
  dailyImpact: string;
  painScale: number;
  medicalAlerts: string[];
  patientName: string;
  patientAge: number;
  patientGender: '남성' | '여성';
  // 상세 복용 약물 및 알러지 (치과의사 필수 사전 확인)
  medicationsList?: string[];
  otherMedicationText?: string;
  drugAllergies?: string[];
  otherAllergyText?: string;
  // 전문 상세 문진 필드 (치과의사/치위생사 & NHS Mouth Care Matters 관점)
  specificSymptomDetail?: string;
  dentureStatus?: 'none' | 'partial' | 'complete';
  dentureWornAtNight?: boolean;
  dentureComplaint?: string;
  implantStatus?: 'none' | 'completed' | 'in_progress';
  implantComplaint?: string;
  cancerTreatmentHistory?: 'none' | 'radiation_past' | 'radiation_current' | 'chemo_other';
  hasDryMouth?: boolean;
  dryMouthSeverity?: 'mild' | 'severe';
  ulcerDuration?: 'none' | 'under_2weeks' | 'over_2weeks';
  hasWhiteOrRedPatches?: boolean;
  hasAngularCheilitis?: boolean;
  hasSevereToothMobility?: boolean;
  hasDysphagia?: boolean;
  hasAcidReflux?: boolean;
  hasHeartCondition?: boolean;
}) {
  const {
    areaType,
    selectedAreas = [],
    selectedSymptoms = [],
    locationId,
    onsetPeriod,
    painType,
    dailyImpact,
    painScale,
    medicalAlerts,
    patientName,
    patientAge,
    patientGender,
    medicationsList = [],
    otherMedicationText = '',
    drugAllergies = [],
    otherAllergyText = '',
    specificSymptomDetail,
    dentureStatus = 'none',
    dentureWornAtNight = false,
    dentureComplaint,
    implantStatus = 'none',
    implantComplaint,
    cancerTreatmentHistory = 'none',
    hasDryMouth = false,
    dryMouthSeverity,
    ulcerDuration = 'none',
    hasWhiteOrRedPatches = false,
    hasAngularCheilitis = false,
    hasSevereToothMobility = false,
    hasDysphagia = false,
    hasAcidReflux = false,
    hasHeartCondition = false,
  } = params;

  const locObj = QUADRANT_LOCATIONS.find((q) => q.id === locationId) || QUADRANT_LOCATIONS[0];
  const areaObj = AREA_CATEGORIES.find((a) => a.id === areaType) || AREA_CATEGORIES[0];

  let recommendedDept = '보존과';
  let suspectedConditions: string[] = [];
  let triageLevel: TriageLevel = 'Routine';

  // 1. 부위 및 주호소에 따른 진료과 및 의심 질환
  if (areaType === 'teeth') {
    recommendedDept = '보존과';
    if (painType.includes('밤새 욱신') || painScale >= 4) {
      suspectedConditions = ['급성 치수염 (Acute Pulpitis)', '치근단 농양 의증 (Periapical Abscess)'];
      triageLevel = 'Urgent';
    } else if (painType.includes('씹을 때') || (specificSymptomDetail && specificSymptomDetail.includes('깜짝'))) {
      suspectedConditions = ['치아 균열 증후군 (Cracked Tooth Syndrome)', '치수괴사 의증'];
    } else {
      suspectedConditions = ['치경부 마모증 (Cervical Abrasion)', '치아 우식증 (Dental Caries)'];
    }
  } else if (areaType === 'gum') {
    recommendedDept = '치주과';
    if (dailyImpact.includes('진통제') || painScale >= 4) {
      suspectedConditions = ['급성 치주농양 (Acute Periodontal Abscess)', '진행성 만성 치주염'];
      triageLevel = 'Urgent';
    } else {
      suspectedConditions = ['만성 치주염 (Chronic Periodontitis)', '치은염 (Gingivitis)'];
    }
  } else if (areaType === 'implant_denture') {
    recommendedDept = '보철과';
    suspectedConditions = ['보철물 적합 불량 (Prosthesis Looseness)', '임플란트 주위염 (Peri-implantitis)', '의치성 궤양/구내염 (Denture Stomatitis)'];
    if (painScale >= 4) triageLevel = 'Urgent';
  } else if (areaType === 'unknown_general') {
    recommendedDept = '구강내과';
    suspectedConditions = ['원인 불명성 치통 / 복합 구강 안면 통증 의증', '정밀 방사선 및 종합 구강 검진 요망'];
    if (painScale >= 4) triageLevel = 'Urgent';
  } else {
    // jaw_mucosa
    if (ulcerDuration === 'over_2weeks') {
      recommendedDept = '구강외과';
      suspectedConditions = ['2주 이상 지속 구강 궤양 (구강암/편평세포암 감별 생검 요망)', '점막 질환'];
      triageLevel = 'Urgent';
    } else if (painType.includes('사랑니') || (onsetPeriod.includes('갑자기') && painScale >= 4)) {
      recommendedDept = '구강외과';
      suspectedConditions = ['지치주위염 (Pericoronitis)', '치성 안면부 봉와직염 의증'];
      triageLevel = 'Urgent';
    } else {
      recommendedDept = '구강내과';
      suspectedConditions = ['턱관절 장애 (TMD)', '구강건조증 및 점막 질환', '재발성 아프타성 구내염'];
    }
  }

  // 1-1. 복수 증상 및 모름 옵션 감별 합성 (Multi-symptom synthesis)
  if (painType.includes('모름') || painType.includes('불분명')) {
    if (!suspectedConditions.some((c) => c.includes('불명'))) {
      suspectedConditions.push('통증 양상 특정 불가 (원인 불분명 / 둔한 비특이적 통증)');
    }
  }
  if (painType.includes('씹을 때') && !suspectedConditions.some((c) => c.includes('균열'))) {
    suspectedConditions.push('치아 균열 증후군 (Cracked Tooth Syndrome)');
  }
  if ((painType.includes('찬물') || painType.includes('시림') || painType.includes('뜨거운')) && !suspectedConditions.some((c) => c.includes('치수염') || c.includes('마모증'))) {
    suspectedConditions.push('가역성 치수염 / 치경부 마모증');
  }
  if ((painType.includes('욱신') || painType.includes('가만히 있어도')) && !suspectedConditions.some((c) => c.includes('급성 치수염'))) {
    suspectedConditions.unshift('급성 치수염 (Acute Pulpitis)');
    triageLevel = 'Urgent';
  }
  if ((painType.includes('피가 남') || painType.includes('붓고')) && !suspectedConditions.some((c) => c.includes('치주'))) {
    suspectedConditions.push('진행성 치주염 / 치은염');
  }
  if ((painType.includes('흔들') || painType.includes('들뜬')) && !suspectedConditions.some((c) => c.includes('동요도'))) {
    suspectedConditions.push('치아 동요도 및 치조골 소실 의증');
  }
  if ((painType.includes('턱관절') || painType.includes('벌리기')) && !suspectedConditions.some((c) => c.includes('턱관절'))) {
    suspectedConditions.push('턱관절 장애 (TMD) 및 저작근 긴장');
  }

  // 2. NHS Mouth Care Matters 연조직 소견 감별 추가
  if (ulcerDuration === 'over_2weeks' && !suspectedConditions.some((c) => c.includes('구강암'))) {
    suspectedConditions.unshift('2주 이상 비치유성 구강궤양 (구강암 악성 감별 의무 대상)');
  }
  if (hasWhiteOrRedPatches) {
    suspectedConditions.push('구강 칸디다증(Oral Thrush) 및 백반증/홍반증 의증');
  }
  if (hasAngularCheilitis) {
    suspectedConditions.push('구각구순염(Angular Cheilitis, 칸디다/포도상구균 복합감염)');
  }
  if (hasSevereToothMobility) {
    suspectedConditions.push('중증 치아 동요도 (3도 이상, 기도 흡인 고위험)');
  }
  if (dentureWornAtNight) {
    suspectedConditions.push('야간 의치 착용성 구내염(Denture Stomatitis)');
  }
  if (hasAcidReflux) {
    suspectedConditions.push('위식도 역류성 치아 부식증(Dental Erosion)');
  }

  // 3. 종양학/방사선 치료 이력 및 구강건조증에 따른 감별 진단
  const isRadiationPatient = cancerTreatmentHistory === 'radiation_past' || cancerTreatmentHistory === 'radiation_current';
  if (isRadiationPatient || hasDryMouth) {
    suspectedConditions.unshift('방사선성 다발성 치아우식 (Radiation Caries)');
    suspectedConditions.push('타액선 기능저하성 구강건조증 (Xerostomia)');
    if (cancerTreatmentHistory === 'radiation_current') {
      triageLevel = 'Urgent';
    }
  }

  // 4. 보철 이력에 따른 감별 진단 보강
  if (dentureStatus !== 'none') {
    const dentureTypeStr = dentureStatus === 'complete' ? '완전틀니' : '부분틀니';
    if (!suspectedConditions.some((c) => c.includes('의치'))) {
      suspectedConditions.push(`${dentureTypeStr} 조직 적합 불량 및 압박 궤양`);
    }
  }
  if (implantStatus !== 'none') {
    if (!suspectedConditions.some((c) => c.includes('임플란트'))) {
      suspectedConditions.push('임플란트 주위염(Peri-implantitis) 감별 요망');
    }
  }

  // 5. 응급 상태 판정
  if ((painScale === 5 && dailyImpact.includes('진통제')) || (ulcerDuration === 'over_2weeks' && painScale >= 4)) {
    triageLevel = 'Emergency';
  }

  // 6. NHS Mouth Care Matters 위험군 분류 (MCM Risk Level)
  let mcmRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  const isHighRisk =
    cancerTreatmentHistory !== 'none' ||
    hasDryMouth ||
    hasDysphagia ||
    hasSevereToothMobility ||
    ulcerDuration === 'over_2weeks' ||
    medicalAlerts.includes('골다공증 약/주사') ||
    medicalAlerts.includes('아스피린/항응고제') ||
    hasHeartCondition ||
    painScale >= 4;

  const isMediumRisk =
    dentureStatus !== 'none' ||
    dentureWornAtNight ||
    hasWhiteOrRedPatches ||
    hasAngularCheilitis ||
    hasAcidReflux ||
    ulcerDuration === 'under_2weeks' ||
    painScale >= 3;

  if (isHighRisk) {
    mcmRiskLevel = 'HIGH';
  } else if (isMediumRisk) {
    mcmRiskLevel = 'MEDIUM';
  } else {
    mcmRiskLevel = 'LOW';
  }

  // 7. 의료진용 임상 주의 경고문 (Clinical Red Flags)
  const redFlags: string[] = [];

  if (ulcerDuration === 'over_2weeks') {
    redFlags.push('🚨 [구강암 의심 - 2주 규칙 (NHS 2-Week Wait)] 구강 내 궤양이 14일 이상 지속됨. 치과/구강악안면외과 조직생검(Biopsy) 및 악성종양(SCC) 감별 진료 의무.');
  }

  if (hasSevereToothMobility) {
    redFlags.push('🚨 [기도 흡인/질식 고위험 (Aspiration Risk)] 중증 치아 동요도 관찰됨. 진료 중 치아 탈락 및 기도 흡인에 의한 흡인성 폐렴/질식 위험. 안전 고정 또는 즉각 발치 고려.');
  }

  if (hasDysphagia) {
    redFlags.push('⚠️ [연하장애 및 흡인성 폐렴 (HAP) 주의] 물/식사 시 잦은 사레들림. 구강 세균 흡인에 따른 병원성 폐렴 고위험군. 진료 시 90도 직립 자세 유지, 흡인기(Suction) 필수, 비발포성 SLS-free 치약 사용.');
  }

  if (hasHeartCondition || medicalAlerts.includes('심장판막/심내막염')) {
    redFlags.push('🚨 [감염성 심내막염(IE) 예방 권고] 인공 심장 판막 또는 심내막염 기왕력. 치석제거, 발치 등 균혈증 유발 침습 시술 전 예방적 항생제(Amoxicillin 2g) 투약 필수 확인.');
  }

  if (cancerTreatmentHistory === 'radiation_current') {
    redFlags.push('🚨 [방사선 치료 진행 중] 두경부/전신 방사선 치료 중인 환자. 타액선 파괴로 인한 극심한 구강건조 및 다발성 치경부 우식(Radiation Caries) 호발. 발치 시 방사선성 악골괴사(ORN) 절대 주의.');
  } else if (cancerTreatmentHistory === 'radiation_past') {
    redFlags.push('⚠️ [방사선 치료 과거 이력] 방사선 기왕력 환자. 침샘 위축 및 구강건조증 호발. 침습적 외과 술식 시 턱뼈 괴사(ORN) 위험도 평가 및 비침습적 보존치료 권장.');
  } else if (cancerTreatmentHistory === 'chemo_other') {
    redFlags.push('⚠️ [항암화학요법 기왕력] 면역 저하 및 구강점막염(Mucositis), 혈소판/백혈구 수치(ANC) 확인 요망.');
  }

  // --- 🚨 약물 알러지 및 과민반응 (Drug Allergies - 최우선 처방 주의) ---
  const allAllergies = [...drugAllergies];
  if (otherAllergyText && otherAllergyText.trim()) {
    allAllergies.push(`기타: ${otherAllergyText.trim()}`);
  }

  if (allAllergies.some((a) => a.includes('항생제') || a.includes('페니실린') || a.includes('세파'))) {
    redFlags.unshift('🚨 [항생제 알러지 - 페니실린/세파 처방 금기] 환자에게 페니실린·아목시실린 계열 알러지(두드러기/호흡곤란/쇼크 위험) 있음. Amoxicillin/Augmentin 처방 절대 금기. Clindamycin 또는 Macrolide(아지스로마이신)로 대체 처방 필수.');
  }
  if (allAllergies.some((a) => a.includes('소염진통제') || a.includes('NSAIDs') || a.includes('아스피린 알러지'))) {
    redFlags.unshift('🚨 [소염진통제(NSAIDs) 알러지 주의] NSAIDs 복용 시 혈관부종 및 아스피린 유발 천식(AERD) 위험. Ibuprofen, Loxoprofen 등 NSAIDs 처방 금기, 아세트아미노펜(타이레놀) 단독 또는 마약성 진통제 대체 권고.');
  }
  if (allAllergies.some((a) => a.includes('국소마취제') || a.includes('리도카인'))) {
    redFlags.unshift('🚨 [치과 국소마취제(리도카인) 이상반응] 과거 치과 마취 주사 후 극심한 어지러움, 혈압 급변, 심계항진, 실신 경험. 혈관수축제(에피네프린) 무첨가 Mepivacaine 검토 및 천천히 소량 주입, V/S 모니터링.');
  }
  if (otherAllergyText && otherAllergyText.trim()) {
    redFlags.push(`🚨 [특이 약물 알러지/부작용 자필 보고] 환자 기재: "${otherAllergyText.trim()}". 원내 처방 및 시술 전 성분 교차검증 필수.`);
  }

  // --- 💊 복용 약물 임상 관리 ---
  const allMeds = [...medicalAlerts, ...medicationsList];
  if (otherMedicationText && otherMedicationText.trim()) {
    allMeds.push(`기타약물: ${otherMedicationText.trim()}`);
  }

  if (allMeds.some((m) => m.includes('골다공증') || m.includes('프롤리아') || m.includes('비스포스포네이트'))) {
    redFlags.push('⚠️ [MRONJ 고위험군 - 턱뼈괴사 주의] 골다공증 약물(비스포스포네이트 경구약 또는 6개월 프롤리아 주사) 투약 환자. 발치 및 임플란트 시 약물관련 악골괴사(MRONJ) 주의. 투약 기간(3년 이상 시 고위험) 및 주사 차수 확인.');
  }

  if (allMeds.some((m) => m.includes('아스피린') || m.includes('항응고제') || m.includes('와파린') || m.includes('NOAC') || m.includes('플라빅스'))) {
    redFlags.push('🩸 [출혈 경향 주의 - 항응고제 복용] 아스피린/와파린/NOAC/플라빅스 복용 환자. 침습 시술(발치/치주소파/수술) 시 지혈 지연 주의. 내과 주치의 협진 및 지혈 처치(압박/Surgicel) 준비.');
  }

  if (allMeds.some((m) => m.includes('스테로이드') || m.includes('면역억제제'))) {
    redFlags.push('⚠️ [면역 저하 및 부신 위기 주의] 장기 스테로이드 또는 면역억제제 복용 환자. 스트레스성 부신 기능 저하 및 술후 감염 취약. 예방적 항생제 및 수술 스트레스 완화 프로토콜.');
  }

  if (allMeds.some((m) => m.includes('신장') || m.includes('투석') || m.includes('신부전'))) {
    redFlags.push('⚠️ [신장질환 및 혈액투석 환자] 투석 당일에는 헤파린 투여로 출혈 위험(투석 다음 날 치과 치료 권장). 신장 배설 약물(진통제/항생제) 용량 감량.');
  }

  if (allMeds.some((m) => m.includes('고혈압') || m.includes('심혈관'))) {
    redFlags.push('💓 [심혈관/고혈압 관리] 고혈압 또는 심혈관 약물 복용 중. 에피네프린 함유 마취제 사용 시 혈압 상승 모니터링.');
  }

  if (allMeds.some((m) => m.includes('당뇨') || m.includes('인슐린'))) {
    redFlags.push('🩸 [당뇨 관리] 혈당 조절제 복용 중. 오전 진료 시 식사 여부(저혈당 쇼크 예방) 및 술후 감염 예방 주의.');
  }

  if (otherMedicationText && otherMedicationText.trim()) {
    redFlags.push(`💊 [기타 복용 약물 자필 보고] 환자 기재: "${otherMedicationText.trim()}". 상호작용 검토 요망.`);
  }

  if (dentureWornAtNight) {
    redFlags.push('⚠️ [의치성 구내염 주의 (Denture Stomatitis)] 환자가 틀니를 밤에 착용하고 취침함. 구개 점막의 지속적 압박 및 칸디다 곰팡이 감염 위험. 야간 탈착 및 0.2% 클로르헥시딘 의치 소독 지도 필요.');
  }

  if (hasWhiteOrRedPatches) {
    redFlags.push('⚠️ [구강 칸디다증(Oral Thrush) 의심] 백태 및 홍반 관찰. Nystatin 가글 또는 Miconazole 젤 국소 항진균 치료 권고.');
  }

  if (hasAngularCheilitis) {
    redFlags.push('⚠️ [구각구순염(Angular Cheilitis)] 입꼬리 갈라짐 및 짓무름. 틀니 교합고경(VD) 저하 또는 칸디다/황색포도상구균 감염. 항진균/항생 연고 및 보습제 처방 권고.');
  }

  if (hasDryMouth) {
    redFlags.push(`💧 [구강건조증(Xerostomia)] 자각 증상: ${dryMouthSeverity === 'severe' ? '중증 (물 없이 식사 불가)' : '경도'}. 타액 완충능 소실로 급속 치근 우식증 주의.`);
  }

  // 8. NHS MCM 기반 의료진 처방 및 간호/치위생 권고사항 (Clinical Recommendations)
  const clinicalRecommendations: string[] = [
    '🪥 [칫솔질 지도] 소두 연모(Small-headed soft brush)를 사용하여 45도 각도로 치경부 플라크 기계적 제거 지도.',
  ];

  if (hasDryMouth || isRadiationPatient || hasDysphagia) {
    clinicalRecommendations.push('🫧 [치약 선택] 거품을 유발해 점막을 건조시키고 흡인 위험을 높이는 SLS(소듐라우릴설페이트) 성분이 없는 비발포성(SLS-free) 무자극 치약 권고.');
  }

  if (hasDryMouth || isRadiationPatient || areaType === 'teeth') {
    clinicalRecommendations.push('🛡️ [고농도 불소 처방] 우식 예방을 위해 일반 치약(1000~1450ppm)보다 강력한 고농도 불소치약(2800ppm 또는 5000ppm Duraphat) 처방 권고. 양치 후 물로 헹구지 않고 뱉어내기만 하도록 안내 (Spit not rinse).');
  }

  if (hasDryMouth || isRadiationPatient) {
    clinicalRecommendations.push('💧 [구강보습 처방] 점막 찰과상 방지를 위해 수용성 구강보습제(Dry mouth gel / Oralieve, Biotene 등)를 뺨, 혀, 입천장에 2~3시간 간격으로 부드럽게 마사지 도포.');
  }

  if (dentureStatus !== 'none') {
    clinicalRecommendations.push('🧽 [틀니 위생 수칙] 밤에는 반드시 틀니를 빼서 전용 의치 보관함(Denture pot)에 보관하도록 지도. 세척 시 연마제가 든 일반 치약 대신 무향 액체비누나 전용 세정제 사용.');
    if (dentureWornAtNight || hasWhiteOrRedPatches) {
      clinicalRecommendations.push('💊 [의치 소독] 의치성 칸디다 감염 관리를 위해 0.2% 클로르헥시딘 액에 틀니를 15분간 침적 소독 후 철저히 헹구어 착용하도록 지도.');
    }
  }

  clinicalRecommendations.push('⚠️ [안전 가이드] 질식 사고 및 기도 폐쇄 위험이 있는 폼 스왑(스펀지 면봉) 사용을 절대 금지함 (NHS MCM 환자안전경보).');

  if (painType.includes('모름') || painType.includes('불분명') || areaType === 'unknown_general') {
    clinicalRecommendations.push('🔍 [통증 원인 정밀 감별] 환자가 증상 유발 요인이나 위치를 특정하지 못함. 전체 치아 타진 검사(Percussion), 냉온 온도검사(Vitality test), 파노라마 방사선 촬영을 시행하여 잠재적 치수·치주 병소를 정밀 감별할 것.');
  }

  // 9. 의료진용 표준 C.C (Chief Complaint)
  let chiefComplaint = `"${locObj.koreanName} 부위 ${painType} (통증 ${painScale}/5, ${onsetPeriod})"`;
  if (specificSymptomDetail) {
    chiefComplaint += ` [세부: ${specificSymptomDetail}]`;
  }

  // 10. 의료진용 현병력 및 기왕력 (HPI & History)
  const prostheticHistStr: string[] = [];
  if (dentureStatus !== 'none') {
    prostheticHistStr.push(`${dentureStatus === 'complete' ? '완전틀니' : '부분틀니'} 착용 (야간착용: ${dentureWornAtNight ? '예 - 위험' : '아니오 - 양호'})${dentureComplaint ? ` [호소: ${dentureComplaint}]` : ''}`);
  }
  if (implantStatus !== 'none') {
    prostheticHistStr.push(`임플란트 ${implantStatus === 'completed' ? '시술 완료' : '치료 진행 중'}${implantComplaint ? ` [호소: ${implantComplaint}]` : ''}`);
  }
  if (prostheticHistStr.length === 0) {
    prostheticHistStr.push('보철/임플란트 없음');
  }

  const redFlagSummary = redFlags.length > 0 ? redFlags.join('\n') : '특이 임상 경고 없음 (Low Risk)';

  const allMedNames = Array.from(new Set([...medicalAlerts, ...medicationsList]));
  if (otherMedicationText && otherMedicationText.trim()) {
    allMedNames.push(`기타직접기재: ${otherMedicationText.trim()}`);
  }
  const medsSummaryStr = allMedNames.length > 0 ? allMedNames.join(', ') : '복용 약물 없음';

  const allergySummaryStr = allAllergies.length > 0
    ? `🚨 알러지 주의 (${allAllergies.join(', ')})`
    : '특이 약물 알러지 없음 (안전)';

  const historyOfPresentIllness = `[환자정보] 만 ${patientAge}세 ${patientGender}.
[발병시기 및 주호소] ${onsetPeriod} 시작. ${locObj.title} 부위에 "${painType}" 호소. NRS 통증 척도 ${painScale}/5점.
[일상 및 저작장애] ${dailyImpact}${specificSymptomDetail ? `, 심층증상: ${specificSymptomDetail}` : ''}.
[NHS MCM 위험 등급] ${mcmRiskLevel === 'HIGH' ? '🔴 고위험군 (HIGH RISK)' : mcmRiskLevel === 'MEDIUM' ? '🟡 중위험군 (MEDIUM RISK)' : '🟢 저위험군 (LOW RISK)'}.
[연조직 및 점막 소견] 궤양: ${ulcerDuration === 'over_2weeks' ? '⚠️ 2주 이상 지속(악성 의증)' : ulcerDuration === 'under_2weeks' ? '10일 이내 아프타성 궤양' : '없음'}, 백태/홍반: ${hasWhiteOrRedPatches ? '유(칸디다 의심)' : '무'}, 구각구순염: ${hasAngularCheilitis ? '유' : '무'}, 동요도: ${hasSevereToothMobility ? '⚠️ 중증 흔들림(기도흡인 위험)' : '경미/정상'}.
[삼킴 및 타액 상태] 연하곤란(사레): ${hasDysphagia ? '⚠️ 유(흡인성 폐렴 주의)' : '정상'}, 구강건조: ${hasDryMouth ? `유(${dryMouthSeverity === 'severe' ? '중증-식사어려움' : '경증'})` : '정상'}.
[치과 보철 이력] ${prostheticHistStr.join(', ')}.
[복용 약물 문진] ${medsSummaryStr}.
[약물 알러지 및 부작용] ${allergySummaryStr}.
[전신질환 및 종양학] 심장판막: ${hasHeartCondition ? '⚠️ 유(심내막염 주의)' : '무'}, 위식도역류: ${hasAcidReflux ? '유' : '무'}, 종양학 기왕력: ${cancerTreatmentHistory === 'none' ? '없음' : cancerTreatmentHistory}.
[임상 필독 경고문]
${redFlagSummary}`;

  // --- 병원 6대 체어 및 진료실 자동 매칭 알고리즘 ---
  let assignedChairUnit: DentalChairUnit;

  // 1) 중앙수술실(특진실) - 특진체어
  // 대상: 임플란트 식립 수술, 고난이도 악안면 외과 수술, 2주 이상 궤양(악성 의증 조직생검), 심한 골다공증약 MRONJ 위험 수술
  if (
    ulcerDuration === 'over_2weeks' ||
    (implantStatus !== 'none' && (painScale >= 4 || (implantComplaint && (implantComplaint.includes('흔들') || implantComplaint.includes('통증'))))) ||
    suspectedConditions.some((c) => c.includes('임플란트') || c.includes('생검') || c.includes('편평세포암') || c.includes('악성')) ||
    (medicalAlerts.includes('골다공증 약/주사') && painScale >= 4 && painType.includes('사랑니'))
  ) {
    assignedChairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === 'chair_special')!;
    recommendedDept = '구강외과';
  }
  // 2) 제 2 진료실 - 4번 체어: 매복 사랑니 발치 및 소치조골 수술 전문 유닛 (서지컬 모터, 피에조 본 수술기, 무영등)
  else if (
    painType.includes('사랑니') ||
    suspectedConditions.some((c) => c.includes('사랑니') || c.includes('지치주위염') || c.includes('발치') || c.includes('소수술'))
  ) {
    assignedChairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === 'chair_4')!;
    recommendedDept = '구강외과';
  }
  // 3) 제 2 진료실 - 3번 체어: 미세 현미경 신경치료 및 근관 성형 유닛 (Zeiss 미세수술현미경, Ni-Ti 전동 엔도 모터)
  else if (
    painType.includes('밤새 욱신') ||
    painType.includes('가만히 있어도') ||
    painScale >= 4 ||
    suspectedConditions.some((c) => c.includes('치수염') || c.includes('근관') || c.includes('신경치료') || c.includes('치근단'))
  ) {
    assignedChairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === 'chair_3')!;
    recommendedDept = '보존과';
  }
  // 4) 제 1 진료실 - 2번 체어: 디지털 보철 프렙 및 인상 채득 특화 유닛 (3D 구강스캐너 트리오스, CAD/CAM 연동)
  else if (
    areaType === 'implant_denture' ||
    dentureStatus !== 'none' ||
    painType.includes('씹을 때') ||
    suspectedConditions.some((c) => c.includes('보철') || c.includes('틀니') || c.includes('의치') || c.includes('균열') || c.includes('크라운'))
  ) {
    assignedChairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === 'chair_2')!;
    recommendedDept = '보철과';
  }
  // 5) 제 3 진료실 - 5번 체어: 턱관절 장애, 안면 통증, 구강점막질환 전용 유닛 (저출력 레이저, TENS, 구강건조 측정기)
  else if (
    areaType === 'jaw_mucosa' ||
    areaType === 'unknown_general' ||
    hasDryMouth ||
    hasWhiteOrRedPatches ||
    hasAngularCheilitis ||
    suspectedConditions.some((c) => c.includes('턱관절') || c.includes('안면') || c.includes('점막') || c.includes('구내염') || c.includes('건조증'))
  ) {
    assignedChairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === 'chair_5')!;
    recommendedDept = '구강내과';
  }
  // 6) 제 1 진료실 - 1번 체어: 일반 치과 보존 및 치주 치료 전용 유닛 (초음파 스케일러, 광중합기, 구강내 카메라)
  else {
    assignedChairUnit = HOSPITAL_CHAIR_UNITS.find((c) => c.id === 'chair_1')!;
    recommendedDept = areaType === 'gum' ? '치주과' : '보존과';
  }

  // 표준 5대 진료과 ('보존과', '치주과', '구강외과', '구강내과', '보철과') 확정
  recommendedDept = normalizeEmrDepartment(recommendedDept);

  const assignedChair = assignedChairUnit.chairName;
  const clinicRoomName = assignedChairUnit.clinicRoom;
  const routeInfo = DEPARTMENT_ROUTES[clinicRoomName] || DEPARTMENT_ROUTES[recommendedDept] || DEPARTMENT_ROUTES['제 1 진료실'];
  const recommendedRoom = `${routeInfo.floor} ${clinicRoomName}`;

  // 11. 환자 친화적 음성/텍스트 안내 메시지
  let seniorPatientMessage = `${patientName} 님, 예진이 완료되었습니다. 증상 맞춤 장비가 구비된 [${clinicRoomName} ${assignedChair}] (${assignedChairUnit.unitPurpose})으로 배정되었습니다. 1층 로비 엘리베이터를 타시고 바닥의 ${routeInfo.lineColorName}을 따라오시면 편안하게 진료실을 찾으실 수 있습니다.`;
  if (isRadiationPatient || hasDryMouth) {
    seniorPatientMessage += ' 방사선 치료 이력 및 입마름 증상이 의사 선생님께 전달되어 세심하게 진료할 예정입니다.';
  } else if (ulcerDuration === 'over_2weeks') {
    seniorPatientMessage += ' 2주 이상 지속된 입안 상처를 정밀하게 확인하도록 의무기록에 기재되었습니다.';
  }

  // 12. 환자 안심 주의사항
  const careInstructions = [
    '통증 부위를 혀나 손가락으로 무리하게 건드리거나 세게 누르지 마세요.',
    '진료 전 너무 뜨겁거나 차가운 물, 단단한 음식은 피하시는 것이 좋습니다.',
  ];

  if (isRadiationPatient || hasDryMouth) {
    careInstructions.push('★ 방사선 치료 이력 및 입마름이 있으시므로, 의료진에게 치료 시기를 말씀해 주세요. 침이 부족하면 충치가 빠르게 번질 수 있어 특별 예방 관리가 진행됩니다.');
  }

  if (ulcerDuration === 'over_2weeks') {
    careInstructions.push('★ 2주 이상 낫지 않는 상처는 치과의사 선생님이 직접 점막 조직을 정밀 검사합니다. 상처 부위를 칫솔로 문지르지 마세요.');
  }

  if (medicalAlerts.includes('골다공증 약/주사')) {
    careInstructions.push('★ 골다공증 약이나 주사 치료를 받고 계시므로, 발치 전 반드시 담당 의사 선생님께 복용 기간을 알려주세요.');
  } else if (medicalAlerts.includes('아스피린/항응고제')) {
    careInstructions.push('★ 아스피린/항응고제 복용 중이시므로, 피가 멎는 데 시간이 걸릴 수 있어 발치나 잇몸 치료 전 의료진에게 꼭 말씀해 주세요.');
  }

  if (allAllergies.length > 0) {
    careInstructions.push(`★ [약물 알러지 주의] 입력하신 약물 알러지(${allAllergies.join(', ')})가 전자의무기록에 빨간색 경고로 등록되었습니다. 처방 및 주사 전 의료진이 다시 한번 확인합니다.`);
  }

  if (dentureWornAtNight) {
    careInstructions.push('💡 틀니는 밤에 빼고 주무셔야 잇몸이 쉬고 곰팡이 균(구내염)을 예방할 수 있습니다.');
  }

  careInstructions.push(`진료실 앞 모니터에서 환자분의 성함이 호출되면 [${clinicRoomName} ${assignedChair}]으로 입장해 주십시오. (전용 설비: ${assignedChairUnit.equippedTools.join(', ')})`);

  return {
    recommendedDepartment: recommendedDept,
    recommendedRoom,
    assignedChair,
    assignedChairUnit,
    triageLevel,
    mcmRiskLevel,
    suspectedConditions,
    chiefComplaint,
    historyOfPresentIllness,
    redFlags,
    clinicalRecommendations,
    seniorPatientMessage,
    careInstructions,
    routeInfo,
  };
}


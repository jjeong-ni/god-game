// 사주팔자(四柱八字) 계산 — 년·월·일·시주
//
// - 일주: 율리우스 적일(JDN) 기반 표준 공식 (JDN + 49) mod 60, 0 = 甲子.
//   검증 기준일: 1900-01-01 = 甲戌, 2000-01-01 = 戊午, 2023-01-01 = 己未 (한국천문연구원 음양력 변환).
//   일진은 한국 표준시 자정에 바뀐다(만세력 관례).
// - 년주: 입춘(태양 황경 315°) 기준. 입춘 전 출생은 전년도 간지.
// - 월주: 12절(節) 기준. 태양 황경으로 직접 판정(입춘 315° = 寅月 시작, 30°마다 한 달).
//   월간은 년간 기준 월두법(甲己년 → 丙寅월 …).
// - 시주: 2시간 단위 12지. 시간은 일간 기준 시두법(甲己일 → 甲子시 …).
//
// 태양 황경은 Meeus, Astronomical Algorithms 25장 저정밀 공식(오차 약 0.01° ≈ 15분 이내).
// 출생 시각은 KST(UTC+9)로 본다. 1954~61년 UTC+8:30 시기와 서머타임은 보정하지 않는다
// (절입일 당일 몇 시간 차이에서만 영향).

export type Ohaeng = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 甲乙=木, 丙丁=火, 戊己=土, 庚辛=金, 壬癸=水
export const STEM_OH: Ohaeng[] = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
// 子水 丑土 寅木 卯木 辰土 巳火 午火 未土 申金 酉金 戌土 亥水
export const BRANCH_OH: Ohaeng[] = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

export type Pillar = { stem: number; branch: number };

export type Saju = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  /** 입춘 기준 사주 년도 (띠 판정용) */
  sajuYear: number;
};

export function pillarName(p: Pillar): string {
  return STEMS[p.stem] + BRANCHES[p.branch];
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

function fromCycle(idx: number): Pillar {
  return { stem: mod(idx, 10), branch: mod(idx, 12) };
}

/** 그레고리력 날짜의 율리우스 적일(정오 기준 정수) */
export function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/** 일주 (60갑자 인덱스 기반) */
export function dayPillar(year: number, month: number, day: number): Pillar {
  return fromCycle(julianDayNumber(year, month, day) + 49);
}

/** 태양의 겉보기 황경(도). jd = 율리우스일(UT, 소수 포함) */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const rad = Math.PI / 180;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * rad;
  return mod(L0 + C - 0.00569 - 0.00478 * Math.sin(omega), 360);
}

/** KST 날짜·시각 → 율리우스일(UT) */
export function kstToJd(year: number, month: number, day: number, hour: number, minute = 0): number {
  return julianDayNumber(year, month, day) - 0.5 + (hour - 9 + minute / 60) / 24;
}

/** 12지 시(時) 인덱스(0=子) → 대표 시각(시진 가운데, KST). 子時 = 23:30~01:30 → 00:30 */
export function hourBranchMidpoint(branch: number): number {
  return mod(branch * 2 + 0.5, 24);
}

/** KST 시각(0~23.99) → 시지 인덱스. 한국 관례대로 30분 늦춘 경계(子時 23:30~01:29) */
export function hourBranchOf(hour: number, minute = 0): number {
  return mod(Math.floor((hour + minute / 60 + 0.5) / 2), 12);
}

/**
 * 사주 계산.
 * @param hourBranch 시지 인덱스(0=子 … 11=亥). 모르면 null — 이때 절기 경계 판정은 정오 기준.
 */
export function computeSaju(year: number, month: number, day: number, hourBranch: number | null = null): Saju {
  const h = hourBranch === null ? 12 : hourBranchMidpoint(hourBranch);
  const lon = sunLongitude(kstToJd(year, month, day, h));

  // 년주 — 1~2월이고 아직 황경 315°(입춘) 전이면 전년도
  const beforeLichun = month <= 2 && lon >= 240 && lon < 315;
  const sajuYear = beforeLichun ? year - 1 : year;
  const yearP = fromCycle(sajuYear - 4); // 1984 = 甲子

  // 월주 — 입춘(315°)부터 30°마다 寅卯辰…
  const monthOffset = Math.floor(mod(lon - 315, 360) / 30); // 0 = 寅月
  const firstMonthStem = mod((yearP.stem % 5) * 2 + 2, 10); // 월두법
  const monthP: Pillar = { stem: mod(firstMonthStem + monthOffset, 10), branch: mod(2 + monthOffset, 12) };

  const dayP = dayPillar(year, month, day);

  // 시주 — 시두법: 子時 천간 = (일간 % 5) * 2
  const hourP: Pillar | null = hourBranch === null ? null : {
    stem: mod((dayP.stem % 5) * 2 + hourBranch, 10),
    branch: hourBranch,
  };

  return { year: yearP, month: monthP, day: dayP, hour: hourP, sajuYear };
}

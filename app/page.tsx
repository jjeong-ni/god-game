'use client';
import { useState, useCallback, useRef, useEffect, type CSSProperties } from 'react';
import { GodIdle, GodPanic, GodDazed } from './god-illustrations';

const MAX = 5;

const INGREDIENTS = [
  { id: 'sleep',     emoji: '😴', name: '잠만자',      desc: '알람 5개는 기본 세팅',     category: 'rest' },
  { id: 'food',      emoji: '🍔', name: '먹방러',      desc: '배고프면 사람이 변함',     category: 'food' },
  { id: 'phone',     emoji: '📱', name: '폰 중독',     desc: '자기 전 5분이 2시간',      category: 'digital' },
  { id: 'emotional', emoji: '😭', name: '감수성 폭발', desc: '광고 보다 울기 가능',      category: 'emotion' },
  { id: 'stubborn',  emoji: '😤', name: '고집 한 스푼',desc: '내가 맞다, 무조건',        category: 'personality' },
  { id: 'overthink', emoji: '🤔', name: '생각 과부하', desc: '자기 전 뇌 OFF 불가',     category: 'personality' },
  { id: 'talkative', emoji: '🗣️', name: '수다쟁이',   desc: '침묵이 너무 불편해',      category: 'social' },
  { id: 'gaming',    emoji: '🎮', name: '게임광',       desc: '한 판만... 또 한 판만',   category: 'digital' },
  { id: 'night',     emoji: '🌙', name: '야행성',       desc: '새벽 2시가 골든타임',     category: 'rest' },
  { id: 'perfect',   emoji: '✨', name: '완벽주의',     desc: '각도기 들고 살기',         category: 'personality' },
  { id: 'broke',     emoji: '💸', name: '텅장 체질',   desc: '월급은 잠깐 들렀다 감',   category: 'daily' },
  { id: 'coffee',    emoji: '☕', name: '카페인 의존',  desc: '커피 없인 아침 없어',     category: 'food' },
  { id: 'laugh',     emoji: '😂', name: '웃음보 터짐', desc: '혼자 웃다 이상한 사람',   category: 'emotion' },
  { id: 'clumsy',    emoji: '🫨', name: '덜렁거림',    desc: '핸드폰 또 어딨지',         category: 'daily' },
  { id: 'fitness',   emoji: '💪', name: '운동귀신',     desc: '쉬는 날도 헬스장',         category: 'energy' },
  { id: 'sensitive', emoji: '🥺', name: '눈치 레이더', desc: '공기 읽기 전문가',         category: 'social' },
] as const;

type Ingredient = (typeof INGREDIENTS)[number];

const CAT_NAME: Record<string, string> = {
  rest: '☁️ 여유/수면', food: '🍽️ 먹방', digital: '💻 디지털',
  emotion: '💕 감성', personality: '🧠 성격', social: '🌸 사회성',
  daily: '📦 일상', energy: '⚡ 에너지',
};
const CAT_COLOR: Record<string, string> = {
  rest: '#7BB8F5', food: '#F5A83C', digital: '#5CB85C',
  emotion: '#E56FAF', personality: '#9B7FE0', social: '#3CB8A3',
  daily: '#E0A83C', energy: '#FF6B2F',
};

const PERSONALITY_TYPES = [
  { id: 'sleepy',    emoji: '😪', title: '인간 슬리핑 뷰티',   subtitle: '이불 밖은 위험해 타입',    dominant: ['rest'],
    desc: '수면이야말로 최고의 힐링. 이불 밖은 위험하다는 걸 온몸으로 아는 분. 그 여유로운 에너지로 주변에 평화를 가져다준다.',
    tags: ['#이불밖은위험해', '#수면전문가', '#알람5개기본'] },
  { id: 'digital',   emoji: '🤖', title: '디지털 좀비',         subtitle: '충전 없으면 방전 타입',    dominant: ['digital'],
    desc: '핸드폰과 한 몸. 화면이 꺼지면 불안한 현대인. 알고리즘이 나를 나보다 더 잘 알고, 충전기를 잃으면 존재 자체가 흔들린다.',
    tags: ['#폰없으면못살아', '#디지털원주민', '#충전기인생'] },
  { id: 'emotional', emoji: '🎭', title: 'K-드라마 주인공',     subtitle: '감성 MAX 공감 천재',       dominant: ['emotion'],
    desc: '광고 보다 울고, 드라마 보다 울고, 그러면서도 웃음이 끊이지 않는다. 공감 능력이 탑재된 인간 감성 충만 FULL.',
    tags: ['#감수성폭발', '#공감의신', '#눈물도웃음도많아'] },
  { id: 'thinker',   emoji: '🧠', title: '뇌가 쉬지를 않아',   subtitle: '생각 고구마 줄기 타입',    dominant: ['personality'],
    desc: '자기 전 5년 후 걱정하고, 완벽하게 하려다 시작을 못 하기도. 하지만 그 꼼꼼함이 어떤 일이든 특별하게 만든다.',
    tags: ['#생각과부하', '#완벽주의자', '#고집도있어'] },
  { id: 'foodie',    emoji: '🍴', title: '먹방의 신',           subtitle: '배 부르면 행복 타입',      dominant: ['food'],
    desc: '먹는 게 낙이고, 먹는 게 힐링. 맛집 리스트 항상 업데이트 중. 배고프면 사람이 변한다는 걸 주변이 먼저 안다.',
    tags: ['#먹방러', '#음식이행복', '#배고프면주의'] },
  { id: 'social',    emoji: '🌟', title: '분위기 메이커',       subtitle: '침묵이 불편한 타입',       dominant: ['social'],
    desc: '어디서나 웃음을 만드는 분위기 메이커. 침묵은 채워야 하고, 새로운 사람 만나는 게 즐겁다. 모임의 태양 같은 존재.',
    tags: ['#수다쟁이', '#분위기메이커', '#인싸본능'] },
  { id: 'energy',    emoji: '⚡', title: '에너자이저 폭발형',  subtitle: '에너지가 어디서 나와 타입', dominant: ['energy'],
    desc: '쉬는 날도 헬스장, 체력이 넘쳐서 주변이 지친다. 하지만 그 에너지로 목표 달성율 200%. 액션 타입.',
    tags: ['#운동귀신', '#에너지폭발', '#몸이먼저움직여'] },
  { id: 'daily',     emoji: '😅', title: '일상의 생존러',       subtitle: '카페인으로 버티는 타입',   dominant: ['daily'],
    desc: '텅장이지만 오늘도 행복하고, 덜렁거리지만 어떻게든 해낸다. 커피 없이는 아침이 없는 현실형 인간의 정석.',
    tags: ['#텅장러', '#카페인의존', '#그래도살아남기'] },
  { id: 'chaotic',   emoji: '🎰', title: '신도 포기한 조합',    subtitle: '예측 불가 혼돈 천재',      dominant: [] as string[],
    desc: '도무지 한 마디로 정의 불가. 다양한 매력이 폭발적으로 섞여 신도 손 놓은 독특한 존재. 만나는 사람마다 다른 나를 발견하게 된다.',
    tags: ['#반전매력', '#예측불가', '#나도나를모름'] },
];

// 유형별 참여 통계 (사주 기반 시뮬레이션)
const TYPE_STATS: Record<string, number> = {
  digital:   24,
  thinker:   19,
  sleepy:    15,
  emotional: 13,
  foodie:    10,
  social:     8,
  daily:      6,
  energy:     3,
  chaotic:    2,
};
const TOTAL_PLAYERS = 14293;

function getPersonalityType(items: Ingredient[]) {
  const counts: Record<string, number> = {};
  items.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topCount = sorted[0]?.[1] ?? 0;
  // 모든 재료가 다른 카테고리일 때만 카오스
  if (topCount === 1) return PERSONALITY_TYPES.find(p => p.id === 'chaotic')!;
  const topCat = sorted[0][0];
  return PERSONALITY_TYPES.find(p => p.dominant.includes(topCat))
    ?? PERSONALITY_TYPES.find(p => p.id === 'chaotic')!;
}

function getCategoryBreakdown(items: Ingredient[]) {
  const counts: Record<string, number> = {};
  items.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
  return Object.entries(counts)
    .map(([cat, count]) => ({ cat, count, pct: Math.round((count / items.length) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count);
}

// ── Supabase 실시간 통계 ──
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

async function recordResult(typeId: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/game_results`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ type_id: typeId }),
    });
  } catch { /* silent */ }
}

async function fetchLiveStats(): Promise<{ stats: Record<string, number>; total: number } | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/game_results?select=type_id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return null;
    const data: { type_id: string }[] = await res.json();
    const total = data.length;
    if (total === 0) return null;

    const counts: Record<string, number> = {};
    for (const { type_id } of data) counts[type_id] = (counts[type_id] ?? 0) + 1;

    const stats: Record<string, number> = {};
    for (const pt of PERSONALITY_TYPES) stats[pt.id] = Math.round(((counts[pt.id] ?? 0) / total) * 100);

    const sum = Object.values(stats).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (top) stats[top] = (stats[top] ?? 0) + (100 - sum);
    }
    return { stats, total };
  } catch { return null; }
}

// ── 결과 이미지 생성 (Canvas) ──
async function generateShareImage(
  userName: string,
  personality: { emoji: string; title: string; subtitle: string; tags: readonly string[] },
  selected: Ingredient[],
  accidentals: Set<string>,
  emptyBottles: Set<string>,
): Promise<Blob> {
  const W = 1080;
  const P = 72;
  const SYS = "-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

  // 1pass: chip row count for height calculation
  const tmp = document.createElement('canvas');
  tmp.width = W; tmp.height = 10;
  const mc = tmp.getContext('2d')!;
  mc.font = `700 28px ${SYS}`;
  let cx = P, chipRows = 1;
  for (const ing of selected) {
    const label = `${ing.emoji} ${ing.name}${emptyBottles.has(ing.id) ? ' 💧' : accidentals.has(ing.id) ? ' 💥' : ''}`;
    const cw = mc.measureText(label).width + 36;
    if (cx + cw > W - P) { cx = P; chipRows++; }
    cx += cw + 10;
  }
  const bd = getCategoryBreakdown(selected);
  const H = P + 54 + 28 + 54 + 36 + 300 + 44 + 44 + 20 + chipRows * 78 + 40 + 44 + 20 + bd.length * 46 + 30 + 36 + 18 + 44 + P + 40;

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W * 0.8, H);
  bg.addColorStop(0, '#0D0820'); bg.addColorStop(0.5, '#1A0D38'); bg.addColorStop(1, '#0D1830');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Decorative stars
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '22px serif'; ctx.textAlign = 'center';
  [[60,100],[1020,150],[80,550],[1000,520],[190,H-120],[890,H-100]].forEach(([sx,sy]) => ctx.fillText('✦', sx, sy));

  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  };

  let y = P;

  // Badge
  ctx.font = `700 28px ${SYS}`;
  const bw = ctx.measureText('🧬 밈 게임').width + 48;
  rr((W-bw)/2, y, bw, 54, 27);
  ctx.fillStyle = 'rgba(155,127,224,0.25)'; ctx.fill();
  ctx.strokeStyle = 'rgba(155,127,224,0.5)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#C4ADFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🧬 밈 게임', W/2, y+27);
  y += 54+28;

  // Title
  ctx.font = `900 44px ${SYS}`; ctx.fillStyle = '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(`신이 ${userName}을(를) 만들 때 🧪`, W/2, y+44);
  y += 54+36;

  // Type card
  rr(P, y, W-P*2, 300, 44);
  const cg = ctx.createLinearGradient(P, y, W-P, y+300);
  cg.addColorStop(0, 'rgba(155,127,224,0.3)'); cg.addColorStop(1, 'rgba(107,181,255,0.15)');
  ctx.fillStyle = cg; ctx.fill();
  ctx.strokeStyle = 'rgba(155,127,224,0.4)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = '130px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(personality.emoji, W/2, y+148);
  ctx.font = `900 50px ${SYS}`; ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(personality.title, W/2, y+232);
  ctx.font = `400 30px ${SYS}`; ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText(`"${personality.subtitle}"`, W/2, y+278);
  y += 300+44;

  // Ingredients header
  ctx.font = `700 32px ${SYS}`; ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('📦 신이 넣은 재료', P, y+32);
  y += 44+20;

  // Ingredient chips
  let chipX = P;
  ctx.font = `700 28px ${SYS}`;
  for (const ing of selected) {
    const isAcc = accidentals.has(ing.id), isEmpty = emptyBottles.has(ing.id);
    const label = `${ing.emoji} ${ing.name}${isEmpty ? ' 💧' : isAcc ? ' 💥' : ''}`;
    const cw = ctx.measureText(label).width + 36;
    if (chipX + cw > W - P) { chipX = P; y += 78; }
    rr(chipX, y, cw, 64, 16);
    ctx.fillStyle = isEmpty ? 'rgba(100,180,255,0.12)' : isAcc ? 'rgba(255,80,80,0.15)' : 'rgba(155,127,224,0.22)'; ctx.fill();
    ctx.strokeStyle = isEmpty ? 'rgba(100,180,255,0.35)' : isAcc ? 'rgba(255,80,80,0.35)' : 'rgba(155,127,224,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, chipX+18, y+32);
    chipX += cw+10;
  }
  y += 64+40;

  // Breakdown header
  ctx.font = `700 32px ${SYS}`; ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('📊 성분 비율 분석', P, y+32);
  y += 44+20;

  const btW = W - P*2 - 170 - 70;
  for (const b of bd) {
    ctx.font = `400 26px ${SYS}`; ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(CAT_NAME[b.cat] ?? b.cat, P, y+10);
    rr(P+170, y, btW, 20, 10); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    const fw = Math.max((btW * b.pct) / 100, 18);
    rr(P+170, y, fw, 20, 10); ctx.fillStyle = CAT_COLOR[b.cat] ?? '#9B7FE0'; ctx.fill();
    ctx.font = `700 24px ${SYS}`; ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.textAlign = 'right'; ctx.fillText(`${b.pct}%`, W-P, y+10);
    y += 20+26;
  }
  y += 30;

  // Tags & hashtag
  ctx.font = `600 28px ${SYS}`; ctx.fillStyle = '#D4BFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(personality.tags.join('  '), W/2, y+28); y += 36+18;
  ctx.font = `900 36px ${SYS}`; ctx.fillStyle = '#fff';
  ctx.fillText('#신이나를만들때', W/2, y+36); y += 44;

  // Bottom
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(P, H-64, W-P*2, 1);
  ctx.font = `400 24px ${SYS}`; ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('신이나를만들때.vercel.app', W/2, H-36);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('blob')), 'image/png')
  );
}

// ── 사주명리학(四柱命理學) 오행(五行) 시스템 ──
type Ohaeng = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

// 12지신 — 년지(年支) 오행을 별도 배열로 관리
const ZODIAC = [
  { name: '원숭이', emoji: '🐒' },  // year%12=0  申(金/metal)
  { name: '닭',     emoji: '🐓' },  // year%12=1  酉(金/metal)
  { name: '개',     emoji: '🐕' },  // year%12=2  戌(土/earth)
  { name: '돼지',   emoji: '🐷' },  // year%12=3  亥(水/water)
  { name: '쥐',     emoji: '🐭' },  // year%12=4  子(水/water)
  { name: '소',     emoji: '🐄' },  // year%12=5  丑(土/earth)
  { name: '호랑이', emoji: '🐯' },  // year%12=6  寅(木/wood)
  { name: '토끼',   emoji: '🐰' },  // year%12=7  卯(木/wood)
  { name: '용',     emoji: '🐉' },  // year%12=8  辰(土/earth)
  { name: '뱀',     emoji: '🐍' },  // year%12=9  巳(火/fire)
  { name: '말',     emoji: '🐴' },  // year%12=10 午(火/fire)
  { name: '양',     emoji: '🐑' },  // year%12=11 未(土/earth)
] as const;

// 년도 끝자리(year%10) → 년간(年干) 오행
// 0=庚(金), 1=辛(金), 2=壬(水), 3=癸(水), 4=甲(木), 5=乙(木), 6=丙(火), 7=丁(火), 8=戊(土), 9=己(土)
const YEAR_STEM_OH: Ohaeng[] = ['metal','metal','water','water','wood','wood','fire','fire','earth','earth'];

// year%12 → 년지(年支) 오행 (위 ZODIAC 순서와 일치)
const YEAR_BRANCH_OH: Ohaeng[] = ['metal','metal','earth','water','water','earth','wood','wood','earth','fire','fire','earth'];

// 월(1~12) → 월지(月支) 오행 (절기 기준 근사)
// 1=丑(土), 2=寅(木), 3=卯(木), 4=辰(土), 5=巳(火), 6=午(火), 7=未(土), 8=申(金), 9=酉(金), 10=戌(土), 11=亥(水), 12=子(水)
const MONTH_OH: Ohaeng[] = ['earth','wood','wood','earth','fire','fire','earth','metal','metal','earth','water','water'];

// 율리우스 적일수(Julian Day Number) — 정확한 일간(日干) 계산용
function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}
// 기준: 2023-01-01 = 甲子日 (60갑자 위치 0번)
const JDN_GABJIA = 2459946;

// 일간(日干) 오행 — 60갑자 천간 기준 정확 계산
// 甲乙=木, 丙丁=火, 戊己=土, 庚辛=金, 壬癸=水
function getDayOhaeng(year: number, month: number, day: number): Ohaeng {
  const pos = ((julianDayNumber(year, month, day) - JDN_GABJIA) % 60 + 60) % 60;
  const DAY_STEM_OH: Ohaeng[] = ['wood','wood','fire','fire','earth','earth','metal','metal','water','water'];
  return DAY_STEM_OH[pos % 10];
}

// 재료 → 오행 배속(配屬) — 명리학적 특성에 따라
const ING_OHAENG: Record<string, Ohaeng> = {
  sleep:     'water',  // 수면 — 水: 정적(靜的), 내면
  food:      'fire',   // 먹방 — 火: 왕성한 식욕
  phone:     'metal',  // 폰중독 — 金: 기술, 정밀
  emotional: 'wood',   // 감수성 — 木: 인자함, 감성
  stubborn:  'earth',  // 고집 — 土: 안정, 불변
  overthink: 'earth',  // 생각과부하 — 土: 신중, 고집
  talkative: 'wood',   // 수다쟁이 — 木: 사교, 생동감
  gaming:    'metal',  // 게임 — 金: 집중, 기술
  night:     'water',  // 야행성 — 水: 음(陰), 깊은 밤
  perfect:   'metal',  // 완벽주의 — 金: 의리, 예리함
  broke:     'earth',  // 텅장 — 土: 재물의 흐름
  coffee:    'fire',   // 카페인 — 火: 자극, 활력
  laugh:     'wood',   // 웃음보 — 木: 밝은 양기(陽氣)
  clumsy:    'earth',  // 덜렁거림 — 土: 땅 기운 과다
  fitness:   'fire',   // 운동귀신 — 火: 활동, 에너지
  sensitive: 'water',  // 눈치레이더 — 水: 지(智), 감지력
};

// 오행 표시용
const OHAENG_KR: Record<Ohaeng, string> = {
  wood:  '목(木) 🌳', fire:  '화(火) 🔥', earth: '토(土) 🌏',
  metal: '금(金) ⚙️', water: '수(水) 💧',
};
const OHAENG_COLOR: Record<Ohaeng, string> = {
  wood: '#5CB85C', fire: '#FF6B2F', earth: '#F5A83C', metal: '#A0B8FF', water: '#5BB8FF',
};

// ── 재료 명리학 배속 설명 ──
const ING_TOOLTIP: Record<string, string> = {
  sleep:     '水(수) — 깊은 밤처럼 고요하고 내면 지향적. 수면은 陰中之陰의 상태.',
  food:      '火(화) — 왕성한 소화력과 욕구. 불꽃처럼 타오르는 식욕의 기(氣).',
  phone:     '金(금) — 정밀한 기술과 집중력. 금속처럼 날카롭고 정확한 디지털 세계.',
  emotional: '木(목) — 봄나무처럼 감성과 인자함이 넘침. 성장과 생명력의 에너지.',
  stubborn:  '土(토) — 대지처럼 굳건하고 변하지 않음. 안정을 추구하는 고집.',
  overthink: '土(토) — 토는 신중함의 기운. 모든 걸 담으려다 생각이 무거워짐.',
  talkative: '木(목) — 나무가 가지를 뻗듯 활발히 퍼져나가는 사교의 기운.',
  gaming:    '金(금) — 쇠처럼 집중하고 갈고닦는 기술 지향. 집념의 에너지.',
  night:     '水(수) — 水는 陰의 기운. 밤이 깊을수록 수기(水氣)가 왕성해짐.',
  perfect:   '金(금) — 금은 예리하고 결벽증이 있음. 흠 없이 깎아낸 금속.',
  broke:     '土(토) — 토는 재물(財)의 흐름과 연결. 土가 약하면 돈이 흘러나감.',
  coffee:    '火(화) — 커피의 자극과 열기는 火의 기운. 활력을 불어넣는 에너지.',
  laugh:     '木(목) — 봄의 생동감. 목기(木氣)는 밝고 양기(陽氣)가 넘쳐흐름.',
  clumsy:    '土(토) — 土가 과하면 묵직해서 몸이 둔해짐. 땅 기운 과부하.',
  fitness:   '火(화) — 운동은 火의 활동 에너지. 심장과 체온을 높이는 양기(陽氣).',
  sensitive: '水(수) — 水는 智慧와 감지력. 물처럼 모든 것을 감지하는 능력.',
};

function getAccidentReason(ingId: string, dominant: Ohaeng): string {
  const ingOh = ING_OHAENG[ingId];
  if (!ingOh) return '';
  const KR: Record<Ohaeng, string> = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  const d = KR[dominant], i = KR[ingOh];
  if (ingOh === dominant)
    return `사주에 ${d} 기운이 넘쳐흘러 같은 기운의 재료까지 끌어당겼어요. 동기상응(同氣相應)!`;
  // dominant generates ingOh
  if (OH_SHENG[dominant] === ingOh)
    return `사주의 ${d}이 ${i}를 낳는 상생(相生) 관계 — 넘치는 기운이 실수를 불렀어요.`;
  // ingOh generates dominant
  if (OH_SHENG[ingOh] === dominant)
    return `${i}이 ${d}을 도와주려다 과하게 흘러들어왔어요. 상생이 지나치면 실수가 돼요.`;
  // dominant controls ingOh
  if (OH_KE[dominant] === ingOh)
    return `사주의 ${d}이 ${i}를 극(克)하려다 오히려 과잉 반응 — 억누를수록 더 튀어나와요.`;
  // ingOh controls dominant
  return `${i}이 ${d}을 극(克)하는 관계 — 억눌린 기운이 실수처럼 폭발했어요.`;
}

// ── 오행 궁합(相生·相剋) ──
const OH_SHENG: Record<Ohaeng, Ohaeng> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};
const OH_KE: Record<Ohaeng, Ohaeng> = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
};
interface CompatResult { score: number; relation: string; emoji: string; title: string; desc: string }

function getCompat(myOh: Ohaeng, theirOh: Ohaeng): CompatResult {
  if (myOh === theirOh) return {
    score: 65, relation: '비화(比和)', emoji: '🤝', title: '동기상구 — 통하는 사이',
    desc: '같은 오행끼리라 말 안 해도 서로 이해. 너무 비슷해서 가끔 답답할 수도. 경쟁보단 협력이 맞는 조합.',
  };
  if (OH_SHENG[myOh] === theirOh) return {
    score: 87, relation: '상생(我生他)', emoji: '💕', title: '내가 상대를 키워주는 사이',
    desc: '내가 상대를 성장시켜 주는 조합. 베푸는 게 자연스럽고 상대는 의지함. 따뜻하지만 가끔 지칠 수 있어.',
  };
  if (OH_SHENG[theirOh] === myOh) return {
    score: 83, relation: '상생(他生我)', emoji: '💕', title: '상대가 나를 돌봐주는 사이',
    desc: '상대가 나를 성장시켜 주는 조합. 든든한 파트너. 받는 만큼 감사함을 충분히 표현해 줘.',
  };
  if (OH_KE[myOh] === theirOh) return {
    score: 42, relation: '상극(我克他)', emoji: '⚡', title: '내가 상대를 제압하는 관계',
    desc: '나도 모르게 상대를 압박하는 기운. 의도는 없어도 상대가 부담스러울 수 있어. 배려를 의식적으로 더 해보자.',
  };
  return {
    score: 45, relation: '상극(他克我)', emoji: '⚡', title: '상대가 나를 제압하는 관계',
    desc: '상대 기운이 나를 답답하게 만들기도. 이 긴장감이 나를 단련시키는 면도 있어. 이겨내면 크게 성장해.',
  };
}

// ── 오행 레이더 차트 ──
const RADAR_ORDER: Ohaeng[] = ['wood', 'fire', 'earth', 'metal', 'water'];
const RADAR_LABELS = ['목(木)🌳', '화(火)🔥', '토(土)🌏', '금(金)⚙️', '수(水)💧'];
const RADAR_CX = 110, RADAR_CY = 105, RADAR_R = 72;
const RADAR_ANGLES = RADAR_ORDER.map((_, i) => (i * 72 - 90) * (Math.PI / 180));

function OhaengRadar({ scores }: { scores: Record<Ohaeng, number> }) {
  const maxScore = Math.max(...Object.values(scores), 1);
  const bgPts = (ratio: number) =>
    RADAR_ANGLES.map(a => `${RADAR_CX + Math.cos(a) * ratio * RADAR_R},${RADAR_CY + Math.sin(a) * ratio * RADAR_R}`).join(' ');
  const scorePts = RADAR_ANGLES.map((a, i) => {
    const v = (scores[RADAR_ORDER[i]] / maxScore) * RADAR_R;
    return `${RADAR_CX + Math.cos(a) * v},${RADAR_CY + Math.sin(a) * v}`;
  }).join(' ');
  return (
    <svg width={220} height={210} viewBox="0 0 220 210">
      {[0.25, 0.5, 0.75, 1].map(ratio => (
        <polygon key={ratio} points={bgPts(ratio)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      ))}
      {RADAR_ANGLES.map((a, i) => (
        <line key={i} x1={RADAR_CX} y1={RADAR_CY}
          x2={RADAR_CX + Math.cos(a) * RADAR_R} y2={RADAR_CY + Math.sin(a) * RADAR_R}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      ))}
      <polygon points={scorePts} fill="rgba(155,127,224,0.28)" stroke="#9B7FE0" strokeWidth="2"/>
      {RADAR_ORDER.map((oh, i) => {
        const v = (scores[oh] / maxScore) * RADAR_R;
        return <circle key={oh} cx={RADAR_CX + Math.cos(RADAR_ANGLES[i]) * v} cy={RADAR_CY + Math.sin(RADAR_ANGLES[i]) * v} r={4} fill={OHAENG_COLOR[oh]}/>;
      })}
      {RADAR_LABELS.map((label, i) => (
        <text key={i}
          x={RADAR_CX + Math.cos(RADAR_ANGLES[i]) * (RADAR_R + 20)}
          y={RADAR_CY + Math.sin(RADAR_ANGLES[i]) * (RADAR_R + 20)}
          textAnchor="middle" dominantBaseline="middle"
          fill={OHAENG_COLOR[RADAR_ORDER[i]]} fontSize="11" fontWeight="700">
          {label}
        </text>
      ))}
    </svg>
  );
}

function seededRandom(seed: number) {
  let s = seed ^ 0x1A2B3C4D;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function selectBySaju(year: number, month: number, day: number, hourOh: Ohaeng | null = null): {
  ings: Ingredient[];
  zodiac: { name: string; emoji: string };
  dominantOh: Ohaeng;
  ohScores: Record<Ohaeng, number>;
} {
  const zodiacIdx = ((year % 12) + 12) % 12;
  const zodiac = ZODIAC[zodiacIdx];
  const seed = year * 10000 + month * 100 + day;
  const rand = seededRandom(seed);

  // 사주 4~5기둥 오행 집계: 년간, 년지, 월지, 일간, (시지)
  const ohScores: Record<Ohaeng, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  ohScores[YEAR_STEM_OH[((year % 10) + 10) % 10]]++;
  ohScores[YEAR_BRANCH_OH[zodiacIdx]]++;
  ohScores[MONTH_OH[month - 1]]++;
  ohScores[getDayOhaeng(year, month, day)]++;
  if (hourOh) ohScores[hourOh]++;

  // 오행 순위 (동점이면 알파벳 순으로 안정적 정렬)
  const ohRanked = (Object.entries(ohScores) as [Ohaeng, number][])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const dominantOh = ohRanked[0][0];
  const secondOh   = ohRanked[1][0];

  const ingsByOh = (oh: Ohaeng) =>
    (INGREDIENTS as readonly Ingredient[]).filter(i => ING_OHAENG[i.id] === oh);

  const shufflePick = (arr: readonly Ingredient[], n: number): Ingredient[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };

  // 주도 오행 2개 + 보조 오행 1개 → 사주 성질이 결과에 강하게 반영
  const core = [
    ...shufflePick(ingsByOh(dominantOh), 2),
    ...shufflePick(ingsByOh(secondOh), 1),
  ];
  const seen = new Set(core.map(i => i.id));
  const remaining = (INGREDIENTS as readonly Ingredient[]).filter(i => !seen.has(i.id));
  const ings = [...core, ...shufflePick(remaining, MAX - core.length)].slice(0, MAX);

  return { ings, zodiac: { name: zodiac.name, emoji: zodiac.emoji }, dominantOh, ohScores };
}

function buildPouringSequence(base: Ingredient[]): { ing: Ingredient; isAccident: boolean; isEmpty: boolean }[] {
  const seq: { ing: Ingredient; isAccident: boolean; isEmpty: boolean }[] = [];
  const used = new Set<string>();
  for (const ing of base) {
    if (seq.length >= MAX) break;
    const isEmpty = Math.random() < 0.2;
    seq.push({ ing, isAccident: false, isEmpty });
    used.add(ing.id);
    if (seq.length < MAX && Math.random() < 0.3) {
      const avail = (INGREDIENTS as readonly Ingredient[]).filter(i => !used.has(i.id));
      if (avail.length > 0) {
        const acc = avail[Math.floor(Math.random() * avail.length)];
        seq.push({ ing: acc, isAccident: true, isEmpty: Math.random() < 0.2 });
        used.add(acc.id);
      }
    }
  }
  return seq;
}

// 시주(時柱) — 태어난 시간대별 지지(地支) 오행
const TIME_SLOTS: { label: string; range: string; emoji: string; oh: Ohaeng }[] = [
  { label: '자정·새벽', range: '밤 11시 ~ 새벽 3시',  emoji: '🌙', oh: 'water' },
  { label: '새벽·아침', range: '새벽 3시 ~ 오전 7시', emoji: '🌅', oh: 'wood'  },
  { label: '오전',       range: '오전 7시 ~ 오전 11시',emoji: '☀️', oh: 'fire'  },
  { label: '낮',         range: '오전 11시 ~ 오후 3시',emoji: '🌞', oh: 'fire'  },
  { label: '오후',       range: '오후 3시 ~ 오후 7시', emoji: '🌤️', oh: 'metal' },
  { label: '저녁·밤',   range: '오후 7시 ~ 밤 11시',  emoji: '🌃', oh: 'earth' },
];

const PARTICLE_EMOJIS = ['✨', '💥', '🌟', '⚡', '🔥', '💨', '🫧', '💫'];
const STARS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5 + 3) % 97}%`,
  top: `${(i * 7 + 2) % 55}%`,
  delay: `${(i * 0.37) % 3}s`,
  size: `${7 + (i % 3) * 4}px`,
  dur: `${2 + (i % 4) * 0.8}s`,
}));

const GOD_SELECT_LINES = [
  (n: string, ing: string, sp: number) => `${n}은... ${ing}... ${sp}스푼을 넣겠노라.`,
  (n: string, ing: string, sp: number) => `어디보자... ${ing}... ${sp}스푼이 딱이겠군.`,
  (n: string, ing: string, sp: number) => `흠흠... ${ing}... ${sp}스푼이로다.`,
  (n: string, ing: string, sp: number) => `${n}에게는 ${ing}... ${sp}스푼이 필요해.`,
  (n: string, ing: string, sp: number) => `오호... ${ing}... ${sp}스푼으로 가보자고.`,
];

const GOD_ACCIDENT_LINES = [
  (ing: string) => `앗!! 실수로 ${ing}도 들어갔다!!`,
  (ing: string) => `어?! ${ing}이 미끄러져서...!!`,
  (ing: string) => `잠깐?! ${ing}까지 들어가버렸어!!`,
  (ing: string) => `으아!! ${ing}는 안 됐는데!!`,
];

const GOD_EMPTY_LINES = [
  (ing: string) => `어... ${ing}... 거의 다 됐는데... 한두방울만...`,
  (ing: string) => `이게 빈 병이잖아?! ${ing}... 바닥 긁어서 넣겠노라...`,
  (ing: string) => `흔들흔들... ${ing}... 한방울 겨우 남았군...`,
  (ing: string) => `${ing}는... 재고가 없군... 아 그래도 조금은 있네?!`,
];

const ACCIDENT_SHOUT = ['앗!!', '어?!', '이게왜?!', '으아아!!'];

type Phase = 'intro' | 'naming' | 'pouring' | 'explosion' | 'result';

export default function GodGame() {
  const [phase, setPhase] = useState<Phase>('intro');

  // naming 단계 (1~5)
  const [namingStep, setNamingStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [dayInput, setDayInput] = useState('');
  const [zodiacInfo, setZodiacInfo] = useState<{ name: string; emoji: string } | null>(null);
  const [saJuIngs, setSaJuIngs] = useState<Ingredient[]>([]);

  const [selected, setSelected] = useState<Ingredient[]>([]);
  const selectedRef = useRef<Ingredient[]>([]);
  const [accidentals, setAccidentals] = useState<Set<string>>(new Set());
  const [emptyBottles, setEmptyBottles] = useState<Set<string>>(new Set());

  const [godSvgType, setGodSvgType] = useState<'idle' | 'panic' | 'dazed'>('idle');
  const [godClass, setGodClass] = useState('');
  const [beakerClass, setBeakerClass] = useState('');
  const [flashClass, setFlashClass] = useState('');
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; px: number; py: number; emoji: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dominantOh, setDominantOh] = useState<Ohaeng | null>(null);
  const [hourOh, setHourOh] = useState<Ohaeng | null>(null);
  const [ohScores, setOhScores] = useState<Record<Ohaeng, number> | null>(null);
  const [tooltipIngId, setTooltipIngId] = useState<string | null>(null);
  const [showCompat, setShowCompat] = useState(false);
  const [compatYear, setCompatYear] = useState('');
  const [compatMonth, setCompatMonth] = useState('');
  const [compatDay, setCompatDay] = useState('');
  const [compatResult, setCompatResult] = useState<CompatResult | null>(null);
  const [compatZodiac, setCompatZodiac] = useState<{ name: string; emoji: string; oh: Ohaeng } | null>(null);
  const [liveStats, setLiveStats] = useState<Record<string, number>>(TYPE_STATS);
  const [liveTotalPlayers, setLiveTotalPlayers] = useState(TOTAL_PLAYERS);
  const [statsLoading, setStatsLoading] = useState(false);
  const hasRecordedRef = useRef(false);

  const [linkCopied, setLinkCopied] = useState(false);
  const [godSpeech, setGodSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [accidentFlash, setAccidentFlash] = useState<string | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    timers.current = [];
  }, []);

  const showGodSpeech = useCallback((text: string, duration = 4000) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    setGodSpeech(text);
    setShowSpeech(true);
    speechTimerRef.current = setTimeout(() => setShowSpeech(false), duration);
  }, []);

  // URL 파라미터로 생년월일 + 이름 자동 입력 (?b=19901215&n=지수)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const b = params.get('b');
    const n = params.get('n');
    if (b && /^\d{8}$/.test(b)) {
      const y = b.slice(0, 4);
      const m = b.slice(4, 6).replace(/^0/, '');
      const d = b.slice(6, 8).replace(/^0/, '');
      setYearInput(y);
      setMonthInput(m);
      setDayInput(d);
    }
    if (n) setNameInput(decodeURIComponent(n));
  }, []);

  useEffect(() => {
    if (phase !== 'naming') return;
    const t = setTimeout(() => setNamingStep(1), 400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (!showResult || hasRecordedRef.current) return;
    hasRecordedRef.current = true;
    const pt = getPersonalityType(selected);
    recordResult(pt.id);
    setStatsLoading(true);
    fetchLiveStats().then(data => {
      if (data) { setLiveStats(data.stats); setLiveTotalPlayers(data.total); }
      setStatsLoading(false);
    });
  }, [showResult, selected]);

  // 이름 확인
  const handleNameSubmit = useCallback(() => {
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    setNamingStep(2);
  }, [nameInput]);

  // step2 ▶ 다음
  const handleStep2Next = useCallback(() => {
    setNamingStep(3);
  }, []);

  // 생년월일 확인 → step4 (시주 선택)
  const handleDateSubmit = useCallback(() => {
    const y = parseInt(yearInput);
    const m = parseInt(monthInput);
    const d = parseInt(dayInput);
    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2030) return;
    setNamingStep(4);
  }, [yearInput, monthInput, dayInput]);

  // 시주 선택 → 사주 계산 → step5
  const handleTimeSubmit = useCallback((oh: Ohaeng | null) => {
    const y = parseInt(yearInput);
    const m = parseInt(monthInput);
    const d = parseInt(dayInput);
    setHourOh(oh);
    const { ings, zodiac, dominantOh: doh, ohScores: scores } = selectBySaju(y, m, d, oh);
    setZodiacInfo(zodiac);
    setSaJuIngs(ings);
    setDominantOh(doh);
    setOhScores(scores);
    setNamingStep(5);
  }, [yearInput, monthInput, dayInput]);

  // 네 → step6
  const handleYes = useCallback(() => {
    setNamingStep(6);
  }, []);

  // 아니오 → step1 (이름부터 다시)
  const handleNo = useCallback(() => {
    setNameInput('');
    setUserName('');
    setYearInput('');
    setMonthInput('');
    setDayInput('');
    setZodiacInfo(null);
    setSaJuIngs([]);
    setDominantOh(null);
    setHourOh(null);
    setNamingStep(1);
  }, []);

  const triggerExplosion = useCallback(() => {
    setGodSvgType('panic');
    setGodClass('god-shake');
    setBeakerClass('beaker-bubble');
    setFlashClass('flash-anim');
    showGodSpeech('으아아아아악!!', 1600);

    const ps = PARTICLE_EMOJIS.map((emoji, id) => ({
      id, emoji,
      px: Math.cos((id / 8) * Math.PI * 2) * 130,
      py: Math.sin((id / 8) * Math.PI * 2) * 110,
    }));
    setParticles(ps);

    const t1 = setTimeout(() => setGodClass('god-dazed'), 1300);
    const t2 = setTimeout(() => { setBeakerClass(''); setFlashClass(''); }, 900);
    const t3 = setTimeout(() => setParticles([]), 1400);
    const t4 = setTimeout(() => { setGodSvgType('dazed'); setGodClass(''); }, 1600);
    const t5 = setTimeout(() => setShowResult(true), 2900);
    timers.current.push(t1, t2, t3, t4, t5);
  }, [showGodSpeech]);

  // step5 ▶ 운명의 재료 보기 → pouring 시작
  const startPouring = useCallback(() => {
    const sequence = buildPouringSequence(saJuIngs);
    setPhase('pouring');

    let delay = 500;
    sequence.forEach((item, idx) => {
      const t = setTimeout(() => {
        const spoons = Math.floor(Math.random() * 10) + 1;

        if (item.isEmpty && item.isAccident) {
          // 사고 + 빈 병 (드문 경우)
          const shout = ACCIDENT_SHOUT[Math.floor(Math.random() * ACCIDENT_SHOUT.length)];
          setAccidentFlash(`${shout}\n${item.ing.emoji}${item.ing.name}... 그나마 한방울!`);
          const cf = setTimeout(() => setAccidentFlash(null), 1800);
          timers.current.push(cf);
          const lineIdx = Math.floor(Math.random() * GOD_EMPTY_LINES.length);
          showGodSpeech(GOD_EMPTY_LINES[lineIdx](`${item.ing.emoji}${item.ing.name}`), 4000);
          setGodClass('god-shake');
          const gt = setTimeout(() => setGodClass(''), 1600);
          timers.current.push(gt);
          setAccidentals(prev => new Set([...prev, item.ing.id]));
          setEmptyBottles(prev => new Set([...prev, item.ing.id]));
        } else if (item.isAccident) {
          const shout = ACCIDENT_SHOUT[Math.floor(Math.random() * ACCIDENT_SHOUT.length)];
          setAccidentFlash(`${shout}\n실수로 ${item.ing.emoji}${item.ing.name}가 들어갔다!!`);
          const cf = setTimeout(() => setAccidentFlash(null), 1800);
          timers.current.push(cf);
          const accIdx = Math.floor(Math.random() * GOD_ACCIDENT_LINES.length);
          showGodSpeech(GOD_ACCIDENT_LINES[accIdx](`${item.ing.emoji}${item.ing.name}`), 4000);
          setAccidentals(prev => new Set([...prev, item.ing.id]));
        } else if (item.isEmpty) {
          const lineIdx = Math.floor(Math.random() * GOD_EMPTY_LINES.length);
          showGodSpeech(GOD_EMPTY_LINES[lineIdx](`${item.ing.emoji}${item.ing.name}`), 4000);
          setGodClass('god-shake');
          const gt = setTimeout(() => setGodClass(''), 1600);
          timers.current.push(gt);
          setEmptyBottles(prev => new Set([...prev, item.ing.id]));
        } else {
          const lineIdx = Math.floor(Math.random() * GOD_SELECT_LINES.length);
          showGodSpeech(GOD_SELECT_LINES[lineIdx](userName || '너', `${item.ing.emoji}${item.ing.name}`, spoons));
        }

        setBouncingId(item.ing.id);
        const bt = setTimeout(() => setBouncingId(null), 400);
        timers.current.push(bt);

        const newSel = [...selectedRef.current, item.ing];
        selectedRef.current = newSel;
        setSelected(newSel);

        if (idx === sequence.length - 1) {
          const et = setTimeout(() => {
            setPhase('explosion');
            triggerExplosion();
          }, 2200);
          timers.current.push(et);
        }
      }, delay);

      timers.current.push(t);
      delay += item.isEmpty ? 3200 : item.isAccident ? 2800 : 2200;
    });
  }, [saJuIngs, userName, showGodSpeech, triggerExplosion]);

  const handleReset = useCallback(() => {
    clearAllTimers();
    selectedRef.current = [];
    setSelected([]); setUserName(''); setNameInput(''); setNamingStep(0);
    setYearInput(''); setMonthInput(''); setDayInput('');
    setZodiacInfo(null); setSaJuIngs([]);
    setGodSvgType('idle'); setGodClass(''); setBeakerClass(''); setFlashClass('');
    setParticles([]); setShowResult(false); setShowStats(false); setBouncingId(null);
    setAccidentals(new Set()); setEmptyBottles(new Set());
    hasRecordedRef.current = false;
    setDominantOh(null); setHourOh(null); setOhScores(null);
    setTooltipIngId(null); setShowCompat(false);
    setCompatYear(''); setCompatMonth(''); setCompatDay('');
    setCompatResult(null); setCompatZodiac(null);
    setLiveStats(TYPE_STATS); setLiveTotalPlayers(TOTAL_PLAYERS); setStatsLoading(false);
    setGodSpeech(''); setShowSpeech(false); setAccidentFlash(null);
    setLinkCopied(false);
    setPhase('intro');
  }, [clearAllTimers]);

  const handleShare = useCallback(async () => {
    const pt = getPersonalityType(selected);
    try {
      const blob = await generateShareImage(userName || '나', pt, selected, accidentals, emptyBottles);
      const file = new File([blob], '신이나를만들때.png', { type: 'image/png' });
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: `신이 ${userName || '나'}을(를) 만들 때 🧪` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = '신이나를만들때.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } catch { /* cancel */ }
  }, [selected, userName, accidentals, emptyBottles]);

  const handleCompatCalc = useCallback(() => {
    if (!dominantOh) return;
    const cy2 = parseInt(compatYear);
    const cm = parseInt(compatMonth);
    const cd = parseInt(compatDay);
    if (!cy2 || !cm || !cd || cm < 1 || cm > 12 || cd < 1 || cd > 31 || cy2 < 1900 || cy2 > 2030) return;
    const { zodiac, dominantOh: theirOh } = selectBySaju(cy2, cm, cd);
    setCompatZodiac({ name: zodiac.name, emoji: zodiac.emoji, oh: theirOh });
    setCompatResult(getCompat(dominantOh, theirOh));
  }, [dominantOh, compatYear, compatMonth, compatDay]);

  const handleCopyLink = useCallback(() => {
    const b = `${yearInput}${monthInput.padStart(2, '0')}${dayInput.padStart(2, '0')}`;
    const n = encodeURIComponent(userName || '');
    const url = `${window.location.origin}${window.location.pathname}?b=${b}&n=${n}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }).catch(() => {
      // fallback: prompt
      prompt('링크를 복사하세요:', url);
    });
  }, [yearInput, monthInput, dayInput, userName]);

  const fillPct = (selected.length / MAX) * 100;
  const personality = showResult ? getPersonalityType(selected) : null;
  const breakdown = personality ? getCategoryBreakdown(selected) : [];
  const liquidColor = fillPct <= 20 ? '#7BB8F5' : fillPct <= 40 ? '#5CB85C'
    : fillPct <= 60 ? '#9B7FE0' : fillPct <= 80 ? '#F5A83C' : '#FF4040';
  const displayName = userName || '나';

  return (
    <div style={{ ...css.root, background: phase === 'intro' ? '#F5EFE0' : 'linear-gradient(160deg, #0D0820 0%, #1A0D38 50%, #0D1830 100%)' }}>
      {/* 별 */}
      {phase !== 'intro' && STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.left, top: s.top, color: 'white',
          fontSize: s.size, animationName: 'twinkle', animationDuration: s.dur,
          animationDelay: s.delay, animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out', pointerEvents: 'none', userSelect: 'none',
        }}>✦</div>
      ))}

      {/* ── 인트로 ── */}
      {phase === 'intro' && (
        <div style={css.introScreen}>
          <h1 style={{ ...css.introTitle } as CSSProperties} className="title-pop">
            신이 나를 만들 때 🧪
          </h1>
          <p style={css.introSub}>생년월일 사주로 알아보는 나의 진짜 성격</p>

          <div style={css.introGodWrap}>
            <div style={css.introBubble}>
              어디보자...<br />
              네가 어떤 인간인지<br />
              만들어보겠노라. 🧪
            </div>
            <GodIdle count={0} />
          </div>

          <button style={css.startBtn} onClick={() => setPhase('naming')}>
            ▶ &nbsp;시작하기
          </button>

          <div style={css.introWarning}>
            ⚠️ 경고: 신이 실수할 수도 있음 (복불복)
          </div>
        </div>
      )}

      {/* ── 이름 + 생년월일 RPG 대화 ── */}
      {phase === 'naming' && (
        <div style={css.namingScreen}>
          <div style={css.namingGodWrap}>
            <GodIdle count={0} />
          </div>

          {/* step 1: 이름 입력 */}
          {namingStep === 1 && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>어디보자...</p>
              <p style={css.rpgLine}>너의... <b>이름</b>은... 무엇이냐?</p>
              <div style={css.rpgInputRow}>
                <input
                  style={css.rpgInput}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="이름 입력..."
                  maxLength={10}
                  autoFocus
                />
                <button style={css.rpgBtn} onClick={handleNameSubmit}>확인 ▶</button>
              </div>
            </div>
          )}

          {/* step 2: 이름 반응 (클릭 진행) */}
          {namingStep === 2 && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}><b>{userName}</b>...</p>
              <p style={css.rpgLine}>그렇군...</p>
              <p style={css.rpgLine}>흠... 좋은 이름이군. ☁️</p>
              <p style={css.rpgLine}>그렇다면 생년월일도 알려주겠느냐?</p>
              <div style={css.rpgAdvanceRow}>
                <button style={css.rpgAdvanceBtn} onClick={handleStep2Next}>▶</button>
              </div>
            </div>
          )}

          {/* step 3: 생년월일 입력 */}
          {namingStep === 3 && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>그렇다면...</p>
              <p style={css.rpgLine}><b>{userName}</b>는 언제 태어났느냐?</p>
              <div style={css.dateRow}>
                <input
                  style={css.dateInputYear}
                  value={yearInput}
                  onChange={e => setYearInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleDateSubmit()}
                  placeholder="1990"
                  maxLength={4}
                  inputMode="numeric"
                  autoFocus
                />
                <span style={css.dateLabel}>년</span>
                <input
                  style={css.dateInputShort}
                  value={monthInput}
                  onChange={e => setMonthInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleDateSubmit()}
                  placeholder="6"
                  maxLength={2}
                  inputMode="numeric"
                />
                <span style={css.dateLabel}>월</span>
                <input
                  style={css.dateInputShort}
                  value={dayInput}
                  onChange={e => setDayInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleDateSubmit()}
                  placeholder="15"
                  maxLength={2}
                  inputMode="numeric"
                />
                <span style={css.dateLabel}>일</span>
              </div>
              <div style={css.rpgAdvanceRow}>
                <button style={css.rpgBtn} onClick={handleDateSubmit}>확인 ▶</button>
              </div>
            </div>
          )}

          {/* step 4: 태어난 시간 선택 */}
          {namingStep === 4 && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>마지막으로...</p>
              <p style={css.rpgLine}><b>{userName}</b>는 언제쯤 태어났느냐?</p>
              <p style={{ ...css.rpgLine, fontSize: 13, color: 'rgba(255,255,255,0.45)' } as CSSProperties}>
                시주(時柱)까지 보면 더 정확해지느니라
              </p>
              <div style={css.timeGrid}>
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot.oh + slot.label}
                    style={{
                      ...css.timeBtn,
                      borderColor: OHAENG_COLOR[slot.oh],
                      color: OHAENG_COLOR[slot.oh],
                    }}
                    onClick={() => handleTimeSubmit(slot.oh)}
                  >
                    <span style={{ fontSize: 22 }}>{slot.emoji}</span>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>{slot.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.7 }}>{slot.range}</span>
                  </button>
                ))}
              </div>
              <button style={css.skipTimeBtn} onClick={() => handleTimeSubmit(null)}>
                잘 모르겠어 (건너뛰기)
              </button>
            </div>
          )}

          {/* step 5: 확인 (네/아니오 선택) */}
          {namingStep === 5 && zodiacInfo && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>너의 이름은... <b>{userName}</b>....</p>
              <p style={css.rpgLine}>
                너는 <b>{yearInput}년 {monthInput}월 {dayInput}일</b>생 이었지.....
              </p>
              <p style={css.rpgLine}>
                <span style={{ fontSize: 22 }}>{zodiacInfo.emoji}</span>{' '}
                <b>{zodiacInfo.name}띠</b>이로구나...
              </p>
              {dominantOh && (
                <p style={{ ...css.rpgLine, marginTop: 6, color: OHAENG_COLOR[dominantOh] } as CSSProperties}>
                  ✨ 사주를 보니... <b>{OHAENG_KR[dominantOh]}</b>의 기운이 강하구나...
                </p>
              )}
              <p style={{ ...css.rpgLine, color: '#FFD700', marginTop: 6 } as CSSProperties}>
                맞나...? 🤔
              </p>
              <div style={css.yesNoBar}>
                <button style={css.noBtn} onClick={handleNo}>✕ 아니오</button>
                <button style={css.yesBtn} onClick={handleYes}>✓ 네</button>
              </div>
            </div>
          )}

          {/* step 6: 운명 발견 (클릭 진행) */}
          {namingStep === 6 && zodiacInfo && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>
                ✨ <b>{zodiacInfo.emoji} {zodiacInfo.name}</b>의 기운을 읽겠노라...
              </p>
              {dominantOh && (
                <p style={{ ...css.rpgLine, color: OHAENG_COLOR[dominantOh] } as CSSProperties}>
                  <b>{OHAENG_KR[dominantOh]}</b>의 기운이 강하여 재료가 보인다!
                </p>
              )}
              <p style={css.rpgLine}>운명의 재료가 보이기 시작했다!</p>
              <p style={{ ...css.rpgLine, color: '#FFD700', fontWeight: 800, marginTop: 4 } as CSSProperties}>
                지금부터 신이 직접 만들어주겠노라!! ⚗️
              </p>
              <div style={css.rpgAdvanceRow}>
                <button style={css.startPourBtn} onClick={startPouring}>
                  ▶ 운명의 재료 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 게임 (자동 붓기 + 폭발) ── */}
      {(phase === 'pouring' || phase === 'explosion') && (
        <div style={css.container}>
          {/* 헤더 */}
          <div style={css.header}>
            <div style={css.headerBadge}>🧬 밈 게임</div>
            <h1 style={css.title} className="title-pop">
              신이 <span style={{ color: '#D4BFFF' }}>{displayName}</span>을(를) 만들 때 🧪
            </h1>
          </div>

          {/* 실험실 */}
          <div style={css.labArea}>
            {/* 신 + 말풍선 */}
            <div style={css.godSection}>
              {showSpeech && (
                <div style={css.speechBubble}>
                  {godSpeech}
                  <div style={css.speechTail} />
                </div>
              )}
              <div className={godClass}>
                {godSvgType === 'idle' && <GodIdle count={selected.length} />}
                {godSvgType === 'panic' && <GodPanic />}
                {godSvgType === 'dazed' && <GodDazed />}
              </div>
            </div>

            {/* 비커 */}
            <div style={css.beakerSection}>
              <div className={beakerClass} style={css.beakerOuter}>
                <div style={css.beakerTube}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ ...css.tick, bottom: `${i * 20}%` }} />
                  ))}
                  <div style={{
                    ...css.liquid, height: `${fillPct}%`,
                    background: liquidColor, transition: 'height 0.35s ease, background 0.35s ease',
                  }}>
                    {selected.length > 0 && (
                      <span style={css.liquidEmoji}>{selected.slice(-2).map(i => i.emoji).join('')}</span>
                    )}
                  </div>
                </div>
                <div style={css.beakerStem} />
                <div style={css.beakerBase} />
              </div>
              <div style={css.beakerCount}>{selected.length}/{MAX}</div>
            </div>

            {/* 파티클 */}
            {particles.map(p => (
              <div key={p.id} className="particle-fly" style={{
                position: 'absolute', left: '50%', top: '50%',
                fontSize: 22, userSelect: 'none', pointerEvents: 'none',
                '--px': `${p.px}px`, '--py': `${p.py}px`,
              } as CSSProperties}>{p.emoji}</div>
            ))}
          </div>

          {/* 자동 붓기 - 재료 등장 카드 */}
          {phase === 'pouring' && (
            <div style={css.pouringArea}>
              <p style={css.pouringHint}>
                {selected.length < MAX
                  ? `✨ 신이 운명의 재료를 넣는 중... (${selected.length}/${MAX})`
                  : '⚗️ 다 됐다! 섞는 중...'}
              </p>
              <div style={css.pouringGrid}>
                {selected.map(ing => {
                  const isAcc = accidentals.has(ing.id);
                  const isEmpty = emptyBottles.has(ing.id);
                  const isBouncing = bouncingId === ing.id;
                  return (
                    <div
                      key={ing.id}
                      className={isBouncing ? 'card-bounce' : ''}
                      style={{
                        ...css.pourCard,
                        ...(isAcc ? css.pourCardAcc : {}),
                        ...(isEmpty ? css.pourCardEmpty2 : {}),
                      }}
                    >
                      <span style={css.pourEmoji}>{ing.emoji}</span>
                      <span style={css.pourName}>{ing.name}</span>
                      {isAcc && !isEmpty && <span style={css.accBadgePour}>💥 실수</span>}
                      {isEmpty && <span style={css.emptyBadgePour}>💧 한방울</span>}
                    </div>
                  );
                })}
                {/* 빈 슬롯 */}
                {Array.from({ length: MAX - selected.length }).map((_, i) => (
                  <div key={`empty-${i}`} style={css.pourCardSlot}>
                    <span style={{ fontSize: 22, opacity: 0.2 }}>?</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 폭발 중 */}
          {phase === 'explosion' && !showResult && (
            <div style={css.explosionMid}>
              <div style={css.expTitle}>⚗️ 실험 진행 중!!</div>
              <div style={css.expSub}>신이 열심히 섞고 있어요...</div>
              <div style={css.expIngs}>
                {selected.map(ing => (
                  <span key={ing.id} style={{ fontSize: 36 }}>{ing.emoji}</span>
                ))}
              </div>
              <div style={css.dots}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#9B7FE0',
                    animationName: 'dotPulse', animationDuration: '1.2s',
                    animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 통계 오버레이 ── */}
      {showStats && personality && (
        <div className="result-slide" style={css.statsOverlay}>
          <div style={css.resultBg} />
          <div style={css.statsScroll}>
            <div style={css.statsContent}>
              <div style={css.statsHeader}>
                <button style={css.statsBackBtn} onClick={() => setShowStats(false)}>← 돌아가기</button>
                <h2 style={css.statsTitle}>🏆 유형 분포</h2>
                <p style={css.statsSubtitle}>
                  {statsLoading ? '통계 불러오는 중...' : `총 ${liveTotalPlayers.toLocaleString()}명 참여`}
                </p>
              </div>

              {/* 내 유형 하이라이트 */}
              <div style={css.myTypeCard}>
                <span style={css.myTypeEmoji}>{personality.emoji}</span>
                <div>
                  <div style={css.myTypeTitle}>{personality.title}</div>
                  <div style={css.myTypeRank}>
                    전체의 {liveStats[personality.id] ?? 0}% ·{' '}
                    {[...PERSONALITY_TYPES]
                      .sort((a, b) => (liveStats[b.id] ?? 0) - (liveStats[a.id] ?? 0))
                      .findIndex(p => p.id === personality.id) + 1}위
                  </div>
                </div>
              </div>

              {/* 전체 유형 리스트 */}
              <div style={css.statsListWrapper}>
                {[...PERSONALITY_TYPES]
                  .sort((a, b) => (liveStats[b.id] ?? 0) - (liveStats[a.id] ?? 0))
                  .map((type, rank) => {
                    const pct = liveStats[type.id] ?? 0;
                    const isMe = type.id === personality.id;
                    return (
                      <div key={type.id} style={{ ...css.statsRow, ...(isMe ? css.statsRowMe : {}) }}>
                        <span style={css.statsRank}>{rank + 1}</span>
                        <span style={css.statsTypeEmoji}>{type.emoji}</span>
                        <div style={css.statsInfo}>
                          <div style={css.statsTypeName}>{type.title}</div>
                          <div style={css.statsBarWrap}>
                            <div style={{
                              ...css.statsBar,
                              width: `${pct}%`,
                              background: isMe ? '#9B7FE0' : 'rgba(155,127,224,0.4)',
                            }} />
                          </div>
                        </div>
                        <span style={css.statsPct}>{pct}%</span>
                        {isMe && <span style={css.statsMeBadge}>나</span>}
                      </div>
                    );
                  })
                }
              </div>

              <p style={css.statsFooter}>
                {SUPABASE_URL ? '* 실제 참여자 데이터 기반' : '* 사주명리학 기반 시뮬레이션 데이터'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 궁합 오버레이 ── */}
      {showCompat && dominantOh && (
        <div className="result-slide" style={css.statsOverlay}>
          <div style={css.resultBg} />
          <div style={css.statsScroll}>
            <div style={css.statsContent}>
              <div style={css.statsHeader}>
                <button style={css.statsBackBtn} onClick={() => { setShowCompat(false); setCompatResult(null); setCompatYear(''); setCompatMonth(''); setCompatDay(''); }}>← 돌아가기</button>
                <h2 style={css.statsTitle}>💕 오행 궁합</h2>
                <p style={css.statsSubtitle}>상대의 생년월일을 입력해줘</p>
              </div>

              {/* 내 오행 */}
              <div style={css.compatMyOh}>
                <span style={{ fontSize: 28 }}>나</span>
                <div style={{ color: OHAENG_COLOR[dominantOh], fontWeight: 800, fontSize: 18 }}>
                  {OHAENG_KR[dominantOh]}
                </div>
              </div>

              {/* 상대 입력 */}
              <div style={css.rpgBox}>
                <div style={css.rpgSpeaker}>상대방 생년월일</div>
                <div style={css.dateRow}>
                  <input style={css.dateInputYear} value={compatYear} onChange={e => setCompatYear(e.target.value)} placeholder="1990" maxLength={4} inputMode="numeric" autoFocus/>
                  <span style={css.dateLabel}>년</span>
                  <input style={css.dateInputShort} value={compatMonth} onChange={e => setCompatMonth(e.target.value)} placeholder="6" maxLength={2} inputMode="numeric"/>
                  <span style={css.dateLabel}>월</span>
                  <input style={css.dateInputShort} value={compatDay} onChange={e => setCompatDay(e.target.value)} placeholder="15" maxLength={2} inputMode="numeric"/>
                  <span style={css.dateLabel}>일</span>
                </div>
                <div style={css.rpgAdvanceRow}>
                  <button style={css.rpgBtn} onClick={handleCompatCalc}>궁합 보기 ▶</button>
                </div>
              </div>

              {/* 결과 */}
              {compatResult && compatZodiac && (
                <div style={css.compatResultBox}>
                  {/* VS */}
                  <div style={css.compatVsRow}>
                    <div style={css.compatOhBox}>
                      <div style={{ color: OHAENG_COLOR[dominantOh], fontWeight: 800, fontSize: 16 }}>{OHAENG_KR[dominantOh]}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>나</div>
                    </div>
                    <div style={css.compatVsEmoji}>{compatResult.emoji}</div>
                    <div style={css.compatOhBox}>
                      <div style={{ color: OHAENG_COLOR[compatZodiac.oh], fontWeight: 800, fontSize: 16 }}>{OHAENG_KR[compatZodiac.oh]}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{compatZodiac.emoji} {compatZodiac.name}띠</div>
                    </div>
                  </div>

                  {/* 점수 바 */}
                  <div style={css.compatScoreRow}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: compatResult.score >= 70 ? '#FF6B8A' : compatResult.score >= 60 ? '#FFD700' : '#9B7FE0' }}>
                      {compatResult.score}점
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginLeft: 8 }}>{compatResult.relation}</span>
                  </div>
                  <div style={css.compatBarWrap}>
                    <div style={{ ...css.compatBar, width: `${compatResult.score}%`, background: compatResult.score >= 70 ? '#FF6B8A' : compatResult.score >= 60 ? '#FFD700' : '#9B7FE0' }}/>
                  </div>
                  <div style={css.compatTitle}>{compatResult.title}</div>
                  <div style={css.compatDesc}>{compatResult.desc}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 플래시 */}
      {flashClass && <div className={flashClass} style={css.flash} />}

      {/* 복불복 알림 */}
      {accidentFlash && (
        <div style={css.accidentOverlay} className="title-pop">
          <div style={css.accidentBox}>
            {accidentFlash.split('\n').map((line, i) => (
              <div key={i} style={i === 0 ? css.accidentShout : css.accidentDesc}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* ── 결과 ── */}
      {personality && showResult && (
        <div className="result-slide" style={css.resultOverlay}>
          <div style={css.resultBg} />
          <div style={css.resultScroll}>
            <div style={css.resultContent}>
              {/* 신 말풍선 */}
              <div style={css.resultGodRow}>
                <GodDazed />
                <div style={css.resultBubble}>
                  뭔지 모르겠는데...<br />
                  너무 많이 부었다. 😵‍💫
                </div>
              </div>

              <div style={css.resultHeader}>
                <div style={css.resultHeaderBadge}>🧪 실험 결과 — 신이 {displayName}을(를) 만들 때</div>
              </div>

              <div style={css.typeCard}>
                <div style={css.typeEmoji}>{personality.emoji}</div>
                <div style={css.typeTitle}>{personality.title}</div>
                <div style={css.typeSub}>{personality.subtitle}</div>
              </div>

              <div style={css.section}>
                <div style={css.sectionTitle}>📦 신이 넣은 재료</div>
                <p style={{ ...css.sectionTitle, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 400, marginTop: -8, marginBottom: 6 } as CSSProperties}>
                  재료를 누르면 명리학 배속 이유를 볼 수 있어
                </p>
                <div style={css.recapGrid}>
                  {selected.map(ing => (
                    <div key={ing.id}
                      onClick={() => setTooltipIngId(tooltipIngId === ing.id ? null : ing.id)}
                      style={{
                        ...css.recapChip,
                        ...(accidentals.has(ing.id) ? css.recapChipAcc : {}),
                        ...(emptyBottles.has(ing.id) ? css.recapChipEmpty : {}),
                        cursor: 'pointer', position: 'relative',
                      }}>
                      <span style={{ fontSize: 20 }}>{ing.emoji}</span>
                      <span style={css.recapName}>{ing.name}</span>
                      {accidentals.has(ing.id) && !emptyBottles.has(ing.id) && <span style={css.accLabel}>실수</span>}
                      {emptyBottles.has(ing.id) && <span style={css.emptyLabel}>💧 한방울</span>}
                      {tooltipIngId === ing.id && (
                        <div style={css.ingTooltip}>
                          <span style={{ color: OHAENG_COLOR[ING_OHAENG[ing.id]] }}>{OHAENG_KR[ING_OHAENG[ing.id]]}</span>
                          <br/>{ING_TOOLTIP[ing.id]}
                          {accidentals.has(ing.id) && dominantOh && (
                            <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(155,127,224,0.3)', color: '#FFCC80', fontSize: 10, lineHeight: 1.5 }}>
                              💥 왜 실수로 들어갔냐면: {getAccidentReason(ing.id, dominantOh)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={css.section}>
                <div style={css.sectionTitle}>📊 성분 비율 분석</div>
                {breakdown.map(b => (
                  <div key={b.cat} style={css.barRow}>
                    <span style={css.barLabel}>{CAT_NAME[b.cat]}</span>
                    <div style={css.barTrack}>
                      <div style={{ ...css.barFill, width: `${b.pct}%`, background: CAT_COLOR[b.cat] ?? '#9B7FE0' }} />
                    </div>
                    <span style={css.barPct}>{b.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              {ohScores && (
                <div style={css.section}>
                  <div style={css.sectionTitle}>🔯 오행(五行) 레이더</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <OhaengRadar scores={ohScores} />
                  </div>
                  <div style={css.radarLegend}>
                    {(Object.entries(ohScores) as [Ohaeng, number][]).sort((a,b)=>b[1]-a[1]).map(([oh, v]) => (
                      <div key={oh} style={css.radarLegendItem}>
                        <span style={{ color: OHAENG_COLOR[oh], fontWeight: 700, fontSize: 12 }}>{OHAENG_KR[oh]}</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginLeft: 4 }}>×{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={css.section}>
                <div style={css.sectionTitle}>💬 이 조합은요...</div>
                <div style={css.descBox}>
                  <p style={css.descText}>{personality.desc}</p>
                </div>
                <div style={css.tagsRow}>
                  {personality.tags.map(tag => (
                    <div key={tag} style={css.tag}>{tag}</div>
                  ))}
                </div>
              </div>

              <div style={css.actionRow}>
                <button style={css.shareBtn} onClick={handleShare}>📤 이미지 공유</button>
                <button style={css.resetBtn} onClick={handleReset}>🔄 다시 하기</button>
              </div>
              <button style={css.copyLinkBtn} onClick={handleCopyLink}>
                {linkCopied ? '✅ 링크 복사됨!' : '🔗 결과 링크 복사'}
              </button>
              <button style={css.compatBtn} onClick={() => { setShowCompat(true); setCompatResult(null); setCompatZodiac(null); setCompatYear(''); setCompatMonth(''); setCompatDay(''); }}>
                💕 궁합 보기 (오행 상생·상극)
              </button>
              <button style={css.statsBtn} onClick={() => setShowStats(true)}>
                👥 나와 같은 유형 알아보기
              </button>
              <div style={css.bottomTag}>#신이나를만들때 #신이{displayName}을만들때</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css: Record<string, CSSProperties> = {
  root: {
    minHeight: '100dvh', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(160deg, #0D0820 0%, #1A0D38 50%, #0D1830 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },

  // ── 인트로 ──
  introScreen: {
    position: 'relative', zIndex: 1,
    minHeight: '100dvh', width: '100%', maxWidth: 480,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 24px', gap: 12,
  },
  introBadge: {
    background: 'rgba(155,127,224,0.25)', color: '#C4ADFF',
    fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20,
    border: '1px solid rgba(155,127,224,0.4)',
  },
  introTitle: {
    fontSize: 28, fontWeight: 900, color: '#2C1810',
    textAlign: 'center', letterSpacing: -0.5, lineHeight: 1.3,
  },
  introSub: {
    fontSize: 13, color: 'rgba(50,25,0,0.55)', textAlign: 'center',
  },
  introGodWrap: {
    position: 'relative', display: 'flex', flexDirection: 'column',
    alignItems: 'center', marginTop: 8,
  },
  introBubble: {
    background: 'white', color: '#222', fontSize: 13, fontWeight: 700,
    padding: '10px 16px', borderRadius: 14, lineHeight: 1.6,
    border: '2px solid #222', textAlign: 'center', marginBottom: -8,
    position: 'relative', zIndex: 1,
    boxShadow: '3px 3px 0px #222',
  },
  startBtn: {
    marginTop: 16,
    background: '#9B7FE0', border: '3px solid #2C1810', borderRadius: 16,
    padding: '16px 48px', color: '#fff', fontSize: 18, fontWeight: 900,
    cursor: 'pointer', letterSpacing: 1,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    transition: 'transform 0.1s',
  },
  introWarning: {
    fontSize: 11, color: 'rgba(120,70,10,0.75)', textAlign: 'center',
    marginTop: 8, fontStyle: 'italic',
  },

  // ── 이름 / 생년월일 입력 공통 ──
  namingScreen: {
    position: 'relative', zIndex: 1,
    minHeight: '100dvh', width: '100%', maxWidth: 480,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'flex-end', paddingBottom: 0,
  },
  namingGodWrap: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    paddingTop: 60,
  },
  rpgBox: {
    width: '100%', maxWidth: 480,
    background: 'rgba(8, 4, 20, 0.97)',
    border: '2px solid rgba(155,127,224,0.7)',
    borderBottom: 'none',
    padding: '20px 24px 28px',
    position: 'relative',
  },
  rpgSpeaker: {
    background: 'rgba(155,127,224,0.3)', border: '1.5px solid rgba(155,127,224,0.6)',
    color: '#D4BFFF', fontSize: 13, fontWeight: 800,
    padding: '4px 14px', borderRadius: '8px 8px 0 0',
    display: 'inline-block', marginBottom: 14,
  },
  rpgLine: {
    color: '#fff', fontSize: 16, lineHeight: 1.8, margin: '2px 0',
  },
  rpgInputRow: {
    display: 'flex', gap: 10, marginTop: 16,
  },
  rpgInput: {
    flex: 1, background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(155,127,224,0.5)', borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 16, outline: 'none',
  },
  rpgBtn: {
    background: '#9B7FE0', border: 'none', borderRadius: 10,
    padding: '12px 18px', color: '#fff', fontSize: 14,
    fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap',
    marginTop: 14, alignSelf: 'flex-end',
  },

  // 클릭 진행 화살표 버튼
  rpgAdvanceRow: {
    display: 'flex', justifyContent: 'flex-end', marginTop: 18,
  },
  rpgAdvanceBtn: {
    background: 'rgba(155,127,224,0.25)', border: '2px solid rgba(155,127,224,0.6)',
    borderRadius: 10, padding: '10px 20px', color: '#D4BFFF',
    fontSize: 18, fontWeight: 900, cursor: 'pointer',
    animation: 'pulseBadge 1.8s ease-in-out infinite',
  },
  startPourBtn: {
    background: '#9B7FE0', border: '2px solid #fff', borderRadius: 12,
    padding: '12px 24px', color: '#fff', fontSize: 14,
    fontWeight: 900, cursor: 'pointer', letterSpacing: 0.5,
    boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
  },

  // YES/NO 네비게이션 바
  yesNoBar: {
    display: 'flex', gap: 12, marginTop: 20,
  },
  noBtn: {
    flex: 1, background: 'rgba(255,80,80,0.15)', border: '2px solid #FF6060',
    borderRadius: 12, padding: '14px 0', color: '#FF9090',
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
  },
  yesBtn: {
    flex: 1, background: '#9B7FE0', border: '2px solid #fff',
    borderRadius: 12, padding: '14px 0', color: '#fff',
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
  },

  // 시주 선택
  timeGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14,
  },
  timeBtn: {
    display: 'flex', flexDirection: 'column' as CSSProperties['flexDirection'],
    alignItems: 'center', gap: 2, padding: '10px 8px',
    background: 'rgba(255,255,255,0.05)', border: '1.5px solid',
    borderRadius: 12, cursor: 'pointer',
    transition: 'background 0.15s',
  },
  skipTimeBtn: {
    marginTop: 12, width: '100%', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
    padding: '10px 0', color: 'rgba(255,255,255,0.35)',
    fontSize: 13, cursor: 'pointer',
  },

  // 생년월일 입력 전용
  dateRow: {
    display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, flexWrap: 'wrap',
  },
  dateInputYear: {
    width: 80, background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(155,127,224,0.5)', borderRadius: 10,
    padding: '12px 10px', color: '#fff', fontSize: 16, outline: 'none',
    textAlign: 'center',
  },
  dateInputShort: {
    width: 52, background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(155,127,224,0.5)', borderRadius: 10,
    padding: '12px 8px', color: '#fff', fontSize: 16, outline: 'none',
    textAlign: 'center',
  },
  dateLabel: {
    color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 600,
  },

  dots: { display: 'flex', gap: 6, alignItems: 'center', marginTop: 12 },

  // ── 게임 ──
  container: {
    width: '100%', maxWidth: 480, flex: 1,
    display: 'flex', flexDirection: 'column',
    padding: '0 0 80px', position: 'relative', zIndex: 1,
  },
  header: {
    padding: '16px 20px 6px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
  },
  headerBadge: {
    background: 'rgba(155,127,224,0.25)', color: '#C4ADFF',
    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
    border: '1px solid rgba(155,127,224,0.35)',
  },
  title: {
    fontSize: 18, fontWeight: 900, color: '#fff',
    textAlign: 'center', letterSpacing: -0.3,
  },

  labArea: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    padding: '2px 20px 6px', position: 'relative', minHeight: 140,
  },
  godSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    position: 'relative', gap: 0, minWidth: 140,
  },
  speechBubble: {
    position: 'absolute', bottom: '100%', left: '50%',
    transform: 'translateX(-50%)',
    background: 'white', color: '#222', fontSize: 11, fontWeight: 700,
    padding: '8px 12px', borderRadius: 10, lineHeight: 1.5,
    border: '2px solid #222', textAlign: 'center',
    whiteSpace: 'normal' as CSSProperties['whiteSpace'],
    zIndex: 10, boxShadow: '2px 2px 0px #222',
    maxWidth: 240, minWidth: 140,
    animation: 'titlePop 0.3s ease both',
    marginBottom: 4,
  },
  speechTail: {
    position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
    width: 0, height: 0,
    borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
    borderTop: '10px solid #222',
  },

  beakerSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  beakerOuter: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  beakerTube: {
    width: 54, height: 80, border: '2px solid rgba(255,255,255,0.4)',
    borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.04)',
    position: 'relative',
  },
  tick: { position: 'absolute', left: 4, right: 4, height: 1, background: 'rgba(255,255,255,0.18)' },
  liquid: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2,
  },
  liquidEmoji: { fontSize: 13, lineHeight: 1, userSelect: 'none' },
  beakerStem: { width: 20, height: 10, background: 'rgba(255,255,255,0.25)' },
  beakerBase: { width: 38, height: 7, background: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  beakerCount: { fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.65)', marginTop: 3 },

  // 자동 붓기 - 재료 카드 그리드
  pouringArea: {
    flex: 1, padding: '12px 16px',
  },
  pouringHint: {
    fontSize: 13, color: 'rgba(255,255,255,0.55)',
    textAlign: 'center', marginBottom: 14, fontWeight: 600,
  },
  pouringGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8,
  },
  pourCard: {
    background: 'rgba(155,127,224,0.22)', border: '1.5px solid #9B7FE0',
    borderRadius: 14, padding: '10px 4px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    position: 'relative', animation: 'titlePop 0.3s ease both',
  },
  pourCardAcc: {
    background: 'rgba(255,80,80,0.22)', border: '1.5px solid #FF6060',
  },
  pourCardEmpty2: {
    background: 'rgba(100,180,255,0.15)', border: '1.5px solid #7BB8F5',
  },
  pourCardSlot: {
    background: 'rgba(255,255,255,0.04)', border: '1.5px dashed rgba(255,255,255,0.12)',
    borderRadius: 14, padding: '10px 4px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: 70,
  },
  pourEmoji: { fontSize: 28, lineHeight: 1 },
  pourName: { fontSize: 10, fontWeight: 700, color: '#D4BFFF', textAlign: 'center' },
  accBadgePour: {
    fontSize: 9, fontWeight: 800, color: '#FF9090',
    background: 'rgba(255,60,60,0.2)', borderRadius: 8, padding: '1px 5px',
  },
  emptyBadgePour: {
    fontSize: 9, fontWeight: 800, color: '#7BB8F5',
    background: 'rgba(100,180,255,0.2)', borderRadius: 8, padding: '1px 5px',
  },

  explosionMid: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20,
  },
  expTitle: { fontSize: 26, fontWeight: 900, color: '#fff' },
  expSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  expIngs: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },

  flash: { position: 'fixed', inset: 0, background: '#FFF5AA', pointerEvents: 'none', zIndex: 200 },

  accidentOverlay: {
    position: 'fixed', inset: 0, zIndex: 300,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.55)', pointerEvents: 'none',
  },
  accidentBox: {
    background: 'white', border: '4px solid #222',
    borderRadius: 20, padding: '20px 30px', textAlign: 'center',
    boxShadow: '6px 6px 0px #222',
    transform: 'rotate(-3deg)',
  },
  accidentShout: {
    fontSize: 36, fontWeight: 900, color: '#FF3030', lineHeight: 1.2,
  },
  accidentDesc: {
    fontSize: 15, fontWeight: 700, color: '#222', marginTop: 8,
  },

  // ── 결과 ──
  resultOverlay: { position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column' },
  resultBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(160deg, #0D0820 0%, #1A0D38 50%, #0D1830 100%)',
  },
  resultScroll: { position: 'relative', zIndex: 1, overflowY: 'auto', flex: 1, display: 'flex', justifyContent: 'center' },
  resultContent: { width: '100%', maxWidth: 480, padding: '20px 20px 60px', display: 'flex', flexDirection: 'column' },

  resultGodRow: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    gap: 12, marginBottom: 8,
  },
  resultBubble: {
    background: 'white', color: '#222', fontSize: 12, fontWeight: 700,
    padding: '10px 14px', borderRadius: 12, lineHeight: 1.6,
    border: '2px solid #222', boxShadow: '2px 2px 0px #222',
    marginBottom: 24,
  },

  resultHeader: { display: 'flex', justifyContent: 'center', marginBottom: 16 },
  resultHeaderBadge: {
    background: 'rgba(155,127,224,0.2)', border: '1px solid rgba(155,127,224,0.3)',
    color: '#C4ADFF', fontSize: 11, fontWeight: 700,
    padding: '6px 16px', borderRadius: 20, textAlign: 'center',
  },
  typeCard: {
    background: 'linear-gradient(135deg, rgba(155,127,224,0.28), rgba(107,181,255,0.14))',
    border: '1.5px solid rgba(155,127,224,0.35)',
    borderRadius: 22, padding: '28px 20px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 24,
  },
  typeEmoji: { fontSize: 72, lineHeight: 1, marginBottom: 4, userSelect: 'none' },
  typeTitle: { fontSize: 22, fontWeight: 900, color: '#fff' },
  typeSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },

  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 12, letterSpacing: 0.3 },
  recapGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  recapChip: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 6,
  },
  recapChipAcc: { background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.3)' },
  recapChipEmpty: { background: 'rgba(100,180,255,0.1)', border: '1px solid rgba(100,180,255,0.3)' },
  recapName: { fontSize: 12, fontWeight: 600, color: '#fff' },
  accLabel: {
    fontSize: 9, fontWeight: 800, color: '#FF8080',
    background: 'rgba(255,80,80,0.2)', borderRadius: 8, padding: '1px 6px',
  },
  emptyLabel: {
    fontSize: 9, fontWeight: 800, color: '#7BB8F5',
    background: 'rgba(100,180,255,0.2)', borderRadius: 8, padding: '1px 6px',
  },

  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  barLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', width: 90, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  barPct: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', width: 42, textAlign: 'right' },

  descBox: { background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, marginBottom: 12 },
  descText: { fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65 },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: {
    background: 'rgba(155,127,224,0.18)', border: '1px solid rgba(155,127,224,0.28)',
    borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#D4BFFF',
  },

  actionRow: { display: 'flex', gap: 12, marginBottom: 16 },
  shareBtn: {
    flex: 1, background: '#9B7FE0', border: 'none', borderRadius: 14,
    padding: '14px 0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  resetBtn: {
    flex: 1, background: 'transparent', border: '1.5px solid #9B7FE0', borderRadius: 14,
    padding: '14px 0', color: '#C084FC', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  bottomTag: { fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center' },

  copyLinkBtn: {
    width: '100%', background: 'rgba(91,184,255,0.1)', border: '1.5px solid rgba(91,184,255,0.4)',
    borderRadius: 14, padding: '12px 0', color: '#5BB8FF', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', marginBottom: 8, marginTop: 4,
  },
  statsBtn: {
    width: '100%', background: 'rgba(155,127,224,0.12)', border: '1.5px solid rgba(155,127,224,0.4)',
    borderRadius: 14, padding: '14px 0', color: '#C4ADFF', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', marginBottom: 12, marginTop: 0,
  },

  // ── 통계 오버레이 ──
  statsOverlay: { position: 'fixed', inset: 0, zIndex: 110, display: 'flex', flexDirection: 'column' },
  statsScroll: { position: 'relative', zIndex: 1, overflowY: 'auto', flex: 1, display: 'flex', justifyContent: 'center' },
  statsContent: { width: '100%', maxWidth: 480, padding: '20px 20px 60px', display: 'flex', flexDirection: 'column' },

  statsHeader: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    marginBottom: 20,
  },
  statsBackBtn: {
    alignSelf: 'flex-start', background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.2)',
    borderRadius: 10, padding: '8px 14px', color: 'rgba(255,255,255,0.55)', fontSize: 13,
    cursor: 'pointer', marginBottom: 14,
  },
  statsTitle: { fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 },
  statsSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 },

  myTypeCard: {
    background: 'linear-gradient(135deg, rgba(155,127,224,0.28), rgba(107,181,255,0.14))',
    border: '1.5px solid rgba(155,127,224,0.5)',
    borderRadius: 18, padding: '16px 20px',
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
  },
  myTypeEmoji: { fontSize: 52, lineHeight: 1 },
  myTypeTitle: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 4 },
  myTypeRank: { fontSize: 13, color: '#D4BFFF', fontWeight: 600 },

  statsListWrapper: { display: 'flex', flexDirection: 'column', gap: 8 },
  statsRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 14px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statsRowMe: {
    background: 'rgba(155,127,224,0.15)', border: '1.5px solid rgba(155,127,224,0.45)',
  },
  statsRank: { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 18, textAlign: 'center' as CSSProperties['textAlign'] },
  statsTypeEmoji: { fontSize: 26, lineHeight: 1 },
  statsInfo: { flex: 1 },
  statsTypeName: { fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 5 },
  statsBarWrap: { height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  statsBar: { height: '100%', borderRadius: 3, transition: 'width 0.6s ease' },
  statsPct: { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)', width: 36, textAlign: 'right' as CSSProperties['textAlign'] },
  statsMeBadge: {
    background: '#9B7FE0', color: '#fff', fontSize: 10, fontWeight: 800,
    borderRadius: 10, padding: '2px 8px', whiteSpace: 'nowrap' as CSSProperties['whiteSpace'],
  },
  statsFooter: { fontSize: 11, color: 'rgba(255,255,255,0.22)', textAlign: 'center', marginTop: 20 },

  // ── 재료 툴팁 ──
  ingTooltip: {
    position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
    transform: 'translateX(-50%)',
    background: '#1A0D38', border: '1.5px solid rgba(155,127,224,0.5)',
    borderRadius: 10, padding: '8px 12px', fontSize: 11, lineHeight: 1.6,
    color: 'rgba(255,255,255,0.85)', whiteSpace: 'normal' as CSSProperties['whiteSpace'],
    zIndex: 50, minWidth: 200, maxWidth: 260, textAlign: 'left' as CSSProperties['textAlign'],
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },

  // ── 오행 레이더 ──
  radarLegend: {
    display: 'flex', flexWrap: 'wrap' as CSSProperties['flexWrap'], gap: 8,
    justifyContent: 'center', marginTop: 4,
  },
  radarLegendItem: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '4px 10px',
  },

  // ── 궁합 버튼 ──
  compatBtn: {
    width: '100%', background: 'rgba(255,107,138,0.12)', border: '1.5px solid rgba(255,107,138,0.4)',
    borderRadius: 14, padding: '12px 0', color: '#FF6B8A', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', marginBottom: 8,
  },

  // ── 궁합 오버레이 ──
  compatMyOh: {
    display: 'flex', flexDirection: 'column' as CSSProperties['flexDirection'],
    alignItems: 'center', gap: 4, marginBottom: 16,
    background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px',
  },
  compatResultBox: {
    background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 18, padding: '20px 16px', marginTop: 20,
    display: 'flex', flexDirection: 'column' as CSSProperties['flexDirection'], gap: 12,
  },
  compatVsRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
  },
  compatOhBox: {
    display: 'flex', flexDirection: 'column' as CSSProperties['flexDirection'],
    alignItems: 'center', gap: 4,
  },
  compatVsEmoji: { fontSize: 32 },
  compatScoreRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  compatBarWrap: {
    height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden',
  },
  compatBar: { height: '100%', borderRadius: 5, transition: 'width 0.6s ease' },
  compatTitle: { fontSize: 15, fontWeight: 800, color: '#fff', textAlign: 'center' as CSSProperties['textAlign'] },
  compatDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, textAlign: 'center' as CSSProperties['textAlign'] },
};

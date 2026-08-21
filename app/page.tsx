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

// 36유형: 12간지(년지) × 오행 기질 3단계 (양기/음기/중심)
// tier 0 = 양기형 (dominant=木or火), tier 1 = 음기형 (dominant=金or水), tier 2 = 중심형 (dominant=土)
// index = zodiacIdx * 3 + tier
const PERSONALITY_TYPES = [
  // ── 원숭이 (year%12=0) ──
  { id: 'monkey_yang',  emoji: '🐒', title: '활화산 원숭이',   subtitle: '재치+열정 동시 폭발 타입',
    desc: '아이디어와 실행력이 동시에 넘침. 입이 먼저 행동이 나중이지만 결국 해내는 에너지형. 주변을 끊임없이 자극하는 존재.',
    tags: ['#재치왕', '#행동파', '#입이먼저손이나중'] },
  { id: 'monkey_yin',   emoji: '🐒', title: '전략가 원숭이',   subtitle: '겉은 얌전 속은 계산기',
    desc: '조용히 3수 앞을 읽는 타입. 말 없이 상황을 파악하고 결정적 순간에 정확하게 움직임. 임기응변의 끝판왕.',
    tags: ['#전략형', '#눈치만렙', '#겉얌전속야망'] },
  { id: 'monkey_earth', emoji: '🐒', title: '나무 원숭이',     subtitle: '어디서든 균형 잡는 타입',
    desc: '좌충우돌하면서도 결국 살아남는 생존 본능. 어떤 환경에서도 뿌리를 내리는 적응의 신.',
    tags: ['#적응력갑', '#균형잡기', '#좌충우돌생존'] },

  // ── 닭 (year%12=1) ──
  { id: 'rooster_yang',  emoji: '🐓', title: '불닭',           subtitle: '완벽주의+직설화법 끓는 타입',
    desc: '기준이 높고 직설적. 타협을 모르는 완벽주의자로, 화가 나면 불닭처럼 매워진다. 솔직함이 무기.',
    tags: ['#완벽주의', '#직설화법', '#기준이높아'] },
  { id: 'rooster_yin',   emoji: '🐓', title: '새벽닭',         subtitle: '혼자 담고 혼자 실망하는 타입',
    desc: '완벽주의인데 말 안 하고 혼자 다 담음. 기준치 높이고 실망도 혼자서. 직관력이 날카로운 속 깊은 타입.',
    tags: ['#속앓이형', '#말없는완벽주의', '#혼자기대혼자실망'] },
  { id: 'rooster_earth', emoji: '🐓', title: '모닝닭',         subtitle: '루틴이 곧 생명인 타입',
    desc: '규칙적이고 성실함. 루틴이 흔들리면 하루가 무너짐. 계획대로 될 때 가장 행복한 안정형.',
    tags: ['#루틴생명', '#성실함갑', '#계획이곧나'] },

  // ── 개 (year%12=2) ──
  { id: 'dog_yang',  emoji: '🐕', title: '불개',               subtitle: '의리+열정으로 사는 타입',
    desc: '내 사람한테는 불같이 헌신. 배신을 당하면 폭발이지만, 그 충직함이 진짜 매력인 타입.',
    tags: ['#의리파', '#충성심100', '#배신하지마'] },
  { id: 'dog_yin',   emoji: '🐕', title: '감시견',             subtitle: '말없이 다 지켜보는 타입',
    desc: '말없이 모든 걸 관찰하는 타입. 한번 믿으면 끝까지, 하지만 믿기까지가 오래 걸리는 신중한 충직함.',
    tags: ['#관찰형', '#신중한신뢰', '#다보고있어'] },
  { id: 'dog_earth', emoji: '🐕', title: '동네 개',            subtitle: '누구나 좋아하는 만능 친화력',
    desc: '어디 가든 사랑받는 타입. 친근하고 따뜻해서 금방 친해지고, 관계에서 갈등이 없는 만인의 친구.',
    tags: ['#친화력갑', '#사랑받는타입', '#만인의친구'] },

  // ── 돼지 (year%12=3) ──
  { id: 'pig_yang',  emoji: '🐷', title: '불돼지',             subtitle: '욕심과 열정이 함께 끓는 타입',
    desc: '좋아하는 건 다 해야 직성이 풀림. 욕심과 열정이 같이 끓어서 에너지가 넘치는 전방위 활력형.',
    tags: ['#욕심쟁이', '#열정폭발', '#다하고싶어'] },
  { id: 'pig_yin',   emoji: '🐷', title: '복돼지',             subtitle: '운이 따르는 행운의 타입',
    desc: '뭘 해도 어떻게든 풀리는 천운 타입. 낙천적이고 운이 따르며 주변도 밝게 만드는 행운의 마스코트.',
    tags: ['#천운타입', '#낙천주의', '#어떻게든됨'] },
  { id: 'pig_earth', emoji: '🐷', title: '풍요 돼지',          subtitle: '넉넉하게 다 챙겨주는 타입',
    desc: '넉넉하고 여유로운 성격. 나보다 주변을 먼저 챙기는 따뜻한 복덩이. 있는 것을 나누는 타입.',
    tags: ['#베푸는타입', '#복덩이', '#풍요롭게'] },

  // ── 쥐 (year%12=4) ──
  { id: 'rat_yang',  emoji: '🐭', title: '번개 쥐',            subtitle: '아이디어가 번개처럼 튀는 타입',
    desc: '아이디어가 폭발하고 입이 먼저. 실행이 나중이지만 결국 해냄. 주변 분위기를 환기시키는 존재.',
    tags: ['#아이디어뱅크', '#입이먼저', '#번개같은반응'] },
  { id: 'rat_yin',   emoji: '🐭', title: '스텔스 쥐',          subtitle: '조용히 3수 앞 읽는 타입',
    desc: '조용히 모든 걸 관찰하고 이미 결론을 낸 상태. 겉은 가만히 있어도 속은 풀가동 중인 두뇌형.',
    tags: ['#관찰의신', '#속으로계산중', '#겉조용속야망'] },
  { id: 'rat_earth', emoji: '🐭', title: '생존왕 쥐',          subtitle: '어디서나 살아남는 적응 끝판왕',
    desc: '어떤 환경에서도 살아남는 적응의 신. 눈치와 유연함으로 위기를 기회로 만드는 현실형 천재.',
    tags: ['#적응왕', '#생존본능', '#눈치만렙'] },

  // ── 소 (year%12=5) ──
  { id: 'ox_yang',  emoji: '🐄', title: '용암 소',             subtitle: '겉은 조용 속은 용암 타입',
    desc: '겉은 얌전하고 조용한데 속에 불길이 있음. 한번 터지면 진짜 무서운 타입. 참을 만큼 참았다면 조심.',
    tags: ['#겉조용속폭발', '#용암기질', '#참다참다터짐'] },
  { id: 'ox_yin',   emoji: '🐄', title: '철벽 소',             subtitle: '한번 결심하면 절대 안 바뀌는 타입',
    desc: '한번 마음먹으면 절대 안 바뀜. 설득도 협상도 불가. 집념의 대명사이자 의지력의 화신.',
    tags: ['#집념의화신', '#철벽마인드', '#설득불가'] },
  { id: 'ox_earth', emoji: '🐄', title: '대지 소',             subtitle: '묵묵히 가장 멀리 가는 타입',
    desc: '화려하지 않아도 결국 제일 멀리 가는 타입. 뚝심과 성실함으로 인생을 개척하는 묵묵한 강자.',
    tags: ['#뚝심형', '#성실함의끝', '#묵묵히나아감'] },

  // ── 호랑이 (year%12=6) ──
  { id: 'tiger_yang',  emoji: '🐯', title: '불호랑이',         subtitle: '열정+추진력 지금 당장 타입',
    desc: '열정과 추진력이 넘쳐서 기다리지 못함. 지금 당장 해야 직성이 풀리는 행동파. 목표 달성률 최강.',
    tags: ['#행동파', '#지금당장', '#추진력갑'] },
  { id: 'tiger_yin',   emoji: '🐯', title: '야행 호랑이',      subtitle: '밤이 되면 본성 드러나는 타입',
    desc: '낮엔 얌전하다가 밤이 되면 진짜 내가 나옴. 혼자일 때 에너지와 집중력이 최고치인 은밀한 타입.',
    tags: ['#야행성', '#밤에진짜나', '#낮과밤이달라'] },
  { id: 'tiger_earth', emoji: '🐯', title: '의리 호랑이',      subtitle: '자기 사람은 끝까지 지키는 타입',
    desc: '자기 사람한테는 어떤 상황에서도 끝까지. 의리 하나로 살아가는 진짜 친구의 정석.',
    tags: ['#의리최강', '#자기사람챙기기', '#배신안해'] },

  // ── 토끼 (year%12=7) ──
  { id: 'rabbit_yang',  emoji: '🐰', title: '핑크 토끼',       subtitle: '감성+활력 동시 폭발 타입',
    desc: '귀여운 것, 예쁜 것에 약하고 감성과 활력이 동시에 폭발. 표현력과 공감 능력이 탁월한 감성형.',
    tags: ['#감성폭발', '#귀여운거최고', '#표현력갑'] },
  { id: 'rabbit_yin',   emoji: '🐰', title: '새벽 토끼',       subtitle: '예민한 감성이 삶의 전부인 타입',
    desc: '예민하고 섬세한 감성파. 새벽 혼자 있는 시간이 진짜 나이고, 그때 충전이 되는 내향 감성형.',
    tags: ['#감성충만', '#혼자가필요해', '#예민한감수성'] },
  { id: 'rabbit_earth', emoji: '🐰', title: '솜털 토끼',       subtitle: '갈등 싫어하는 평화주의 타입',
    desc: '부드럽고 공감 잘 하는 평화주의자. 갈등이 싫고 모두와 사이좋게 지내는 세상의 윤활유.',
    tags: ['#평화주의', '#갈등싫어', '#모두와좋게'] },

  // ── 용 (year%12=8) ──
  { id: 'dragon_yang',  emoji: '🐉', title: '불용',            subtitle: '등장만으로 분위기 장악 타입',
    desc: '카리스마와 열정의 조합. 등장만으로 분위기가 달라지는 존재감 끝판왕. 스케일이 다른 삶을 삶.',
    tags: ['#카리스마폭발', '#존재감갑', '#분위기장악'] },
  { id: 'dragon_yin',   emoji: '🐉', title: '심해 용',         subtitle: '비밀 많은 내면의 야망가 타입',
    desc: '표면은 조용하지만 내면의 야망이 심해처럼 깊음. 비밀이 많고 직관이 탁월한 신비형.',
    tags: ['#비밀의야망', '#심해같은속', '#직관력MAX'] },
  { id: 'dragon_earth', emoji: '🐉', title: '구름 용',         subtitle: '꿈이 너무 커서 현실이 버거운 타입',
    desc: '이상주의적이고 몽환적. 꿈이 너무 크고 이상이 높아서 현실과 자주 충돌하는 로망 충만형.',
    tags: ['#이상주의자', '#꿈이너무커', '#몽환적인나'] },

  // ── 뱀 (year%12=9) ──
  { id: 'snake_yang',  emoji: '🐍', title: '불뱀',             subtitle: '한번 꽂히면 강렬하게 집착하는 타입',
    desc: '신비롭지만 불같은 열정. 한번 마음에 들면 강렬하게 빠져드는 집착과 열정의 타입.',
    tags: ['#강렬한집착', '#불같은열정', '#신비로운매력'] },
  { id: 'snake_yin',   emoji: '🐍', title: '얼음 뱀',          subtitle: '차갑지만 직관이 탁월한 타입',
    desc: '차갑고 계산적으로 보이지만 속은 섬세함. 직관력이 탁월하고 상황 파악이 남들보다 빠른 타입.',
    tags: ['#얼음외모', '#섬세한속', '#직관력끝판'] },
  { id: 'snake_earth', emoji: '🐍', title: '흙뱀',             subtitle: '느리지만 절대 포기 않는 타입',
    desc: '느려 보여도 자기 속도로 묵묵히 나아가는 타입. 절대 포기하지 않는 끈기의 화신.',
    tags: ['#묵묵히', '#포기없어', '#내속도가맞아'] },

  // ── 말 (year%12=10) ──
  { id: 'horse_yang',  emoji: '🐴', title: '불말',             subtitle: '가만히 있으면 오히려 고통인 타입',
    desc: '에너지 넘치고 자유를 사랑함. 가만히 있는 게 오히려 스트레스인 행동 중독 자유형.',
    tags: ['#자유영혼', '#에너지폭발', '#움직여야산다'] },
  { id: 'horse_yin',   emoji: '🐴', title: '달밤 말',          subtitle: '활발해 보이지만 혼자가 필요한 타입',
    desc: '겉으로는 활발하고 사교적이지만 혼자만의 시간이 절대적으로 필요한 내향 외향 혼합형.',
    tags: ['#AMBI형', '#혼자가필요해', '#겉활발속고독'] },
  { id: 'horse_earth', emoji: '🐴', title: '들말',             subtitle: '자유롭지만 관계에선 진지한 타입',
    desc: '자유분방하고 거침없지만 진짜 중요한 관계에서만큼은 의외로 꽤 진지하고 책임감 있음.',
    tags: ['#자유플러스책임', '#겉자유속진지', '#관계에선진심'] },

  // ── 양 (year%12=11) ──
  { id: 'goat_yang',  emoji: '🐑', title: '불양',              subtitle: '온순해 보이지만 속엔 강단 타입',
    desc: '온순해 보이지만 한번 밀리면 끝까지 가는 강단이 있음. 양 탈 쓴 늑대. 의외성 MAX.',
    tags: ['#양탈늑대', '#의외의강단', '#밀리면끝까지'] },
  { id: 'goat_yin',   emoji: '🐑', title: '안개 양',           subtitle: '감성이 삶의 전부인 예술형 타입',
    desc: '몽환적이고 예술적 감수성이 풍부. 음악과 감성 없이는 못 사는 예술혼 충만 타입.',
    tags: ['#감성예술형', '#음악없이못살아', '#몽환감성'] },
  { id: 'goat_earth', emoji: '🐑', title: '목장 양',           subtitle: '모두와 사이좋게 사는 평화주의 타입',
    desc: '평화를 사랑하고 모두와 사이좋게 지내는 따뜻한 타입. 갈등이 제일 무섭고 함께가 행복.',
    tags: ['#평화주의자', '#갈등싫어', '#다같이행복'] },
];

// 유형별 참여 통계 (사주 시뮬레이션 기반 시드값)
const TYPE_STATS: Record<string, number> = {
  monkey_yang: 3.2, monkey_yin: 2.7, monkey_earth: 2.0,
  rooster_yang: 3.5, rooster_yin: 2.8, rooster_earth: 2.2,
  dog_yang: 3.1, dog_yin: 2.6, dog_earth: 2.4,
  pig_yang: 2.9, pig_yin: 2.5, pig_earth: 2.1,
  rat_yang: 3.8, rat_yin: 3.1, rat_earth: 2.4,
  ox_yang: 3.0, ox_yin: 2.7, ox_earth: 2.5,
  tiger_yang: 3.6, tiger_yin: 3.0, tiger_earth: 2.3,
  rabbit_yang: 3.3, rabbit_yin: 2.9, rabbit_earth: 2.1,
  dragon_yang: 3.5, dragon_yin: 2.9, dragon_earth: 2.2,
  snake_yang: 3.0, snake_yin: 2.6, snake_earth: 1.9,
  horse_yang: 3.2, horse_yin: 2.8, horse_earth: 2.4,
  goat_yang: 3.1, goat_yin: 2.7, goat_earth: 2.0,
};
const TOTAL_PLAYERS = 14293;

// 12간지(zodiacIdx 0~11) × 오행 기질(tier: 0=양기木火, 1=음기金水, 2=중심土)
function getPersonalityType(zodiacIdx: number, dominantOh: Ohaeng) {
  const tier = (dominantOh === 'wood' || dominantOh === 'fire') ? 0
    : (dominantOh === 'water' || dominantOh === 'metal') ? 1 : 2;
  return PERSONALITY_TYPES[zodiacIdx * 3 + tier];
}

function getCategoryBreakdown(items: Ingredient[], weights?: number[]) {
  const scores: Record<string, number> = {};
  items.forEach((i, idx) => {
    const w = weights?.[idx] ?? 1;
    scores[i.category] = (scores[i.category] || 0) + w;
  });
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(scores)
    .map(([cat, score]) => ({ cat, count: score, pct: Math.round((score / total) * 1000) / 10 }))
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
  selectedWeights?: number[],
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
  const bd = getCategoryBreakdown(selected, selectedWeights);
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
  ctx.fillText(`신이 ${userName}${josa을를(userName)} 만들 때 🧪`, W/2, y+44);
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

// ── 한자 데이터베이스 (주요 이름 글자) ──────────────────────
type HanjaOpt = { h: string; hun: string };
const HANJA_DB: Record<string, HanjaOpt[]> = {
  가: [{ h: '佳', hun: '아름다울' }, { h: '嘉', hun: '아름다울' }, { h: '可', hun: '옳을' }],
  강: [{ h: '江', hun: '강' }, { h: '強', hun: '강할' }, { h: '康', hun: '편안할' }],
  건: [{ h: '建', hun: '세울' }, { h: '健', hun: '튼튼할' }],
  경: [{ h: '景', hun: '경치' }, { h: '敬', hun: '공경할' }, { h: '慶', hun: '경사' }, { h: '炅', hun: '빛날' }],
  광: [{ h: '光', hun: '빛' }, { h: '廣', hun: '넓을' }],
  규: [{ h: '奎', hun: '별' }, { h: '圭', hun: '홀' }],
  근: [{ h: '根', hun: '뿌리' }, { h: '勤', hun: '부지런할' }],
  기: [{ h: '基', hun: '터' }, { h: '起', hun: '일어날' }, { h: '琪', hun: '옥' }],
  길: [{ h: '吉', hun: '길할' }],
  남: [{ h: '南', hun: '남녘' }, { h: '男', hun: '사내' }],
  달: [{ h: '達', hun: '통달할' }],
  대: [{ h: '大', hun: '클' }, { h: '代', hun: '대신할' }],
  덕: [{ h: '德', hun: '덕' }],
  도: [{ h: '道', hun: '길' }, { h: '度', hun: '법도' }, { h: '桃', hun: '복숭아' }],
  동: [{ h: '東', hun: '동녘' }, { h: '同', hun: '같을' }, { h: '冬', hun: '겨울' }],
  련: [{ h: '蓮', hun: '연꽃' }],
  령: [{ h: '令', hun: '하여금' }, { h: '靈', hun: '신령' }],
  록: [{ h: '祿', hun: '복' }, { h: '綠', hun: '녹색' }],
  류: [{ h: '柳', hun: '버들' }, { h: '流', hun: '흐를' }],
  리: [{ h: '利', hun: '이로울' }, { h: '理', hun: '이치' }, { h: '李', hun: '오얏' }],
  린: [{ h: '麟', hun: '기린' }, { h: '璘', hun: '옥빛' }],
  만: [{ h: '萬', hun: '일만' }, { h: '滿', hun: '찰' }],
  명: [{ h: '明', hun: '밝을' }, { h: '命', hun: '목숨' }, { h: '銘', hun: '새길' }],
  무: [{ h: '武', hun: '굳셀' }, { h: '茂', hun: '무성할' }, { h: '務', hun: '힘쓸' }],
  문: [{ h: '文', hun: '글' }, { h: '門', hun: '문' }],
  미: [{ h: '美', hun: '아름다울' }, { h: '微', hun: '작을' }],
  민: [{ h: '民', hun: '백성' }, { h: '敏', hun: '민첩할' }, { h: '旻', hun: '하늘' }, { h: '珉', hun: '옥' }],
  박: [{ h: '朴', hun: '순박할' }, { h: '博', hun: '넓을' }],
  범: [{ h: '範', hun: '법' }, { h: '凡', hun: '무릇' }],
  병: [{ h: '炳', hun: '빛날' }, { h: '秉', hun: '잡을' }],
  보: [{ h: '寶', hun: '보물' }, { h: '普', hun: '넓을' }, { h: '輔', hun: '도울' }],
  복: [{ h: '福', hun: '복' }],
  봉: [{ h: '奉', hun: '받들' }, { h: '鳳', hun: '봉황' }],
  빈: [{ h: '彬', hun: '빛날' }, { h: '斌', hun: '빛날' }, { h: '賓', hun: '손님' }],
  상: [{ h: '相', hun: '서로' }, { h: '尙', hun: '높을' }, { h: '祥', hun: '상서' }],
  서: [{ h: '書', hun: '글' }, { h: '瑞', hun: '상서로울' }, { h: '徐', hun: '천천히' }],
  선: [{ h: '善', hun: '착할' }, { h: '宣', hun: '베풀' }, { h: '鮮', hun: '고울' }, { h: '仙', hun: '신선' }],
  성: [{ h: '成', hun: '이룰' }, { h: '誠', hun: '정성' }, { h: '星', hun: '별' }, { h: '聖', hun: '성인' }],
  세: [{ h: '世', hun: '세상' }, { h: '歲', hun: '해' }],
  소: [{ h: '小', hun: '작을' }, { h: '素', hun: '흴' }, { h: '昭', hun: '밝을' }],
  수: [{ h: '水', hun: '물' }, { h: '秀', hun: '빼어날' }, { h: '壽', hun: '목숨' }, { h: '洙', hun: '물이름' }, { h: '守', hun: '지킬' }],
  숙: [{ h: '淑', hun: '맑을' }, { h: '肅', hun: '엄숙할' }],
  순: [{ h: '順', hun: '순할' }, { h: '淳', hun: '순박할' }, { h: '純', hun: '순수할' }],
  승: [{ h: '承', hun: '이을' }, { h: '昇', hun: '오를' }, { h: '勝', hun: '이길' }],
  시: [{ h: '始', hun: '시작' }, { h: '時', hun: '때' }, { h: '詩', hun: '시' }],
  신: [{ h: '信', hun: '믿을' }, { h: '新', hun: '새' }, { h: '申', hun: '펼' }],
  아: [{ h: '雅', hun: '우아할' }, { h: '芽', hun: '싹' }],
  안: [{ h: '安', hun: '편안할' }],
  양: [{ h: '陽', hun: '볕' }, { h: '梁', hun: '들보' }],
  연: [{ h: '然', hun: '그럴' }, { h: '娟', hun: '예쁠' }, { h: '燕', hun: '제비' }, { h: '延', hun: '늘일' }],
  영: [{ h: '永', hun: '길' }, { h: '英', hun: '꽃부리' }, { h: '榮', hun: '영화' }, { h: '映', hun: '비출' }, { h: '瑛', hun: '옥빛' }],
  예: [{ h: '禮', hun: '예도' }, { h: '藝', hun: '재주' }],
  옥: [{ h: '玉', hun: '구슬' }],
  온: [{ h: '溫', hun: '따뜻할' }],
  용: [{ h: '勇', hun: '용감할' }, { h: '容', hun: '얼굴' }, { h: '龍', hun: '용' }],
  우: [{ h: '宇', hun: '집' }, { h: '友', hun: '벗' }, { h: '雨', hun: '비' }, { h: '佑', hun: '도울' }],
  욱: [{ h: '旭', hun: '해돋을' }, { h: '煜', hun: '빛날' }],
  원: [{ h: '源', hun: '근원' }, { h: '遠', hun: '멀' }, { h: '元', hun: '으뜸' }],
  유: [{ h: '有', hun: '있을' }, { h: '裕', hun: '넉넉할' }, { h: '儒', hun: '선비' }, { h: '柔', hun: '부드러울' }],
  윤: [{ h: '允', hun: '허락할' }, { h: '潤', hun: '윤택할' }, { h: '尹', hun: '다스릴' }],
  은: [{ h: '恩', hun: '은혜' }, { h: '銀', hun: '은' }, { h: '隱', hun: '숨을' }],
  의: [{ h: '義', hun: '옳을' }, { h: '意', hun: '뜻' }, { h: '毅', hun: '굳셀' }],
  인: [{ h: '仁', hun: '어질' }, { h: '引', hun: '끌' }, { h: '忍', hun: '참을' }],
  일: [{ h: '一', hun: '한' }, { h: '日', hun: '날' }, { h: '逸', hun: '편안할' }],
  임: [{ h: '林', hun: '수풀' }, { h: '任', hun: '맡길' }],
  재: [{ h: '材', hun: '재목' }, { h: '才', hun: '재주' }, { h: '在', hun: '있을' }, { h: '宰', hun: '재상' }],
  정: [{ h: '正', hun: '바를' }, { h: '貞', hun: '곧을' }, { h: '情', hun: '뜻' }, { h: '禎', hun: '상서' }, { h: '靜', hun: '고요할' }],
  조: [{ h: '照', hun: '비출' }, { h: '朝', hun: '아침' }, { h: '造', hun: '만들' }],
  종: [{ h: '宗', hun: '마루' }, { h: '鍾', hun: '쇠북' }],
  주: [{ h: '主', hun: '주인' }, { h: '周', hun: '두루' }, { h: '珠', hun: '구슬' }, { h: '柱', hun: '기둥' }],
  준: [{ h: '俊', hun: '준걸' }, { h: '準', hun: '법' }, { h: '竣', hun: '마칠' }, { h: '駿', hun: '준마' }, { h: '峻', hun: '높을' }],
  지: [{ h: '智', hun: '슬기' }, { h: '志', hun: '뜻' }, { h: '知', hun: '알' }, { h: '芝', hun: '지초' }],
  진: [{ h: '眞', hun: '참' }, { h: '珍', hun: '보배' }, { h: '振', hun: '떨칠' }, { h: '進', hun: '나아갈' }],
  찬: [{ h: '讚', hun: '기릴' }, { h: '燦', hun: '빛날' }],
  채: [{ h: '彩', hun: '빛' }, { h: '採', hun: '캘' }],
  철: [{ h: '哲', hun: '밝을' }, { h: '鐵', hun: '쇠' }],
  청: [{ h: '淸', hun: '맑을' }, { h: '靑', hun: '푸를' }],
  춘: [{ h: '春', hun: '봄' }],
  충: [{ h: '忠', hun: '충성' }],
  태: [{ h: '泰', hun: '클' }, { h: '太', hun: '클' }],
  택: [{ h: '澤', hun: '못' }],
  하: [{ h: '夏', hun: '여름' }, { h: '河', hun: '강' }, { h: '賀', hun: '축하할' }, { h: '霞', hun: '노을' }],
  학: [{ h: '學', hun: '배울' }, { h: '鶴', hun: '학' }],
  한: [{ h: '漢', hun: '한수' }, { h: '韓', hun: '나라이름' }],
  해: [{ h: '海', hun: '바다' }, { h: '解', hun: '풀' }],
  현: [{ h: '賢', hun: '어질' }, { h: '玄', hun: '검을' }, { h: '炫', hun: '빛날' }, { h: '鉉', hun: '솥귀' }],
  혜: [{ h: '慧', hun: '슬기' }, { h: '惠', hun: '은혜' }],
  호: [{ h: '好', hun: '좋을' }, { h: '虎', hun: '범' }, { h: '浩', hun: '클' }, { h: '昊', hun: '하늘' }],
  홍: [{ h: '洪', hun: '큰물' }, { h: '鴻', hun: '기러기' }, { h: '弘', hun: '넓을' }],
  화: [{ h: '和', hun: '화할' }, { h: '花', hun: '꽃' }, { h: '華', hun: '빛날' }],
  환: [{ h: '桓', hun: '굳셀' }, { h: '歡', hun: '기쁠' }],
  효: [{ h: '孝', hun: '효도' }, { h: '曉', hun: '새벽' }],
  훈: [{ h: '勳', hun: '공' }, { h: '薰', hun: '향기' }],
  휘: [{ h: '輝', hun: '빛날' }],
  희: [{ h: '希', hun: '바랄' }, { h: '喜', hun: '기쁠' }, { h: '熙', hun: '빛날' }],
};

// ── 이름 글자별 분해 ─────────────────────────────────────────
const CHO_CHARS  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JONG_CHARS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

type SyllableInfo = { char: string; cho: string; choOh: Ohaeng; jong: string | null; jongOh: Ohaeng | null };

function decomposeName(name: string): SyllableInfo[] {
  return [...name].flatMap(ch => {
    const code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return [];
    const offset = code - 0xAC00;
    const choIdx  = Math.floor(offset / 28 / 21);
    const jongIdx = offset % 28;
    const choOh  = CHO_OH[choIdx]!;
    const jongOh = jongIdx > 0 ? JONG_OH[jongIdx] : null;
    return [{ char: ch, cho: CHO_CHARS[choIdx], choOh, jong: jongIdx > 0 ? JONG_CHARS[jongIdx] : null, jongOh }];
  });
}

// 오행별 운세 영향
const OH_FORTUNE: Record<Ohaeng, { areas: string[]; desc: string }> = {
  wood:  { areas: ['성장운','건강운','추진력'], desc: '새로운 시작과 성장을 촉진하는 기운이에요. 끊임없이 뻗어나가는 에너지가 이름에 담겨 있어요.' },
  fire:  { areas: ['명예운','인기운','표현력'], desc: '밝고 열정적인 기운으로 대인관계와 사회적 인지도에 긍정적 영향을 줘요.' },
  earth: { areas: ['사업운','신뢰운','안정감'], desc: '묵직한 신뢰와 안정감을 주는 기운이에요. 사람들이 의지하게 되는 이름이에요.' },
  metal: { areas: ['재물운','결단력','집중력'], desc: '날카로운 판단력과 집중력을 높이는 기운이에요. 목표 달성에 도움을 줘요.' },
  water: { areas: ['지혜운','창의운','유연성'], desc: '깊은 지혜와 창의적 사고를 자극하는 기운이에요. 흐르는 물처럼 적응력이 높아요.' },
};

// ── 발음오행 분석 (작명소 원리) ────────────────────────────
// 초성 인덱스 → 오행 (0=ㄱ,1=ㄲ,2=ㄴ,3=ㄷ,4=ㄸ,5=ㄹ,6=ㅁ,7=ㅂ,8=ㅃ,9=ㅅ,10=ㅆ,11=ㅇ,12=ㅈ,13=ㅉ,14=ㅊ,15=ㅋ,16=ㅌ,17=ㅍ,18=ㅎ)
const CHO_OH: (Ohaeng | null)[] = [
  'wood','wood','fire','fire','fire','fire','water','water','water','metal','metal','earth','metal','metal','metal','wood','fire','water','earth',
];
// 종성 인덱스 → 오행 (0=없음, 나머지는 대표 자음으로 귀속)
const JONG_OH: (Ohaeng | null)[] = [
  null,                     // 0: 없음
  'wood','wood','wood',     // 1=ㄱ 2=ㄲ 3=ㄳ(ㄱ계)
  'fire','fire','fire',     // 4=ㄴ 5=ㄵ(ㄴ계) 6=ㄶ(ㄴ계)
  'fire',                   // 7=ㄷ
  'fire','wood','water','water','metal','fire','fire','fire', // 8=ㄹ 9=ㄺ(ㄱ계) 10=ㄻ(ㅁ계) 11=ㄼ(ㅂ계) 12=ㄽ(ㅅ계) 13=ㄾ(ㄹ계) 14=ㄿ(ㅍ계) 15=ㅀ(ㄹ계)
  'water',                  // 16=ㅁ
  'water','water',          // 17=ㅂ 18=ㅄ(ㅂ계)
  'metal','metal',          // 19=ㅅ 20=ㅆ
  'earth',                  // 21=ㅇ
  'metal','metal',          // 22=ㅈ 23=ㅊ
  'wood',                   // 24=ㅋ
  'fire',                   // 25=ㅌ
  'water',                  // 26=ㅍ
  'earth',                  // 27=ㅎ
];

function getNameOhaeng(name: string): Record<Ohaeng, number> {
  const scores: Record<Ohaeng, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const ch of name) {
    const code = ch.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) continue;
    const offset = code - 0xAC00;
    const choIdx = Math.floor(offset / 28 / 21);
    const jongIdx = offset % 28;
    const choOh = CHO_OH[choIdx];
    const jongOh = JONG_OH[jongIdx];
    if (choOh) scores[choOh]++;
    if (jongOh) scores[jongOh]++;
  }
  return scores;
}

// 상생·상극 관계
const SANGSAENG: Record<Ohaeng, Ohaeng> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const SANGGEUK: Record<Ohaeng, Ohaeng> = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
const OH_KR_SHORT: Record<Ohaeng, string> = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };

type NameAnalysis = {
  nameOh: Record<Ohaeng, number>;
  dominant: Ohaeng | null;
  grade: '최적' | '좋음' | '보통' | '주의';
  gradeColor: string;
  summary: string;
  detail: string;
};

function analyzeNameForSaju(name: string, sajuOh: Record<Ohaeng, number>): NameAnalysis {
  const nameOh = getNameOhaeng(name);
  const total = Object.values(nameOh).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return { nameOh, dominant: null, grade: '보통', gradeColor: '#aaa', summary: '한자 이름이 아니라 분석이 어려워요', detail: '' };
  }

  // 이름에서 가장 강한 오행
  const nameRanked = (Object.entries(nameOh) as [Ohaeng, number][]).sort((a, b) => b[1] - a[1]);
  const dominant = nameRanked[0][1] > 0 ? nameRanked[0][0] : null;

  // 사주에서 가장 약한 오행 (보완 대상)
  const sajuRanked = (Object.entries(sajuOh) as [Ohaeng, number][]).sort((a, b) => a[1] - b[1]);
  const weakest = sajuRanked[0][0];
  const strongest = (Object.entries(sajuOh) as [Ohaeng, number][]).sort((a, b) => b[1] - a[1])[0][0];

  if (!dominant) return { nameOh, dominant: null, grade: '보통', gradeColor: '#F5A83C', summary: '분석 불가', detail: '' };

  const completesWeak = dominant === weakest;
  const sangsaengWithStrong = SANGSAENG[strongest] === dominant || SANGSAENG[dominant] === strongest;
  const sanggeukWithStrong = SANGGEUK[dominant] === strongest || SANGGEUK[strongest] === dominant;

  let grade: NameAnalysis['grade'];
  let gradeColor: string;
  let summary: string;
  let detail: string;

  if (completesWeak && sangsaengWithStrong) {
    grade = '최적'; gradeColor = '#5CB85C';
    summary = `이름이 사주의 약한 ${OH_KR_SHORT[weakest]}을(를) 보완하고 강한 ${OH_KR_SHORT[strongest]}과 상생해요`;
    detail = `이름의 주요 기운 ${OH_KR_SHORT[dominant]}이(가) 사주에서 부족한 ${OH_KR_SHORT[weakest]}을(를) 채워주고, 사주 주도 기운 ${OH_KR_SHORT[strongest]}과 서로 기운을 키워줘요. 작명소에서 가장 좋게 보는 배합이에요.`;
  } else if (completesWeak) {
    grade = '좋음'; gradeColor = '#9B7FE0';
    summary = `이름이 사주의 약한 ${OH_KR_SHORT[weakest]}을(를) 잘 보완해줘요`;
    detail = `이름의 주요 기운 ${OH_KR_SHORT[dominant]}이(가) 사주에서 가장 부족한 ${OH_KR_SHORT[weakest]}을(를) 채워주는 역할을 해요. 작명에서 사주의 약점을 보완하는 것은 매우 중요하게 여겨요.`;
  } else if (sangsaengWithStrong && !sanggeukWithStrong) {
    grade = '좋음'; gradeColor = '#9B7FE0';
    summary = `이름이 사주 주도 기운 ${OH_KR_SHORT[strongest]}과 상생 관계예요`;
    detail = `이름의 ${OH_KR_SHORT[dominant]}과 사주의 강한 기운 ${OH_KR_SHORT[strongest]}이 서로 상생(相生)해요. 기운이 부드럽게 흘러 긍정적인 영향을 줘요.`;
  } else if (sanggeukWithStrong) {
    grade = '주의'; gradeColor = '#FF6B2F';
    summary = `이름과 사주 주도 기운 ${OH_KR_SHORT[strongest]}이 상극(相剋) 관계예요`;
    detail = `이름의 ${OH_KR_SHORT[dominant]}과 사주의 강한 기운 ${OH_KR_SHORT[strongest]}이 서로 억제하는 상극 관계예요. 작명소에서는 이 경우 이름을 바꾸거나 자를 조정하도록 권해요. 하지만 이름이 전부는 아니에요!`;
  } else {
    grade = '보통'; gradeColor = '#F5A83C';
    summary = `이름과 사주가 무난한 관계예요`;
    detail = `이름의 ${OH_KR_SHORT[dominant]} 기운이 사주와 특별히 상생하거나 상극하지 않아요. 무난한 배합으로 큰 문제는 없어요.`;
  }

  return { nameOh, dominant, grade, gradeColor, summary, detail };
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

// 한국어 조사 자동 선택 (받침 유무 판별)
function josa을를(name: string) {
  const code = name.charCodeAt(name.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return '를';
  return (code - 0xAC00) % 28 === 0 ? '를' : '을';
}
function josa이가(name: string) {
  const code = name.charCodeAt(name.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return '가';
  return (code - 0xAC00) % 28 === 0 ? '가' : '이';
}
function josa은는(name: string) {
  const code = name.charCodeAt(name.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return '는';
  return (code - 0xAC00) % 28 === 0 ? '는' : '은';
}

type Phase = 'intro' | 'naming' | 'pouring' | 'explosion' | 'result';

export default function GodGame() {
  const [phase, setPhase] = useState<Phase>('intro');

  // naming 단계 (1~5)
  const [namingStep, setNamingStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('');
  // 한자 확인
  const [hanjaSelections, setHanjaSelections] = useState<number[]>([]); // 글자별 선택 인덱스
  const [hanjaEditMode, setHanjaEditMode] = useState(false);            // 편집 모드
  const [hanjaConfirmed, setHanjaConfirmed] = useState(false);          // 확정 여부
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [dayInput, setDayInput] = useState('');
  const [zodiacInfo, setZodiacInfo] = useState<{ name: string; emoji: string } | null>(null);
  const [saJuIngs, setSaJuIngs] = useState<Ingredient[]>([]);

  const [selected, setSelected] = useState<Ingredient[]>([]);
  const selectedRef = useRef<Ingredient[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const selectedWeightsRef = useRef<number[]>([]);
  const [accidentals, setAccidentals] = useState<Set<string>>(new Set());
  const [emptyBottles, setEmptyBottles] = useState<Set<string>>(new Set());

  const [pourIsDrop, setPourIsDrop] = useState(false);

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
  const [showNameDetail, setShowNameDetail] = useState(false);
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
    if (!showResult || hasRecordedRef.current || !dominantOh) return;
    hasRecordedRef.current = true;
    const zi = ((parseInt(yearInput) % 12) + 12) % 12;
    const pt = getPersonalityType(zi, dominantOh);
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
    // 글자별 한자 초기 선택값 세팅
    const sels = [...name].map(() => 0);
    setHanjaSelections(sels);
    setHanjaEditMode(false);
    setHanjaConfirmed(false);
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
          setPourIsDrop(true);
          setGodClass('god-shake');
          const gt = setTimeout(() => { setGodClass(''); setPourIsDrop(false); }, 3200);
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
          setPourIsDrop(false);
          setAccidentals(prev => new Set([...prev, item.ing.id]));
        } else if (item.isEmpty) {
          const lineIdx = Math.floor(Math.random() * GOD_EMPTY_LINES.length);
          showGodSpeech(GOD_EMPTY_LINES[lineIdx](`${item.ing.emoji}${item.ing.name}`), 4000);
          setPourIsDrop(true);
          setGodClass('god-tilt');
          const gt = setTimeout(() => { setGodClass(''); setPourIsDrop(false); }, 3200);
          timers.current.push(gt);
          setEmptyBottles(prev => new Set([...prev, item.ing.id]));
        } else {
          setPourIsDrop(false);
          const lineIdx = Math.floor(Math.random() * GOD_SELECT_LINES.length);
          showGodSpeech(GOD_SELECT_LINES[lineIdx](userName || '너', `${item.ing.emoji}${item.ing.name}`, spoons));
        }

        setBouncingId(item.ing.id);
        const bt = setTimeout(() => setBouncingId(null), 400);
        timers.current.push(bt);

        const newSel = [...selectedRef.current, item.ing];
        selectedRef.current = newSel;
        setSelected(newSel);
        const newW = [...selectedWeightsRef.current, spoons];
        selectedWeightsRef.current = newW;
        setSelectedWeights(newW);

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
    selectedWeightsRef.current = [];
    setSelected([]); setSelectedWeights([]); setUserName(''); setNameInput(''); setNamingStep(0);
    setYearInput(''); setMonthInput(''); setDayInput('');
    setZodiacInfo(null); setSaJuIngs([]);
    setGodSvgType('idle'); setGodClass(''); setBeakerClass(''); setFlashClass('');
    setParticles([]); setShowResult(false); setShowStats(false); setBouncingId(null);
    setAccidentals(new Set()); setEmptyBottles(new Set()); setPourIsDrop(false);
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
    const zi = ((parseInt(yearInput) % 12) + 12) % 12;
    const pt = dominantOh ? getPersonalityType(zi, dominantOh) : PERSONALITY_TYPES[0];
    try {
      const blob = await generateShareImage(userName || '나', pt, selected, accidentals, emptyBottles, selectedWeights);
      const file = new File([blob], '신이나를만들때.png', { type: 'image/png' });
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: `신이 ${userName || '나'}${josa을를(userName || '나')} 만들 때 🧪` });
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
  const _zodiacIdx = yearInput ? ((parseInt(yearInput) % 12) + 12) % 12 : 0;
  const personality = showResult && dominantOh ? getPersonalityType(_zodiacIdx, dominantOh) : null;
  const breakdown = personality ? getCategoryBreakdown(selected, selectedWeights) : [];
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

          {/* step 2: 한자 확인 → 이름 반응 */}
          {namingStep === 2 && (() => {
            const chars = [...userName];
            const hanjaChars = chars.filter(ch => {
              const c = ch.charCodeAt(0);
              return c >= 0xAC00 && c <= 0xD7A3 && HANJA_DB[ch];
            });
            const hasHanja = hanjaChars.length > 0 && !hanjaConfirmed;

            if (hasHanja) {
              return (
                <div style={css.rpgBox}>
                  <div style={css.rpgSpeaker}>신 🌩️</div>
                  {!hanjaEditMode ? (
                    <>
                      <p style={css.rpgLine}><b>{userName}</b>...</p>
                      <p style={css.rpgLine}>이 이름의 한자는 이게 맞느냐?</p>
                      {/* 기본 추천 한자 카드 */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, margin: '12px 0 4px' }}>
                        {chars.map((ch, i) => {
                          const opts = HANJA_DB[ch];
                          const sel = hanjaSelections[i] ?? 0;
                          const opt = opts?.[sel];
                          return (
                            <div key={i} style={{
                              background: 'rgba(155,127,224,0.12)',
                              border: '1.5px solid rgba(155,127,224,0.4)',
                              borderRadius: 10, padding: '10px 14px',
                              textAlign: 'center' as const, minWidth: 64,
                            }}>
                              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{opt ? opt.h : ch}</div>
                              <div style={{ fontSize: 12, color: 'rgba(155,127,224,0.9)', fontWeight: 700, marginTop: 3 }}>{ch}</div>
                              {opt && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{opt.hun} {ch}</div>}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button style={{ ...css.rpgBtn, flex: 1 }} onClick={() => setHanjaConfirmed(true)}>맞아요 ✓</button>
                        <button style={{ ...css.rpgBtn, flex: 1, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                          onClick={() => setHanjaEditMode(true)}>바꿀게요 ✍️</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={css.rpgLine}>글자마다 한자를 골라보렴 👇</p>
                      {chars.map((ch, i) => {
                        const opts = HANJA_DB[ch];
                        if (!opts) return (
                          <div key={i} style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '6px 12px', margin: '4px 4px', fontSize: 16, color: '#fff' }}>{ch}</div>
                        );
                        const sel = hanjaSelections[i] ?? 0;
                        return (
                          <div key={i} style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                              <b style={{ color: '#fff' }}>{ch}</b> 의 한자
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                              {opts.map((opt, j) => (
                                <button key={j}
                                  onClick={() => {
                                    const next = [...hanjaSelections];
                                    next[i] = j;
                                    setHanjaSelections(next);
                                  }}
                                  style={{
                                    background: sel === j ? 'rgba(155,127,224,0.3)' : 'rgba(255,255,255,0.06)',
                                    border: `1.5px solid ${sel === j ? 'rgba(155,127,224,0.8)' : 'rgba(255,255,255,0.15)'}`,
                                    borderRadius: 10, padding: '8px 12px',
                                    cursor: 'pointer', textAlign: 'center' as const,
                                    color: '#fff',
                                  }}>
                                  <div style={{ fontSize: 20, fontWeight: 900 }}>{opt.h}</div>
                                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{opt.hun} {ch}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <button style={{ ...css.rpgBtn, width: '100%', marginTop: 4 }}
                        onClick={() => { setHanjaEditMode(false); setHanjaConfirmed(true); }}>
                        확정 ✓
                      </button>
                    </>
                  )}
                </div>
              );
            }

            // 한자 확인 완료 → 이름 반응
            return (
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
            );
          })()}

          {/* step 3: 생년월일 입력 */}
          {namingStep === 3 && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>그렇다면...</p>
              <p style={css.rpgLine}><b>{userName}</b>{josa은는(userName)} 언제 태어났느냐?</p>
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
              <p style={css.rpgLine}><b>{userName}</b>{josa은는(userName)} 언제쯤 태어났느냐?</p>
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
                    <span style={{ fontSize: 12, opacity: 0.7 }}>{slot.range}</span>
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
              신이 <span style={{ color: '#D4BFFF' }}>{displayName}</span>{josa을를(displayName)} 만들 때 🧪
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
                {godSvgType === 'idle' && <GodIdle count={selected.length} isDrop={pourIsDrop} />}
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
                        ...(isAcc && !isEmpty ? css.pourCardAcc : {}),
                        ...(isEmpty && !isAcc ? css.pourCardEmpty2 : {}),
                        ...(isEmpty && isAcc ? { background: 'rgba(255,80,80,0.12)', border: '1.5px dashed #FF6060', opacity: 0.82 } : {}),
                        ...(isEmpty ? { opacity: (isAcc ? 0.82 : 0.72) } : {}),
                      }}
                    >
                      <span style={{ ...css.pourEmoji, ...(isEmpty ? { fontSize: 20, filter: 'grayscale(40%)' } : {}) }}>{ing.emoji}</span>
                      <span style={{ ...css.pourName, ...(isEmpty ? { color: '#7BB8F5' } : {}) }}>{ing.name}</span>
                      {isAcc && !isEmpty && <span style={css.accBadgePour}>💥 실수</span>}
                      {isEmpty && !isAcc && <span style={css.emptyBadgePour}>💧 한방울</span>}
                      {isEmpty && isAcc && <span style={{ ...css.accBadgePour, fontSize: 8 }}>💥💧</span>}
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

      {/* ── 이름 × 사주 상세 분석 오버레이 ── */}
      {showNameDetail && ohScores && userName && (() => {
        const na = analyzeNameForSaju(userName, ohScores);
        const syllables = decomposeName(userName);
        if (syllables.length === 0) return null;

        const sajuRanked = (Object.entries(ohScores) as [Ohaeng,number][]).sort((a,b)=>a[1]-b[1]);
        const weakest  = sajuRanked[0][0];
        const weakest2 = sajuRanked[1][0];
        const sajuStrongest = (Object.entries(ohScores) as [Ohaeng,number][]).sort((a,b)=>b[1]-a[1])[0][0];

        const completesWeak   = na.dominant === weakest;
        const completesWeak2  = na.dominant === weakest2;
        const sangsaeng       = na.dominant ? (SANGSAENG[sajuStrongest] === na.dominant || SANGSAENG[na.dominant] === sajuStrongest) : false;
        const diversity       = Object.values(na.nameOh).filter(v => v > 0).length >= 2;

        const principles = [
          { label: '사주 약점 보완', pass: completesWeak || completesWeak2, desc: completesWeak ? `이름의 ${OH_KR_SHORT[na.dominant!]} 기운이 사주에서 가장 부족한 ${OH_KR_SHORT[weakest]}을(를) 직접 채워요` : completesWeak2 ? `사주에서 두 번째로 부족한 ${OH_KR_SHORT[weakest2]}을(를) 보완해요` : `이름의 주도 기운이 사주의 약점과 잘 맞지 않아요` },
          { label: '상생 흐름 형성', pass: sangsaeng, desc: sangsaeng ? `이름의 ${OH_KR_SHORT[na.dominant!]}과(와) 사주 주도 기운 ${OH_KR_SHORT[sajuStrongest]}이 상생(相生)해요` : `이름과 사주 주도 기운 사이에 상생 관계가 없어요` },
          { label: '오행 다양성',    pass: diversity, desc: diversity ? `이름에 ${Object.values(na.nameOh).filter(v=>v>0).length}가지 오행이 담겨 있어요` : `이름의 오행이 한 가지에 집중되어 있어요` },
        ];

        const fortuneOh = na.dominant ?? sajuStrongest;
        const fortune   = OH_FORTUNE[fortuneOh];

        return (
          <div className="result-slide" style={css.statsOverlay}>
            <div style={css.resultBg} />
            <div style={css.statsScroll}>
              <div style={css.statsContent}>

                {/* 헤더 */}
                <div style={css.statsHeader}>
                  <button style={css.statsBackBtn} onClick={() => setShowNameDetail(false)}>← 돌아가기</button>
                  <h2 style={css.statsTitle}>🔤 이름 × 사주 분석</h2>
                  <p style={css.statsSubtitle}>작명소 원리로 보는 이름과 사주의 관계</p>
                  {/* 선택된 한자 요약 */}
                  {hanjaSelections.length > 0 && [...userName].some(ch => HANJA_DB[ch]) && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginTop: 10, justifyContent: 'center' }}>
                      {[...userName].map((ch, i) => {
                        const opts = HANJA_DB[ch];
                        const opt = opts?.[hanjaSelections[i] ?? 0];
                        return (
                          <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                            {opt ? `${opt.h}(${opt.hun} ${ch})` : ch}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ① 글자별 발음오행 분해 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, marginBottom: 10 }}>STEP 1 — 글자별 발음오행 분해</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as CSSProperties['flexWrap'] }}>
                    {syllables.map((s, i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
                        borderRadius: 12, padding: '14px 16px', minWidth: 96, textAlign: 'center' as CSSProperties['textAlign'],
                      }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{s.char}</div>
                        {/* 초성 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{s.cho}</span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>→</span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: OHAENG_COLOR[s.choOh], background: `${OHAENG_COLOR[s.choOh]}22`, borderRadius: 6, padding: '2px 7px' }}>{OH_KR_SHORT[s.choOh]}</span>
                        </div>
                        {/* 종성 */}
                        {s.jong && s.jongOh && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.45)' }}>{s.jong}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>→</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: OHAENG_COLOR[s.jongOh], background: `${OHAENG_COLOR[s.jongOh]}18`, borderRadius: 6, padding: '2px 6px' }}>{OH_KR_SHORT[s.jongOh]}</span>
                          </div>
                        )}
                        {!s.jong && (
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>받침 없음</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 10, lineHeight: 1.6 }}>
                    초성(굵게) = 주요 오행 / 종성(연하게) = 보조 오행 · 자음이 없는 ㅇ은 중성으로 토(土) 배속
                  </div>
                </div>

                {/* ② 사주 vs 이름 오행 비교 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, marginBottom: 10 }}>STEP 2 — 사주 vs 이름 오행 비교</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 12, height: 6, borderRadius: 3, background: 'rgba(155,127,224,0.9)' }} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>사주</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 12, height: 6, borderRadius: 3, background: 'rgba(155,127,224,0.35)' }} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>이름</span>
                    </div>
                  </div>
                  {(['wood','fire','earth','metal','water'] as Ohaeng[]).map(oh => {
                    const sajuV = ohScores[oh];
                    const nameV = na.nameOh[oh];
                    const sajuMax = Math.max(...Object.values(ohScores)) || 1;
                    const nameMax = Math.max(...Object.values(na.nameOh)) || 1;
                    const isWeak  = oh === weakest;
                    const isNamed = nameV > 0 && oh === na.dominant;
                    return (
                      <div key={oh} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 58, fontSize: 11, color: OHAENG_COLOR[oh], fontWeight: 700, flexShrink: 0 }}>{OH_KR_SHORT[oh]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 3 }}>
                            <div style={{ height: '100%', width: `${(sajuV/sajuMax)*100}%`, background: OHAENG_COLOR[oh], borderRadius: 4 }} />
                          </div>
                          <div style={{ height: 7, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(nameV/nameMax)*100}%`, background: OHAENG_COLOR[oh], borderRadius: 4, opacity: 0.4 }} />
                          </div>
                        </div>
                        <div style={{ width: 60, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', flexShrink: 0 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>사주 ×{sajuV}{isWeak?' 🔻':''}</span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>이름 ×{nameV}{isNamed?' ✦':''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ③ 작명 3원칙 체크 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, marginBottom: 10 }}>STEP 3 — 작명 3원칙 체크</div>
                  {principles.map((p, i) => (
                    <div key={i} style={{
                      background: p.pass ? 'rgba(91,184,91,0.08)' : 'rgba(255,120,80,0.08)',
                      border: `1.5px solid ${p.pass ? 'rgba(91,184,91,0.3)' : 'rgba(255,120,80,0.25)'}`,
                      borderRadius: 10, padding: '12px 14px', marginBottom: 8,
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{p.pass ? '✅' : '⚠️'}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: p.pass ? '#7BE07B' : '#FF9060', marginBottom: 3 }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ④ 이름이 강화하는 운세 */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, marginBottom: 10 }}>STEP 4 — 이름이 강화하는 운세</div>
                  <div style={{
                    background: `${OHAENG_COLOR[fortuneOh]}18`,
                    border: `1.5px solid ${OHAENG_COLOR[fortuneOh]}44`,
                    borderRadius: 12, padding: '16px',
                  }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as CSSProperties['flexWrap'], marginBottom: 10 }}>
                      {fortune.areas.map(a => (
                        <span key={a} style={{
                          background: `${OHAENG_COLOR[fortuneOh]}2A`,
                          border: `1px solid ${OHAENG_COLOR[fortuneOh]}55`,
                          borderRadius: 999, padding: '4px 12px',
                          fontSize: 12, fontWeight: 700, color: OHAENG_COLOR[fortuneOh],
                        }}>{a}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>{fortune.desc}</p>
                  </div>
                </div>

                {/* ⑤ 종합 판정 */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, marginBottom: 10 }}>종합 판정</div>
                  <div style={{
                    background: `${na.gradeColor}18`, border: `2px solid ${na.gradeColor}55`,
                    borderRadius: 14, padding: '18px 16px', textAlign: 'center' as CSSProperties['textAlign'],
                  }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: na.gradeColor, marginBottom: 6 }}>{na.grade}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{na.summary}</div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{na.detail}</p>
                    <div style={{ marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      통과한 원칙: {principles.filter(p=>p.pass).length} / {principles.length}개
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.7, marginBottom: 8 }}>
                  * 발음오행은 한국의 전통 작명 원리 중 하나예요.<br/>
                  실제 작명소에서는 획수·음양·자원오행 등도 함께 검토해요.
                </div>

              </div>
            </div>
          </div>
        );
      })()}

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
                <div style={css.resultHeaderBadge}>🧪 실험 결과 — 신이 {displayName}{josa을를(displayName)} 만들 때</div>
              </div>

              <div style={css.typeCard}>
                <div style={css.typeEmoji}>{personality.emoji}</div>
                <div style={css.typeTitle}>{personality.title}</div>
                <div style={css.typeSub}>{personality.subtitle}</div>
              </div>

              <div style={css.section}>
                <div style={css.sectionTitle}>📦 신이 넣은 재료</div>
                <p style={{ ...css.sectionTitle, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 400, marginTop: -8, marginBottom: 8 } as CSSProperties}>
                  재료를 누르면 명리학 배속 이유를 볼 수 있어
                </p>

                {/* ① 정상 재료 — 많이 들어간 것들 */}
                {selected.some(ing => !accidentals.has(ing.id) && !emptyBottles.has(ing.id)) && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 3, height: 14, background: '#9B7FE0', borderRadius: 2 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>가득 들어간 것들</span>
                    </div>
                    <div style={css.recapGrid}>
                      {selected.filter(ing => !accidentals.has(ing.id) && !emptyBottles.has(ing.id)).map(ing => (
                        <div key={ing.id}
                          onClick={() => setTooltipIngId(tooltipIngId === ing.id ? null : ing.id)}
                          style={{ ...css.recapChip, cursor: 'pointer', position: 'relative' }}>
                          <span style={{ fontSize: 20 }}>{ing.emoji}</span>
                          <span style={css.recapName}>{ing.name}</span>
                          {tooltipIngId === ing.id && (
                            <div style={css.ingTooltip}>
                              <span style={{ color: OHAENG_COLOR[ING_OHAENG[ing.id]] }}>{OHAENG_KR[ING_OHAENG[ing.id]]}</span>
                              <br/>{ING_TOOLTIP[ing.id]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ② 한방울만 들어간 것들 — 있을 때만 */}
                {selected.some(ing => !accidentals.has(ing.id) && emptyBottles.has(ing.id)) && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 8 }}>
                      <div style={{ width: 3, height: 14, background: '#5BB8FF', borderRadius: 2 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#5BB8FF', letterSpacing: 0.5 }}>한방울만 들어간 것들</span>
                      <span style={{ fontSize: 11, color: 'rgba(91,184,255,0.6)' }}>— 병이 비어서 겨우 뚝...</span>
                    </div>
                    <div style={css.recapGrid}>
                      {selected.filter(ing => !accidentals.has(ing.id) && emptyBottles.has(ing.id)).map(ing => (
                        <div key={ing.id}
                          onClick={() => setTooltipIngId(tooltipIngId === ing.id ? null : ing.id)}
                          style={{
                            background: 'rgba(91,184,255,0.06)',
                            border: '1.5px dashed rgba(91,184,255,0.35)',
                            borderRadius: 8, padding: '5px 10px',
                            display: 'flex', alignItems: 'center', gap: 5,
                            cursor: 'pointer', position: 'relative', opacity: 0.78,
                          }}>
                          <span style={{ fontSize: 14, filter: 'grayscale(55%) opacity(0.8)' }}>{ing.emoji}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{ing.name}</span>
                          <span style={{ fontSize: 9, color: '#5BB8FF', marginLeft: 1 }}>💧</span>
                          {tooltipIngId === ing.id && (
                            <div style={css.ingTooltip}>
                              <span style={{ color: OHAENG_COLOR[ING_OHAENG[ing.id]] }}>{OHAENG_KR[ING_OHAENG[ing.id]]}</span>
                              <br/>{ING_TOOLTIP[ing.id]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ③ 실수로 들어간 것들 — 있을 때만 */}
                {selected.some(ing => accidentals.has(ing.id)) && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 8 }}>
                      <div style={{ width: 3, height: 14, background: '#FF8C42', borderRadius: 2 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFCC80', letterSpacing: 0.5 }}>실수로 들어간 것들</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,204,128,0.6)' }}>— 신이 미끄러졌어</span>
                    </div>
                    <div style={css.recapGrid}>
                      {selected.filter(ing => accidentals.has(ing.id)).map(ing => (
                        <div key={ing.id}
                          onClick={() => setTooltipIngId(tooltipIngId === ing.id ? null : ing.id)}
                          style={{
                            ...css.recapChip,
                            ...css.recapChipAcc,
                            ...(emptyBottles.has(ing.id) ? { border: '1.5px dashed rgba(255,80,80,0.45)', opacity: 0.8 } : {}),
                            cursor: 'pointer', position: 'relative',
                          }}>
                          <span style={{ fontSize: emptyBottles.has(ing.id) ? 15 : 20, filter: emptyBottles.has(ing.id) ? 'grayscale(40%)' : 'none' }}>{ing.emoji}</span>
                          <span style={{ ...css.recapName, ...(emptyBottles.has(ing.id) ? { fontSize: 11, opacity: 0.75 } : {}) }}>{ing.name}</span>
                          {emptyBottles.has(ing.id) && <span style={{ ...css.emptyLabel, fontSize: 9 }}>💧</span>}
                          {tooltipIngId === ing.id && (
                            <div style={css.ingTooltip}>
                              <span style={{ color: OHAENG_COLOR[ING_OHAENG[ing.id]] }}>{OHAENG_KR[ING_OHAENG[ing.id]]}</span>
                              <br/>{ING_TOOLTIP[ing.id]}
                              {dominantOh && (
                                <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(155,127,224,0.3)', color: '#FFCC80', fontSize: 10, lineHeight: 1.5 }}>
                                  💥 왜 실수로 들어갔냐면: {getAccidentReason(ing.id, dominantOh)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
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
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 4 }}>×{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ohScores && userName && (() => {
                const na = analyzeNameForSaju(userName, ohScores);
                const nameTotal = Object.values(na.nameOh).reduce((a, b) => a + b, 0);
                if (nameTotal === 0) return null;
                const nameRanked = (Object.entries(na.nameOh) as [Ohaeng, number][]).filter(([,v]) => v > 0).sort((a,b)=>b[1]-a[1]);
                return (
                  <div style={css.section}>
                    <div style={css.sectionTitle}>🔤 이름 발음오행 분석</div>
                    {/* 선택된 한자 표시 */}
                    {hanjaSelections.length > 0 && (() => {
                      const chars = [...userName];
                      const hasAny = chars.some(ch => HANJA_DB[ch]);
                      if (!hasAny) return null;
                      return (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10, alignItems: 'center' }}>
                          {chars.map((ch, i) => {
                            const opts = HANJA_DB[ch];
                            const opt = opts?.[hanjaSelections[i] ?? 0];
                            return (
                              <div key={i} style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 8, padding: '5px 10px',
                                textAlign: 'center' as const,
                              }}>
                                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{opt ? opt.h : ch}</div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{opt ? `${opt.hun} ${ch}` : ch}</div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                    {/* 이름 오행 칩 */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {nameRanked.map(([oh, v]) => (
                        <div key={oh} style={{
                          background: `${OHAENG_COLOR[oh as Ohaeng]}22`,
                          border: `1.5px solid ${OHAENG_COLOR[oh as Ohaeng]}`,
                          borderRadius: 8, padding: '6px 12px',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          <span style={{ color: OHAENG_COLOR[oh as Ohaeng], fontWeight: 800, fontSize: 13 }}>{OH_KR_SHORT[oh as Ohaeng]}</span>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>×{v}</span>
                        </div>
                      ))}
                    </div>
                    {/* 등급 배지 + 요약 */}
                    <div style={{
                      background: `${na.gradeColor}18`, border: `1.5px solid ${na.gradeColor}55`,
                      borderRadius: 12, padding: '14px 16px', marginBottom: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{
                          background: na.gradeColor, color: '#fff',
                          fontWeight: 900, fontSize: 13, borderRadius: 999, padding: '3px 10px',
                        }}>{na.grade}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{na.summary}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, margin: 0 }}>{na.detail}</p>
                    </div>
                    {/* 사주 vs 이름 비교 바 */}
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: 0.5 }}>사주 vs 이름 오행 비교</div>
                    {(['wood','fire','earth','metal','water'] as Ohaeng[]).map(oh => {
                      const sajuV = ohScores[oh];
                      const nameV = na.nameOh[oh];
                      const sajuMax = Math.max(...Object.values(ohScores)) || 1;
                      const nameMax = Math.max(...Object.values(na.nameOh)) || 1;
                      return (
                        <div key={oh} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ width: 56, fontSize: 11, color: OHAENG_COLOR[oh], fontWeight: 700, flexShrink: 0 }}>{OH_KR_SHORT[oh]}</span>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${(sajuV / sajuMax) * 100}%`, background: OHAENG_COLOR[oh], borderRadius: 3, opacity: 0.9 }} />
                            </div>
                            <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${(nameV / nameMax) * 100}%`, background: OHAENG_COLOR[oh], borderRadius: 3, opacity: 0.4 }} />
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end', width: 52 }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>사주 ×{sajuV}</span>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>이름 ×{nameV}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
                      * 발음오행은 이름 각 글자의 초성·종성 자음을 오행에 배속해 분석해요. 한글 이름만 분석 가능해요.
                    </div>
                    <button
                      style={{
                        width: '100%', marginTop: 14,
                        background: 'rgba(155,127,224,0.12)', border: '1.5px solid rgba(155,127,224,0.4)',
                        borderRadius: 10, padding: '11px 0', color: '#C4ADFF',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      }}
                      onClick={() => setShowNameDetail(true)}
                    >
                      🔍 이름 × 사주 상세 분석 보기
                    </button>
                  </div>
                );
              })()}

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
              <div style={css.bottomTag}>#신이나를만들때 #신이{displayName}{josa을를(displayName)}만들때</div>
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
    fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
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
    background: 'white', color: '#222', fontSize: 14, fontWeight: 700,
    padding: '8px 16px', borderRadius: 12, lineHeight: 1.6,
    border: '2px solid #222', textAlign: 'center', marginBottom: -8,
    position: 'relative', zIndex: 1,
    boxShadow: '3px 3px 0px #222',
  },
  startBtn: {
    marginTop: 16,
    background: '#9B7FE0', border: '3px solid #2C1810', borderRadius: 12,
    padding: '16px 48px', color: '#fff', fontSize: 18, fontWeight: 900,
    cursor: 'pointer', letterSpacing: 1,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    transition: 'transform 0.1s',
  },
  introWarning: {
    fontSize: 12, color: 'rgba(120,70,10,0.75)', textAlign: 'center',
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
    padding: '24px',
    position: 'relative',
  },
  rpgSpeaker: {
    background: 'rgba(155,127,224,0.3)', border: '1.5px solid rgba(155,127,224,0.6)',
    color: '#D4BFFF', fontSize: 13, fontWeight: 800,
    padding: '4px 12px', borderRadius: '8px 8px 0 0',
    display: 'inline-block', marginBottom: 16,
  },
  rpgLine: {
    color: '#fff', fontSize: 16, lineHeight: 1.8, margin: '2px 0',
  },
  rpgInputRow: {
    display: 'flex', gap: 8, marginTop: 16,
  },
  rpgInput: {
    flex: 1, background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(155,127,224,0.5)', borderRadius: 8,
    padding: '12px 14px', color: '#fff', fontSize: 16, outline: 'none',
  },
  rpgBtn: {
    background: '#9B7FE0', border: 'none', borderRadius: 8,
    padding: '12px 16px', color: '#fff', fontSize: 14,
    fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap',
    marginTop: 16, alignSelf: 'flex-end',
  },

  // 클릭 진행 화살표 버튼
  rpgAdvanceRow: {
    display: 'flex', justifyContent: 'flex-end', marginTop: 18,
  },
  rpgAdvanceBtn: {
    background: 'rgba(155,127,224,0.25)', border: '2px solid rgba(155,127,224,0.6)',
    borderRadius: 8, padding: '8px 20px', color: '#D4BFFF',
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
    display: 'flex', gap: 8, marginTop: 16,
  },
  noBtn: {
    flex: 1, background: 'rgba(255,80,80,0.15)', border: '2px solid #FF6060',
    borderRadius: 12, padding: '14px 0', color: '#FF9090',
    fontSize: 16, fontWeight: 800, cursor: 'pointer',
  },
  yesBtn: {
    flex: 1, background: '#9B7FE0', border: '2px solid #fff',
    borderRadius: 12, padding: '14px 0', color: '#fff',
    fontSize: 16, fontWeight: 800, cursor: 'pointer',
    boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
  },

  // 시주 선택
  timeGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14,
  },
  timeBtn: {
    display: 'flex', flexDirection: 'column' as CSSProperties['flexDirection'],
    alignItems: 'center', gap: 4, padding: '12px 8px',
    background: 'rgba(255,255,255,0.05)', border: '1.5px solid',
    borderRadius: 12, cursor: 'pointer',
    transition: 'background 0.15s',
  },
  skipTimeBtn: {
    marginTop: 8, width: '100%', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
    padding: '12px 0', color: 'rgba(255,255,255,0.35)',
    fontSize: 14, cursor: 'pointer',
  },

  // 생년월일 입력 전용
  dateRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap',
  },
  dateInputYear: {
    width: 80, background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(155,127,224,0.5)', borderRadius: 8,
    padding: '12px 10px', color: '#fff', fontSize: 16, outline: 'none',
    textAlign: 'center',
  },
  dateInputShort: {
    width: 52, background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(155,127,224,0.5)', borderRadius: 8,
    padding: '12px 8px', color: '#fff', fontSize: 16, outline: 'none',
    textAlign: 'center',
  },
  dateLabel: {
    color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 600,
  },

  dots: { display: 'flex', gap: 8, alignItems: 'center', marginTop: 16 },

  // ── 게임 ──
  container: {
    width: '100%', maxWidth: 480, flex: 1,
    display: 'flex', flexDirection: 'column',
    padding: '0 0 80px', position: 'relative', zIndex: 1,
  },
  header: {
    padding: '16px 20px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  headerBadge: {
    background: 'rgba(155,127,224,0.25)', color: '#C4ADFF',
    fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
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
    background: 'white', color: '#222', fontSize: 12, fontWeight: 700,
    padding: '8px 12px', borderRadius: 8, lineHeight: 1.5,
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
    background: 'rgba(91,184,255,0.08)', border: '1.5px dashed rgba(91,184,255,0.5)',
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
    borderRadius: 16, padding: '20px 30px', textAlign: 'center',
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
    color: '#C4ADFF', fontSize: 12, fontWeight: 700,
    padding: '6px 16px', borderRadius: 999, textAlign: 'center',
  },
  typeCard: {
    background: 'linear-gradient(135deg, rgba(155,127,224,0.28), rgba(107,181,255,0.14))',
    border: '1.5px solid rgba(155,127,224,0.35)',
    borderRadius: 16, padding: '28px 20px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24,
  },
  typeEmoji: { fontSize: 72, lineHeight: 1, marginBottom: 4, userSelect: 'none' },
  typeTitle: { fontSize: 22, fontWeight: 900, color: '#fff' },
  typeSub: { fontSize: 14, color: 'rgba(255,255,255,0.55)' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 12, letterSpacing: 0.3 },
  recapGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  recapChip: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
  },
  recapChipAcc: { background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.3)' },
  recapChipEmpty: {
    background: 'rgba(100,180,255,0.06)',
    border: '1px dashed rgba(100,180,255,0.35)',
    opacity: 0.72,
  },
  recapName: { fontSize: 13, fontWeight: 600, color: '#fff' },
  accLabel: {
    fontSize: 10, fontWeight: 800, color: '#FF8080',
    background: 'rgba(255,80,80,0.2)', borderRadius: 999, padding: '1px 6px',
  },
  emptyLabel: {
    fontSize: 10, fontWeight: 800, color: '#7BB8F5',
    background: 'rgba(100,180,255,0.2)', borderRadius: 999, padding: '1px 6px',
  },

  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  barLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', width: 90, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  barPct: { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', width: 42, textAlign: 'right' },

  descBox: { background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 12 },
  descText: { fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65 },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: {
    background: 'rgba(155,127,224,0.18)', border: '1px solid rgba(155,127,224,0.28)',
    borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#D4BFFF',
  },

  actionRow: { display: 'flex', gap: 8, marginBottom: 16 },
  shareBtn: {
    flex: 1, background: '#9B7FE0', border: 'none', borderRadius: 12,
    padding: '14px 0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  resetBtn: {
    flex: 1, background: 'transparent', border: '1.5px solid #9B7FE0', borderRadius: 12,
    padding: '14px 0', color: '#C084FC', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  bottomTag: { fontSize: 12, color: 'rgba(255,255,255,0.28)', textAlign: 'center' },

  copyLinkBtn: {
    width: '100%', background: 'rgba(91,184,255,0.1)', border: '1.5px solid rgba(91,184,255,0.4)',
    borderRadius: 12, padding: '12px 0', color: '#5BB8FF', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', marginBottom: 8, marginTop: 4,
  },
  statsBtn: {
    width: '100%', background: 'rgba(155,127,224,0.12)', border: '1.5px solid rgba(155,127,224,0.4)',
    borderRadius: 12, padding: '14px 0', color: '#C4ADFF', fontSize: 14,
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
    borderRadius: 8, padding: '8px 14px', color: 'rgba(255,255,255,0.55)', fontSize: 14,
    cursor: 'pointer', marginBottom: 16,
  },
  statsTitle: { fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 },
  statsSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 4 },

  myTypeCard: {
    background: 'linear-gradient(135deg, rgba(155,127,224,0.28), rgba(107,181,255,0.14))',
    border: '1.5px solid rgba(155,127,224,0.5)',
    borderRadius: 16, padding: '16px 20px',
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
  },
  myTypeEmoji: { fontSize: 52, lineHeight: 1 },
  myTypeTitle: { fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 4 },
  myTypeRank: { fontSize: 14, color: '#D4BFFF', fontWeight: 600 },

  statsListWrapper: { display: 'flex', flexDirection: 'column', gap: 8 },
  statsRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  statsRowMe: {
    background: 'rgba(155,127,224,0.15)', border: '1.5px solid rgba(155,127,224,0.45)',
  },
  statsRank: { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 18, textAlign: 'center' as CSSProperties['textAlign'] },
  statsTypeEmoji: { fontSize: 26, lineHeight: 1 },
  statsInfo: { flex: 1 },
  statsTypeName: { fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 },
  statsBarWrap: { height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  statsBar: { height: '100%', borderRadius: 3, transition: 'width 0.6s ease' },
  statsPct: { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)', width: 36, textAlign: 'right' as CSSProperties['textAlign'] },
  statsMeBadge: {
    background: '#9B7FE0', color: '#fff', fontSize: 10, fontWeight: 800,
    borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap' as CSSProperties['whiteSpace'],
  },
  statsFooter: { fontSize: 12, color: 'rgba(255,255,255,0.22)', textAlign: 'center', marginTop: 20 },

  // ── 재료 툴팁 ──
  ingTooltip: {
    position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
    transform: 'translateX(-50%)',
    background: '#1A0D38', border: '1.5px solid rgba(155,127,224,0.5)',
    borderRadius: 8, padding: '8px 12px', fontSize: 12, lineHeight: 1.6,
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
    borderRadius: 12, padding: '12px 0', color: '#FF6B8A', fontSize: 14,
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

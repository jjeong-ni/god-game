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
  { id: 'emotional', emoji: '🎭', title: 'K-드라마 주인공',     subtitle: '감성 MAX 공감 천재',       dominant: ['emotion', 'social'],
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
  if (sorted.length >= 4 && sorted[0][1] === 1) return PERSONALITY_TYPES.find(p => p.id === 'chaotic')!;
  const topCat = sorted[0]?.[0];
  const topCount = sorted[0]?.[1] ?? 0;
  return PERSONALITY_TYPES.find(p => topCount >= 2 && p.dominant.includes(topCat))
    ?? PERSONALITY_TYPES.find(p => p.id === 'chaotic')!;
}

function getCategoryBreakdown(items: Ingredient[]) {
  const counts: Record<string, number> = {};
  items.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
  return Object.entries(counts)
    .map(([cat, count]) => ({ cat, count, pct: Math.round((count / items.length) * 100) }))
    .sort((a, b) => b.count - a.count);
}

// ── 12지신 사주명리학 ──
const ZODIAC = [
  { name: '원숭이', emoji: '🐒', primary: 'talkative' },
  { name: '닭',     emoji: '🐓', primary: 'coffee' },
  { name: '개',     emoji: '🐕', primary: 'laugh' },
  { name: '돼지',   emoji: '🐷', primary: 'food' },
  { name: '쥐',     emoji: '🐭', primary: 'night' },
  { name: '소',     emoji: '🐄', primary: 'stubborn' },
  { name: '호랑이', emoji: '🐯', primary: 'emotional' },
  { name: '토끼',   emoji: '🐰', primary: 'sensitive' },
  { name: '용',     emoji: '🐉', primary: 'overthink' },
  { name: '뱀',     emoji: '🐍', primary: 'perfect' },
  { name: '말',     emoji: '🐴', primary: 'fitness' },
  { name: '양',     emoji: '🐑', primary: 'sleep' },
] as const;

const MONTH_ING: Record<number, string> = {
  1: 'overthink', 2: 'emotional', 3: 'fitness',  4: 'sensitive',
  5: 'perfect',   6: 'talkative', 7: 'gaming',   8: 'food',
  9: 'stubborn',  10: 'broke',   11: 'night',    12: 'sleep',
};

function getDayIng(day: number): string {
  if (day <= 7) return 'phone';
  if (day <= 14) return 'clumsy';
  if (day <= 21) return 'coffee';
  if (day <= 28) return 'laugh';
  return 'broke';
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

function selectBySaju(year: number, month: number, day: number): {
  ings: Ingredient[];
  zodiac: { name: string; emoji: string };
} {
  const zodiac = ZODIAC[((year % 12) + 12) % 12];
  const seed = year * 10000 + month * 100 + day;
  const rand = seededRandom(seed);

  // 년/월/일이 같은 재료로 매핑될 수 있으므로 중복 제거
  const primaryIds = [...new Set([
    zodiac.primary,
    MONTH_ING[month] ?? 'sleep',
    getDayIng(day),
  ])];
  const seen = new Set<string>(primaryIds);
  const primary = primaryIds
    .map(id => (INGREDIENTS as readonly Ingredient[]).find(i => i.id === id))
    .filter((i): i is Ingredient => !!i);

  const remaining = (INGREDIENTS as readonly Ingredient[]).filter(i => !seen.has(i.id));
  const shuffled = [...remaining];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const ings = [...primary, ...shuffled.slice(0, MAX - primary.length)].slice(0, MAX);
  return { ings, zodiac: { name: zodiac.name, emoji: zodiac.emoji } };
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

  useEffect(() => {
    if (phase !== 'naming') return;
    const t = setTimeout(() => setNamingStep(1), 400);
    return () => clearTimeout(t);
  }, [phase]);

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

  // 생년월일 확인 → 사주 계산 → step4
  const handleDateSubmit = useCallback(() => {
    const y = parseInt(yearInput);
    const m = parseInt(monthInput);
    const d = parseInt(dayInput);
    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2030) return;
    const { ings, zodiac } = selectBySaju(y, m, d);
    setZodiacInfo(zodiac);
    setSaJuIngs(ings);
    setNamingStep(4);
  }, [yearInput, monthInput, dayInput]);

  // 네 → step5
  const handleYes = useCallback(() => {
    setNamingStep(5);
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
    setGodSpeech(''); setShowSpeech(false); setAccidentFlash(null);
    setPhase('intro');
  }, [clearAllTimers]);

  const handleShare = useCallback(async () => {
    const pt = getPersonalityType(selected);
    const bd = getCategoryBreakdown(selected);
    const text = [
      `🧪 신이 ${userName || '나'}을(를) 만들 때`,
      '',
      `${pt.emoji} ${pt.title}`,
      `"${pt.subtitle}"`,
      '',
      `📦 내 재료: ${selected.map(i => `${i.emoji}${i.name}`).join(' · ')}`,
      '',
      '📊 성분 분석:',
      ...bd.map(b => `${CAT_NAME[b.cat]} ${b.pct}%`),
      '',
      pt.tags.join(' '),
      '',
      '#신이나를만들때',
    ].join('\n');
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: `신이 ${userName || '나'}을(를) 만들 때 🧪`, text });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('📋 클립보드에 복사됐어요!');
      }
    } catch { /* cancel */ }
  }, [selected, userName]);

  const fillPct = (selected.length / MAX) * 100;
  const personality = showResult ? getPersonalityType(selected) : null;
  const breakdown = personality ? getCategoryBreakdown(selected) : [];
  const liquidColor = fillPct <= 20 ? '#7BB8F5' : fillPct <= 40 ? '#5CB85C'
    : fillPct <= 60 ? '#9B7FE0' : fillPct <= 80 ? '#F5A83C' : '#FF4040';
  const displayName = userName || '나';

  return (
    <div style={css.root}>
      {/* 별 */}
      {STARS.map((s, i) => (
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
          <div style={css.introBadge}>🧬 밈 게임</div>
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

          {/* step 4: 확인 (네/아니오 선택) */}
          {namingStep === 4 && zodiacInfo && (
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
              <p style={{ ...css.rpgLine, color: '#FFD700', marginTop: 6 } as CSSProperties}>
                맞나...? 🤔
              </p>
              <div style={css.yesNoBar}>
                <button style={css.noBtn} onClick={handleNo}>✕ 아니오</button>
                <button style={css.yesBtn} onClick={handleYes}>✓ 네</button>
              </div>
            </div>
          )}

          {/* step 5: 운명 발견 (클릭 진행) */}
          {namingStep === 5 && zodiacInfo && (
            <div style={css.rpgBox}>
              <div style={css.rpgSpeaker}>신 🌩️</div>
              <p style={css.rpgLine}>
                ✨ <b>{zodiacInfo.emoji} {zodiacInfo.name}</b>의 기운을 읽겠노라...
              </p>
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
                <p style={css.statsSubtitle}>총 {TOTAL_PLAYERS.toLocaleString()}명 참여</p>
              </div>

              {/* 내 유형 하이라이트 */}
              <div style={css.myTypeCard}>
                <span style={css.myTypeEmoji}>{personality.emoji}</span>
                <div>
                  <div style={css.myTypeTitle}>{personality.title}</div>
                  <div style={css.myTypeRank}>
                    전체의 {TYPE_STATS[personality.id] ?? 0}% ·{' '}
                    {[...PERSONALITY_TYPES]
                      .sort((a, b) => (TYPE_STATS[b.id] ?? 0) - (TYPE_STATS[a.id] ?? 0))
                      .findIndex(p => p.id === personality.id) + 1}위
                  </div>
                </div>
              </div>

              {/* 전체 유형 리스트 */}
              <div style={css.statsListWrapper}>
                {[...PERSONALITY_TYPES]
                  .sort((a, b) => (TYPE_STATS[b.id] ?? 0) - (TYPE_STATS[a.id] ?? 0))
                  .map((type, rank) => {
                    const pct = TYPE_STATS[type.id] ?? 0;
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

              <p style={css.statsFooter}>* 사주명리학 기반 시뮬레이션 데이터</p>
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
                <div style={css.recapGrid}>
                  {selected.map(ing => (
                    <div key={ing.id} style={{
                      ...css.recapChip,
                      ...(accidentals.has(ing.id) ? css.recapChipAcc : {}),
                      ...(emptyBottles.has(ing.id) ? css.recapChipEmpty : {}),
                    }}>
                      <span style={{ fontSize: 20 }}>{ing.emoji}</span>
                      <span style={css.recapName}>{ing.name}</span>
                      {accidentals.has(ing.id) && !emptyBottles.has(ing.id) && <span style={css.accLabel}>실수</span>}
                      {emptyBottles.has(ing.id) && <span style={css.emptyLabel}>💧 한방울</span>}
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
                    <span style={css.barPct}>{b.pct}%</span>
                  </div>
                ))}
              </div>

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
                <button style={css.shareBtn} onClick={handleShare}>📤 결과 공유하기</button>
                <button style={css.resetBtn} onClick={handleReset}>🔄 다시 하기</button>
              </div>
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
    fontSize: 28, fontWeight: 900, color: '#fff',
    textAlign: 'center', letterSpacing: -0.5, lineHeight: 1.3,
  },
  introSub: {
    fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center',
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
    background: '#9B7FE0', border: '3px solid #fff', borderRadius: 16,
    padding: '16px 48px', color: '#fff', fontSize: 18, fontWeight: 900,
    cursor: 'pointer', letterSpacing: 1,
    boxShadow: '4px 4px 0px rgba(0,0,0,0.4)',
    transition: 'transform 0.1s',
  },
  introWarning: {
    fontSize: 11, color: 'rgba(255,200,100,0.7)', textAlign: 'center',
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
  barPct: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', width: 34, textAlign: 'right' },

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

  statsBtn: {
    width: '100%', background: 'rgba(155,127,224,0.12)', border: '1.5px solid rgba(155,127,224,0.4)',
    borderRadius: 14, padding: '14px 0', color: '#C4ADFF', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', marginBottom: 12, marginTop: 4,
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
};

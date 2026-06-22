'use client';
import { useState, useCallback, useRef, useEffect, type CSSProperties } from 'react';

// ─── 데이터 ────────────────────────────────────────────────────────
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
  { id: 'sleepy',    emoji: '😪', title: '인간 슬리핑 뷰티',   subtitle: '이불 밖은 위험해 타입',   dominant: ['rest'],
    desc: '수면이야말로 최고의 힐링. 이불 밖은 위험하다는 걸 온몸으로 아는 분. 하지만 그 여유로운 에너지로 주변에 평화를 가져다준다. 잠깐, 지금도 졸려?',
    tags: ['#이불밖은위험해', '#수면전문가', '#알람5개기본'] },
  { id: 'digital',   emoji: '🤖', title: '디지털 좀비',         subtitle: '충전 없으면 방전 타입',   dominant: ['digital'],
    desc: '핸드폰과 한 몸. 화면이 꺼지면 불안한 현대인. 알고리즘이 나를 나보다 더 잘 알고, 충전기를 잃으면 존재 자체가 흔들린다.',
    tags: ['#폰없으면못살아', '#디지털원주민', '#충전기인생'] },
  { id: 'emotional', emoji: '🎭', title: 'K-드라마 주인공',     subtitle: '감성 MAX 공감 천재',       dominant: ['emotion', 'social'],
    desc: '광고 보다 울고, 드라마 보다 울고, 그러면서도 웃음이 끊이지 않는다. 공감 능력이 탑재된 인간 감성 충만 FULL. 주변 사람들의 마음을 누구보다 잘 안다.',
    tags: ['#감수성폭발', '#공감의신', '#눈물도웃음도많아'] },
  { id: 'thinker',   emoji: '🧠', title: '뇌가 쉬지를 않아',   subtitle: '생각 고구마 줄기 타입',   dominant: ['personality'],
    desc: '자기 전 5년 후 걱정하고, 완벽하게 하려다 시작을 못 하기도. 하지만 그 꼼꼼함과 깊이가 어떤 일이든 특별하게 만든다. 장단점이 명확한 매력.',
    tags: ['#생각과부하', '#완벽주의자', '#고집도있어'] },
  { id: 'foodie',    emoji: '🍴', title: '먹방의 신',           subtitle: '배 부르면 행복 타입',     dominant: ['food'],
    desc: '먹는 게 낙이고, 먹는 게 힐링. 맛집 리스트 항상 업데이트 중. 배고프면 사람이 변한다는 걸 주변 사람들이 먼저 안다. 오늘 저녁은 뭐 먹지?',
    tags: ['#먹방러', '#음식이행복', '#배고프면주의'] },
  { id: 'social',    emoji: '🌟', title: '분위기 메이커',       subtitle: '침묵이 불편한 타입',      dominant: ['social'],
    desc: '어디서나 웃음을 만드는 분위기 메이커. 침묵은 채워야 하고, 새로운 사람 만나는 게 즐겁다. 모임의 태양 같은 존재. 혼자 있어도 뇌 속에서 대화 중.',
    tags: ['#수다쟁이', '#분위기메이커', '#인싸본능'] },
  { id: 'energy',    emoji: '⚡', title: '에너자이저 폭발형',  subtitle: '에너지가 어디서 나와 타입', dominant: ['energy'],
    desc: '쉬는 날도 헬스장, 체력이 넘쳐서 주변이 지친다. 하지만 그 에너지로 목표 달성율 200%. 몸이 먼저 움직이고 머리가 따라가는 액션 타입.',
    tags: ['#운동귀신', '#에너지폭발', '#몸이먼저움직여'] },
  { id: 'daily',     emoji: '😅', title: '일상의 생존러',       subtitle: '카페인으로 버티는 타입',  dominant: ['daily'],
    desc: '텅장이지만 오늘도 행복하고, 덜렁거리지만 어떻게든 해낸다. 커피 없이는 아침이 없는 현실형 인간의 정석. 생존 본능 하나만큼은 탑재.',
    tags: ['#텅장러', '#카페인의존', '#그래도살아남기'] },
  { id: 'chaotic',   emoji: '🎰', title: '신도 포기한 조합',    subtitle: '예측 불가 혼돈 천재',     dominant: [] as string[],
    desc: '도무지 한 마디로 정의 불가. 다양한 매력이 폭발적으로 섞여 신도 손 놓은 독특한 존재. 만나는 사람마다 다른 나를 발견하게 된다. 그것이 매력.',
    tags: ['#반전매력', '#예측불가', '#나도나를모름'] },
];

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

const PARTICLE_EMOJIS = ['✨', '💥', '🌟', '⚡', '🔥', '💨', '🫧', '💫'];

const STARS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5 + 3) % 97}%`,
  top: `${(i * 7 + 2) % 55}%`,
  delay: `${(i * 0.37) % 3}s`,
  size: `${7 + (i % 3) * 4}px`,
  dur: `${2 + (i % 4) * 0.8}s`,
}));

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────
export default function GodGame() {
  const [phase, setPhase] = useState<'select' | 'explosion' | 'result'>('select');
  const [selected, setSelected] = useState<Ingredient[]>([]);
  const [godMood, setGodMood] = useState('🧑‍🔬');
  const [godClass, setGodClass] = useState('');
  const [beakerClass, setBeakerClass] = useState('');
  const [flashClass, setFlashClass] = useState('');
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; px: number; py: number; emoji: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => timers.current.forEach(clearTimeout);

  const triggerExplosion = useCallback(() => {
    setGodClass('god-shake');
    setBeakerClass('beaker-bubble');
    setFlashClass('flash-anim');
    setGodMood('😰');

    // 파티클 생성
    const ps = PARTICLE_EMOJIS.map((emoji, id) => ({
      id,
      emoji,
      px: Math.cos((id / 8) * Math.PI * 2) * 130,
      py: Math.sin((id / 8) * Math.PI * 2) * 110,
    }));
    setParticles(ps);

    const t1 = setTimeout(() => setGodMood('💥'), 700);
    const t2 = setTimeout(() => { setGodMood('😵‍💫'); setGodClass('god-dazed'); }, 1300);
    const t3 = setTimeout(() => { setBeakerClass(''); setFlashClass(''); }, 900);
    const t4 = setTimeout(() => setParticles([]), 1400);
    const t5 = setTimeout(() => setShowResult(true), 2800);
    timers.current = [t1, t2, t3, t4, t5];
  }, []);

  const handleSelect = useCallback((ing: Ingredient) => {
    if (phase !== 'select') return;
    const isSel = !!selected.find(s => s.id === ing.id);

    setBouncingId(ing.id);
    setTimeout(() => setBouncingId(null), 400);

    if (isSel) { setSelected(prev => prev.filter(s => s.id !== ing.id)); return; }
    if (selected.length >= MAX) return;

    const next = [...selected, ing];
    setSelected(next);
    if (next.length === MAX) {
      setPhase('explosion');
      setTimeout(triggerExplosion, 300);
    }
  }, [selected, phase, triggerExplosion]);

  const handleReset = useCallback(() => {
    clearAllTimers();
    setSelected([]); setGodMood('🧑‍🔬'); setPhase('select');
    setGodClass(''); setBeakerClass(''); setFlashClass('');
    setParticles([]); setShowResult(false); setBouncingId(null);
  }, []);

  const handleShare = useCallback(async () => {
    const pt = getPersonalityType(selected);
    const bd = getCategoryBreakdown(selected);
    const text = [
      '🧪 신이 나를 만들 때',
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
        await navigator.share({ title: '신이 나를 만들 때 🧪', text });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('📋 결과가 클립보드에 복사됐어요!');
      }
    } catch { /* ignore cancel */ }
  }, [selected]);

  const fillPct = (selected.length / MAX) * 100;
  const personality = showResult ? getPersonalityType(selected) : null;
  const breakdown = personality ? getCategoryBreakdown(selected) : [];

  // 비커 색
  const liquidColor = fillPct <= 20 ? '#7BB8F5'
    : fillPct <= 40 ? '#5CB85C'
    : fillPct <= 60 ? '#9B7FE0'
    : fillPct <= 80 ? '#F5A83C'
    : '#FF4040';

  return (
    <div style={css.root}>
      {/* ── 별 배경 ── */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.left, top: s.top, color: 'white',
          fontSize: s.size, animationName: 'twinkle', animationDuration: s.dur,
          animationDelay: s.delay, animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out', pointerEvents: 'none',
          userSelect: 'none',
        }}>✦</div>
      ))}

      <div style={css.container}>
        {/* ── 헤더 ── */}
        <div style={css.header}>
          <div style={css.headerBadge}>🧬 밈 게임</div>
          <h1 style={css.title} className="title-pop">신이 나를 만들 때 🧪</h1>
          <p style={css.subtitle}>재료 5개를 골라 신이 폭발하는 실험을 완성해봐!</p>
        </div>

        {/* ── 실험실 영역 ── */}
        <div style={css.labArea}>
          {/* 신 */}
          <div style={css.godSection}>
            <div className={godClass} style={css.godEmoji}>{godMood}</div>
            {phase === 'select' && (
              <div style={css.godLabel}>
                {selected.length === 0 ? '재료를 골라봐!' :
                 selected.length < MAX ? `${MAX - selected.length}개 남았어!` :
                 '실험 시작! 💥'}
              </div>
            )}
            {phase === 'explosion' && (
              <div style={{ ...css.godLabel, color: '#FFD700', fontWeight: 700 }}>헤롱헤롱...</div>
            )}
          </div>

          {/* 비커 */}
          <div style={css.beakerSection}>
            <div className={beakerClass} style={css.beakerOuter}>
              <div style={css.beakerTube}>
                {/* 눈금 */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ ...css.tick, bottom: `${i * 20}%` }} />
                ))}
                {/* 액체 */}
                <div style={{
                  ...css.liquid,
                  height: `${fillPct}%`,
                  background: liquidColor,
                  transition: 'height 0.35s ease, background 0.35s ease',
                }}>
                  {selected.length > 0 && (
                    <span style={css.liquidEmoji}>
                      {selected.slice(-2).map(i => i.emoji).join('')}
                    </span>
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
              '--px': `${p.px}px`,
              '--py': `${p.py}px`,
            } as CSSProperties}>
              {p.emoji}
            </div>
          ))}
        </div>

        {/* ── 선택된 재료 스트립 ── */}
        {selected.length > 0 && phase === 'select' && (
          <div style={css.strip}>
            <div style={css.stripInner}>
              {selected.map(ing => (
                <button key={ing.id} style={css.stripChip} onClick={() => handleSelect(ing)}>
                  {ing.emoji} {ing.name} <span style={{ opacity: 0.5 }}>×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 재료 그리드 ── */}
        {phase === 'select' && (
          <div style={css.gridScroll}>
            <p style={css.gridHint}>
              {selected.length < MAX
                ? `🧫 재료를 ${MAX}개 골라봐 (${selected.length}/${MAX})`
                : '🎉 5개 완료! 지금 실험 중...'}
            </p>
            <div style={css.grid}>
              {INGREDIENTS.map(ing => {
                const isSel = !!selected.find(s => s.id === ing.id);
                const isDisabled = !isSel && selected.length >= MAX;
                const isBouncing = bouncingId === ing.id;
                return (
                  <button
                    key={ing.id}
                    className={isBouncing ? 'card-bounce' : ''}
                    disabled={isDisabled}
                    onClick={() => handleSelect(ing)}
                    style={{
                      ...css.card,
                      ...(isSel ? css.cardSel : {}),
                      ...(isDisabled ? css.cardDim : {}),
                    }}
                  >
                    <span style={css.cardEmoji}>{ing.emoji}</span>
                    <span style={{ ...css.cardName, ...(isSel ? { color: '#D4BFFF' } : {}) }}>
                      {ing.name}
                    </span>
                    <span style={{ ...css.cardDesc, ...(isSel ? { color: 'rgba(212,191,255,0.7)' } : {}) }}>
                      {ing.desc}
                    </span>
                    {isSel && <span style={css.checkBadge}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 폭발 중 ── */}
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

      {/* ── 플래시 오버레이 ── */}
      {flashClass && (
        <div className={flashClass} style={css.flash} />
      )}

      {/* ── 결과 화면 ── */}
      {personality && showResult && (
        <div className="result-slide" style={css.resultOverlay}>
          {/* 그라데이션 배경 */}
          <div style={css.resultBg} />

          <div style={css.resultScroll}>
            <div style={css.resultContent}>
              {/* 헤더 */}
              <div style={css.resultHeader}>
                <div style={css.resultHeaderBadge}>🧪 실험 결과</div>
              </div>

              {/* 성격 유형 카드 */}
              <div style={css.typeCard}>
                <div style={css.typeEmoji}>{personality.emoji}</div>
                <div style={css.typeTitle}>{personality.title}</div>
                <div style={css.typeSub}>{personality.subtitle}</div>
              </div>

              {/* 내 재료 */}
              <div style={css.section}>
                <div style={css.sectionTitle}>📦 넣은 재료</div>
                <div style={css.recapGrid}>
                  {selected.map(ing => (
                    <div key={ing.id} style={css.recapChip}>
                      <span style={{ fontSize: 20 }}>{ing.emoji}</span>
                      <span style={css.recapName}>{ing.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 성분 비율 분석 */}
              <div style={css.section}>
                <div style={css.sectionTitle}>📊 성분 비율 분석</div>
                {breakdown.map(b => (
                  <div key={b.cat} style={css.barRow}>
                    <span style={css.barLabel}>{CAT_NAME[b.cat]}</span>
                    <div style={css.barTrack}>
                      <div style={{
                        ...css.barFill,
                        width: `${b.pct}%`,
                        background: CAT_COLOR[b.cat] ?? '#9B7FE0',
                      }} />
                    </div>
                    <span style={css.barPct}>{b.pct}%</span>
                  </div>
                ))}
              </div>

              {/* 이 조합은요 */}
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

              {/* 액션 버튼 */}
              <div style={css.actionRow}>
                <button style={css.shareBtn} onClick={handleShare}>
                  📤 결과 공유하기
                </button>
                <button style={css.resetBtn} onClick={handleReset}>
                  🔄 다시 하기
                </button>
              </div>

              <div style={css.bottomTag}>#신이나를만들때</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 인라인 스타일 ─────────────────────────────────────────────────
const css: Record<string, CSSProperties> = {
  root: {
    minHeight: '100dvh', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(160deg, #0D0820 0%, #1A0D38 50%, #0D1830 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  container: {
    width: '100%', maxWidth: 480, flex: 1,
    display: 'flex', flexDirection: 'column',
    padding: '0 0 80px',
    position: 'relative', zIndex: 1,
  },

  // 헤더
  header: {
    padding: '20px 20px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  },
  headerBadge: {
    background: 'rgba(155,127,224,0.25)', color: '#C4ADFF',
    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
    border: '1px solid rgba(155,127,224,0.35)',
  },
  title: {
    fontSize: 22, fontWeight: 900, color: '#fff',
    textAlign: 'center', letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center',
  },

  // 실험실 영역
  labArea: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    padding: '4px 20px 8px', position: 'relative', minHeight: 120,
  },
  godSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  godEmoji: { fontSize: 68, lineHeight: 1, cursor: 'default', userSelect: 'none' },
  godLabel: {
    fontSize: 11, color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: 110,
  },

  // 비커
  beakerSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  beakerOuter: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  beakerTube: {
    width: 56, height: 82,
    border: '2px solid rgba(255,255,255,0.4)',
    borderRadius: 4, overflow: 'hidden',
    background: 'rgba(255,255,255,0.04)',
    position: 'relative',
  },
  tick: {
    position: 'absolute', left: 4, right: 4, height: 1,
    background: 'rgba(255,255,255,0.18)',
  },
  liquid: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    borderRadius: 2,
  },
  liquidEmoji: { fontSize: 13, lineHeight: 1, userSelect: 'none' },
  beakerStem: { width: 22, height: 10, background: 'rgba(255,255,255,0.25)' },
  beakerBase: { width: 40, height: 7, background: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  beakerCount: { fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.65)', marginTop: 3 },

  // 스트립
  strip: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    overflowX: 'auto', padding: '8px 0',
    scrollbarWidth: 'none',
  },
  stripInner: {
    display: 'flex', gap: 8, padding: '0 16px',
    width: 'max-content',
  },
  stripChip: {
    background: 'rgba(155,127,224,0.22)', border: '1px solid rgba(155,127,224,0.4)',
    borderRadius: 20, padding: '5px 12px', color: '#fff',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    whiteSpace: 'nowrap', display: 'flex', gap: 4, alignItems: 'center',
  },

  // 그리드
  gridScroll: { flex: 1, overflowY: 'auto', padding: '0 12px' },
  gridHint: {
    fontSize: 12, color: 'rgba(255,255,255,0.45)',
    textAlign: 'center', margin: '8px 0 10px', fontWeight: 500,
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8, paddingBottom: 16,
  },
  card: {
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 14, padding: '10px 8px', cursor: 'pointer', color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    position: 'relative', transition: 'border-color 0.15s, background 0.15s',
    textAlign: 'center',
  },
  cardSel: {
    background: 'rgba(155,127,224,0.22)', border: '1.5px solid #9B7FE0',
  },
  cardDim: { opacity: 0.28, cursor: 'default' },
  cardEmoji: { fontSize: 28, lineHeight: 1 },
  cardName: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)' },
  cardDesc: { fontSize: 9, color: 'rgba(255,255,255,0.38)', lineHeight: 1.35 },
  checkBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 16, height: 16, borderRadius: '50%',
    background: '#9B7FE0', color: '#fff',
    fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  // 폭발 중
  explosionMid: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20,
  },
  expTitle: { fontSize: 26, fontWeight: 900, color: '#fff' },
  expSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  expIngs: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  dots: { display: 'flex', gap: 6, alignItems: 'center' },

  // 플래시
  flash: {
    position: 'fixed', inset: 0, background: '#FFF5AA',
    pointerEvents: 'none', zIndex: 200,
  },

  // 결과 오버레이
  resultOverlay: {
    position: 'fixed', inset: 0, zIndex: 100,
    display: 'flex', flexDirection: 'column',
  },
  resultBg: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(160deg, #0D0820 0%, #1A0D38 50%, #0D1830 100%)',
  },
  resultScroll: {
    position: 'relative', zIndex: 1, overflowY: 'auto', flex: 1,
    display: 'flex', justifyContent: 'center',
  },
  resultContent: {
    width: '100%', maxWidth: 480, padding: '24px 20px 60px',
    display: 'flex', flexDirection: 'column', gap: 0,
  },
  resultHeader: { display: 'flex', justifyContent: 'center', marginBottom: 16 },
  resultHeaderBadge: {
    background: 'rgba(155,127,224,0.2)', border: '1px solid rgba(155,127,224,0.3)',
    color: '#C4ADFF', fontSize: 12, fontWeight: 700,
    padding: '6px 16px', borderRadius: 20,
  },

  typeCard: {
    background: 'linear-gradient(135deg, rgba(155,127,224,0.28), rgba(107,181,255,0.14))',
    border: '1.5px solid rgba(155,127,224,0.35)',
    borderRadius: 22, padding: '28px 20px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    marginBottom: 24,
  },
  typeEmoji: { fontSize: 72, lineHeight: 1, marginBottom: 4, userSelect: 'none' },
  typeTitle: { fontSize: 22, fontWeight: 900, color: '#fff' },
  typeSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)' },

  section: { marginBottom: 22 },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)',
    marginBottom: 12, letterSpacing: 0.3,
  },

  recapGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  recapChip: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '7px 12px',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  recapName: { fontSize: 12, fontWeight: 600, color: '#fff' },

  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  barLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', width: 90, flexShrink: 0 },
  barTrack: {
    flex: 1, height: 8, background: 'rgba(255,255,255,0.08)',
    borderRadius: 4, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
  barPct: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', width: 34, textAlign: 'right' },

  descBox: {
    background: 'rgba(255,255,255,0.05)', borderRadius: 14,
    padding: 16, marginBottom: 12,
  },
  descText: { fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65 },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: {
    background: 'rgba(155,127,224,0.18)', border: '1px solid rgba(155,127,224,0.28)',
    borderRadius: 20, padding: '6px 12px',
    fontSize: 12, fontWeight: 600, color: '#D4BFFF',
  },

  actionRow: { display: 'flex', gap: 12, marginBottom: 16 },
  shareBtn: {
    flex: 1, background: '#9B7FE0', border: 'none', borderRadius: 14,
    padding: '14px 0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  resetBtn: {
    flex: 1, background: 'transparent',
    border: '1.5px solid #9B7FE0', borderRadius: 14,
    padding: '14px 0', color: '#C084FC', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },

  bottomTag: {
    fontSize: 11, color: 'rgba(255,255,255,0.28)',
    textAlign: 'center',
  },
};

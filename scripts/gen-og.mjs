// Generate og-image.png for KakaoTalk/Twitter previews
import sharp from 'sharp';
import { mkdir } from 'fs/promises';

await mkdir('public', { recursive: true });

const W = 1200, H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#0D0820"/>
      <stop offset="50%" stop-color="#1A0D38"/>
      <stop offset="100%" stop-color="#0D1830"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(155,127,224,0.3)"/>
      <stop offset="100%" stop-color="rgba(107,181,255,0.15)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Stars -->
  <text x="80" y="100" font-size="20" fill="rgba(255,255,255,0.4)" font-family="serif">✦</text>
  <text x="1120" y="120" font-size="16" fill="rgba(255,255,255,0.3)" font-family="serif">✦</text>
  <text x="60" y="520" font-size="14" fill="rgba(255,255,255,0.25)" font-family="serif">✦</text>
  <text x="1140" y="500" font-size="18" fill="rgba(255,255,255,0.35)" font-family="serif">✦</text>
  <text x="200" y="580" font-size="12" fill="rgba(255,255,255,0.2)" font-family="serif">✦</text>
  <text x="980" y="580" font-size="16" fill="rgba(255,255,255,0.3)" font-family="serif">✦</text>

  <!-- Badge pill -->
  <rect x="490" y="60" width="220" height="44" rx="22"
    fill="rgba(155,127,224,0.25)" stroke="rgba(155,127,224,0.5)" stroke-width="2"/>
  <text x="600" y="89" font-size="18" font-weight="700" fill="#C4ADFF"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">🧬 밈 게임</text>

  <!-- Main title -->
  <text x="600" y="200" font-size="64" font-weight="900" fill="white"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">신이 나를 만들 때 🧪</text>

  <!-- Subtitle -->
  <text x="600" y="255" font-size="26" fill="rgba(255,255,255,0.55)"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">생년월일 사주로 알아보는 나의 진짜 성격</text>

  <!-- Card -->
  <rect x="180" y="295" width="840" height="230" rx="32"
    fill="rgba(155,127,224,0.2)" stroke="rgba(155,127,224,0.4)" stroke-width="2"/>

  <!-- God emoji -->
  <text x="350" y="435" font-size="100" font-family="Apple Color Emoji, Segoe UI Emoji, serif" text-anchor="middle">⚗️</text>

  <!-- Type text -->
  <text x="660" y="375" font-size="38" font-weight="900" fill="white"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">신도 포기한 독특한 조합</text>
  <text x="660" y="425" font-size="24" fill="rgba(255,255,255,0.55)"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">"재료 5개로 알아보는 내 성격 유형"</text>

  <!-- Tags -->
  <text x="390" y="480" font-size="20" fill="rgba(155,127,224,0.8)"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif">#반전매력</text>
  <text x="540" y="480" font-size="20" fill="rgba(155,127,224,0.8)"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif">#예측불가</text>
  <text x="680" y="480" font-size="20" fill="rgba(155,127,224,0.8)"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif">#나도나를모름</text>

  <!-- Ingredient pills row -->
  <rect x="180" y="545" width="120" height="38" rx="19"
    fill="rgba(155,127,224,0.2)" stroke="rgba(155,127,224,0.4)" stroke-width="1.5"/>
  <text x="240" y="570" font-size="16" fill="#D4BFFF"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">😴 잠만자</text>

  <rect x="315" y="545" width="120" height="38" rx="19"
    fill="rgba(155,127,224,0.2)" stroke="rgba(155,127,224,0.4)" stroke-width="1.5"/>
  <text x="375" y="570" font-size="16" fill="#D4BFFF"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">🍔 먹방러</text>

  <rect x="450" y="545" width="130" height="38" rx="19"
    fill="rgba(155,127,224,0.2)" stroke="rgba(155,127,224,0.4)" stroke-width="1.5"/>
  <text x="515" y="570" font-size="16" fill="#D4BFFF"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">😭 감수성폭발</text>

  <rect x="595" y="545" width="120" height="38" rx="19"
    fill="rgba(155,127,224,0.2)" stroke="rgba(155,127,224,0.4)" stroke-width="1.5"/>
  <text x="655" y="570" font-size="16" fill="#D4BFFF"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">🎮 게임광</text>

  <rect x="730" y="545" width="120" height="38" rx="19"
    fill="rgba(155,127,224,0.2)" stroke="rgba(155,127,224,0.4)" stroke-width="1.5"/>
  <text x="790" y="570" font-size="16" fill="#D4BFFF"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">✨ 완벽주의</text>

  <!-- Bottom hashtag -->
  <text x="600" y="615" font-size="22" font-weight="900" fill="rgba(255,255,255,0.3)"
    font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif" text-anchor="middle">#신이나를만들때</text>
</svg>`;

const buf = await sharp(Buffer.from(svg)).png().toBuffer();
await sharp(buf).resize(1200, 630).toFile('public/og-image.png');
console.log('✅ public/og-image.png generated (1200x630)');

// B급 손그림 신 일러스트 - 신이 나를 만들 때 밈 스타일

export function GodIdle({ count }: { count: number }) {
  const liquidW = 18 + count * 8;
  const liquidColor = count <= 1 ? '#7BB8F5' : count <= 2 ? '#5CB85C' : count <= 3 ? '#9B7FE0' : count <= 4 ? '#F5A83C' : '#FF4040';
  return (
    <svg width="130" height="172" viewBox="0 0 130 172" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 후광 */}
      <ellipse cx="65" cy="32" rx="28" ry="6" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>

      {/* 머리 */}
      <ellipse cx="65" cy="44" rx="22" ry="23" fill="white" stroke="#222" strokeWidth="2.2"/>

      {/* 눈 */}
      <circle cx="57" cy="42" r="3" fill="#222"/>
      <circle cx="73" cy="42" r="3" fill="#222"/>
      {/* 눈 하이라이트 */}
      <circle cx="58.5" cy="41" r="1" fill="white"/>
      <circle cx="74.5" cy="41" r="1" fill="white"/>

      {/* 입 (약간 웃음) */}
      <path d="M58 53 Q65 59 72 53" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* 수염+몸통 (하나로 합쳐진 둥근 형태) */}
      <path d="M43 58 C35 72 33 95 36 116 C40 133 50 144 65 145 C80 144 90 133 94 116 C97 95 95 72 87 58"
            fill="white" stroke="#222" strokeWidth="2.2"/>
      {/* 수염 결 */}
      <path d="M50 72 Q54 88 52 104" stroke="#ccc" strokeWidth="1.2" fill="none"/>
      <path d="M65 74 Q65 92 65 108" stroke="#ccc" strokeWidth="1.2" fill="none"/>
      <path d="M80 72 Q76 88 78 104" stroke="#ccc" strokeWidth="1.2" fill="none"/>

      {/* 왼팔 - 국자 들고 있는 */}
      <path d="M36 98 C22 106 16 120 22 132" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      {/* 국자 손잡이 */}
      <line x1="22" y1="132" x2="15" y2="150" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
      {/* 국자 */}
      <ellipse cx="13" cy="156" rx="11" ry="8" fill="white" stroke="#222" strokeWidth="2"/>
      {/* 국자 안 재료 */}
      {count > 0 && <ellipse cx="13" cy="155" rx="7" ry="4" fill={liquidColor} opacity="0.85"/>}
      {/* 떨어지는 방울 */}
      {count > 0 && <ellipse cx="34" cy="145" rx="4" ry="5" fill={liquidColor} opacity="0.7"/>}

      {/* 오른팔 */}
      <path d="M94 98 C108 106 114 118 108 128" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

      {/* 그릇 */}
      <path d="M18 163 Q65 178 112 163 L108 150 Q65 166 22 150 Z" fill="white" stroke="#222" strokeWidth="2.2"/>
      {/* 그릇 안 액체 */}
      {count > 0 && (
        <ellipse cx="65" cy="153" rx={liquidW} ry="6" fill={liquidColor} opacity="0.75"/>
      )}
      {/* 그릇 테두리 반짝임 */}
      <path d="M30 153 Q65 160 100 153" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export function GodPanic() {
  return (
    <svg width="150" height="180" viewBox="0 0 150 180" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 혼돈 배경 선들 */}
      <line x1="10" y1="20" x2="30" y2="8" stroke="#FF6B2F" strokeWidth="2" strokeLinecap="round"/>
      <line x1="120" y1="15" x2="140" y2="28" stroke="#FF6B2F" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="55" x2="22" y2="50" stroke="#FFD700" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="128" y1="50" x2="145" y2="44" stroke="#FFD700" strokeWidth="1.8" strokeLinecap="round"/>
      {/* * 표시들 */}
      <text x="8" y="40" fontSize="18" fill="#FF4040" fontWeight="bold">*</text>
      <text x="128" y="38" fontSize="18" fill="#FF4040" fontWeight="bold">*</text>
      <text x="5" y="80" fontSize="14" fill="#FFD700">✦</text>
      <text x="133" y="75" fontSize="14" fill="#FFD700">✦</text>

      {/* 몸통 (기울어짐) - transform으로 회전 */}
      <g transform="rotate(-8, 75, 90)">
        {/* 머리 */}
        <ellipse cx="75" cy="44" rx="22" ry="23" fill="white" stroke="#222" strokeWidth="2.2"/>
        {/* 눈 (크게 뜬) */}
        <circle cx="66" cy="40" r="4.5" fill="white" stroke="#222" strokeWidth="1.8"/>
        <circle cx="84" cy="40" r="4.5" fill="white" stroke="#222" strokeWidth="1.8"/>
        <circle cx="67" cy="40" r="2.5" fill="#222"/>
        <circle cx="85" cy="40" r="2.5" fill="#222"/>
        {/* 입 (O 모양으로 벌림) */}
        <ellipse cx="75" cy="53" rx="7" ry="6" fill="#222"/>
        <ellipse cx="75" cy="53" rx="4" ry="3.5" fill="#cc3333"/>
        {/* 땀방울 */}
        <path d="M92 30 Q96 22 100 28 Q98 35 92 30" fill="#7BB8F5" opacity="0.8"/>
        <path d="M55 28 Q50 20 47 26 Q49 33 55 28" fill="#7BB8F5" opacity="0.8"/>

        {/* 수염+몸통 */}
        <path d="M53 57 C44 70 42 90 45 110 C49 128 58 140 75 141 C92 140 101 128 105 110 C108 90 106 70 97 57"
              fill="white" stroke="#222" strokeWidth="2.2"/>
        <path d="M60 72 Q62 88 60 104" stroke="#ccc" strokeWidth="1.2" fill="none"/>
        <path d="M75 74 Q75 92 75 108" stroke="#ccc" strokeWidth="1.2" fill="none"/>
        <path d="M90 72 Q88 88 90 104" stroke="#ccc" strokeWidth="1.2" fill="none"/>

        {/* 왼팔 - 위로 번쩍 들어올림 */}
        <path d="M44 85 C28 72 18 55 24 42" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        {/* 오른팔 - 위로 번쩍 */}
        <path d="M106 85 C122 72 132 55 126 42" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        {/* 손들 */}
        <circle cx="24" cy="38" r="8" fill="white" stroke="#222" strokeWidth="2"/>
        <circle cx="126" cy="38" r="8" fill="white" stroke="#222" strokeWidth="2"/>
      </g>

      {/* 으아아아악 말풍선 */}
      <path d="M88 8 Q118 4 122 22 Q126 38 108 40 Q102 44 96 40 L88 44 L90 36 Q76 34 76 20 Q76 10 88 8Z"
            fill="white" stroke="#222" strokeWidth="1.8"/>
      <text x="82" y="28" fontSize="9.5" fill="#222" fontWeight="900" fontFamily="sans-serif">으아아아악!!</text>

      {/* 바닥에 쏟아진 액체 */}
      <ellipse cx="75" cy="172" rx="55" ry="8" fill="#FF6B2F" opacity="0.5"/>
      <ellipse cx="45" cy="170" rx="20" ry="5" fill="#FF6B2F" opacity="0.4"/>
      <ellipse cx="105" cy="171" rx="16" ry="4" fill="#FF6B2F" opacity="0.4"/>

      {/* 구르는 그릇 */}
      <path d="M95 160 Q120 155 130 165 L126 170 Q110 162 98 168 Z" fill="white" stroke="#222" strokeWidth="1.8"
            transform="rotate(30, 112, 163)"/>
    </svg>
  );
}

export function GodDazed() {
  return (
    <svg width="160" height="175" viewBox="0 0 160 175" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 뒤집어진 그릇과 쏟아진 액체 (배경) */}
      <ellipse cx="125" cy="158" rx="30" ry="7" fill="#FF6B2F" opacity="0.45"/>
      <ellipse cx="115" cy="155" rx="18" ry="5" fill="#9B7FE0" opacity="0.4"/>
      {/* 뒤집어진 그릇 */}
      <path d="M100 148 Q128 138 148 148 L146 154 Q128 145 102 154 Z"
            fill="white" stroke="#222" strokeWidth="1.8" transform="rotate(12, 124, 148)"/>

      {/* 주저앉은 신 */}
      {/* 몸통/수염 - 더 납작하고 바닥에 앉은 형태 */}
      <path d="M18 130 C16 112 20 95 32 82 C40 74 52 68 65 67 C78 68 90 74 98 82 C110 95 114 112 112 130 C108 148 90 162 65 162 C40 162 22 148 18 130Z"
            fill="white" stroke="#222" strokeWidth="2.2"/>
      {/* 수염 결 */}
      <path d="M40 95 Q46 115 44 135" stroke="#ccc" strokeWidth="1.2" fill="none"/>
      <path d="M65 97 Q65 118 65 138" stroke="#ccc" strokeWidth="1.2" fill="none"/>
      <path d="M90 95 Q84 115 86 135" stroke="#ccc" strokeWidth="1.2" fill="none"/>

      {/* 머리 (약간 아래로 처진) */}
      <ellipse cx="65" cy="55" rx="22" ry="22" fill="white" stroke="#222" strokeWidth="2.2"/>

      {/* 눈 (헤롱헤롱 - 소용돌이/X) */}
      {/* 왼눈 X */}
      <line x1="52" y1="47" x2="60" y2="55" stroke="#222" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="60" y1="47" x2="52" y2="55" stroke="#222" strokeWidth="2.2" strokeLinecap="round"/>
      {/* 오른눈 소용돌이 */}
      <path d="M77 51 Q80 47 83 51 Q85 55 82 57 Q79 59 77 56 Q76 54 78 52" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* 입 (비뚤어진 ㅡ) */}
      <path d="M56 65 Q65 62 74 66" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* 별이 빙글빙글 (헤롱) */}
      <text x="90" y="28" fontSize="14" fill="#FFD700" opacity="0.9">✦</text>
      <text x="28" y="24" fontSize="12" fill="#FFD700" opacity="0.8">✧</text>
      <text x="105" y="48" fontSize="10" fill="#FF6B2F" opacity="0.9">★</text>
      <text x="20" y="52" fontSize="10" fill="#9B7FE0" opacity="0.9">★</text>

      {/* 처진 팔 */}
      <path d="M20 120 C8 128 4 142 12 150" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M110 120 C122 128 126 142 118 150" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

      {/* ........ 말풍선 */}
      <path d="M95 30 Q128 26 132 44 Q134 58 118 60 Q112 64 106 60 L98 64 L100 56 Q84 54 84 40 Q84 32 95 30Z"
            fill="white" stroke="#222" strokeWidth="1.8"/>
      <text x="90" y="50" fontSize="13" fill="#555" fontFamily="sans-serif" letterSpacing="2">......</text>
    </svg>
  );
}

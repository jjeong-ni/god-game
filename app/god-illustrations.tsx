// B급 손그림 신 일러스트 - "신이 나를 만들 때" 밈 레퍼런스 스타일

export function GodIdle({ count }: { count: number }) {
  const colors = ['#E07070', '#5CB85C', '#9B7FE0', '#F5C842', '#FF5050', '#50B8FF'];
  const liquidColor = count > 0 ? colors[(count - 1) % colors.length] : '#bbb';

  return (
    <svg width="180" height="190" viewBox="0 0 180 190" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 후광 */}
      <ellipse cx="90" cy="14" rx="26" ry="7" fill="none" stroke="#FFD700" strokeWidth="2.2" strokeDasharray="5 3" opacity="0.8"/>

      {/* 몸통 - 넓고 둥근 흰 덩어리, 레퍼런스처럼 blob형태 */}
      <path d="M22 158 C14 138 14 112 20 88 C28 62 52 54 90 54 C128 54 152 62 160 88 C166 112 166 138 158 158 Z"
            fill="white" stroke="#222" strokeWidth="2.8"/>

      {/* 머리 - 크고 동그랗게, 몸통과 자연스럽게 연결 */}
      <circle cx="90" cy="50" r="34" fill="white" stroke="#222" strokeWidth="2.8"/>

      {/* 눈 - 레퍼런스처럼 크고 또렷한 검은 원 */}
      <circle cx="75" cy="44" r="7" fill="#222"/>
      <circle cx="105" cy="44" r="7" fill="#222"/>
      {/* 눈 하이라이트 */}
      <circle cx="77" cy="42" r="2.5" fill="white"/>
      <circle cx="107" cy="42" r="2.5" fill="white"/>

      {/* 코 (작게) */}
      <path d="M85 58 Q90 61 95 58" stroke="#555" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* 테이블 라인 */}
      <line x1="0" y1="165" x2="180" y2="165" stroke="#222" strokeWidth="2.8"/>

      {/* 그릇 바닥 곡선 */}
      <path d="M8 155 Q90 186 172 155" fill="white" stroke="#222" strokeWidth="2.8"/>
      {/* 그릇 테두리 (앞에 크게) */}
      <ellipse cx="90" cy="153" rx="82" ry="14" fill="white" stroke="#222" strokeWidth="2.8"/>
      {/* 그릇 안 액체 */}
      {count > 0 && (
        <ellipse cx="90" cy="153" rx={Math.min(70, 10 + count * 11)} ry={Math.min(10, 2 + count * 1.5)}
                 fill={liquidColor} opacity="0.85"/>
      )}
      {/* 그릇 안쪽 하이라이트 */}
      <path d="M22 153 Q90 149 158 153" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8"/>

      {/* 왼팔 - 얇고 단순하게 */}
      <path d="M22 112 Q8 120 6 134" stroke="#222" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      {/* 재료 (작은 동그라미) */}
      <circle cx="6" cy="142" r="10" fill={count > 0 ? liquidColor : '#ddd'} stroke="#222" strokeWidth="2.2"/>
      {count > 0 && <circle cx="6" cy="142" r="5" fill="white" opacity="0.3"/>}

      {/* 오른팔 */}
      <path d="M158 112 Q172 120 174 134" stroke="#222" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <circle cx="174" cy="142" r="9" fill="white" stroke="#222" strokeWidth="2.2"/>
    </svg>
  );
}

export function GodPanic() {
  return (
    <svg width="210" height="200" viewBox="0 0 210 200" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 혼돈 배경 */}
      <line x1="14" y1="20" x2="32" y2="8" stroke="#FF6B2F" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="178" y1="16" x2="196" y2="30" stroke="#FF6B2F" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="8" y="42" fontSize="20" fill="#FF4040" fontWeight="bold">*</text>
      <text x="182" y="40" fontSize="20" fill="#FF4040" fontWeight="bold">*</text>
      <text x="4" y="78" fontSize="15" fill="#FFD700">✦</text>
      <text x="188" y="74" fontSize="15" fill="#FFD700">✦</text>

      {/* 테이블 */}
      <line x1="0" y1="168" x2="210" y2="168" stroke="#222" strokeWidth="2.8"/>

      {/* 바닥에 쏟아진 액체 (배경에) */}
      <ellipse cx="105" cy="175" rx="80" ry="10" fill="#FF6B2F" opacity="0.5"/>
      <ellipse cx="60" cy="173" rx="35" ry="7" fill="#FF6B2F" opacity="0.4"/>
      <ellipse cx="160" cy="174" rx="28" ry="6" fill="#FF6B2F" opacity="0.4"/>

      {/* 그릇 (기울어져서 쏟아짐) */}
      <g transform="rotate(15, 90, 158)">
        <path d="M30 158 Q90 186 150 158" fill="white" stroke="#222" strokeWidth="2.5"/>
        <ellipse cx="90" cy="156" rx="60" ry="11" fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 몸통 (약간 기울어짐) */}
      <g transform="rotate(-7, 100, 100)">
        {/* 몸통 - 넓고 둥근 blob */}
        <path d="M46 158 C36 138 36 112 42 90 C50 66 68 58 100 58 C132 58 150 66 158 90 C164 112 164 138 154 158 Z"
              fill="white" stroke="#222" strokeWidth="2.8"/>

        {/* 머리 */}
        <circle cx="100" cy="54" r="34" fill="white" stroke="#222" strokeWidth="2.8"/>

        {/* 놀란 눈 - 더 크게, 흰 테두리 있는 형태 */}
        <circle cx="84" cy="48" r="11" fill="white" stroke="#222" strokeWidth="2.5"/>
        <circle cx="116" cy="48" r="11" fill="white" stroke="#222" strokeWidth="2.5"/>
        <circle cx="84" cy="49" r="6.5" fill="#222"/>
        <circle cx="116" cy="49" r="6.5" fill="#222"/>
        <circle cx="86" cy="47" r="2.2" fill="white"/>
        <circle cx="118" cy="47" r="2.2" fill="white"/>

        {/* 입 (O 모양) */}
        <ellipse cx="100" cy="68" rx="9" ry="8" fill="#222"/>
        <ellipse cx="100" cy="68" rx="5.5" ry="5" fill="#cc3333"/>

        {/* 땀방울 */}
        <path d="M130 32 Q135 22 140 30 Q137 38 130 32" fill="#7BB8F5" opacity="0.85"/>
        <path d="M70 30 Q64 20 60 28 Q63 36 70 30" fill="#7BB8F5" opacity="0.85"/>

        {/* 왼팔 - 위로 번쩍 */}
        <path d="M46 100 C28 85 18 65 26 50" stroke="#222" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        <circle cx="27" cy="44" r="10" fill="white" stroke="#222" strokeWidth="2.5"/>

        {/* 오른팔 - 큰 통 들고 있음 */}
        <path d="M154 100 C170 88 178 78 174 62" stroke="#222" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      </g>

      {/* 큰 파란 통 (기울어진 채 쏟아짐) - 앞 레이어 */}
      <g transform="rotate(-50, 168, 68)">
        <rect x="148" y="42" width="46" height="52" rx="6" fill="#5BB8F5" stroke="#222" strokeWidth="2.8"/>
        <rect x="156" y="50" width="30" height="30" rx="4" fill="rgba(255,255,255,0.35)"/>
        {/* 통 손잡이 */}
        <path d="M148 52 Q140 48 142 42 Q144 36 150 38" stroke="#222" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      </g>

      {/* 쏟아지는 오렌지 액체 (크게, 극적으로) */}
      <path d="M168 52 C162 68 150 86 138 102 C130 112 124 124 128 138 C138 128 148 112 158 96 C170 78 178 60 172 52 Z"
            fill="#FF6B2F" opacity="0.9"/>
      <path d="M162 56 C158 72 148 88 136 106 C128 118 122 130 124 144 Q116 136 120 122 C126 108 138 92 148 76 C158 62 164 50 162 56Z"
            fill="#FF8C00" opacity="0.6"/>
      {/* 튀기는 방울들 */}
      <circle cx="128" cy="100" r="7" fill="#FF6B2F" opacity="0.8"/>
      <circle cx="142" cy="82" r="5" fill="#FF6B2F" opacity="0.7"/>
      <circle cx="118" cy="120" r="6" fill="#FF6B2F" opacity="0.75"/>

      {/* 말풍선 */}
      <path d="M40 10 Q80 5 86 24 Q90 40 68 44 Q62 48 56 44 L46 50 L48 40 Q30 38 28 24 Q26 10 40 10Z"
            fill="white" stroke="#222" strokeWidth="2"/>
      <text x="33" y="30" fontSize="9.5" fill="#222" fontWeight="900" fontFamily="sans-serif">으아아아악!!</text>
    </svg>
  );
}

export function GodDazed() {
  return (
    <svg width="190" height="185" viewBox="0 0 190 185" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 테이블 */}
      <line x1="0" y1="168" x2="190" y2="168" stroke="#222" strokeWidth="2.8"/>

      {/* 쏟아진 액체들 (배경) */}
      <ellipse cx="95" cy="168" rx="88" ry="10" fill="#9B7FE0" opacity="0.45"/>
      <ellipse cx="50" cy="167" rx="40" ry="7" fill="#FF6B2F" opacity="0.4"/>
      <ellipse cx="148" cy="167" rx="32" ry="6" fill="#5CB85C" opacity="0.4"/>

      {/* 뒤집어진 그릇 */}
      <g transform="rotate(18, 155, 158)">
        <path d="M118 158 Q155 148 192 158 L190 164 Q155 155 120 164 Z"
              fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 몸통 - 주저앉아서 약간 납작해진 blob */}
      <path d="M20 158 C12 140 14 115 20 94 C28 70 50 60 95 60 C140 60 162 70 170 94 C176 115 178 140 170 158 Z"
            fill="white" stroke="#222" strokeWidth="2.8"/>

      {/* 머리 (약간 숙임) */}
      <circle cx="95" cy="57" r="34" fill="white" stroke="#222" strokeWidth="2.8"/>

      {/* 눈 - 헤롱헤롱 */}
      {/* 왼눈 X */}
      <line x1="76" y1="46" x2="88" y2="58" stroke="#222" strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="88" y1="46" x2="76" y2="58" stroke="#222" strokeWidth="2.8" strokeLinecap="round"/>
      {/* 오른눈 소용돌이 */}
      <path d="M108 52 Q113 46 118 52 Q121 58 116 62 Q111 65 107 60 Q105 56 108 53"
            stroke="#222" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

      {/* 입 (비뚤어짐) */}
      <path d="M82 72 Q95 68 108 73" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* 빙글 도는 별들 */}
      <text x="126" y="28" fontSize="16" fill="#FFD700" opacity="0.9">✦</text>
      <text x="44" y="24" fontSize="14" fill="#FFD700" opacity="0.8">✧</text>
      <text x="140" y="54" fontSize="11" fill="#FF6B2F" opacity="0.9">★</text>
      <text x="36" y="58" fontSize="11" fill="#9B7FE0" opacity="0.9">★</text>

      {/* 축 처진 팔 */}
      <path d="M20 122 C6 134 2 152 12 162" stroke="#222" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <path d="M170 122 C184 134 188 152 178 162" stroke="#222" strokeWidth="3.2" fill="none" strokeLinecap="round"/>

      {/* ...... 말풍선 */}
      <path d="M120 28 Q158 22 163 42 Q167 58 148 62 Q142 66 136 62 L126 67 L128 58 Q110 56 108 41 Q107 30 120 28Z"
            fill="white" stroke="#222" strokeWidth="2"/>
      <text x="113" y="48" fontSize="13" fill="#555" fontFamily="sans-serif" letterSpacing="2">......</text>
    </svg>
  );
}

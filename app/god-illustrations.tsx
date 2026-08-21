// 신 일러스트 — 참고 이미지 기반 재디자인
// 긴 수염 + 긴 머리카락, 양손으로 재료 쏟아붓는 만화 스타일

export function GodIdle({ count, isDrop = false }: { count: number; isDrop?: boolean }) {
  const colors = ['#E07070', '#5CB85C', '#9B7FE0', '#F5C842', '#FF5050', '#50B8FF'];
  const liquidColor = count > 0 ? colors[(count - 1) % colors.length] : '#bbb';

  return (
    <svg width="210" height="220" viewBox="0 0 210 220" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 배경 속도선 — 많이 부을 때만 */}
      {!isDrop && (
        <>
          <line x1="105" y1="85" x2="8"   y2="5"   stroke="#e8e8e8" strokeWidth="1.5"/>
          <line x1="105" y1="85" x2="0"   y2="55"  stroke="#e8e8e8" strokeWidth="1"/>
          <line x1="105" y1="85" x2="55"  y2="0"   stroke="#e8e8e8" strokeWidth="1"/>
          <line x1="105" y1="85" x2="155" y2="0"   stroke="#e8e8e8" strokeWidth="1"/>
          <line x1="105" y1="85" x2="202" y2="5"   stroke="#e8e8e8" strokeWidth="1.5"/>
          <line x1="105" y1="85" x2="210" y2="55"  stroke="#e8e8e8" strokeWidth="1"/>
          <line x1="105" y1="85" x2="5"   y2="130" stroke="#e8e8e8" strokeWidth="1"/>
          <line x1="105" y1="85" x2="205" y2="130" stroke="#e8e8e8" strokeWidth="1"/>
        </>
      )}

      {/* 테이블 */}
      <line x1="0" y1="208" x2="210" y2="208" stroke="#222" strokeWidth="2.5"/>

      {/* 큰 믹싱볼 */}
      <path d="M 18 175 Q 18 210, 105 210 Q 192 210, 192 175"
        fill="white" stroke="#222" strokeWidth="2.5"/>
      <ellipse cx="105" cy="175" rx="87" ry="14" fill="white" stroke="#222" strokeWidth="2.5"/>
      <ellipse cx="105" cy="175" rx="74" ry="9"  fill="none"  stroke="#eee" strokeWidth="1.2"/>
      {count > 0 && (
        <ellipse cx="105" cy="175"
          rx={Math.min(72, 4 + count * 13)}
          ry={Math.min(10, 1 + count * 1.6)}
          fill={liquidColor} opacity="0.88"/>
      )}

      {/* 긴 머리카락 — 왼쪽 뒤 */}
      <path d="M 72 24 C 52 52, 34 98, 28 145 C 23 178, 27 207, 34 208"
        fill="#f2f2f2" stroke="#222" strokeWidth="2" strokeLinejoin="round"/>
      {/* 긴 머리카락 — 오른쪽 뒤 */}
      <path d="M 138 24 C 158 52, 176 98, 182 145 C 187 178, 183 207, 176 208"
        fill="#f2f2f2" stroke="#222" strokeWidth="2" strokeLinejoin="round"/>

      {/* 로브/몸통 */}
      <path d="M 76 80 C 58 94, 50 128, 53 168 L 157 168 C 160 128, 152 94, 134 80 Z"
        fill="white" stroke="#222" strokeWidth="2.5"/>
      <path d="M 93 92 C 91 120, 91 145, 93 165" stroke="#e0e0e0" strokeWidth="1.2" fill="none"/>
      <path d="M 117 92 C 119 120, 119 145, 117 165" stroke="#e0e0e0" strokeWidth="1.2" fill="none"/>

      {/* 머리 */}
      <ellipse cx="105" cy="46" rx="32" ry="35" fill="white" stroke="#222" strokeWidth="2.5"/>

      {/* 긴 수염 */}
      <path d="M 80 78 C 73 104, 70 134, 72 162 C 74 185, 86 208, 105 208
                C 124 208, 136 185, 138 162 C 140 134, 137 104, 130 78"
        fill="white" stroke="#222" strokeWidth="2"/>
      {/* 수염 결 */}
      <path d="M 88 86 C 85 116, 83 148, 86 172 C 88 188, 95 203, 105 207"
        stroke="#ccc" strokeWidth="1.3" fill="none"/>
      <path d="M 105 82 L 105 207" stroke="#ccc" strokeWidth="1.3" fill="none"/>
      <path d="M 122 86 C 125 116, 127 148, 124 172 C 122 188, 115 203, 105 207"
        stroke="#ccc" strokeWidth="1.3" fill="none"/>

      {/* 굵은 눈썹 */}
      <path d="M 82 33 Q 93 27, 103 33" stroke="#222" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 107 33 Q 117 27, 128 33" stroke="#222" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {isDrop ? (
        /* 한방울 모드 — 눈: 힘겨운 표정 (눈 반쯤 감음) */
        <>
          <path d="M 88 43 Q 93 40, 98 43"  stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M 112 43 Q 117 40, 122 43" stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <circle cx="93"  cy="44" r="2.5" fill="#222"/>
          <circle cx="117" cy="44" r="2.5" fill="#222"/>
        </>
      ) : (
        /* 일반 모드 — 눈: 집중한 표정 */
        <>
          <circle cx="93"  cy="43" r="4" fill="#222"/>
          <circle cx="117" cy="43" r="4" fill="#222"/>
          <circle cx="94.5" cy="41.5" r="1.4" fill="white"/>
          <circle cx="118.5" cy="41.5" r="1.4" fill="white"/>
        </>
      )}

      {/* 콧수염 */}
      <path d="M 89 59 Q 97 64, 105 59 Q 113 64, 121 59"
        fill="#d0d0d0" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {isDrop ? (
        /* ── 한방울 모드: 병 뒤집어 탈탈, 물방울 하나만 뚝 ── */
        <>
          {/* 왼팔 */}
          <path d="M 64 105 Q 36 122, 22 146"
            stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          {/* 왼쪽 병 — ~120° 기울어서 거의 뒤집힘 (탈탈 털기) */}
          <rect x="5" y="130" width="26" height="32" rx="5"
            fill="#6BB5FF" stroke="#222" strokeWidth="2" transform="rotate(-120, 18, 146)"/>
          {/* 병 하이라이트 */}
          <line x1="8" y1="137" x2="20" y2="133" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"
            transform="rotate(-120, 18, 146)"/>

          {/* 한방울 — 천천히 뚝 떨어지는 물방울 (SMIL animation) */}
          <ellipse cx="35" cy="142" rx="3.5" ry="5" fill="#6BB5FF">
            <animate attributeName="cy"
              values="138;173"
              dur="2.6s" repeatCount="indefinite" calcMode="ease-in"/>
            <animate attributeName="opacity"
              values="0;0;0.9;0.85;0"
              dur="2.6s" repeatCount="indefinite"
              keyTimes="0;0.06;0.18;0.82;1"/>
            <animate attributeName="ry"
              values="3.5;5;7"
              dur="2.6s" repeatCount="indefinite"/>
          </ellipse>

          {/* 오른팔 — 기다리는 중, 덜 기울어진 병 */}
          <path d="M 146 105 Q 174 122, 188 146"
            stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <rect x="179" y="130" width="26" height="32" rx="5"
            fill="#FFB27F" stroke="#222" strokeWidth="2" transform="rotate(42, 192, 146)"/>
          <line x1="182" y1="134" x2="202" y2="137" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"
            transform="rotate(42, 192, 146)"/>
        </>
      ) : (
        /* ── 일반 모드: 양손 컵에서 액체 쏟아붓기 ── */
        <>
          {/* 왼팔 */}
          <path d="M 64 105 Q 36 122, 22 146"
            stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          {/* 왼쪽 컵 (기울어져서 쏟기) */}
          <rect x="5" y="130" width="26" height="32" rx="5"
            fill="#6BB5FF" stroke="#222" strokeWidth="2" transform="rotate(-25, 18, 146)"/>
          <line x1="8" y1="137" x2="28" y2="134" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
          {count > 0 && (
            <path d={`M 24 148 Q 44 162, 65 170`}
              stroke={liquidColor} strokeWidth="2.5" fill="none" opacity="0.82" strokeLinecap="round"/>
          )}

          {/* 오른팔 */}
          <path d="M 146 105 Q 174 122, 188 146"
            stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          {/* 오른쪽 컵 (기울어져서 쏟기) */}
          <rect x="179" y="130" width="26" height="32" rx="5"
            fill="#FFB27F" stroke="#222" strokeWidth="2" transform="rotate(25, 192, 146)"/>
          <line x1="182" y1="134" x2="202" y2="137" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
          {count > 0 && (
            <path d={`M 186 148 Q 166 162, 145 170`}
              stroke={liquidColor} strokeWidth="2.5" fill="none" opacity="0.82" strokeLinecap="round"/>
          )}
        </>
      )}
    </svg>
  );
}

export function GodPanic() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 강한 배경 속도선 */}
      <line x1="110" y1="90" x2="5"   y2="5"   stroke="#ddd" strokeWidth="2"/>
      <line x1="110" y1="90" x2="0"   y2="50"  stroke="#ddd" strokeWidth="1.5"/>
      <line x1="110" y1="90" x2="50"  y2="0"   stroke="#ddd" strokeWidth="1.5"/>
      <line x1="110" y1="90" x2="110" y2="0"   stroke="#ddd" strokeWidth="1.5"/>
      <line x1="110" y1="90" x2="170" y2="0"   stroke="#ddd" strokeWidth="1.5"/>
      <line x1="110" y1="90" x2="215" y2="5"   stroke="#ddd" strokeWidth="2"/>
      <line x1="110" y1="90" x2="220" y2="50"  stroke="#ddd" strokeWidth="1.5"/>
      <line x1="110" y1="90" x2="220" y2="120" stroke="#ddd" strokeWidth="1.5"/>
      <line x1="110" y1="90" x2="0"   y2="120" stroke="#ddd" strokeWidth="1.5"/>

      {/* 테이블 */}
      <line x1="0" y1="208" x2="220" y2="208" stroke="#222" strokeWidth="2.5"/>

      {/* 기울어진 믹싱볼 (쏟아짐) */}
      <g transform="rotate(22, 90, 185)">
        <path d="M 20 178 Q 20 210, 100 210 Q 180 210, 180 178"
          fill="white" stroke="#222" strokeWidth="2.5"/>
        <ellipse cx="100" cy="178" rx="80" ry="13" fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 바닥에 쏟아진 액체 */}
      <ellipse cx="85" cy="208" rx="70" ry="7" fill="#FF6B2F" opacity="0.5"/>
      <path d="M 30 200 Q 50 210, 100 208 Q 130 206, 160 210"
        fill="#FF6B2F" stroke="none" opacity="0.35"/>

      {/* 긴 머리카락 — 왼쪽 (흩날림) */}
      <path d="M 72 22 C 50 48, 30 92, 22 140 C 16 172, 20 205, 28 208"
        fill="#f2f2f2" stroke="#222" strokeWidth="2" transform="rotate(-8, 72, 22)"/>
      {/* 긴 머리카락 — 오른쪽 (흩날림) */}
      <path d="M 148 22 C 172 45, 192 88, 198 136 C 203 170, 200 205, 192 208"
        fill="#f2f2f2" stroke="#222" strokeWidth="2" transform="rotate(5, 148, 22)"/>

      {/* 로브/몸통 — 기울어짐 */}
      <g transform="rotate(-8, 110, 130)">
        <path d="M 80 82 C 62 96, 54 130, 57 170 L 163 170 C 166 130, 158 96, 140 82 Z"
          fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 머리 — 기울어짐 */}
      <g transform="rotate(-8, 110, 48)">
        <ellipse cx="110" cy="48" rx="32" ry="35" fill="white" stroke="#222" strokeWidth="2.5"/>

        {/* 긴 수염 — 흩날림 */}
        <path d="M 84 82 C 76 108, 73 138, 76 166 C 79 188, 92 208, 110 208
                  C 128 208, 141 188, 144 166 C 147 138, 144 108, 136 82"
          fill="white" stroke="#222" strokeWidth="2" transform="rotate(5, 110, 150)"/>
        <path d="M 92 90 C 89 118, 87 150, 90 174 C 92 190, 100 204, 110 207"
          stroke="#ccc" strokeWidth="1.3" fill="none"/>
        <path d="M 110 86 L 110 207" stroke="#ccc" strokeWidth="1.3" fill="none"/>
        <path d="M 128 90 C 131 118, 133 150, 130 174 C 128 190, 120 204, 110 207"
          stroke="#ccc" strokeWidth="1.3" fill="none"/>

        {/* 굵은 눈썹 — 놀람 (치켜올라감) */}
        <path d="M 86 30 Q 97 24, 107 31" stroke="#222" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M 113 31 Q 123 24, 134 30" stroke="#222" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

        {/* 눈 — 놀란 큰 눈 */}
        <circle cx="97"  cy="44" r="9" fill="white" stroke="#222" strokeWidth="2"/>
        <circle cx="123" cy="44" r="9" fill="white" stroke="#222" strokeWidth="2"/>
        <circle cx="97"  cy="45" r="6" fill="#222"/>
        <circle cx="123" cy="45" r="6" fill="#222"/>
        <circle cx="99"  cy="43" r="2" fill="white"/>
        <circle cx="125" cy="43" r="2" fill="white"/>

        {/* 입 — O 형 */}
        <ellipse cx="110" cy="64" rx="7" ry="7.5" fill="#222"/>
        <ellipse cx="110" cy="65" rx="4" ry="4"   fill="#555"/>

        {/* 콧수염 — 흩날림 */}
        <path d="M 92 56 Q 101 53, 110 58 Q 119 53, 128 56"
          fill="#d0d0d0" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/>
      </g>

      {/* 왼팔 — 위로 들림 */}
      <path d="M 70 110 Q 38 90, 18 72"
        stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      {/* 왼쪽 컵 — 뒤집혀서 쏟아짐 */}
      <rect x="3" y="52" width="26" height="30" rx="5"
        fill="#6BB5FF" stroke="#222" strokeWidth="2" transform="rotate(-110, 16, 67)"/>
      {/* 쏟아지는 액체 왼쪽 */}
      <path d="M 24 72 C 38 90, 55 108, 65 125"
        stroke="#6BB5FF" strokeWidth="3" fill="none" opacity="0.75"/>
      <circle cx="28" cy="88" r="5" fill="#6BB5FF" opacity="0.6"/>
      <circle cx="18" cy="105" r="3.5" fill="#6BB5FF" opacity="0.5"/>

      {/* 오른팔 — 위로 들림 */}
      <path d="M 150 110 Q 182 90, 202 72"
        stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      {/* 오른쪽 컵 — 뒤집혀서 쏟아짐 */}
      <rect x="191" y="52" width="26" height="30" rx="5"
        fill="#FFB27F" stroke="#222" strokeWidth="2" transform="rotate(110, 204, 67)"/>
      {/* 쏟아지는 액체 오른쪽 */}
      <path d="M 196 72 C 182 90, 165 108, 155 125"
        stroke="#FFB27F" strokeWidth="3" fill="none" opacity="0.75"/>
      <circle cx="192" cy="88" r="5" fill="#FFB27F" opacity="0.6"/>
      <circle cx="202" cy="105" r="3.5" fill="#FFB27F" opacity="0.5"/>

      {/* 충격 표시 */}
      <text x="8"   y="32" fontSize="22" fill="#FF4040" fontWeight="bold" fontFamily="serif">!</text>
      <text x="196" y="32" fontSize="22" fill="#FF4040" fontWeight="bold" fontFamily="serif">!</text>
      <text x="8"   y="155" fontSize="18" fill="#FF4040" fontWeight="bold" fontFamily="serif">?!</text>
    </svg>
  );
}

export function GodDazed() {
  return (
    <svg width="210" height="220" viewBox="0 0 210 220" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 테이블 */}
      <line x1="0" y1="208" x2="210" y2="208" stroke="#222" strokeWidth="2.5"/>

      {/* 바닥에 흥건한 액체 */}
      <ellipse cx="105" cy="208" rx="88" ry="8" fill="#9B7FE0" opacity="0.4"/>

      {/* 뒤집힌 믹싱볼 */}
      <g transform="rotate(178, 105, 180)">
        <path d="M 22 178 Q 22 210, 105 210 Q 188 210, 188 178"
          fill="white" stroke="#222" strokeWidth="2.5"/>
        <ellipse cx="105" cy="178" rx="83" ry="13" fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 긴 머리카락 — 왼쪽 (축 늘어짐) */}
      <path d="M 73 24 C 55 52, 40 98, 35 145 C 30 178, 34 207, 40 208"
        fill="#f2f2f2" stroke="#222" strokeWidth="2"/>
      {/* 긴 머리카락 — 오른쪽 (축 늘어짐) */}
      <path d="M 137 24 C 155 52, 170 98, 175 145 C 180 178, 176 207, 170 208"
        fill="#f2f2f2" stroke="#222" strokeWidth="2"/>

      {/* 로브/몸통 — 살짝 앞으로 숙임 */}
      <path d="M 77 80 C 60 94, 52 128, 55 168 L 155 168 C 158 128, 150 94, 133 80 Z"
        fill="white" stroke="#222" strokeWidth="2.5"/>
      <path d="M 94 92 C 92 120, 92 145, 94 165" stroke="#e0e0e0" strokeWidth="1.2" fill="none"/>
      <path d="M 116 92 C 118 120, 118 145, 116 165" stroke="#e0e0e0" strokeWidth="1.2" fill="none"/>

      {/* 머리 */}
      <ellipse cx="105" cy="46" rx="32" ry="35" fill="white" stroke="#222" strokeWidth="2.5"/>

      {/* 긴 수염 */}
      <path d="M 80 78 C 73 104, 70 134, 72 162 C 74 185, 86 207, 105 208
                C 124 207, 136 185, 138 162 C 140 134, 137 104, 130 78"
        fill="white" stroke="#222" strokeWidth="2"/>
      <path d="M 88 86 C 85 116, 83 148, 86 172 C 88 188, 95 203, 105 206"
        stroke="#ccc" strokeWidth="1.3" fill="none"/>
      <path d="M 105 82 L 105 207" stroke="#ccc" strokeWidth="1.3" fill="none"/>
      <path d="M 122 86 C 125 116, 127 148, 124 172 C 122 188, 115 203, 105 206"
        stroke="#ccc" strokeWidth="1.3" fill="none"/>

      {/* 굵은 눈썹 — 아래로 처짐 */}
      <path d="M 82 35 Q 93 40, 103 35" stroke="#222" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 107 35 Q 117 40, 128 35" stroke="#222" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* 눈 — X X (정신 나간 표정) */}
      {/* 왼쪽 X */}
      <line x1="84" y1="38" x2="96" y2="50" stroke="#222" strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="96" y1="38" x2="84" y2="50" stroke="#222" strokeWidth="2.8" strokeLinecap="round"/>
      {/* 오른쪽 소용돌이 눈 */}
      <path d="M 120 44 C 120 40, 116 38, 112 40 C 108 42, 108 48, 112 50 C 116 52, 122 50, 124 46 C 126 42, 124 36, 118 35"
        stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* 비뚤어진 입 */}
      <path d="M 93 60 Q 105 55, 117 61" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* 콧수염 — 한쪽만 처짐 */}
      <path d="M 90 58 Q 98 63, 105 58 Q 113 56, 120 58"
        fill="#d0d0d0" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* 팔 — 힘없이 늘어짐 */}
      <path d="M 64 108 Q 44 128, 34 155"
        stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <path d="M 146 108 Q 166 128, 176 155"
        stroke="#222" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

      {/* 빈 손 */}
      <circle cx="32"  cy="158" r="7" fill="white" stroke="#222" strokeWidth="2"/>
      <circle cx="178" cy="158" r="7" fill="white" stroke="#222" strokeWidth="2"/>

      {/* 머리 주변 별들 */}
      <text x="130" y="18" fontSize="16" fill="#FFD700" opacity="0.9">✦</text>
      <text x="44"  y="14" fontSize="14" fill="#FFD700" opacity="0.8">✧</text>
      <text x="148" y="50" fontSize="12" fill="#FF6B2F" opacity="0.9">★</text>
      <text x="36"  y="52" fontSize="12" fill="#9B7FE0" opacity="0.9">★</text>
      <text x="105" y="8"  fontSize="11" fill="#6BB5FF" opacity="0.8">✦</text>
    </svg>
  );
}

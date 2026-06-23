// B급 손그림 신 일러스트 - 레퍼런스: 긴 흰 머리카락 흘러내리는 로브형 캐릭터

export function GodIdle({ count }: { count: number }) {
  const colors = ['#E07070', '#5CB85C', '#9B7FE0', '#F5C842', '#FF5050', '#50B8FF'];
  const liquidColor = count > 0 ? colors[(count - 1) % colors.length] : '#ddd';

  return (
    <svg width="180" height="188" viewBox="0 0 180 188" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 테이블 */}
      <line x1="0" y1="170" x2="180" y2="170" stroke="#222" strokeWidth="2.5"/>

      {/* 신 전체 실루엣: 머리 + 긴 흘러내리는 머리카락/로브 */}
      <path
        d="M 90 10 C 108 10, 116 22, 116 38 C 140 50, 162 82, 162 120 C 162 148, 148 163, 132 163 L 48 163 C 32 163, 18 148, 18 120 C 18 82, 40 50, 64 38 C 64 22, 72 10, 90 10 Z"
        fill="white" stroke="#222" strokeWidth="2.5"
      />

      {/* 오른팔 - 재료 들고 있음 */}
      <path d="M 130 110 Q 150 124 150 140" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 재료 방울 */}
      <circle cx="150" cy="148" r={count > 0 ? 7 : 6}
              fill={count > 0 ? liquidColor : '#ddd'} stroke="#222" strokeWidth="1.8"/>

      {/* 그릇 (신체 앞에, 큰 믹싱볼) */}
      <path d="M 20 152 C 20 182, 160 182, 160 152"
            fill="white" stroke="#222" strokeWidth="2.5"/>
      <ellipse cx="90" cy="152" rx="70" ry="12" fill="white" stroke="#222" strokeWidth="2.5"/>
      {count > 0 && (
        <ellipse
          cx="90" cy="152"
          rx={Math.min(58, 8 + count * 10)}
          ry={Math.min(9, 1.5 + count * 1.3)}
          fill={liquidColor} opacity="0.85"
        />
      )}

      {/* 눈 - 레퍼런스처럼 작은 검은 점 */}
      <circle cx="81" cy="32" r="2.8" fill="#222"/>
      <circle cx="99" cy="32" r="2.8" fill="#222"/>

      {/* 입 */}
      <path d="M 84 44 Q 90 48 96 44" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function GodPanic() {
  return (
    <svg width="200" height="195" viewBox="0 0 200 195" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 테이블 */}
      <line x1="0" y1="172" x2="200" y2="172" stroke="#222" strokeWidth="2.5"/>
      {/* 바닥 쏟아진 액체 */}
      <ellipse cx="100" cy="177" rx="88" ry="8" fill="#FF6B2F" opacity="0.5"/>

      {/* 그릇 (기울어져 쏟아짐) */}
      <g transform="rotate(18, 80, 158)">
        <path d="M 24 158 C 24 184, 136 184, 136 158"
              fill="white" stroke="#222" strokeWidth="2.5"/>
        <ellipse cx="80" cy="158" rx="56" ry="10" fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 신 몸 - 약간 기울어짐 */}
      <g transform="rotate(-6, 100, 100)">
        <path
          d="M 100 10 C 118 10, 126 22, 126 38 C 150 50, 172 82, 172 120 C 172 148, 158 163, 142 163 L 58 163 C 42 163, 28 148, 28 120 C 28 82, 50 50, 74 38 C 74 22, 82 10, 100 10 Z"
          fill="white" stroke="#222" strokeWidth="2.5"
        />

        {/* 놀란 눈 (크고 흰 테두리) */}
        <circle cx="88" cy="32" r="9.5" fill="white" stroke="#222" strokeWidth="2.2"/>
        <circle cx="112" cy="32" r="9.5" fill="white" stroke="#222" strokeWidth="2.2"/>
        <circle cx="88" cy="33" r="6" fill="#222"/>
        <circle cx="112" cy="33" r="6" fill="#222"/>
        <circle cx="89.5" cy="31" r="2.2" fill="white"/>
        <circle cx="113.5" cy="31" r="2.2" fill="white"/>

        {/* O 입 */}
        <ellipse cx="100" cy="50" rx="7" ry="6.5" fill="#222"/>

        {/* 오른팔 - 컵 방향 */}
        <path d="M 142 105 Q 160 90 170 78" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </g>

      {/* 파란 컵 (기울어져 쏟아짐) */}
      <g transform="rotate(-48, 172, 80)">
        <rect x="154" y="56" width="36" height="44" rx="5" fill="#4FAEE0" stroke="#222" strokeWidth="2.5"/>
        <rect x="161" y="63" width="22" height="24" rx="3" fill="rgba(255,255,255,0.3)"/>
      </g>

      {/* 쏟아지는 오렌지 액체 */}
      <path
        d="M 174 68 C 162 84, 150 102, 142 120 C 134 134, 130 150, 132 162 C 142 150, 152 132, 160 112 C 170 92, 176 72, 174 68 Z"
        fill="#FF6B2F" opacity="0.88"
      />
      <circle cx="140" cy="110" r="6" fill="#FF6B2F" opacity="0.75"/>
      <circle cx="152" cy="90" r="4.5" fill="#FF6B2F" opacity="0.7"/>

      {/* 충격 표시 */}
      <text x="24" y="38" fontSize="20" fill="#FF4040" fontWeight="bold">!</text>
      <text x="168" y="32" fontSize="20" fill="#FF4040" fontWeight="bold">!</text>
    </svg>
  );
}

export function GodDazed() {
  return (
    <svg width="190" height="188" viewBox="0 0 190 188" style={{ overflow: 'visible' }} aria-hidden="true">
      {/* 테이블 */}
      <line x1="0" y1="170" x2="190" y2="170" stroke="#222" strokeWidth="2.5"/>
      {/* 쏟아진 액체 */}
      <ellipse cx="95" cy="174" rx="88" ry="8" fill="#9B7FE0" opacity="0.4"/>

      {/* 뒤집어진 그릇 */}
      <g transform="rotate(178, 95, 164)">
        <path d="M 33 164 C 33 190, 157 190, 157 164"
              fill="white" stroke="#222" strokeWidth="2.5"/>
        <ellipse cx="95" cy="164" rx="62" ry="11" fill="white" stroke="#222" strokeWidth="2.5"/>
      </g>

      {/* 신 몸 */}
      <path
        d="M 95 10 C 113 10, 121 22, 121 38 C 145 50, 167 82, 167 120 C 167 148, 153 163, 137 163 L 53 163 C 37 163, 23 148, 23 120 C 23 82, 45 50, 69 38 C 69 22, 77 10, 95 10 Z"
        fill="white" stroke="#222" strokeWidth="2.5"
      />

      {/* 헤롱헤롱 눈 */}
      <line x1="77" y1="27" x2="87" y2="39" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="87" y1="27" x2="77" y2="39" stroke="#222" strokeWidth="2.5" strokeLinecap="round"/>
      <path
        d="M 103 34 Q 108 27, 114 34 Q 117 40 112 44 Q 107 46, 103 41 Q 102 37, 103 34"
        stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round"
      />

      {/* 비뚤어진 입 */}
      <path d="M 83 50 Q 93 46 103 51" stroke="#222" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* 별들 */}
      <text x="128" y="22" fontSize="15" fill="#FFD700" opacity="0.9">✦</text>
      <text x="46" y="18" fontSize="13" fill="#FFD700" opacity="0.8">✧</text>
      <text x="142" y="52" fontSize="11" fill="#FF6B2F" opacity="0.9">★</text>
      <text x="38" y="54" fontSize="11" fill="#9B7FE0" opacity="0.9">★</text>
    </svg>
  );
}

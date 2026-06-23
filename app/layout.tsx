import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = 'https://god-game-kohl.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: '신이 나를 만들 때 🧪',
  description: '생년월일 사주로 알아보는 나의 진짜 성격! 재료 5개로 신이 폭발하는 밈 게임',
  openGraph: {
    title: '신이 나를 만들 때 🧪',
    description: '재료 5개 골라 내 성격 분석 — 생년월일 사주 기반 밈 게임',
    type: 'website',
    url: BASE_URL,
    siteName: '신이나를만들때',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '신이 나를 만들 때 🧪 — 사주 기반 성격 분석 밈 게임',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '신이 나를 만들 때 🧪',
    description: '재료 5개 골라 내 성격 분석 — 생년월일 사주 기반 밈 게임',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

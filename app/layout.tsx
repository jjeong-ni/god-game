import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '신이 나를 만들 때 🧪',
  description: '실험실에서 재료 5개를 골라 나의 성격을 분석해봐! 웃기고 공감되는 재료들로 신이 폭발하는 실험을 완성하세요.',
  openGraph: {
    title: '신이 나를 만들 때 🧪',
    description: '재료 5개 골라 내 성격 분석 - 신이 헤롱헤롱하는 그 밈 게임',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

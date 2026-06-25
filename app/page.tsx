// src/app/page.tsx
'use client';

import dynamic from 'next/dynamic';

// SSR을 끄고 브라우저에서만 이 컴포넌트를 부르도록 강제함 🌟
const MP3Converter = dynamic(() => import('@/app/Converter'), { ssr: false });

export default function Home() {
  return <MP3Converter />;
}
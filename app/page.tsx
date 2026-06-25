'use client';

import dynamic from 'next/dynamic';

// 🌟 무거운 변환기 알맹이만 안전하게 지연 로딩합니다.
// 로딩 중일 때도 디자인 박스 안에서 귀여운 동자승 멘트가 뜨도록 세팅했어요!
const MP3Converter = dynamic(() => import('@/app/Converter'), { 
  ssr: false,
  loading: () => (
    <p className="text-center text-sm font-bold text-[#8D6E63] animate-pulse">
      동자승이 엔진을 깨우는 중... 🧘‍♂️
    </p>
  )
});

export default function Home() {
  return (
    // 1. 화면 높이에 딱 맞추고 스크롤 없이 무조건 화면 정중앙에 배치!
    <main className="w-full h-screen bg-[#FFF8E1] flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* 2. 한눈에 쏙 들어오는 아담하고 귀여운 노란색/주황색 단청 박스 */}
      <div className="w-full max-w-md bg-white p-5 md:p-6 rounded-3xl shadow-[0_8px_0_0_#FFB74D] border-4 border-[#FF9800] flex flex-col my-auto">
        
        {/* 헤더 영역 (사이트 켜자마자 바로 뜸!) */}
        <header className="text-center mb-4 pb-3 border-b-4 border-dashed border-[#FFE082]">
          <div className="flex justify-center items-center gap-2 mb-1">
            <span className="text-3xl">🙇‍♂️</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#BF360C] tracking-tighter">
              고음질 MP3 변환기
            </h1>
            <span className="text-3xl">📿</span>
          </div>
          <p className="text-xs text-[#D84315] font-medium bg-[#FFF3E0] inline-block px-2.5 py-0.5 rounded-full">
            m4a/mp4 번뇌를 벗고, mp3로 닙바나 성취하길. 🙏
          </p>
        </header>

        {/* 변환기 영역 */}
        <section className="bg-[#FFFDE7] p-4 rounded-2xl border-4 border-[#FFE082] shadow-inner min-h-[150px] flex flex-col justify-center">
          {/* ✅ 여기에 원래 부르던 변환기 알맹이가 안전하게 들어옵니다! */}
          <div className="converter-wrapper custom-buddha-style">
            <MP3Converter />
          </div>
        </section>

        {/* 푸터 영역 */}
        <footer className="text-center mt-4 pt-3 border-t-2 border-[#EEEEEE] text-[#A1887F] text-[11px]">
          <p>기다리면 자동으로 다운로드 됩니다. 최대 1분 정도 소요 됩니다. 🧘‍♂️</p>
        </footer>
      </div>

      {/* 버튼들을 동자승 컬러로 강제 물들이기 */}
      <style jsx global>{`
        .custom-buddha-style input[type="file"]::file-selector-button {
          background-color: #FFB74D;
          border: 2px solid #FF9800;
          color: #BF360C;
          border-radius: 99px;
          padding: 4px 10px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
        }
        .custom-buddha-style input[type="file"]::file-selector-button:hover {
          background-color: #FF9800;
          color: white;
        }
        .custom-buddha-style button {
          background-color: #BF360C !important;
          color: white !important;
          border-radius: 99px !important;
          font-weight: bold !important;
          box-shadow: 0 4px 0 0 #872202 !important;
          transition: all 0.1s !important;
          font-size: 14px !important;
          padding: 6px 16px !important;
        }
        .custom-buddha-style button:active {
          transform: translateY(2px) !important;
          box-shadow: 0 2px 0 0 #872202 !important;
        }
      `}</style>
    </main>
  );
}
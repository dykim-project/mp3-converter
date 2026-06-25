'use client';

import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function Convert() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const ffmpegRef = useRef(new FFmpeg());

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    setLoaded(true);
  };

  const handleConvert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setProgress('변환 엔진 준비 중...');

    try {
      if (!loaded) await loadFFmpeg();

      const ffmpeg = ffmpegRef.current;
      setProgress('파일 읽는 중...');
      const fileExtension = file.name.split('.').pop() || 'mp4';
      await ffmpeg.writeFile(`input.${fileExtension}`, await fetchFile(file));

      setProgress('오디오 추출 중...');
      await ffmpeg.exec(['-i', `input.${fileExtension}`, '-vn', '-b:a', '320k', 'output.mp3']);
      setProgress('파일 생성 중...');
      const data = await ffmpeg.readFile('output.mp3');

      const rawData = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const audioData = new Uint8Array(rawData);

      const blob = new Blob([audioData], { type: 'audio/mp3' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setProgress('변환 완료!');
    } catch (error) {
      console.error(error);
      alert('변환 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="custom-buddha-style w-full text-center">
      {/* 🌟 [핵심 수정] min-h-screen, bg-slate-900 같은 무거운 부모 레이아웃을 전부 삭제했습니다. */}
      <div className="w-full flex flex-col items-center">
        
        {/* 파일 업로드 버튼 구역 - 컴팩트하게 패딩 조정 및 귀여운 오렌지 톤으로 통일 */}
        <label className={`block w-full text-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          isLoading 
            ? 'border-orange-200 bg-orange-50 text-orange-300 pointer-events-none' 
            : 'border-[#FF9800] bg-[#FFF3E0] hover:bg-[#FFE082] text-[#BF360C]'
        }`}>
          <input type="file" accept="video/mp4,video/mkv,video/x-m4v,audio/x-m4a,audio/m4a" onChange={handleConvert} disabled={isLoading} className="hidden" />
          <span className="font-bold block text-sm">
            {isLoading ? '법문 변환 중...' : '공덕 파일 선택하기 (클릭)'}
          </span>
          <span className="text-[10px] text-[#D84315] block mt-0.5">MP4, MKV, M4A 지원</span>
        </label>

        {/* 로딩 표시 구역 - 마진을 바짝 줄여서 세로 길이 축소 */}
        {isLoading && (
          <div className="mt-3">
            <div className="w-6 h-6 border-4 border-[#BF360C] border-t-transparent rounded-full animate-spin mx-auto mb-1.5"></div>
            <p className="text-[#BF360C] text-xs font-bold animate-pulse">{progress}</p>
          </div>
        )}
      </div>
    </div>
  );
}
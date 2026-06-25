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
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'; // 정확한 버전 명시
    const ffmpeg = ffmpegRef.current;

    // Vercel 배포 환경에서 멈추지 않도록 core와 wasm 주소를 강제로 지정 🌟
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
      // [수정] input.mp4 대신 확장자를 유연하게 처리하기 위해 파일명 수정
      setProgress('파일 읽는 중...');
      const fileExtension = file.name.split('.').pop() || 'mp4';
      await ffmpeg.writeFile(`input.${fileExtension}`, await fetchFile(file));

      setProgress('MP3 고음질 오디오 추출 중...');
      // [수정] 입력 파일 확장자를 변수 처리하고, m4a의 경우 오디오만 그대로 재인코딩하도록 설정
      await ffmpeg.exec(['-i', `input.${fileExtension}`, '-vn', '-q:a', '2', 'output.mp3']);

      setProgress('다운로드 파일 생성 중...');
     const data = await ffmpeg.readFile('output.mp3');

      // 🌟 [수정] string 타입 예외 처리 및 SharedArrayBuffer 문제를 해결하기 위해 일반 Uint8Array로 복사
      const rawData = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const audioData = new Uint8Array(rawData); // 순수 Uint8Array로 완벽 변환!

      // 이제 타입 오류 없이 깔끔하게 Blob이 생성됩니다.
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-slate-700">
        <div className="text-5xl mb-4">🎵</div>
        <h1 className="text-2xl font-bold mb-2 tracking-tight"> 고음질 MP4 ➡️ MP3 변환기</h1>
        {/* <p className="text-slate-400 text-sm mb-8">
          서버로 파일을 전송하지 않아 100% 안전하며,<br />
          용량 제한 없이 즉시 기기에서 변환됩니다.
        </p> */}
        
        <label className={`block w-full text-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isLoading 
            ? 'border-slate-600 bg-slate-750 text-slate-500 pointer-events-none' 
            : 'border-violet-500 bg-violet-950/20 hover:bg-violet-950/40 text-violet-300'
        }`}>
          {/* [수정] accept 속성에 m4a 관련 마임타입 추가 */}
          <input type="file" accept="video/mp4,video/mkv,video/x-m4v,audio/x-m4a,audio/m4a" onChange={handleConvert} disabled={isLoading} className="hidden" />
          <span className="font-semibold block mb-1">
            {isLoading ? '변환 작업 진행 중...' : '파일 선택하기'}
          </span>
          {/* [수정] 안내 문구에 M4A 추가 */}
          <span className="text-xs text-slate-400 block">MP4, MKV, M4A 지원</span>
        </label>
         

        {isLoading && (
          <div className="mt-6">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-violet-400 text-sm font-medium animate-pulse">{progress}</p>
          </div>
        )}
      </div>
    </div>
  );
}
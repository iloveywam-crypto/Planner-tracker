/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export default function App() {
  const [today] = React.useState(new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '. ').replace(/\.$/, ''));

  return (
    <div className="min-h-screen bg-warm-bg text-ink p-4 sm:p-8 md:p-12 transition-colors duration-500 flex items-start justify-center">
      <div className="w-full max-w-[976px]">
        {/* Header - Stack on mobile, side-by-side on desktop */}
        <header className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-ink/5 pb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-3xl sm:text-4xl font-light tracking-tight"
            >
              따뜻한 하루
            </motion.h1>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-ink-muted font-medium mt-1">
              Custom Daily Habit Tracker
            </p>
          </div>
          <div className="sm:text-right w-full sm:w-auto">
            <p className="font-serif italic text-sm text-ink-muted border-l-2 sm:border-l-0 sm:border-r-2 border-pastel-orange pl-3 sm:pl-0 sm:pr-3">
              {today}
            </p>
          </div>
        </header>

        {/* Main Layout Grid - 1 col on mobile, 2 col on desktop */}
        <main className="grid grid-cols-1 md:grid-cols-[400px_1fr] lg:grid-cols-[380px_1fr] gap-8 md:gap-10">
          
          {/* Left Column (Order 2 on mobile, 1 on desktop if needed, or just let stack) */}
          <div className="flex flex-col gap-8 order-2 md:order-1">
            {/* Time Schedule Section */}
            <section className="paper-texture paper-shadow p-5 sm:p-6 rounded-2xl flex-grow flex flex-col border border-black/5">
              <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-1 mb-6 self-start">
                시간대별 계획
              </h2>
              <div className="space-y-1">
                {[
                  { time: '06:00', task: '새벽 요가 및 확언', done: true },
                  { time: '08:00', task: '영양제 및 건강한 아침 식사', done: false },
                  { time: '10:00', task: '딥워크: 핵심 프로젝트 1단계', done: false },
                  { time: '12:00', task: '팀 미팅 및 점심 식사', done: false },
                  { time: '14:00', task: '커피 한 잔과 이메일 정리', done: false },
                  { time: '16:00', task: '운동 (헬스장 또는 러닝)', done: false },
                  { time: '18:00', task: '저녁 식사 및 휴식', done: false },
                  { time: '20:00', task: '독서 및 하루 회고', done: false },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[55px_1fr_32px] items-center border-b border-line/50 py-3 sm:py-2 min-h-[48px] sm:min-h-[40px]">
                    <span className="font-serif text-sm text-ink-muted">{item.time}</span>
                    <input 
                      readOnly
                      value={item.task}
                      className="bg-transparent text-sm focus:outline-none placeholder:text-ink/20 truncate pr-2" 
                    />
                    <div className="flex justify-end items-center h-full">
                      <div className={`w-5 h-5 sm:w-4 sm:h-4 cursor-pointer rounded border border-line flex-shrink-0 flex items-center justify-center ${item.done ? 'bg-pastel-orange' : 'bg-white'}`}>
                        {item.done && <div className="w-1.5 h-1.5 bg-ink/40 rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tomorrow Section - Adaptive Sticky Note */}
            <section className="bg-pastel-yellow p-6 rounded-2xl paper-shadow border border-black/5 md:-rotate-1 relative min-h-[140px]">
              <div className="absolute top-0 left-0 w-full h-4 bg-white/20 rounded-t-2xl"></div>
              <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-0.5 mb-3 relative z-10">
                내일 할 일
              </h2>
              <div className="text-sm font-light leading-relaxed relative z-10 space-y-1">
                <p>• 시장조사 보고서 마무리</p>
                <p>• 요가 수업 예약하기</p>
                <p>• 비타민 구매</p>
              </div>
              {/* Note Corner Curl Effect on Desktop */}
              <div className="hidden sm:block absolute bottom-0 right-0 w-8 h-8 bg-black/5 rounded-br-2xl clip-path-corner"></div>
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 order-1 md:order-2">
            {/* Today's Goals Section */}
            <section className="paper-texture paper-shadow p-5 sm:p-6 rounded-2xl border border-black/5 flex flex-col gap-5">
              <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-1 mb-2 self-start">
                오늘의 목표
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  '주간 업무 우선순위 리스트업 완료',
                  '물 2L 이상 마시기 (현재 1.5L)',
                  '가족에게 안부 전화 한 통 하기'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-[#FDFCF9] rounded-xl border border-line paper-shadow-sm">
                    <span className="text-pastel-orange text-lg leading-none">●</span>
                    <input 
                      readOnly
                      value={text}
                      className="bg-transparent w-full text-sm font-light leading-snug" 
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Habit Checklist Section */}
            <section className="bg-pastel-green p-6 rounded-3xl paper-shadow border border-black/5 flex-grow">
               <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-1 mb-6">
                 습관 체크리스트
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: '영양제 먹기', checked: true },
                    { label: '영어 단어 10개', checked: false },
                    { label: '스트레칭 10분', checked: true },
                    { label: '일기 쓰기', checked: false }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl flex justify-between items-center text-sm border border-black/5 paper-shadow-sm min-h-[56px]">
                      <span className="font-light">{item.label}</span>
                      <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded border border-line flex items-center justify-center ${item.checked ? 'bg-ink' : 'bg-white'}`}>
                        {item.checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Memo Section */}
            <section className="p-6 rounded-2xl border-2 border-dashed border-line/60 flex flex-col min-h-[160px]">
              <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-0.5 mb-4 self-start">
                메모
              </h2>
              <div className="flex-grow font-serif leading-relaxed text-ink-muted text-[15px] italic">
                오늘은 하늘이 참 맑았다. 내일은 조금 더 일찍 일어나서 아침 산책을 다녀오면 좋을 것 같다. 프로젝트 A에 대한 아이디어가 떠올랐는데, 메모해두자.
              </div>
            </section>
          </div>

        </main>
        
        {/* Footer info for mobile */}
        <footer className="mt-12 mb-8 text-center md:hidden border-t border-ink/5 pt-6">
          <p className="text-[10px] text-ink-muted uppercase tracking-widest font-medium italic">Handcrafted with care</p>
        </footer>
      </div>
    </div>
  );
}




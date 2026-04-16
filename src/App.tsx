/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Plus, Trash2, Check, Edit3, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ScheduleItem {
  time: string;
  task: string;
  done: boolean;
}

interface HabitItem {
  id: string;
  label: string;
  checked: boolean;
}

interface DayData {
  schedule: ScheduleItem[];
  goals: string[];
  habits: HabitItem[];
  tomorrow: string;
  memo: string;
}

interface AllEntries {
  [date: string]: DayData;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: '06:00', task: '', done: false },
  { time: '08:00', task: '', done: false },
  { time: '10:00', task: '', done: false },
  { time: '12:00', task: '', done: false },
  { time: '14:00', task: '', done: false },
  { time: '16:00', task: '', done: false },
  { time: '18:00', task: '', done: false },
  { time: '20:00', task: '', done: false },
];

const DEFAULT_HABITS: HabitItem[] = [
  { id: '1', label: '영양제 먹기', checked: false },
  { id: '2', label: '스트레칭 10분', checked: false },
];

export default function App() {
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const [allEntries, setAllEntries] = useState<AllEntries>({});

  // --- Current Day State ---
  const [schedule, setSchedule] = useState<ScheduleItem[]>(JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)));
  const [goals, setGoals] = useState<string[]>(['', '', '']);
  const [habits, setHabits] = useState<HabitItem[]>(JSON.parse(JSON.stringify(DEFAULT_HABITS)));
  const [tomorrow, setTomorrow] = useState('');
  const [memo, setMemo] = useState('');

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // --- Persistence ---
  
  // Load ALL data once on mount
  useEffect(() => {
    const savedData = localStorage.getItem('warm-habit-tracker-v2');
    if (savedData) {
      setAllEntries(JSON.parse(savedData));
    }
  }, []);

  // Update current view when selectedDate OR allEntries changes
  useEffect(() => {
    if (allEntries[selectedDate]) {
      const day = allEntries[selectedDate];
      setSchedule(day.schedule);
      setGoals(day.goals);
      setHabits(day.habits);
      setTomorrow(day.tomorrow);
      setMemo(day.memo);
    } else {
      // New day: Initialize defaults
      setSchedule(JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)));
      setHabits(JSON.parse(JSON.stringify(DEFAULT_HABITS)));
      setMemo('');
      setTomorrow('');

      // Link Tomorrow logic: Check previous day's "tomorrow" and pre-fill goals
      const prevDateObj = new Date(selectedDate);
      prevDateObj.setDate(prevDateObj.getDate() - 1);
      const prevDateStr = getFormattedDate(prevDateObj);
      
      const prevDayData = allEntries[prevDateStr];
      if (prevDayData && prevDayData.tomorrow) {
        const lines = prevDayData.tomorrow.split('\n').filter(l => l.trim() !== '');
        const newGoals = ['', '', ''];
        lines.slice(0, 3).forEach((line, i) => {
          newGoals[i] = line.replace(/^[•\s\-\*]+/, '').trim();
        });
        setGoals(newGoals);
      } else {
        setGoals(['', '', '']);
      }
    }
  }, [selectedDate, allEntries]);

  const saveData = () => {
    const currentDayData = { schedule, goals, habits, tomorrow, memo };
    const updatedEntries = { ...allEntries, [selectedDate]: currentDayData };
    setAllEntries(updatedEntries);
    localStorage.setItem('warm-habit-tracker-v2', JSON.stringify(updatedEntries));
    setSaveStatus('저장되었습니다');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  // --- Handlers ---
  const changeDate = (days: number) => {
    // Before changing, you might want to auto-save? 
    // For now, let's just change and the user can hit Save.
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(getFormattedDate(date));
  };

  const setDateToToday = () => {
    setSelectedDate(getFormattedDate(new Date()));
  };

  const toggleSchedule = (idx: number) => {
    const newSchedule = [...schedule];
    newSchedule[idx].done = !newSchedule[idx].done;
    setSchedule(newSchedule);
  };

  const updateScheduleTask = (idx: number, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[idx].task = value;
    setSchedule(newSchedule);
  };

  const updateGoal = (idx: number, value: string) => {
    const newGoals = [...goals];
    newGoals[idx] = value;
    setGoals(newGoals);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, checked: !h.checked } : h));
  };

  const addHabit = () => {
    const newHabit = { id: Date.now().toString(), label: '새 습관', checked: false };
    setHabits([...habits, newHabit]);
  };

  const updateHabitLabel = (id: string, label: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, label } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const displayDate = new Date(selectedDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\.$/, '');

  return (
    <div className="min-h-screen bg-warm-bg text-ink p-4 sm:p-8 md:p-12 transition-colors duration-500 flex items-start justify-center relative">
      
      {/* Save Notification */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 bg-ink text-warm-bg px-6 py-2 rounded-full text-xs font-medium tracking-widest z-50 shadow-lg"
          >
            {saveStatus}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[976px]">
        {/* Header with Date Navigation */}
        <header className="mb-8 md:mb-12 border-b border-ink/5 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-serif text-3xl sm:text-4xl font-light tracking-tight"
              >
                따뜻한 하루
              </motion.h1>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-ink-muted font-medium mt-1">
                Custom Daily Habit Tracker
              </p>
            </div>

            {/* Date Navigator */}
            <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-4 bg-white/50 p-2 rounded-xl paper-shadow-sm border border-black/5">
                <button 
                  onClick={() => changeDate(-1)}
                  className="p-1 hover:bg-ink/5 rounded-md transition-colors"
                >
                  <ChevronLeft size={20} className="text-ink/60" />
                </button>
                <div className="flex items-center gap-2 px-2 cursor-pointer" onClick={setDateToToday}>
                  <Calendar size={14} className="text-pastel-orange" />
                  <span className="font-serif italic text-base font-medium min-w-[120px] text-center">
                    {displayDate}
                  </span>
                </div>
                <button 
                  onClick={() => changeDate(1)}
                  className="p-1 hover:bg-ink/5 rounded-md transition-colors"
                >
                  <ChevronRight size={20} className="text-ink/60" />
                </button>
              </div>
              <button 
                onClick={saveData}
                className="flex items-center gap-2 bg-ink text-warm-bg px-5 py-2.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] active:scale-95 paper-shadow w-full sm:w-auto justify-center"
              >
                <Save size={14} /> 오늘 기록 저장하기
              </button>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="grid grid-cols-1 md:grid-cols-[400px_1fr] lg:grid-cols-[380px_1fr] gap-8 md:gap-10">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 order-2 md:order-1">
            {/* Time Schedule */}
            <section className="paper-texture paper-shadow p-5 sm:p-6 rounded-2xl flex-grow flex flex-col border border-black/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-1">
                  시간대별 계획
                </h2>
              </div>
              <div className="space-y-1">
                {schedule.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[55px_1fr_32px] items-center border-b border-line/40 py-2 min-h-[48px]">
                    <span className="font-serif text-sm text-ink-muted">{item.time}</span>
                    <input 
                      type="text"
                      value={item.task}
                      onChange={(e) => updateScheduleTask(idx, e.target.value)}
                      placeholder="할 일 입력"
                      className={`bg-transparent text-sm focus:outline-none placeholder:text-ink/10 truncate pr-2 transition-all ${item.done ? 'line-through text-ink/30 italic' : ''}`} 
                    />
                    <div className="flex justify-end items-center h-full">
                      <button 
                        onClick={() => toggleSchedule(idx)}
                        className={`w-6 h-6 flex items-center justify-center rounded border transition-colors ${item.done ? 'bg-pastel-orange border-pastel-orange' : 'bg-white border-line'}`}
                      >
                        {item.done && <Check size={14} className="text-ink/70" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tomorrow Section */}
            <section className="bg-pastel-yellow p-6 rounded-2xl paper-shadow border border-black/5 md:-rotate-1 relative min-h-[160px] flex flex-col">
              <div className="absolute top-0 left-0 w-full h-4 bg-white/20 rounded-t-2xl"></div>
              <div className="flex justify-between items-center mb-3 relative z-10">
                <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-0.5">
                  내일 할 일
                </h2>
                <Edit3 size={16} className="text-ink/20" />
              </div>
              <p className="text-[10px] text-ink/30 mb-2 font-medium uppercase tracking-tight relative z-10">
                Tip: 적어둔 내용은 다음 날 목표로 자동 연동됩니다. (한 줄에 한 개)
              </p>
              <textarea 
                value={tomorrow}
                onChange={(e) => setTomorrow(e.target.value)}
                placeholder="내일의 주요 목표들을 적어보세요..."
                className="flex-grow bg-transparent text-sm font-light leading-relaxed relative z-10 w-full resize-none focus:outline-none placeholder:text-ink/20"
              />
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 order-1 md:order-2">
            {/* Today's Goals */}
            <section className="paper-texture paper-shadow p-5 sm:p-6 rounded-2xl border border-black/5 flex flex-col gap-5">
              <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-1 mb-2 self-start">
                오늘의 목표
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {goals.map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 sm:p-4 bg-[#FDFCF9] rounded-xl border border-line paper-shadow-sm focus-within:ring-1 focus-within:ring-pastel-orange/30">
                    <span className="text-pastel-orange text-lg leading-none">●</span>
                    <input 
                      type="text"
                      value={text}
                      onChange={(e) => updateGoal(i, e.target.value)}
                      placeholder={`목표 ${i + 1}`}
                      className="bg-transparent w-full text-sm font-light focus:outline-none" 
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Habit Checklist */}
            <section className="bg-pastel-green p-6 rounded-3xl paper-shadow border border-black/5 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-1">
                   습관 체크리스트
                 </h2>
                 <button 
                  onClick={addHabit}
                  className="bg-ink/5 hover:bg-ink/10 p-2 rounded-full transition-colors text-ink/40"
                 >
                   <Plus size={16} />
                 </button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {habits.map((item) => (
                    <div key={item.id} className="bg-white/80 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between gap-3 text-sm border border-black/5 paper-shadow-sm min-h-[56px] group">
                      <input 
                        className={`bg-transparent flex-grow font-light focus:outline-none ${item.checked ? 'text-ink/30 italic' : ''}`}
                        value={item.label}
                        onChange={(e) => updateHabitLabel(item.id, e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => deleteHabit(item.id)}
                          className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button 
                          onClick={() => toggleHabit(item.id)}
                          className={`w-6 h-6 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${item.checked ? 'bg-ink border-ink' : 'bg-white border-line'}`}
                        >
                          {item.checked && <Check size={14} className="text-white" />}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Memo Section */}
            <section className="p-6 rounded-2xl border-2 border-dashed border-line/60 flex flex-col min-h-[200px]">
              <h2 className="font-serif text-xl border-b-2 border-pastel-orange inline-block pb-0.5 mb-4 self-start">
                메모
              </h2>
              <textarea 
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="오늘 하루의 기록을 자유롭게 남겨보세요..."
                className="flex-grow font-serif leading-relaxed text-ink-muted text-[15px] italic bg-transparent w-full resize-none focus:outline-none"
              />
            </section>
          </div>

        </main>
        
        {/* Floating Save Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-40">
            <button 
              onClick={saveData}
              className="bg-ink text-warm-bg w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
            >
              <Save size={24} />
            </button>
        </div>

        <footer className="mt-12 mb-8 text-center border-t border-ink/5 pt-6">
          <p className="text-[10px] text-ink-muted uppercase tracking-widest font-medium italic">Handcrafted with care</p>
        </footer>
      </div>
    </div>
  );
}






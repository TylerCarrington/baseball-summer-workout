import React, { useState, useEffect } from 'react';
import { EXERCISE_LIBRARY, DAILY_PLANS, PROGRAM_PHASES } from '../constants/programData';
import { Exercise, DayPlan, ProgramPhase, DailyWorkoutProgress } from '../types';
import { 
  Trophy, Calendar, CheckSquare, Target, Flame, Heart, AlertCircle, ChevronLeft, 
  ChevronRight, Play, Square, RotateCcw, Info, Star, Save, Sparkles, Check, Dumbbell, ShieldCheck, Timer
} from 'lucide-react';

interface WorkoutPlannerProps {
  currentDate: string;
}

export default function WorkoutPlanner({ currentDate }: WorkoutPlannerProps) {
  // 1. Selector states
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDayId, setSelectedDayId] = useState<number>(DAILY_PLANS[0].dayId); // default first day

  // 2. Active timer states
  const [timerDuration, setTimerDuration] = useState<number>(20); // default 20s
  const [timerRemaining, setTimerRemaining] = useState<number>(20);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerActiveLabel, setTimerActiveLabel] = useState<string>('Plank Hold');

  // 3. User Progress / Checkoffs state (loaded from localstorage)
  const [sessionProgress, setSessionProgress] = useState<DailyWorkoutProgress | null>(null);
  const [allHistory, setAllHistory] = useState<DailyWorkoutProgress[]>([]);
  
  // Expanded exercise info toggle
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Wellness logger state
  const [wellBeingRating, setWellBeingRating] = useState<number>(5);
  const [sessionNote, setSessionNote] = useState<string>('');

  // Throwing specific states
  const [strikes, setStrikes] = useState<number>(0);
  const [balls, setBalls] = useState<number>(0);
  const [sessionMaxSpeed, setSessionMaxSpeed] = useState<number | ''>('');

  const userTargetSpeed = (() => {
    const saved = localStorage.getItem('pitcher_app_target_speed');
    return saved ? parseInt(saved, 10) : 50;
  })();
  
  const topSpeedMph = (() => {
    try {
      const logs = JSON.parse(localStorage.getItem('pitcher_app_logs') || '[]');
      return logs.reduce((max: number, log: any) => Math.max(max, log.topSpeedMph || 0), 0);
    } catch {
      return 0;
    }
  })();

  // Find active data sets
  // Phase 1 (Weeks 1-2), Phase 2 (Weeks 3-5), Phase 3 (Weeks 6-7), Phase 4 (Week 8)
  const getPhaseForWeek = (wk: number): ProgramPhase => {
    return PROGRAM_PHASES.find(p => p.weeks.includes(wk)) || PROGRAM_PHASES[0];
  };

  const activePhase = getPhaseForWeek(selectedWeek);
  const activeDayPlan = DAILY_PLANS.find(dp => dp.dayId === selectedDayId) || DAILY_PLANS[0];

  // Load progress for selectedWeek and selectedDayId
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('pitcher_app_workout_progress');
      let progressList: DailyWorkoutProgress[] = [];
      if (savedProgress) {
        progressList = JSON.parse(savedProgress);
        setAllHistory(progressList);
      }

      const key = `week-${selectedWeek}-day-${selectedDayId}`;
      const existing = progressList.find(p => p.id === key);

      if (existing) {
        setSessionProgress(existing);
        setWellBeingRating(existing.wellBeing);
        setSessionNote(existing.completedExercises.length > 0 ? '' : ''); // can pre-populate if needed
      } else {
        // init empty progress
        const initProg: DailyWorkoutProgress = {
          id: key,
          date: currentDate,
          week: selectedWeek,
          dayId: selectedDayId,
          completedExercises: [],
          wellBeing: 5,
          completed: false
        };
        setSessionProgress(initProg);
        setWellBeingRating(5);
        setSessionNote('');
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedWeek, selectedDayId, currentDate]);

  // Integrated Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            // play simple beep if browser supports it
            try {
              const context = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = context.createOscillator();
              const gain = context.createGain();
              osc.connect(gain);
              gain.connect(context.destination);
              osc.frequency.value = 587.33; // D5
              osc.type = 'sine';
              gain.gain.setValueAtTime(0.08, context.currentTime);
              osc.start();
              osc.stop(context.currentTime + 0.5);
            } catch (err) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerRemaining]);

  // Handle checking off an exercise
  const handleToggleExercise = (exerciseId: string) => {
    if (!sessionProgress) return;

    let nextExercises = [...sessionProgress.completedExercises];
    if (nextExercises.includes(exerciseId)) {
      nextExercises = nextExercises.filter(id => id !== exerciseId);
    } else {
      nextExercises.push(exerciseId);
    }

    const nextProgress: DailyWorkoutProgress = {
      ...sessionProgress,
      completedExercises: nextExercises,
      completed: detectDayFullyCompleted(nextExercises, activeDayPlan)
    };

    saveWorkoutProgress(nextProgress);
  };

  const detectDayFullyCompleted = (completedEx: string[], plan: DayPlan): boolean => {
    // gather all required exercises for this day
    const requiredList: string[] = [];
    plan.blocks.forEach(b => {
      if (b.exercises && b.exercises.length > 0) {
        requiredList.push(...b.exercises);
      }
    });

    if (requiredList.length === 0) return true; // edge cases (e.g. throwing recovery days handled dynamically)
    return requiredList.every(reqId => completedEx.includes(reqId));
  };

  const saveWorkoutProgress = (updatedProg: DailyWorkoutProgress) => {
    setSessionProgress(updatedProg);
    try {
      const savedProgress = localStorage.getItem('pitcher_app_workout_progress');
      let list: DailyWorkoutProgress[] = savedProgress ? JSON.parse(savedProgress) : [];

      const idx = list.findIndex(p => p.id === updatedProg.id);
      if (idx !== -1) {
        list[idx] = updatedProg;
      } else {
        list.push(updatedProg);
      }

      localStorage.setItem('pitcher_app_workout_progress', JSON.stringify(list));
      setAllHistory(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveWellness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionProgress) return;

    const notesSummary = sessionNote.trim();
    const updatedProg: DailyWorkoutProgress = {
      ...sessionProgress,
      wellBeing: wellBeingRating,
      completed: true // saving log marks workout as consolidated
    };

    saveWorkoutProgress(updatedProg);
    alert("Workout logs and feeling rating saved! High five! ✋");
  };

  // Launch timer widget for a specific drill
  const triggerTimer = (label: string, defaultSec = 20) => {
    setTimerActiveLabel(label);
    setTimerDuration(defaultSec);
    setTimerRemaining(defaultSec);
    setTimerRunning(true);
    // Expand or scroll timer into view smoothly
    const timerElem = document.getElementById('integrated-timer-widget');
    if (timerElem) {
      timerElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Quick stats calculations
  const calculateTotalWorkoutsDone = (): number => {
    return allHistory.filter(h => h.completedExercises.length > 0).length;
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="planner-root-container">
      
      {/* 1. Header Banner & Quick Progress Stats */}
      <div className="vibrant-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5" id="planner-header">
        <div className="flex items-center gap-4">
          <span className="p-3 bg-[#EBF8FF] text-[#004E89] rounded-2xl border-2 border-[#004E89] shadow-sm shrink-0">
            <Calendar size={24} />
          </span>
          <div>
            <h2 className="font-black text-2xl text-[#004E89] uppercase tracking-tight font-display flex items-center gap-2">
              <span>8-Week Athletic Plan</span>
            </h2>
            <p className="text-xs text-[#5a6b82] font-semibold mt-0.5">Toggle week & day tabs to explore age-smart exercise specifications.</p>
          </div>
        </div>

        <div className="flex gap-4 p-3 bg-[#EBF8FF] border-4 border-[#004E89] rounded-2xl min-w-[200px] justify-around shadow-sm shrink-0">
          <div className="text-center">
            <div className="text-2xl font-black text-[#FF6B35] leading-none">{selectedWeek}</div>
            <p className="text-[10px] uppercase font-black text-[#004E89] tracking-wider mt-1">Active Week</p>
          </div>
          <div className="h-10 w-[2px] bg-[#004E89] align-self-center"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#48BB78] leading-none">{calculateTotalWorkoutsDone()}</div>
            <p className="text-[10px] uppercase font-black text-[#004E89] tracking-wider mt-1">Logged</p>
          </div>
        </div>
      </div>

      {/* 2. Weeks Selector Carousel */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" id="week-carousel-row">
        {[1,2,3,4,5,6,7,8].map((wk) => {
          const isSel = wk === selectedWeek;
          const isActivePhase = getPhaseForWeek(wk);
          
          let ringColor = 'border-2 border-[#CBD5E0] hover:border-[#004E89] hover:bg-white bg-white/70 text-[#718096] font-bold';
          if (isSel) {
            ringColor = 'bg-[#FF6B35] border-4 border-[#004E89] text-white shadow-[3px_3px_0px_0px_#004E89] font-black scale-105';
          }

          return (
            <button
              key={wk}
              onClick={() => setSelectedWeek(wk)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${ringColor}`}
            >
              <span className={`text-[10px] uppercase font-black block ${isSel ? 'text-white' : 'text-slate-400'}`}>Wk</span>
              <span className="text-xl font-black leading-none mt-1">{wk}</span>
              <span className={`text-[8px] font-black uppercase tracking-wide mt-1 ${isSel ? 'text-yellow-200' : 'text-slate-500'}`}>
                Ph {isActivePhase.phaseId}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Phase Constraints Display */}
      <div 
        className="vibrant-card-accent-yellow relative overflow-hidden" 
        id="phase-constraints-banner"
      >
        <div className="absolute right-[-20px] bottom-[-20px] opacity-15 pointer-events-none text-[#004E89]">
          <Trophy size={150} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-xs font-black px-3 py-1 rounded-xl uppercase tracking-wider mb-2 border-2 border-[#004E89] shadow-sm">
              <Sparkles size={11} className="stroke-[2.5]" />
              <span>{activePhase.name}</span>
            </div>
            <h3 className="text-xl font-black text-[#004E89] uppercase tracking-tight">{activePhase.description}</h3>
            <p className="text-[#004E89] text-xs font-bold mt-1.5 leading-relaxed max-w-2xl">
              During this phase, strength circuits are programmed for <strong className="text-[#FF6B35] font-black">{activePhase.strengthRounds} rounds</strong>. Monitor his balance posture and landing absorbency before increasing goblet dumbbell loading!
            </p>
          </div>

          <div className="bg-white border-4 border-[#004E89] p-4 rounded-2xl shrink-0 text-center min-w-[140px] shadow-sm">
            <span className="text-[10px] uppercase font-black text-[#718096] tracking-wider">Circuit Target:</span>
            <p className="text-4xl font-black text-[#004E89] mt-1">{activePhase.strengthRounds}x</p>
            <p className="text-[10px] text-[#004E89] font-black uppercase tracking-wide mt-1">rounds</p>
          </div>
        </div>
      </div>

      {/* 4. Days Tabs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="days-tab">
        {DAILY_PLANS.map((dp) => {
          const isSel = dp.dayId === selectedDayId;
          const isCompleted = allHistory.some(h => h.id === `week-${selectedWeek}-day-${dp.dayId}` && h.completedExercises?.length > 0);
          
          let ringColor = 'border-2 border-[#CBD5E0] hover:border-[#004E89] hover:bg-white bg-white/70 text-[#718096] font-bold';
          if (isSel) {
            ringColor = 'bg-[#FFBC42] border-4 border-[#004E89] text-[#004E89] shadow-[3px_3px_0px_0px_#004E89] font-black scale-105 z-10';
          }

          return (
            <button
              key={dp.dayId}
              onClick={() => setSelectedDayId(dp.dayId)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative ${ringColor}`}
            >
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-[#48BB78] text-white rounded-full p-1 border-2 border-[#004E89] shadow-sm z-20">
                  <Check size={14} className="stroke-[4]" />
                </div>
              )}
              <span className={`text-[10px] uppercase font-black block ${isSel ? 'text-[#004E89]' : 'text-slate-400'}`}>
                {dp.name.includes('Throwing') ? 'Throwing' : 'Strength'}
              </span>
              <span className="text-lg font-black leading-none mt-1">
                {dp.name.replace('Strength ', '').replace('Throwing ', '')}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-wide mt-1 text-center leading-tight ${isSel ? 'text-[#004E89]/70' : 'text-slate-500'}`}>
                {dp.subtitle.split(' Focus')[0].substring(0, 25)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dual Column Layout: Content Drills & Float StopWatch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="planner-split-layout">
        
        {/* Left/Middle Column: Drill Blocks */}
        <div className="lg:col-span-2 space-y-6" id="daily-workout-cards-grid">
          
          <div className="bg-[#EBF8FF] rounded-2xl border-4 border-[#004E89] p-5 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="font-black text-[#004E89] uppercase text-base">{activeDayPlan.name}: {activeDayPlan.subtitle}</h3>
              <p className="text-xs text-slate-700 font-bold mt-1 leading-relaxed">{activeDayPlan.description}</p>
            </div>
            
            {sessionProgress && sessionProgress.completedExercises.length > 0 && (
              <div className="shrink-0 flex items-center gap-1.5 bg-[#48BB78] text-white text-xs font-black px-3 py-1.5 rounded-full border-2 border-[#004E89] shadow-sm">
                <Check size={14} className="stroke-[3]" />
                <span>ACTIVE LOG</span>
              </div>
            )}
          </div>

          {/* STANDARD BLOCKS LIST */}
          <div className="space-y-6 animate-fadeIn" id="strength-blocks-list">
              {activeDayPlan.blocks.map((block) => (
                <div 
                  key={block.name} 
                  className="vibrant-card !p-0 overflow-hidden"
                >
                  {/* Block Header */}
                  <div className="bg-[#EBF8FF] border-b-4 border-[#004E89] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white bg-[#004E89] border border-[#004E89] px-3 py-1 rounded-full uppercase tracking-wider">
                        {block.time}
                      </span>
                      <h4 className="font-black text-[#004E89] text-sm uppercase">{block.name}</h4>
                    </div>
                    <span className="text-xs font-extrabold text-[#718096] uppercase tracking-wide shrink-0 font-sans">
                      {block.focus}
                    </span>
                  </div>

                  {/* Block Drill items */}
                  <div className="divide-y-2 divide-[#004E89]">
                    {block.exercises.map((exId) => {
                      const exercise = EXERCISE_LIBRARY.find(e => e.id === exId);
                      if (!exercise) return null;

                      const isCompleted = sessionProgress?.completedExercises.includes(exId) || false;
                      const isExpanded = expandedExerciseId === exId;

                      // Extract reps for that phase
                      const phaseRepInstructions = exercise.phaseSpecs[activePhase.phaseId] || exercise.baseReps;

                      return (
                        <div 
                          key={exId} 
                          id={`exercise-item-row-${exId}`}
                          className={`p-4 transition-all ${isCompleted ? 'bg-[#48BB78]/10' : 'bg-white'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              {/* Custom Checkbox */}
                              <button 
                                onClick={() => handleToggleExercise(exId)}
                                className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border-2 transition-all cursor-pointer ${
                                  isCompleted 
                                    ? 'bg-[#48BB78] border-[#004E89] text-white shadow-sm' 
                                    : 'border-[#004E89] bg-white text-transparent hover:bg-[#EBF8FF]'
                                }`}
                              >
                                <Check size={14} className="stroke-[3]" />
                              </button>

                              <div className="min-w-0">
                                <h5 
                                  onClick={() => setExpandedExerciseId(isExpanded ? null : exId)}
                                  className={`font-black cursor-pointer text-sm uppercase tracking-tight transition-all hover:text-[#004E89] ${
                                    isCompleted ? 'text-gray-400 line-through' : 'text-slate-900'
                                  }`}
                                >
                                  {exercise.name}
                                </h5>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-xs font-black text-[#FF6B35]">
                                    {phaseRepInstructions}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    {exercise.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Expand toggle */}
                            <button 
                              onClick={() => setExpandedExerciseId(isExpanded ? null : exId)}
                              className="text-xs font-black text-[#004E89] hover:bg-[#FFBC42] bg-[#EBF8FF] border-2 border-[#004E89] px-3 py-1 rounded-xl transition-all shadow-[2px_2px_0px_0px_#004E89]"
                            >
                              {isExpanded ? 'Hide' : 'Coach Guide'}
                            </button>
                          </div>

                          {/* Expanded view */}
                          {isExpanded && (
                            <div className="mt-4 bg-[#EBF8FF] rounded-2xl p-4 border-2 border-[#004E89] text-xs font-bold text-slate-800 space-y-3.5 animate-fadeIn">
                              <div>
                                <strong className="font-black text-[#004E89] text-[11px] block uppercase tracking-wider mb-0.5">Execution Details</strong>
                                <p className="leading-relaxed font-semibold text-[#1A202C]">{exercise.description}</p>
                              </div>

                              {/* Simple SVG Motion Guide */}
                              <div className="relative h-18 bg-white rounded-xl flex items-center justify-center gap-4 text-[10px] text-gray-500 overflow-hidden px-4 border-2 border-[#004E89] shadow-inner">
                                <span className="absolute left-1.5 top-1.5 text-[8px] font-black text-[#718096] uppercase tracking-widest leading-none">Active Model Guide</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Dumbbell size={14} className="text-[#FF6B35] stroke-[2.5] animate-bounce" />
                                  <span className="font-black text-[#004E89] uppercase tracking-wider">{exercise.visualType || 'warmup'} Mode</span>
                                </div>
                                <div className="h-6 w-[2px] bg-[#004E89]"></div>
                                <div className="flex-1 italic font-semibold text-[#004E89] leading-tight">
                                  Loads the posterior shoulder capsule while keeping lumbar spine locked neutral. Landing soft!
                                </div>
                              </div>

                              <div>
                                <strong className="font-black text-[#004E89] text-[11px] block uppercase tracking-wider mb-1">Coaching Cues</strong>
                                <ul className="space-y-1">
                                  {exercise.cues.map((cue, cIdx) => (
                                    <li key={cIdx} className="flex items-start gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full mt-1.5 shrink-0 border border-[#004E89]" />
                                      <span className="leading-tight text-slate-800">{cue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Embedded timer launcher */}
                              {(exercise.id.includes('hold') || exercise.id.includes('plank') || exercise.id.includes('stretches') || exercise.id.includes('reach')) && (
                                <button
                                  type="button"
                                  onClick={() => triggerTimer(exercise.name, exercise.id.includes('stretches') ? 30 : 20)}
                                  className="flex items-center justify-center gap-2 w-full bg-[#003B69] hover:bg-[#004E89] text-white border-2 border-[#004E89] font-black uppercase tracking-wider py-2 px-3 rounded-xl transition-all cursor-pointer shadow-[3px_3px_0px_0px_#004E89]"
                                >
                                  <Timer size={14} />
                                  <span>Launch Countdown Hold ({exercise.id.includes('stretches') ? '30s' : '20s'})</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          {/* 5. End of session feeling Rating (Wellness Logger) */}
          {sessionProgress && (
            <form onSubmit={handleSaveWellness} className="vibrant-card space-y-4" id="wellness-form">
              <h3 className="font-black text-[#004E89] text-lg uppercase mb-1 flex items-center gap-2">
                <Heart size={18} className="text-[#FF6B35] fill-[#FF6B35]" />
                <span>Session Workout Recovery Log</span>
              </h3>
              <p className="text-xs text-[#5a6b82] font-semibold">Rate how their body and arm feel at the tail end of general movement.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <div>
                  <label className="block text-[11px] font-black text-[#004E89] uppercase tracking-wider mb-2">Soreness / Feeling Score</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <button
                        key={starIdx}
                        type="button"
                        onClick={() => setWellBeingRating(starIdx)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110 bg-[#EBF8FF] rounded-lg border-2 border-[#004E89]"
                      >
                        <Star 
                          size={24} 
                          className={starIdx <= wellBeingRating ? "fill-[#FFBC42] stroke-[#004E89]" : "text-gray-300 stroke-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block mt-3 uppercase tracking-wide">
                    {wellBeingRating === 5 && '🌟 Excellent: zero pain, feeling charged and light!'}
                    {wellBeingRating === 4 && '👍 Good: comfortable tiredness, completely normal.'}
                    {wellBeingRating === 3 && '😐 Average: slightly sore thighs or joints, nothing major.'}
                    {wellBeingRating === 2 && '⚠️ Bad: tired posture, a bit heavy or achy.'}
                    {wellBeingRating === 1 && '🚨 CRITICAL: actual shoulder/elbow pain, must halt and rest immediately!'}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[#004E89] uppercase tracking-wider mb-2">Coach/Parent Session Comments</label>
                  <textarea
                    rows={2}
                    value={sessionNote}
                    onChange={(e) => setSessionNote(e.target.value)}
                    placeholder="e.g. Completed with great energy. Squats were deep and stable today."
                    className="w-full bg-[#F0F4F8] text-xs font-semibold text-slate-800 p-2.5 border-2 border-[#CBD5E0] focus:border-[#004E89] focus:bg-white rounded-xl focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#48BB78] text-white border-2 border-[#004E89] font-black uppercase text-xs py-3 rounded-xl transition-colors cursor-pointer shadow-[3px_3px_0px_0px_#004E89]"
              >
                Log Session Completion & Reclaim Recovery
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Floating Stopwatch widget */}
        <div className="space-y-6 animate-fadeIn" id="integrated-timer-widget">
          
          {activeDayPlan.dayId === 101 ? (
            /* Target Throwing Widget */
            <div className="bg-[#003B69] text-white rounded-3xl p-5 border-4 border-[#004E89] shadow-[6px_6px_0px_0px_#004E89] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-[#FF6B35] block border border-[#003B69]"></span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FFBC42]">Live Practice Tracker</span>
                </div>
                <h3 className="font-black text-base text-white uppercase tracking-tight">Pitch Accuracy</h3>
                <p className="text-xs text-[#A3BFFA] font-bold mt-0.5">Track your target accuracy for the 25-30 throws block.</p>
              </div>

              <div className="my-6 grid grid-cols-2 gap-4">
                <div 
                  className="bg-[#004E89] p-4 rounded-2xl flex flex-col items-center justify-center border-4 border-transparent hover:border-[#48BB78] cursor-pointer transition-all active:scale-95"
                  onClick={() => setStrikes(s => s + 1)}
                >
                  <span className="text-4xl font-black text-[#48BB78]">{strikes}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-white mt-1">Strikes</span>
                </div>
                <div 
                  className="bg-[#004E89] p-4 rounded-2xl flex flex-col items-center justify-center border-4 border-transparent hover:border-[#FF6B35] cursor-pointer transition-all active:scale-95"
                  onClick={() => setBalls(b => b + 1)}
                >
                  <span className="text-4xl font-black text-[#FF6B35]">{balls}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-white mt-1">Balls</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-[#00284A] px-4 py-2 rounded-xl text-xs font-bold uppercase mb-4">
                <span className="text-[#A3BFFA]">Total Throws</span>
                <span className="text-white text-lg font-black">{strikes + balls}</span>
              </div>
              
              <div className="h-4 bg-[#004E89] w-full rounded-full overflow-hidden flex shadow-inner">
                {strikes + balls > 0 && (
                  <>
                    <div style={{ width: `${(strikes / (strikes + balls)) * 100}%` }} className="h-full bg-[#48BB78] transition-all"></div>
                    <div style={{ width: `${(balls / (strikes + balls)) * 100}%` }} className="h-full bg-[#FF6B35] transition-all"></div>
                  </>
                )}
              </div>

              <button
                onClick={() => { setStrikes(0); setBalls(0); }}
                className="mt-6 py-2 px-3 w-full rounded-xl bg-[#004E89] hover:bg-[#00284A] text-[#A3BFFA] hover:text-white border-2 border-[#004E89] font-black flex items-center justify-center gap-1 cursor-pointer text-center"
              >
                <RotateCcw size={12} />
                <span>Reset Count</span>
              </button>
            </div>
          ) : activeDayPlan.dayId === 102 ? (
            /* Long Toss Widget */
            <div className="bg-[#003B69] text-white rounded-3xl p-5 border-4 border-[#004E89] shadow-[6px_6px_0px_0px_#004E89] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-[#FF6B35] block border border-[#003B69]"></span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FFBC42]">Live Practice Tracker</span>
                </div>
                <h3 className="font-black text-base text-white uppercase tracking-tight">Velocity Targeting</h3>
                <p className="text-xs text-[#A3BFFA] font-bold mt-0.5">Use your current outing top speed to measure baseline strength.</p>
              </div>

              <div className="my-6 flex flex-col gap-4">
                <div className="bg-[#004E89] p-4 rounded-2xl flex items-center justify-between shadow-inner border border-[#003B69]">
                   <div className="flex flex-col">
                     <span className="text-[10px] uppercase font-black tracking-widest text-[#A3BFFA]">Goal Velocity</span>
                     <span className="text-3xl font-black text-[#FFBC42]">{userTargetSpeed} <span className="text-lg">MPH</span></span>
                   </div>
                   <Target size={32} className="text-[#FFBC42] opacity-50" />
                </div>
                
                <div className="bg-[#004E89] p-4 rounded-2xl flex items-center justify-between shadow-inner border border-[#003B69]">
                   <div className="flex flex-col">
                     <span className="text-[10px] uppercase font-black tracking-widest text-[#A3BFFA]">Session Max Speed</span>
                     <div className="flex items-end gap-1 mt-1">
                       <input 
                         type="number" 
                         value={sessionMaxSpeed} 
                         onChange={(e) => setSessionMaxSpeed(e.target.value ? parseInt(e.target.value) : '')} 
                         placeholder={topSpeedMph > 0 ? topSpeedMph.toString() : '--'}
                         className="w-16 bg-[#003B69] border-b-2 border-[#A3BFFA] text-white text-3xl font-black focus:outline-none focus:border-[#FFBC42] rounded-t text-center placeholder-[#A3BFFA]/30 py-0.5"
                       />
                       <span className="text-lg font-black text-white mb-1">MPH</span>
                     </div>
                   </div>
                   <Flame size={32} className="text-[#FF6B35] opacity-50" />
                </div>
              </div>

              <div className="mt-2 text-center text-[10px] font-black text-[#A3BFFA] uppercase bg-[#00284A] p-3 rounded-xl border border-[#004E89]">
                Reminder: Do not max effort long toss. Maintain 70-80% output while targeting a smooth, high arc.
              </div>
            </div>
          ) : (
            /* Stopwatch widget body */
            <div className="bg-[#003B69] text-white rounded-3xl p-5 border-4 border-[#004E89] shadow-[6px_6px_0px_0px_#004E89] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-[#FF6B35] block border border-[#003B69]"></span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FFBC42]">Live Practice Timer</span>
                </div>
                <h3 className="font-black text-base text-white uppercase tracking-tight">{timerActiveLabel}</h3>
                <p className="text-xs text-[#A3BFFA] font-bold mt-0.5">Hold standard static postures for best core recruitment results.</p>
              </div>

              {/* Circular Timer Graphics */}
              <div className="my-6 flex items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* SVG Dial sweep */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#004E89" strokeWidth="8" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="64" 
                      fill="transparent" 
                      stroke="#FFBC42" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 64}
                      strokeDashoffset={2 * Math.PI * 64 * (1 - timerRemaining / timerDuration)}
                      className="transition-all duration-300"
                    />
                  </svg>
                  {/* Center text duration */}
                  <div className="absolute text-center">
                    <span className="text-4xl font-black text-white">{timerRemaining}</span>
                    <p className="text-[9px] uppercase font-black text-[#A3BFFA] tracking-wider leading-none mt-1">sec left</p>
                  </div>
                </div>
              </div>

              {/* Hold duration shortcuts */}
              <div className="flex px-1 gap-1.5 justify-around mb-4">
                {[15, 20, 30, 40].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimerDuration(t);
                      setTimerRemaining(t);
                      setTimerRunning(false);
                    }}
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                      timerDuration === t ? 'bg-[#FF6B35] text-white border-white' : 'bg-[#004E89] border-transparent text-[#A3BFFA] hover:text-white'
                    }`}
                  >
                    {t}s Hold
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold uppercase">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`py-2 px-3 rounded-xl text-white font-black border-2 border-[#004E89] cursor-pointer text-center select-none flex items-center justify-center gap-1 shadow-sm transition-all ${
                    timerRunning ? 'bg-[#FF6B35] hover:bg-orange-600' : 'bg-[#48BB78] hover:bg-green-600'
                  }`}
                >
                  {timerRunning ? <Square size={12} /> : <Play size={12} />}
                  <span>{timerRunning ? 'Pause' : 'Start'}</span>
                </button>

                <button
                  onClick={() => {
                    setTimerRemaining(timerDuration);
                    setTimerRunning(false);
                  }}
                  className="py-2 px-3 rounded-xl bg-[#004E89] hover:bg-[#003B69] text-white border-2 border-[#004E89] font-black flex items-center justify-center gap-1 cursor-pointer text-center shadow-sm"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => {
                    setTimerActiveLabel('Free Hold Countdown');
                    setTimerDuration(60);
                    setTimerRemaining(60);
                    setTimerRunning(false);
                  }}
                  className="py-2 px-3 rounded-xl bg-[#004E89] hover:bg-[#003B69] text-[#A3BFFA] hover:text-white border-2 border-[#004E89] font-black flex items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span>+60s</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick coaching callout in column */}
          {activeDayPlan.tipTitle && activeDayPlan.tipDescription && (
            <div className="bg-[#EBF8FF] rounded-2xl border-4 border-[#004E89] p-5 shadow-[4px_4px_0px_0px_#004E89] flex gap-3 text-xs font-semibold text-[#004E89]">
              <Info className="text-[#FF6B35] shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="font-extrabold uppercase tracking-wide text-sm block mb-1">{activeDayPlan.tipTitle}</strong>
                <p className="text-slate-700 leading-relaxed font-semibold">
                  {activeDayPlan.tipDescription}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

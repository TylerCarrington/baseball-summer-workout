import React, { useState, useEffect } from 'react';
import { Check, Flame, Trophy, Info, Sparkles, Activity, ShieldAlert, Volume2 } from 'lucide-react';
import { ARM_CARE_STEPS } from '../constants/programData';
import { ArmCareProgress } from '../types';

interface ArmCareRoutineProps {
  currentDate: string;
  onLoggedToday: (stats: { completedCount: number }) => void;
}

export default function ArmCareRoutine({ currentDate, onLoggedToday }: ArmCareRoutineProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [completeHistory, setCompleteHistory] = useState<ArmCareProgress[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Load state on mount / date change
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pitcher_app_arm_care');
      let history: ArmCareProgress[] = [];
      if (savedHistory) {
        history = JSON.parse(savedHistory);
        setCompleteHistory(history);
      }

      // Find current day's progress
      const todayProgress = history.find(p => p.date === currentDate);
      if (todayProgress) {
        setCompletedSteps(todayProgress.completedSteps);
      } else {
        setCompletedSteps([]);
      }

      // Calculate simple daily streak from history
      calculateStreak(history);
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }, [currentDate]);

  const calculateStreak = (history: ArmCareProgress[]) => {
    if (!history || history.length === 0) {
      setStreakCount(0);
      return;
    }

    // Sort descending by date
    const sortedDates = [...history]
      .filter(h => h.completedSteps.length === ARM_CARE_STEPS.length)
      .map(h => h.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedDates.length === 0) {
      setStreakCount(0);
      return;
    }

    // Calculate sequential days from today or yesterday
    let tempStreak = 0;
    const today = new Date(currentDate);
    today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const latestDateStr = sortedDates[0];
    const latestDate = new Date(latestDateStr);
    latestDate.setHours(0,0,0,0);

    // If latest perfect log wasn't today or yesterday, streak is broken
    if (latestDate.getTime() !== today.getTime() && latestDate.getTime() !== yesterday.getTime()) {
      setStreakCount(0);
      return;
    }

    let checkDate = latestDate;
    let index = 0;

    while (index < sortedDates.length) {
      const currentCheckStr = sortedDates[index];
      const currentCheckDate = new Date(currentCheckStr);
      currentCheckDate.setHours(0,0,0,0);

      if (index === 0) {
        tempStreak = 1;
        checkDate = currentCheckDate;
      } else {
        const diffTime = checkDate.getTime() - currentCheckDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak += 1;
          checkDate = currentCheckDate;
        } else if (diffDays === 0) {
          // duplicate date skip
        } else {
          break; // break in chain
        }
      }
      index++;
    }

    setStreakCount(tempStreak);
  };

  const handleToggleStep = (index: number) => {
    let nextCompleted = [...completedSteps];
    if (nextCompleted.includes(index)) {
      nextCompleted = nextCompleted.filter(i => i !== index);
    } else {
      nextCompleted.push(index);
    }

    setCompletedSteps(nextCompleted);

    // Save back to local storage
    try {
      const savedHistory = localStorage.getItem('pitcher_app_arm_care');
      let history: ArmCareProgress[] = savedHistory ? JSON.parse(savedHistory) : [];

      const existingIndex = history.findIndex(p => p.date === currentDate);
      if (existingIndex !== -1) {
        history[existingIndex] = { date: currentDate, completedSteps: nextCompleted };
      } else {
        history.push({ date: currentDate, completedSteps: nextCompleted });
      }

      localStorage.setItem('pitcher_app_arm_care', JSON.stringify(history));
      setCompleteHistory(history);
      calculateStreak(history);

      onLoggedToday({ completedCount: nextCompleted.length });
    } catch (e) {
      console.error("Error saving localStorage", e);
    }
  };

  const handleMarkAllComplete = () => {
    const allIndexes = ARM_CARE_STEPS.map((_, i) => i);
    setCompletedSteps(allIndexes);

    try {
      const savedHistory = localStorage.getItem('pitcher_app_arm_care');
      let history: ArmCareProgress[] = savedHistory ? JSON.parse(savedHistory) : [];

      const existingIndex = history.findIndex(p => p.date === currentDate);
      if (existingIndex !== -1) {
        history[existingIndex] = { date: currentDate, completedSteps: allIndexes };
      } else {
        history.push({ date: currentDate, completedSteps: allIndexes });
      }

      localStorage.setItem('pitcher_app_arm_care', JSON.stringify(history));
      setCompleteHistory(history);
      calculateStreak(history);
      onLoggedToday({ completedCount: allIndexes.length });
    } catch (e) {
      console.error(e);
    }
  };

  const percentComplete = Math.round((completedSteps.length / ARM_CARE_STEPS.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn" id="arm-care-root-container">
      {/* Banner/Header with Vibrant Palette */}
      <div className="bg-[#004E89] text-white rounded-3xl p-6 shadow-[5px_5px_0px_0px_#004E89] border-4 border-[#004E89] relative overflow-hidden" id="arm-care-banner">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Activity size={180} />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FF6B35] text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg border-2 border-white">
                Daily Non-Negotiable
              </span>
              {completedSteps.length === ARM_CARE_STEPS.length && (
                <span className="bg-[#FFBC42] text-[#004E89] text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 border-2 border-[#004E89]">
                  <Trophy size={12} className="stroke-[3]" /> Complete
                </span>
              )}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Active Daily Arm-Care Routine</h2>
            <p className="text-[#A3BFFA] text-xs font-semibold mt-1.5 max-w-xl leading-relaxed">
              Focuses on shoulder rotation range-of-motion, hip freedom, and T-spine mobility—three scientifically-proven pillars of safety for young arm health. Do this before throwing!
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white border-4 border-[#004E89] rounded-2xl p-3.5 text-[#004E89] shadow-md">
            <div className="text-center">
              <div className="flex items-center justify-center text-[#FF6B35] font-black text-2xl gap-0.5">
                <Flame className="fill-[#FF6B35] stroke-[#004E89] stroke-[2.5]" size={24} />
                <span>{streakCount}</span>
              </div>
              <p className="text-[9px] uppercase font-black text-[#004E89] tracking-wider">Perfect Days</p>
            </div>
            <div className="h-10 w-[2.5px] bg-[#004E89]/20"></div>
            <div className="text-center min-w-[70px]">
              <div className="text-2xl font-black text-[#004E89]">{percentComplete}%</div>
              <p className="text-[9px] uppercase font-black text-[#004E89] tracking-wider">Done Today</p>
            </div>
          </div>
        </div>

        {/* Progress Bar with vibrant styling */}
        <div className="mt-6 bg-[#003B69] rounded-full h-3.5 overflow-hidden border-2 border-white/90">
          <div 
            className="bg-gradient-to-r from-[#FFBC42] to-[#48BB78] h-full rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-4" id="arm-care-steps-list">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight flex items-center gap-2">
              <span>Exercises Checklist</span>
              <span className="bg-[#EBF8FF] text-[#004E89] text-[10px] font-black px-2 py-0.5 rounded-lg border border-[#004E89]">
                {completedSteps.length} of {ARM_CARE_STEPS.length} Completed
              </span>
            </h3>
            {completedSteps.length < ARM_CARE_STEPS.length && (
              <button 
                onClick={handleMarkAllComplete}
                className="text-[10px] font-black uppercase text-white bg-[#FF6B35] px-3.5 py-2 rounded-xl border-2 border-[#004E89] transition-all shadow-[2px_2px_0px_0px_#004E89] hover:bg-orange-600 cursor-pointer"
              >
                Mark All Complete
              </button>
            )}
          </div>

          {ARM_CARE_STEPS.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const isExpanded = expandedStep === idx;
            return (
              <div 
                key={idx}
                id={`armcare-step-card-${idx}`}
                className={`group p-4 rounded-2xl border-4 transition-all flex items-start gap-4 shadow-[4px_4px_0px_0px_#004E89] ${
                  isDone 
                    ? 'border-[#48BB78] bg-[#EBF8FF]/20' 
                    : 'border-[#004E89] bg-white hover:bg-[#EBF8FF]/10'
                }`}
              >
                <div 
                  onClick={() => handleToggleStep(idx)}
                  className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border-2 transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-[#48BB78] border-[#004E89] text-white shadow-sm' 
                    : 'border-[#004E89] bg-[#F0F4F8] text-transparent hover:bg-white'
                }`}>
                  <Check size={14} className="stroke-[3]" />
                </div>

                <div className="flex-1 min-w-0 font-semibold">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <h4 
                        onClick={() => setExpandedStep(isExpanded ? null : idx)}
                        className={`font-black text-sm uppercase tracking-tight cursor-pointer transition-colors hover:text-[#004E89] ${isDone ? 'text-slate-400 line-through' : 'text-[#004E89]'}`}
                      >
                        {step.name}
                      </h4>
                      <span className="text-[10px] font-black uppercase text-[#004E89] bg-[#FFBC42] px-2.5 py-0.5 rounded-lg border-2 border-[#004E89]">
                        {step.reps}
                      </span>
                    </div>
                    <button 
                      onClick={() => setExpandedStep(isExpanded ? null : idx)}
                      className="text-xs font-black text-[#004E89] hover:bg-[#FFBC42] bg-[#EBF8FF] border-2 border-[#004E89] px-3 py-1 rounded-xl transition-all shadow-[2px_2px_0px_0px_#004E89] cursor-pointer"
                    >
                      {isExpanded ? 'Hide' : 'Coach Guide'}
                    </button>
                  </div>
                  
                  <p className={`text-xs mt-2 transition-colors leading-relaxed ${isDone ? 'text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {step.description}
                  </p>

                  {isExpanded && (
                    <div className="mt-3 animate-fadeIn">
                      {step.videoLink && (
                        <div className="mb-3 aspect-video rounded-xl overflow-hidden border-2 border-[#004E89] bg-black shadow-inner">
                          <iframe
                            width="100%"
                            height="100%"
                            src={step.videoLink}
                            title={`${step.name} video guide`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      <div className="bg-[#EBF8FF] text-[#004E89] rounded-xl p-3 border-2 border-[#004E89]/80 shadow-inner">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="bg-[#FF6B35] rounded-full p-1 text-white">
                            <Volume2 size={12} className="stroke-[3]" />
                          </div>
                          <strong className="font-black text-[#004E89] uppercase tracking-wide text-[10px]">Coach's Voice</strong>
                        </div>
                        <ul className="space-y-1.5 text-xs">
                          <li className="flex items-start gap-1.5 font-semibold text-slate-800">
                            <span className="text-[#FF6B35] text-xs font-black mt-0.5">•</span> {step.coachingCue}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Side Card */}
        <div className="space-y-6" id="arm-care-tips-panel">
          <div className="vibrant-card shadow-[4px_4px_0px_0px_#004E89]" id="armcare-rules-box">
            <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight flex items-center gap-1.5 mb-4 border-b-4 border-[#004E89] pb-3">
              <ShieldAlert size={20} className="text-[#FF6B35] stroke-[2.5]" />
              <span>Safety & Arm Guidelines</span>
            </h3>
            <ul className="space-y-4 text-xs font-bold text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBC42] border-2 border-[#004E89] mt-1 shrink-0"></span>
                <span>Perform this routine <strong className="font-black text-[#004E89]">before throwing matches</strong> and daily to secure quick metabolic recovery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] border-2 border-[#004E89] mt-1 shrink-0"></span>
                <span>The bands must be <strong className="font-black text-[#004E89]">very light</strong>. Youth players must never struggle or strain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#48BB78] border-2 border-[#004E89] mt-1 shrink-0"></span>
                <span><strong className="font-black text-[#FF6B35]">Zero pain limit:</strong> if his shoulder pinches, halt throwing instructions immediately!</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004E89] border-2 border-[#004E89] mt-1 shrink-0"></span>
                <span>Proper sleep (8-10 hours) secures cartilage regrowth in joint heads against fatigue friction.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFBC42] border-4 border-[#004E89] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#004E89] relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-10">
              <Sparkles size={100} className="text-[#004E89]" />
            </div>
            <h3 className="font-black text-[#004E89] text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles size={18} className="text-[#004E89]" />
              <span>Scientific Why?</span>
            </h3>
            <p className="text-slate-800 text-[11px] leading-relaxed font-semibold">
              Research from the <strong className="text-[#004E89] font-black">American Sports Medicine Institute (ASMI)</strong> shows that youth players who preserve rotator range, maintain scapular glide, and use proper lower-body rotation drop elbow loads by up to <strong className="text-[#004E89] font-black">34%</strong>. Consistently checking these boxes prevents repetitive UCL ligaments wear!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

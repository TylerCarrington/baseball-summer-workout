import React, { useState, useEffect } from 'react';
import { PitchLog } from '../types';
import { PITCH_SMART_LIMITS_9_10 } from '../constants/programData';
import { ShieldAlert, Calendar, CheckCircle2, History, Trash2, Plus, Info, ChevronRight, AlertTriangle, Play, Sparkles, X, Check } from 'lucide-react';

interface DashboardProps {
  currentDate: string;
  logs: PitchLog[];
  onLogsChanged: (newLogs: PitchLog[]) => void;
}

export default function Dashboard({ currentDate, logs, onLogsChanged }: DashboardProps) {
  // Add Pitch Log form state
  const [pitchCount, setPitchCount] = useState<number>(25);
  const [logDate, setLogDate] = useState<string>(currentDate);
  const [topSpeedMph, setTopSpeedMph] = useState<number | ''>('');
  const [caughtSameDay, setCaughtSameDay] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [userTargetSpeed, setUserTargetSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('pitcher_app_target_speed');
    return saved ? parseInt(saved, 10) : 50;
  });

  useEffect(() => {
    localStorage.setItem('pitcher_app_target_speed', userTargetSpeed.toString());
  }, [userTargetSpeed]);

  const calculateRestDays = (pitches: number): number => {
    const rules = PITCH_SMART_LIMITS_9_10.restGuidelines;
    for (const rule of rules) {
      if (pitches <= rule.maxPitches) {
        return rule.restNeededDays;
      }
    }
    return 4; // fallback for large counts
  };

  const getAddDate = (dateStr: string, days: number): string => {
    const d = new Date(dateStr + 'T12:00:00'); // mid-day to avoid offset errors
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (pitchCount <= 0) return;

    const restDays = calculateRestDays(pitchCount);
    // Clearance date is the day AFTER they complete rest
    // e.g. pitch on Monday (day 0). Rest 1 day (Tuesday). Cleared Wednesday. (Monday + 1 rest + 1)
    // Actually, Pitch Smart: "1 Day rest" means they resting for 1 full calendar day.
    // So if pitch count requires 1 day of rest on Monday, they cannot pitch Tuesday, but can pitch Wednesday.
    // Math: pitch date + restDays + 1 day
    const cleared = getAddDate(logDate, restDays + 1);

    const newLog: PitchLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: logDate,
      pitchesCount: pitchCount,
      topSpeedMph: typeof topSpeedMph === 'number' ? topSpeedMph : undefined,
      caughtSameDay,
      notes: notes.trim(),
      clearedDate: cleared,
      requiredRestDays: restDays
    };

    const updated = [newLog, ...logs].sort((a,b) => b.date.localeCompare(a.date));
    onLogsChanged(updated);

    // reset forms
    setPitchCount(25);
    setTopSpeedMph('');
    setNotes('');
    setCaughtSameDay(false);
  };

  const handleDeleteLog = (id: string, force?: boolean) => {
    if (force) {
      const updated = logs.filter(l => l.id !== id);
      onLogsChanged(updated);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  };

  // Calculate current arm clearance details
  const getArmStatus = () => {
    if (logs.length === 0) {
      return { status: 'CLEARED', message: 'Ready to pitch. No recent pitching log.', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', restRemaining: 0, nextDate: '' };
    }

    // Sort by actual pitching date
    const sorted = [...logs].sort((a,b) => b.date.localeCompare(a.date));
    const lastLog = sorted[0];

    const todayDate = new Date(currentDate + 'T12:00:00');
    const clearedDate = new Date(lastLog.clearedDate + 'T12:00:00');

    if (todayDate >= clearedDate) {
      return { 
        status: 'CLEARED', 
        message: `Arms ready! Fully rested since last outing (${lastLog.pitchesCount} pitches on ${lastLog.date}).`,
        color: 'text-emerald-700 bg-emerald-50/50 border-emerald-200',
        restRemaining: 0,
        nextDate: ''
      };
    } else {
      // Calculate remaining days
      const diffTime = clearedDate.getTime() - todayDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; // days left of resting
      
      const restTotal = lastLog.requiredRestDays;
      const restCompleted = Math.max(0, restTotal - diffDays);

      return {
        status: 'RESTING',
        message: `Resting arm. Outing on ${lastLog.date} (${lastLog.pitchesCount} pitches) requires ${restTotal} full day${restTotal > 1 ? 's' : ''} of rest.`,
        color: 'text-rose-700 bg-rose-50/50 border-rose-200',
        restRemaining: diffDays + 1, // days remaining to resume
        restTotal: restTotal,
        restCompleted: restCompleted,
        nextDate: lastLog.clearedDate
      };
    }
  };

  const armStatus = getArmStatus();

  const renderPitchSVGChart = () => {
    if (logs.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-[#CBD5E0] bg-white rounded-2xl">
          <History className="text-[#004E89] mb-2 animate-bounce" size={32} />
          <p className="text-sm font-black text-[#004E89] uppercase tracking-wide">No Pitch Logs recorded yet</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Please add a game/session to view trends</p>
        </div>
      );
    }

    const chronoLogs = [...logs].sort((a,b) => a.date.localeCompare(b.date)).slice(-7);
    const width = 600;
    const height = 240;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const maxVal = 75; // standard cap
    const stepY = (height - paddingTop - paddingBottom) / maxVal;
    const stepX = (width - paddingLeft - paddingRight) / (chronoLogs.length > 1 ? chronoLogs.length - 1 : 1);

    const getX = (idx: number) => paddingLeft + idx * stepX;
    const getY = (val: number) => height - paddingBottom - (val * stepY);

    let dLine = '';
    const dots: React.ReactNode[] = [];

    chronoLogs.forEach((log, idx) => {
      const x = chronoLogs.length === 1 ? (width - paddingLeft - paddingRight) / 2 + paddingLeft : getX(idx);
      const y = getY(Math.min(95, log.pitchesCount));

      if (idx === 0) {
        dLine = `M ${x} ${y}`;
      } else {
        dLine += ` L ${x} ${y}`;
      }

      const dotColor = log.pitchesCount > 65 ? '#FF6B35' : log.pitchesCount > 35 ? '#FFBC42' : '#48BB78';

      dots.push(
        <g key={log.id} className="group cursor-pointer">
          <circle 
            cx={x} 
            cy={y} 
            r="8" 
            fill={dotColor} 
            stroke="#004E89" 
            strokeWidth="3.5" 
            className="transition-all hover:scale-125 duration-200"
          />
          <title>{`${log.date}: ${log.pitchesCount} pitches (${log.requiredRestDays}d rest)`}</title>
        </g>
      );
    });

    return (
      <div className="w-full overflow-x-auto bg-white p-4 rounded-2xl border-4 border-[#004E89] shadow-inner relative">
        <div className="absolute top-4 right-4 flex items-center gap-4 bg-white/90 p-2 rounded-xl border-2 border-[#004E89]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#48BB78] border-2 border-[#004E89]"></div>
            <span className="text-[10px] font-black text-[#004E89] uppercase tracking-tighter">Pitches</span>
          </div>
        </div>
        <div className="min-w-[550px]" id="svg-chart-container-pitches">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <line x1={paddingLeft} y1={getY(20)} x2={width - paddingRight} y2={getY(20)} stroke="#CBD5E0" strokeDasharray="3,3" strokeWidth="1.5" />
            <line x1={paddingLeft} y1={getY(50)} x2={width - paddingRight} y2={getY(50)} stroke="#CBD5E0" strokeDasharray="3,3" strokeWidth="1.5" />
            <line x1={paddingLeft} y1={getY(75)} x2={width - paddingRight} y2={getY(75)} stroke="#FF6B35" strokeWidth="2.5" />

            <text x={width - paddingRight} y={getY(75) - 6} fill="#FF6B35" fontSize="10" fontWeight="900" textAnchor="end">MAX 75 CAP</text>
            <text x={width - paddingRight} y={getY(20) - 6} fill="#48BB78" fontSize="10" fontWeight="900" textAnchor="end">Low Risk (20 Pitch) rest buffer</text>

            {[0, 20, 35, 50, 65, 75].map((yVal) => (
              <text key={yVal} x={paddingLeft - 10} y={getY(yVal) + 4} fill="#004E89" fontSize="10" fontWeight="900" textAnchor="end">
                {yVal}
              </text>
            ))}

            {chronoLogs.length > 1 && (
              <path 
                d={dLine} 
                fill="none" 
                stroke="#004E89" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {dots}

            {chronoLogs.map((log, idx) => {
              const x = chronoLogs.length === 1 ? (width - paddingLeft - paddingRight) / 2 + paddingLeft : getX(idx);
              const dateObj = new Date(log.date + 'T12:00:00');
              const formattedDate = dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});

              return (
                <text 
                  key={log.id} 
                  x={x} 
                  y={height - 15} 
                  fill="#004E89" 
                  fontSize="10" 
                  fontWeight="900"
                  textAnchor="middle"
                  transform={`rotate(-10, ${x}, ${height - 15})`}
                >
                  {formattedDate}
                </text>
              );
            })}

            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#004E89" strokeWidth="2.5" />
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#004E89" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    );
  };

  const renderSpeedSVGChart = () => {
    const speedLogs = logs.filter(l => typeof l.topSpeedMph === 'number' && !isNaN(l.topSpeedMph));
    
    if (speedLogs.length === 0) {
      return (
        <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-[#CBD5E0] bg-white rounded-2xl">
          <History className="text-[#004E89] mb-2 animate-bounce" size={32} />
          <p className="text-sm font-black text-[#004E89] uppercase tracking-wide">No Speed Data</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Log your top pitched speed to see velocity trends</p>
        </div>
      );
    }

    const chronoLogs = [...speedLogs].sort((a,b) => a.date.localeCompare(b.date)).slice(-7);
    const width = 600;
    const height = 240;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const maxVal = Math.max(60, Math.ceil((userTargetSpeed + 10) / 10) * 10); 
    const minVal = 20; 
    const range = maxVal - minVal;
    
    const stepY = (height - paddingTop - paddingBottom) / range;
    const stepX = (width - paddingLeft - paddingRight) / (chronoLogs.length > 1 ? chronoLogs.length - 1 : 1);

    const getX = (idx: number) => paddingLeft + idx * stepX;
    const getY = (val: number) => height - paddingBottom - ((Math.max(minVal, Math.min(maxVal, val)) - minVal) * stepY);

    let dLine = '';
    const dots: React.ReactNode[] = [];

    chronoLogs.forEach((log, idx) => {
      const x = chronoLogs.length === 1 ? (width - paddingLeft - paddingRight) / 2 + paddingLeft : getX(idx);
      const y = getY(log.topSpeedMph!);

      if (idx === 0) dLine = `M ${x} ${y}`;
      else dLine += ` L ${x} ${y}`;

      dots.push(
        <g key={`speed-${log.id}`} className="group cursor-pointer">
          <rect x={x - 6} y={y - 6} width="12" height="12" fill="#FFBC42" stroke="#004E89" strokeWidth="2.5" className="transition-all hover:scale-125 duration-200" />
          <title>{`${log.date}: ${log.topSpeedMph} MPH`}</title>
          <text x={x} y={y - 12} fill="#FF6B35" fontSize="10" fontWeight="900" textAnchor="middle">{log.topSpeedMph} mph</text>
        </g>
      );
    });

    return (
      <div className="w-full overflow-x-auto bg-white p-4 rounded-2xl border-4 border-[#004E89] shadow-inner relative">
         <div className="absolute top-4 right-4 flex items-center gap-4 bg-white/90 p-2 rounded-xl border-2 border-[#004E89]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#FFBC42] border-2 border-[#004E89]"></div>
            <span className="text-[10px] font-black text-[#004E89] uppercase tracking-tighter">Speed (MPH)</span>
          </div>
        </div>
        <div className="min-w-[550px]" id="svg-chart-container-speed">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <line x1={paddingLeft} y1={getY(userTargetSpeed)} x2={width - paddingRight} y2={getY(userTargetSpeed)} stroke="#48BB78" strokeDasharray="3,3" strokeWidth="2" />
            <text x={width - paddingRight} y={getY(userTargetSpeed) - 6} fill="#48BB78" fontSize="10" fontWeight="900" textAnchor="end">GOAL ({userTargetSpeed} MPH)</text>

            {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
              <text key={`y-${frac}`} x={paddingLeft - 10} y={getY(minVal + frac * range) + 4} fill="#004E89" fontSize="10" fontWeight="900" textAnchor="end">{Math.round(minVal + frac * range)}</text>
            ))}

            {chronoLogs.length > 1 && <path d={dLine} fill="none" stroke="#FFBC42" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />}
            {dots}

            {chronoLogs.map((log, idx) => {
              const x = chronoLogs.length === 1 ? (width - paddingLeft - paddingRight) / 2 + paddingLeft : getX(idx);
              const dateObj = new Date(log.date + 'T12:00:00');
              const formattedDate = dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
              return (
                <text key={log.id} x={x} y={height - 15} fill="#004E89" fontSize="10" fontWeight="900" textAnchor="middle" transform={`rotate(-10, ${x}, ${height - 15})`}>
                  {formattedDate}
                </text>
              );
            })}

            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#004E89" strokeWidth="2.5" />
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#004E89" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="dashboard-root-container">
      
      {/* 1. Clearance Indicator using Custom Vibrant styling */}
      <div className={`p-6 rounded-3xl border-4 shadow-[6px_6px_0px_0px_#004E89] transition-all bg-white border-[#004E89]`} id="arm-clearance-widget">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className={`p-3.5 rounded-2xl shrink-0 mt-0.5 border-4 border-[#004E89] ${
              armStatus.status === 'CLEARED' 
                ? 'bg-[#48BB78] text-white' 
                : 'bg-[#FF6B35] text-white animate-pulse'
            }`}>
              {armStatus.status === 'CLEARED' ? <CheckCircle2 size={24} className="stroke-[3]" /> : <ShieldAlert size={24} className="stroke-[3]" />}
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 bg-[#004E89] text-white rounded-lg">
                  Arm Integrity Check
                </span>
                <span className={`text-xs font-black px-3 py-0.5 rounded-full border-2 border-[#004E89] uppercase ${
                  armStatus.status === 'CLEARED' ? 'bg-[#48BB78] text-white' : 'bg-[#FF6B35] text-white'
                }`}>
                  {armStatus.status}
                </span>
              </div>
              <h3 className="text-xl font-black text-[#004E89] uppercase tracking-tight mt-2">{armStatus.message}</h3>
              <p className="text-xs text-slate-700 font-bold mt-1 leading-relaxed">
                {armStatus.status === 'CLEARED' 
                  ? 'All safety checks clear. No remaining fatigue debt detected. Good to throw or pitch in practice!'
                  : 'Safety warning: do not pitch today. This safeguard is critical to prevent growth plate stress. Give the joint time to recover.'}
              </p>
            </div>
          </div>

          {armStatus.status === 'RESTING' && (
            <div className="shrink-0 flex flex-col items-center justify-center bg-[#EBF8FF] border-4 border-[#004E89] p-4 rounded-2xl min-w-[170px] shadow-sm" id="rest-countdown-clock">
              <span className="text-[10px] font-black text-[#004E89] uppercase tracking-wider">Cleared on:</span>
              <span className="text-xs font-black text-[#FF6B35] mt-1 uppercase text-center">{new Date(armStatus.nextDate + 'T12:00:00').toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}</span>
              
              {/* Micro visual progress circle */}
              <div className="relative w-16 h-16 mt-3 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="#004E89" strokeWidth="5" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    fill="transparent" 
                    stroke="#FFBC42" 
                    strokeWidth="5" 
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - (armStatus.restCompleted || 0) / (armStatus.restTotal || 1))}
                  />
                </svg>
                <span className="absolute text-xs font-black text-[#004E89]">
                  {armStatus.restRemaining}d left
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 2. Log Outing Form */}
        <div className="vibrant-card flex flex-col justify-between" id="outing-form-box">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 bg-[#EBF8FF] text-[#004E89] rounded-xl border-2 border-[#004E89] shrink-0">
                <Plus size={20} className="stroke-[3]" />
              </span>
              <div>
                <h3 className="font-black text-[#004E89] text-lg uppercase tracking-tight">Log Pitching Outing</h3>
                <p className="text-xs text-slate-500 font-semibold">Record a game or bullpen pitching session.</p>
              </div>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 my-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-[#004E89] uppercase tracking-wider mb-1">Pitches Count</label>
                  <input 
                    type="number" 
                    required
                    min="1" 
                    max="110"
                    value={pitchCount}
                    onChange={(e) => setPitchCount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#F0F4F8] border-2 border-[#CBD5E0] focus:border-[#004E89] focus:bg-white rounded-xl px-4 py-2.5 text-slate-800 font-extrabold focus:outline-none transition-all"
                  />
                  {pitchCount > 75 && (
                    <span className="text-[10px] font-black text-[#FF6B35] mt-1.5 block flex items-center gap-1">
                      <AlertTriangle size={11} /> EXCEEDS SINGLE DAY MAX (75)!
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#004E89] uppercase tracking-wider mb-1">Outing Date</label>
                  <input 
                    type="date" 
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-[#F0F4F8] border-2 border-[#CBD5E0] focus:border-[#004E89] focus:bg-white rounded-xl px-4 py-2 text-slate-800 font-extrabold focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#EBF8FF] border-2 border-[#004E89] rounded-xl p-4 shadow-inner relative overflow-hidden">
                  <div className="absolute right-[-10px] top-[-10px] opacity-10 pointer-events-none">
                    <History size={80} className="text-[#004E89]" />
                  </div>
                  <label className="block text-xs font-black text-[#004E89] uppercase tracking-wider mb-2 flex items-center gap-1.5 relative z-10">
                    Road to {userTargetSpeed} MPH <span className="text-[10px] text-slate-500 font-bold ml-2">(Top Speed Today)</span>
                  </label>
                  <div className="flex items-center gap-3 relative z-10">
                    <input 
                      type="number" 
                      placeholder="e.g. 42"
                      min="20"
                      max="100"
                      value={topSpeedMph}
                      onChange={(e) => setTopSpeedMph(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-24 bg-white border-2 border-[#CBD5E0] focus:border-[#FF6B35] rounded-xl px-4 py-2 text-[#004E89] font-black text-xl focus:outline-none transition-all shadow-sm"
                    />
                    <span className="text-xl font-black text-[#FF6B35]">MPH</span>
                  </div>
                  {typeof topSpeedMph === 'number' && (
                    <div className="mt-3 bg-[#CBD5E0]/30 rounded-full h-2 w-full overflow-hidden">
                       <div 
                         className="h-full bg-[#FF6B35] rounded-full transition-all duration-300"
                         style={{ width: `${Math.min(100, Math.max(0, (topSpeedMph / userTargetSpeed) * 100))}%` }}
                       />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#004E89] uppercase tracking-wider mb-1">Notes / Core Pitch performance</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Fastball command was good. Tested the circle-changeup grip draft."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F0F4F8] border-2 border-[#CBD5E0] focus:border-[#004E89] focus:bg-white rounded-xl px-4 py-2 text-slate-800 font-extrabold focus:outline-none transition-all"
                />
              </div>

              {/* Danger checklist triggers */}
              <div 
                onClick={() => setCaughtSameDay(!caughtSameDay)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer select-none flex items-start gap-3 transition-all ${
                  caughtSameDay ? 'bg-[#FFBC42]/10 border-[#004E89] text-[#004E89]' : 'bg-[#F0F4F8] border-[#CBD5E0]'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={caughtSameDay} 
                  readOnly
                  className="mt-1 accent-[#004E89]" 
                />
                <div>
                  <strong className="text-xs font-black block text-[#004E89] uppercase tracking-tight">Also caught (catcher) on the same day?</strong>
                  <p className="text-[10px] text-slate-600 font-bold mt-0.5 leading-tight">
                    Pitch Smart rules state youth pitchers should NEVER catch and pitch on the same calendar day due to excessive elbow overload.
                  </p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#FF6B35] hover:bg-orange-600 text-white border-4 border-[#004E89] font-black uppercase text-xs py-3 rounded-2xl transition-all shadow-[3px_3px_0px_0px_#004E89]"
              >
                Save Outing & Recalculate Rest
              </button>
            </form>
          </div>
        </div>

        {/* 3. Road to 50 Tracker */}
        <div className="vibrant-card flex flex-col justify-between" id="road-to-50-box">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 bg-[#FF6B35]/10 text-[#FF6B35] rounded-xl border-2 border-[#FF6B35] shrink-0">
                <Sparkles size={20} className="stroke-[3]" />
              </span>
              <div className="flex-1">
                <h3 className="font-black text-[#004E89] text-lg uppercase tracking-tight flex items-center flex-wrap gap-2">
                  Road to 
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={userTargetSpeed}
                    onChange={(e) => setUserTargetSpeed(parseInt(e.target.value) || 0)}
                    className="w-16 bg-[#F0F4F8] border-b-4 border-[#004E89] text-[#004E89] text-center px-1 focus:outline-none focus:bg-white rounded-t transition-all box-content leading-none"
                    title="Edit Target Speed"
                  />
                  MPH
                </h3>
                <p className="text-xs text-slate-500 font-semibold">Track your all-time top speed record</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 mt-4">
              <div className="text-[10px] font-black text-[#004E89] uppercase tracking-wider mb-2">Current Max Speed</div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-[#FF6B35]">{logs.reduce((max, log) => Math.max(max, log.topSpeedMph || 0), 0) || '-'}</span>
                <span className="text-xl font-bold text-slate-500">MPH</span>
              </div>
              
              <div className="w-full mt-6 bg-[#CBD5E0] rounded-full h-4 border-2 border-[#004E89] overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#FFBC42] to-[#FF6B35] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, ((logs.reduce((max, log) => Math.max(max, log.topSpeedMph || 0), 0)) / userTargetSpeed) * 100))}%` }}
                />
              </div>
              <div className="w-full flex justify-between mt-2 text-[10px] font-black text-[#004E89] uppercase tracking-wider">
                <span>0 MPH</span>
                <span>Goal: {userTargetSpeed} MPH</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-[#EBF8FF] rounded-2xl border-2 border-[#004E89] shadow-sm">
               <p className="text-xs font-semibold text-slate-700 leading-relaxed text-center">
                 Keep logging your top pitch speeds. Focus on proper mechanics and arm care to naturally build velocity over time without risking injury.
               </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Tracking Chart Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="vibrant-card" id="progress-charts-panel">
          <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight flex items-center gap-2 mb-4">
            <History className="text-[#004E89] stroke-[2.5]" size={20} />
            <span>Volume Trend Analytics</span>
          </h3>
          {renderPitchSVGChart()}
        </div>
        <div className="vibrant-card" id="velocity-charts-panel">
          <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight flex items-center gap-2 mb-4">
            <Sparkles className="text-[#FFBC42] stroke-[2.5]" size={20} />
            <span>Velocity Trend Analytics</span>
          </h3>
          {renderSpeedSVGChart()}
        </div>
      </div>

      {/* 5. Historical Logs List */}
      <div className="vibrant-card" id="historical-logs-list">
        <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight flex items-center gap-2 mb-4 border-b-4 border-[#004E89] pb-3">
          <History className="text-slate-500" size={20} />
          <span>Historical Outing Logs</span>
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 font-bold text-center py-6">No historical matches logged yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-[#004E89]">
            <table className="min-w-full text-left font-bold text-xs text-slate-800 divide-y-2 divide-[#004E89]">
              <thead>
                <tr className="bg-[#EBF8FF] font-black text-[#004E89] uppercase tracking-wide text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Top Speed</th>
                  <th className="py-3 px-4 text-center">Pitches</th>
                  <th className="py-3 px-4 text-center">Required Rest</th>
                  <th className="py-3 px-4 text-center">Cleared Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#CBD5E0] bg-white">
                {logs.map((log) => {
                  const dateObj = new Date(log.date + 'T12:00:00');
                  const formattedDate = dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
                  const restNeeded = log.requiredRestDays;

                  let rowAlert = false;
                  if (log.pitchesCount > 75 || log.caughtSameDay) rowAlert = true;

                  return (
                    <tr 
                      key={log.id} 
                      id={`log-row-${log.id}`}
                      className={`hover:bg-[#EBF8FF]/40 font-semibold ${rowAlert ? 'bg-red-50/20 text-[#be123c]' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-black text-[#004E89] flex items-center gap-2">
                        <Calendar size={14} className="text-[#004E89]" />
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {log.topSpeedMph ? (
                          <span className="text-[#FF6B35] font-black text-sm">{log.topSpeedMph} <span className="text-[10px] text-slate-500">MPH</span></span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-sm">
                        <span className={`px-2.5 py-1 rounded-lg border-2 border-[#004E89] ${
                          log.pitchesCount > 75 ? 'bg-[#FF6B35] text-white' : 'bg-[#EBF8FF] text-[#004E89]'
                        }`}>
                          {log.pitchesCount}
                        </span>
                        {log.caughtSameDay && (
                          <span className="block text-[8px] font-black text-[#FF6B35] uppercase mt-1.5">⚠️ Caught Same Day</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border-2 ${
                          restNeeded === 0 
                            ? 'bg-[#48BB78] border-[#004E89] text-white' 
                            : restNeeded >= 3 
                              ? 'bg-[#FF6B35] border-[#004E89] text-white' 
                              : 'bg-[#FFBC42] border-[#004E89] text-[#004E89]'
                        }`}>
                          {restNeeded} Day{restNeeded !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-xs font-black text-[#004E89] uppercase">
                        {new Date(log.clearedDate + 'T12:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {deleteConfirmId === log.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDeleteLog(log.id, true)}
                              className="hover:bg-red-50 p-1.5 text-red-500 hover:text-red-600 rounded-lg transition-colors inline-flex items-center cursor-pointer font-bold text-xs"
                              title="Confirm Delete"
                            >
                              <Check size={16} className="mr-1" />
                              YES
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmId(null)}
                              className="hover:bg-slate-100 p-1.5 text-slate-500 hover:text-slate-700 rounded-lg transition-colors inline-flex items-center cursor-pointer font-bold text-xs"
                              title="Cancel Delete"
                            >
                              <X size={16} className="mr-1" />
                              NO
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleDeleteLog(log.id)}
                            className="hover:bg-red-50 p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                            title="Delete Outing"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

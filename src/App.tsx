import React, { useState, useEffect } from "react";
import { PitchLog } from "./types";
import Dashboard from "./components/Dashboard";
import WorkoutPlanner from "./components/WorkoutPlanner";
import ArmCareRoutine from "./components/ArmCareRoutine";
import EquipmentRules from "./components/EquipmentRules";
import {
  Calendar,
  Activity,
  ShieldAlert,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Star,
  HelpingHand,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "workouts" | "pitchlogs" | "armcare" | "rules"
  >("workouts");
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [pitchLogs, setPitchLogs] = useState<PitchLog[]>([]);

  // Load sample data if empty to display gorgeous graphs immediately
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem("pitcher_app_pitch_logs");
      if (savedLogs) {
        setPitchLogs(JSON.parse(savedLogs));
      } else {
        // Instantiate a beautiful default safety trajectory
        const defaultLogs: PitchLog[] = [
          {
            id: "demo-1",
            date: "2026-06-03",
            pitchesCount: 18,
            topSpeedMph: 41,
            caughtSameDay: false,
            notes:
              "Solid warm up performance. Throws were quick, clean follow through.",
            clearedDate: "2026-06-04",
            requiredRestDays: 0,
          },
          {
            id: "demo-2",
            date: "2026-06-06",
            pitchesCount: 42,
            topSpeedMph: 44,
            caughtSameDay: false,
            notes:
              "Fastball was running and accurate. Took 2 full days of resting.",
            clearedDate: "2026-06-09",
            requiredRestDays: 2,
          },
          {
            id: "demo-3",
            date: "2026-06-10",
            pitchesCount: 22,
            topSpeedMph: 46,
            caughtSameDay: false,
            notes:
              "Basic throw targets bullpen. Checked the circle change grip draft.",
            clearedDate: "2026-06-12",
            requiredRestDays: 1,
          },
        ];
        localStorage.setItem(
          "pitcher_app_pitch_logs",
          JSON.stringify(defaultLogs),
        );
        setPitchLogs(defaultLogs);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogsChanged = (newLogs: PitchLog[]) => {
    setPitchLogs(newLogs);
    localStorage.setItem("pitcher_app_pitch_logs", JSON.stringify(newLogs));
  };

  // Simulating time passage: adjust calendar ticker
  const shiftDate = (days: number) => {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().split("T")[0]);
  };

  // Human-readable date string
  const formatReadableDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Basic wellness/arm alerts on current date
  const getOverallReadiness = () => {
    if (pitchLogs.length === 0)
      return {
        label: "Excellent",
        color: "bg-[#48BB78] text-white border-[#004E89]",
      };
    const sorted = [...pitchLogs].sort((a, b) => b.date.localeCompare(a.date));
    const latest = sorted[0];
    const today = new Date(currentDate + "T12:00:00");
    const cleared = new Date(latest.clearedDate + "T12:00:00");

    if (today < cleared) {
      return {
        label: "REST DEBT ACTIVE",
        color: "bg-[#FF6B35] text-white animate-pulse border-[#004E89]",
        desc: "Safety guard active: give throwing arm time to recover.",
      };
    }
    return {
      label: "FULLY RECOVERED",
      color: "bg-[#48BB78] text-white border-[#004E89]",
      desc: "All joints cleared. Normal training/throwing guidelines apply.",
    };
  };

  const readiness = getOverallReadiness();

  return (
    <div
      className="min-h-screen bg-[#F0F4F8] text-[#1A202C] flex flex-col font-sans"
      id="app-wrapper"
    >
      {/* 1. Global Navigation Top Header */}
      <header
        className="bg-[#004E89] text-white border-b-4 border-[#003B69] shadow-md"
        id="global-header"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFBC42] rounded-xl flex items-center justify-center shadow-lg transform rotate-3 border-2 border-[#003B69] shrink-0">
              <span className="text-2xl">⚾</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none uppercase font-display">
                Youth Slugger Pro
              </h1>
              <p className="text-xs font-bold text-[#A3BFFA] uppercase tracking-widest mt-1">
                Arm safety & Summer Coach's Dashboard
              </p>
            </div>
          </div>

          {/* Interactive Date passage simulator */}
          <div
            className="flex items-center gap-2 bg-[#003B69] border-2 border-[#004E89] rounded-2xl p-2.5 shadow-inner"
            id="date-simulator-widget"
          >
            <button
              onClick={() => shiftDate(-1)}
              className="p-1.5 bg-[#004E89] hover:bg-[#FF6B35] rounded-xl text-white transition-all font-bold border border-[#003B69] cursor-pointer"
              title="Prior day"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="text-center min-w-[170px] px-1 select-none">
              <p className="text-[9px] uppercase font-bold text-[#A3BFFA] tracking-wider">
                Simulated Ticker Date
              </p>
              <p className="text-xs font-black text-[#FFBC42] mt-0.5">
                {formatReadableDate(currentDate)}
              </p>
            </div>

            <button
              onClick={() => shiftDate(1)}
              className="p-1.5 bg-[#004E89] hover:bg-[#FF6B35] rounded-xl text-white transition-all font-bold border border-[#003B69] cursor-pointer"
              title="Next day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Sub-Header: Fast Safety Check-Ins */}
      <div
        className="bg-white border-b-4 border-[#004E89] py-3 shadow-xs"
        id="sub-header-bar"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-1 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#004E89] font-black uppercase tracking-wider text-xs">
              Arm Status:
            </span>
            <span
              className={`px-4 py-1 text-[11px] font-black rounded-full border-2 border-[#004E89] uppercase ${readiness.color}`}
            >
              {readiness.label}
            </span>
            {readiness.desc && (
              <span className="text-slate-600 font-bold hidden md:inline">
                | {readiness.desc}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#EBF8FF] text-[#004E89] px-3 py-1.5 rounded-full border-2 border-[#004E89] font-black uppercase text-[10px]">
            <Award size={14} className="text-[#FF6B35]" />
            <span>Target: 9-Year-Old Pitcher Safety Specs</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body Container */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6"
        id="main-content"
      >
        {/* Navigation Tabs bar */}
        <div
          className="flex justify-center md:justify-start mb-8 overflow-x-auto scrollbar-none"
          id="dashboard-navbar"
          role="tablist"
        >
          <div className="inline-flex flex-nowrap gap-2 bg-[#003B69] p-2 rounded-3xl border-4 border-[#004E89] shadow-[6px_6px_0px_0px_#004E89]">
            <button
              onClick={() => setActiveTab("workouts")}
              id="tab-workouts"
              role="tab"
              aria-selected={activeTab === "workouts"}
              className={`cursor-pointer transition-all uppercase text-xs md:text-sm font-black px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === "workouts"
                  ? "bg-[#FF6B35] text-white border-2 border-[#004E89] shadow-md"
                  : "text-white hover:bg-[#004E89]/80 border-2 border-transparent"
              }`}
            >
              <span>📅 8-Week Workouts</span>
            </button>

            <button
              onClick={() => setActiveTab("pitchlogs")}
              id="tab-pitchlogs"
              role="tab"
              aria-selected={activeTab === "pitchlogs"}
              className={`cursor-pointer transition-all uppercase text-xs md:text-sm font-black px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === "pitchlogs"
                  ? "bg-[#FF6B35] text-white border-2 border-[#004E89] shadow-md"
                  : "text-white hover:bg-[#004E89]/80 border-2 border-transparent"
              }`}
            >
              <span>⚾ Pitch Outing Track</span>
            </button>

            <button
              onClick={() => setActiveTab("armcare")}
              id="tab-armcare"
              role="tab"
              aria-selected={activeTab === "armcare"}
              className={`cursor-pointer transition-all uppercase text-xs md:text-sm font-black px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === "armcare"
                  ? "bg-[#FF6B35] text-white border-2 border-[#004E89] shadow-md"
                  : "text-white hover:bg-[#004E89]/80 border-2 border-transparent"
              }`}
            >
              <span>🩺 Daily Arm-Care</span>
            </button>

            <button
              onClick={() => setActiveTab("rules")}
              id="tab-rules"
              role="tab"
              aria-selected={activeTab === "rules"}
              className={`cursor-pointer transition-all uppercase text-xs md:text-sm font-black px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === "rules"
                  ? "bg-[#FF6B35] text-white border-2 border-[#004E89] shadow-md"
                  : "text-white hover:bg-[#004E89]/80 border-2 border-transparent"
              }`}
            >
              <span>📋 Guard & Equipment</span>
            </button>
          </div>
        </div>

        {/* Active Tab View routers */}
        <div
          className="focus:outline-none transition-all"
          tabIndex={0}
          id="tab-content-renderer"
        >
          {activeTab === "workouts" && (
            <WorkoutPlanner
              currentDate={currentDate}
              logs={pitchLogs}
              onLogsChanged={handleLogsChanged}
            />
          )}

          {activeTab === "pitchlogs" && (
            <Dashboard
              currentDate={currentDate}
              logs={pitchLogs}
              onLogsChanged={handleLogsChanged}
            />
          )}

          {activeTab === "armcare" && (
            <ArmCareRoutine
              currentDate={currentDate}
              onLoggedToday={() => {}} // passive callbacks
            />
          )}

          {activeTab === "rules" && <EquipmentRules />}
        </div>
      </main>

      {/* 4. Footer credits bar with Vibrant Palette styling */}
      <footer
        className="bg-[#003B69] border-t-4 border-[#004E89] text-white text-xs py-6 mt-12"
        id="global-footer"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold">
          <p className="uppercase tracking-wide">
            ⚾ Summer Youth Baseball Program Dashboard
          </p>
          <div className="flex flex-wrap gap-4 items-center uppercase text-[10px] text-[#A3BFFA]">
            <span>Age Guard: 9-10 Years Max Daily 75 Pitches</span>
            <span>|</span>
            <span>Clinical Standard: MLB Pitch Smart & ASMI</span>
          </div>
          <div className="flex gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] border border-[#003B69]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBC42] border border-[#003B69]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#48BB78] border border-[#003B69]"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Dumbbell, Award, Link as LinkIcon, AlertTriangle, CheckSquare, Square } from 'lucide-react';

export default function EquipmentRules() {
  const [checkedEquip, setCheckedEquip] = useState<string[]>([]);

  const equipmentList = [
    { id: 'cones', name: '6-10 Cones or Field Markers', use: 'Used for sprinting, agility shuttle drills, and agility pathways.' },
    { id: 'bands', name: '1-2 Light Resistance Bands', use: 'Critical for backing up shoulder rotation, YTW raises, and warm-ups.' },
    { id: 'medball', name: 'Light Med Ball (2-4 lb)', use: 'Develops rotational torso speed. A playground basketball works perfectly as a replacement.' },
    { id: 'step', name: 'Low Step or Box (6-12")', use: 'Used for box jumps in Phase 3. A strong stable bench or stair step does the job.' },
    { id: 'timer', name: 'Stopwatch or Phone Timer', use: 'Essential for tracking plank holds and sprint pacing intervals.' }
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pitcher_app_equip');
      if (saved) {
        setCheckedEquip(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleEquipment = (id: string) => {
    let next = [...checkedEquip];
    if (next.includes(id)) {
      next = next.filter(item => item !== id);
    } else {
      next.push(id);
    }
    setCheckedEquip(next);
    localStorage.setItem('pitcher_app_equip', JSON.stringify(next));
  };

  const sources = [
    { name: 'MLB & USA Baseball — Pitch Smart Guidelines', link: 'https://www.mlb.com/pitch-smart' },
    { name: 'American Sports Medicine Institute (ASMI) Youth Pitching Safety', link: 'https://sportsmedicine.org' },
    { name: 'NSCA Position Statement on Youth Resistance Training (Faigenbaum et al.)', link: 'https://nsca.com' },
    { name: 'Sakata et al. (2017) — Modifiable Risk Factors and Youth Thrower\'s Exercises', link: 'https://pubmed.ncbi.nlm.nih.gov' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn" id="rules-equip-container">
      {/* Upper Grid: Equipment and Pitches table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Equipment Card */}
        <div className="vibrant-card shadow-[4px_4px_0px_0px_#004E89] flex flex-col justify-between" id="rules-equipment-panel">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 bg-[#EBF8FF] text-[#004E89] rounded-xl border-2 border-[#004E89] shrink-0">
                <Dumbbell size={20} className="stroke-[2.5]" />
              </span>
              <div>
                <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight">Training Gear bag</h3>
                <p className="text-xs text-slate-500 font-semibold">Check off what you have at home before starting</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4 font-bold text-xs">
              {equipmentList.map((item) => {
                const isHave = checkedEquip.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleEquipment(item.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex gap-3 transition-all select-none ${
                      isHave 
                        ? 'border-[#004E89] bg-[#EBF8FF]/40 text-[#004E89]' 
                        : 'border-[#CBD5E0] bg-[#F0F4F8] hover:border-[#004E89] text-slate-800'
                    }`}
                  >
                    <button className="mt-0.5 text-[#004E89] shrink-0 cursor-pointer">
                      {isHave ? <CheckSquare size={18} className="fill-[#FFBC42] stroke-[#004E89]" /> : <Square size={18} className="text-slate-400" />}
                    </button>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-tight leading-none ${isHave ? 'text-[#004E89]/60 line-through' : 'text-[#004E89]'}`}>
                        {item.name}
                      </h4>
                      <p className={`text-xs mt-1.5 leading-relaxed font-semibold ${isHave ? 'text-slate-500/80' : 'text-slate-600'}`}>{item.use}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#FFBC42] p-3 rounded-2xl border-4 border-[#004E89] mt-2 shadow-xs">
            <p className="text-xs text-[#004E89] font-black tracking-tight text-center">
              💡 NO WEIGHTS? <span className="underline">Water jugs</span> or a <span className="underline">backpack loaded with books</span> works perfectly for physical carries!
            </p>
          </div>
        </div>

        {/* Pitch Smart Reference */}
        <div className="vibrant-card shadow-[4px_4px_0px_0px_#004E89] flex flex-col justify-between" id="rules-pitchsmart-limits">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 bg-[#EBF8FF] text-[#004E89] rounded-xl border-2 border-[#004E89] shrink-0">
                <ShieldCheck size={20} className="text-[#FF6B35] stroke-[2.5]" />
              </span>
              <div>
                <h3 className="font-black text-[#004E89] text-base uppercase tracking-tight">USA Pitch Smart Chart</h3>
                <p className="text-xs text-slate-500 font-semibold">Official safety limits for youth arms (9-10 years)</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden border-2 border-[#004E89] rounded-2xl mt-4">
              <table className="min-w-full text-center divide-y-2 divide-[#004E89] text-xs font-bold">
                <thead className="bg-[#EBF8FF] text-[#004E89] uppercase tracking-wide text-[10px] font-black">
                  <tr>
                    <th className="py-2.5 px-3">Pitch Count</th>
                    <th className="py-2.5 px-3">Required Rest</th>
                    <th className="py-2.5 px-3">Indication</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E0] bg-white text-slate-800">
                  <tr className="hover:bg-[#EBF8FF]/20">
                    <td className="py-2.5 px-3 font-black text-[#004E89]">1 - 20</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-[#48BB78] text-white border border-[#004E89] rounded text-[10px] font-black">0 Days</span></td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-500">Can throw tomorrow</td>
                  </tr>
                  <tr className="hover:bg-[#EBF8FF]/20">
                    <td className="py-2.5 px-3 font-black text-[#004E89]">21 - 35</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-[#FFBC42] text-[#004E89] border border-[#004E89] rounded text-[10px] font-black">1 Day</span></td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-500">Requires 1 calendar rest day</td>
                  </tr>
                  <tr className="hover:bg-[#EBF8FF]/20">
                    <td className="py-2.5 px-3 font-black text-[#004E89]">36 - 50</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-[#FF6B35] text-white border border-[#004E89] rounded text-[10px] font-black">2 Days</span></td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-500">Requires 2 calendar rest days</td>
                  </tr>
                  <tr className="hover:bg-[#EBF8FF]/20">
                    <td className="py-2.5 px-3 font-black text-[#004E89]">51 - 65</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-[#004E89] text-white border border-[#004E89] rounded text-[10px] font-black">3 Days</span></td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-500">Requires 3 calendar rest days</td>
                  </tr>
                  <tr className="hover:bg-[#EBF8FF]/20">
                    <td className="py-2.5 px-3 font-black text-[#004E89]">66 - 75</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-rose-600 text-white border border-[#004E89] rounded text-[10px] font-black animate-pulse">4 Days</span></td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-slate-500">Requires 4 calendar rest days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-start gap-3 p-4 bg-[#FF6B35] text-white rounded-2xl border-4 border-[#004E89] shadow-xs">
              <AlertTriangle className="text-[#FFBC42] shrink-0 mt-0.5 stroke-[3]" size={20} />
              <div className="font-semibold text-xs leading-relaxed">
                <strong className="text-sm font-black uppercase block text-white tracking-tight">Absolute Daily Max Limit</strong>
                <p className="mt-1 text-[#FFF4E0] font-bold">
                  A youth player <span className="underline">MUST NOT</span> throw more than <strong className="font-black text-white">75 pitches in a single day</strong>. If they reach this limit, they must be removed from the throwing mound immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Low row: Non negotiables callouts */}
      <div className="bg-[#004E89] text-white rounded-3xl p-6 relative overflow-hidden border-4 border-[#004E89] shadow-[6px_6px_0px_0px_#004E89]" id="rules-non-negotiables">
        <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none text-[#FF6B35]">
          <AlertTriangle size={150} />
        </div>
        <div className="flex items-center gap-2.5 mb-5 relative z-10">
          <span className="p-1 px-2.5 bg-[#FF6B35] text-white border-2 border-white rounded-lg font-black text-[10px] uppercase tracking-wider">
            Youth Safety Rules
          </span>
          <h3 className="font-black text-xl tracking-tight uppercase">Arm Safety Non-Negotiables</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          <div className="bg-white/10 rounded-2xl p-4.5 border-2 border-white/20 text-xs font-semibold leading-relaxed">
            <h4 className="font-black text-[#FFBC42] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <span>01. Consecutive Day Limit</span>
            </h4>
            <p className="text-slate-100 font-medium">
              <strong className="font-black">Never pitch on 3 consecutive days</strong> regardless of how low the pitch counts were. Always enforce a hard break to protect growth cartilage.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4.5 border-2 border-white/20 text-xs font-semibold leading-relaxed">
            <h4 className="font-black text-[#FFBC42] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <span>02. The Catching Block</span>
            </h4>
            <p className="text-slate-100 font-medium">
              <strong className="font-black">Avoid catching and pitching in the same game</strong>. Catching involves high-volume throws from ready squats, overtaxing a fatigued elbow.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4.5 border-2 border-white/20 text-xs font-semibold leading-relaxed">
            <h4 className="font-black text-[#FFBC42] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <span>03. Zero Rotational Spin</span>
            </h4>
            <p className="text-slate-100 font-medium">
              <strong className="font-black">Absolutely no curveballs or sliders</strong> before age 13. Focus strictly on clean four-seam spin and standard circle changeups.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4.5 border-2 border-white/20 text-xs font-semibold leading-relaxed">
            <h4 className="font-black text-[#FFBC42] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <span>04. Complete Team Combine</span>
            </h4>
            <p className="text-slate-100 font-medium">
              If playing for multiple teams (Rec, Travel League), <strong className="font-black">add up counts across all teams</strong>. The physical arm ligament does not care what jersey is worn!
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4.5 border-2 border-white/20 text-xs font-semibold leading-relaxed">
            <h4 className="font-black text-[#FFBC42] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <span>05. The Shut-Down Rule</span>
            </h4>
            <p className="text-slate-100 font-medium">
              An athlete must complete <strong className="font-black text-white">2 to 4 consecutive months of zero competitive throwing</strong> each year to build natural tendon density.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4.5 border-2 border-white/20 text-xs font-semibold leading-relaxed">
            <h4 className="font-black text-[#FFBC42] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <span>06. Listening to Pain</span>
            </h4>
            <p className="text-slate-100 font-medium">
              Any throwing-side ache or pinch is a hard safety stop. <strong className="font-black text-[#FFBC42]">Never pitch through soreness.</strong> Halt immediately and look for a medical review.
            </p>
          </div>
        </div>
      </div>

      {/* Sources list */}
      <div className="vibrant-card shadow-[4px_4px_0px_0px_#004E89]" id="rules-clinical-sources">
        <h4 className="font-black text-[#004E89] text-sm uppercase tracking-tight flex items-center gap-1.5 mb-4">
          <Award size={18} className="text-[#FF6B35] stroke-[2.5]" />
          <span>Research Foundations & Safety Citations</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sources.map((src, index) => (
            <a 
              key={index}
              href={src.link} 
              target="_blank" 
              rel="noreferrer referrer"
              className="p-3.5 bg-[#EBF8FF] hover:bg-[#FFBC42] border-2 border-[#004E89] rounded-2xl flex items-center justify-between text-xs font-black text-[#004E89] transition-all cursor-pointer shadow-xs hover:scale-[1.01]"
            >
              <span>{src.name}</span>
              <LinkIcon size={14} className="text-[#004E89] stroke-[3]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

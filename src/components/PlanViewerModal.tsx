import React, { useState } from 'react';
import { X, Calendar, Download, Printer, ChevronRight, Activity, Info, ShieldAlert } from 'lucide-react';
import { DayWorkout, GeneratedPlan } from '../types/architect';

interface PlanViewerModalProps {
  plan: GeneratedPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlanViewerModal: React.FC<PlanViewerModalProps> = ({ plan, isOpen, onClose }) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<{ dayName: string; workout: DayWorkout } | null>(null);

  if (!isOpen || !plan) return null;

  const activeWeek = plan.weeks[activeWeekIndex] || plan.weeks[0];
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleExportCSV = () => {
    let csv = 'Week,Day,Phase,Workout Type,Distance (km),Pace Target,RPE,Description\n';
    plan.weeks.forEach((w) => {
      allDays.forEach((d) => {
        const wo = w.days[d];
        if (wo) {
          const cleanDesc = (wo.desc || '').replace(/,/g, ';').replace(/\n/g, ' ');
          csv += `${w.number},${d},${w.phase},${wo.type},${wo.dist},"${wo.pace || ''}",${wo.rpe},"${cleanDesc}"\n`;
        }
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PYROFIT_${plan.distance}_${plan.methodology.name.replace(/ /g, '_')}_Plan.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-carbon border border-border p-6 md:p-8 shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="italic-heavy text-2xl text-fg">
              PYROFIT <span className="text-strava">BLUEPRINT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-space text-[10px] tracking-widest uppercase bg-strava/10 border border-strava/30 text-strava px-2.5 py-1 font-bold">
                {plan.distance.toUpperCase()} {plan.distKm}KM
              </span>
              <span className="font-space text-[10px] tracking-widest uppercase bg-surface border border-border text-fg px-2.5 py-1">
                {plan.methodology.name}
              </span>
              <span className="font-space text-[10px] tracking-widest uppercase bg-surface border border-border text-muted px-2.5 py-1">
                {plan.weeks.length} WEEKS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-xs font-space uppercase text-muted hover:text-fg hover:border-strava transition-colors"
              title="Export plan as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" /> CSV Export
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-xs font-space uppercase text-muted hover:text-fg hover:border-strava transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-fg hover:bg-surface border border-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pacing Matrix Strip */}
        {plan.paces && Object.keys(plan.paces).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 my-4 p-3 bg-surface border border-border">
            <div>
              <div className="text-[9px] font-space text-faint uppercase">Easy Aerobic</div>
              <div className="text-sm font-space font-bold text-fg">{plan.paces.easy}</div>
            </div>
            <div>
              <div className="text-[9px] font-space text-faint uppercase">Threshold</div>
              <div className="text-sm font-space font-bold text-[#FF9800]">{plan.paces.threshold}</div>
            </div>
            <div>
              <div className="text-[9px] font-space text-faint uppercase">VO₂max Interval</div>
              <div className="text-sm font-space font-bold text-[#FF3D3D]">{plan.paces.interval}</div>
            </div>
            <div>
              <div className="text-[9px] font-space text-faint uppercase">Marathon Pace</div>
              <div className="text-sm font-space font-bold text-fg">{plan.paces.marathon}</div>
            </div>
            <div>
              <div className="text-[9px] font-space text-faint uppercase">Long Run</div>
              <div className="text-sm font-space font-bold text-fg">{plan.paces.long}</div>
            </div>
            <div>
              <div className="text-[9px] font-space text-faint uppercase">Recovery Shakeout</div>
              <div className="text-sm font-space font-bold text-muted">{plan.paces.recovery}</div>
            </div>
          </div>
        )}

        {/* Auto Resolved Reason Note */}
        {plan.autoResolved && (
          <div className="p-3 bg-strava/5 border border-strava/20 text-xs font-space text-strava/90 mb-4 flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider">Methodology Match:</span>
            <span>{plan.autoResolved.reason}</span>
          </div>
        )}

        {/* Week Selector Ribbon */}
        <div className="flex gap-1 overflow-x-auto pb-2 border-b border-border">
          {plan.weeks.map((w, idx) => {
            const isActive = activeWeekIndex === idx;
            return (
              <button
                key={w.number}
                onClick={() => {
                  setActiveWeekIndex(idx);
                  setSelectedDay(null);
                }}
                className={`flex-shrink-0 px-3.5 py-2 text-center border font-space transition-all ${
                  isActive
                    ? 'border-strava bg-strava text-on-brand font-bold'
                    : 'border-border bg-surface text-muted hover:text-fg hover:border-border-bright'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider">Week {w.number}</div>
                <div className="text-[9px] opacity-75">{w.totalVolume} km</div>
              </button>
            );
          })}
        </div>

        {/* Active Week Summary */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="italic-heavy text-lg text-fg">WEEK {activeWeek.number}</span>
              <span className="font-space text-[10px] tracking-widest uppercase bg-surface-top border border-border text-strava px-2 py-0.5 font-bold">
                {activeWeek.phase}
              </span>
            </div>
            <div className="text-xs text-muted font-light mt-0.5">
              {activeWeek.phaseMeta?.desc || 'Build aerobic engine and training stamina.'}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-space">
            <div>
              <span className="text-faint">Weekly Volume: </span>
              <span className="text-fg font-bold text-sm">{activeWeek.totalVolume} km</span>
            </div>
            <div>
              <span className="text-faint">Quality Sessions: </span>
              <span className="text-strava font-bold text-sm">{activeWeek.qualitySessions}</span>
            </div>
          </div>
        </div>

        {/* 7 Days Workout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2 overflow-y-auto flex-1 p-1">
          {allDays.map((day) => {
            const workout = activeWeek.days[day];
            if (!workout) return null;
            const isRest = workout.archKey === 'REST';
            const isSelected = selectedDay?.dayName === day;

            return (
              <div
                key={day}
                onClick={() => !isRest && setSelectedDay({ dayName: day, workout })}
                className={`p-3.5 border flex flex-col justify-between transition-all ${
                  isRest
                    ? 'border-border/60 bg-carbon/50 opacity-60'
                    : 'bg-surface hover:border-strava/50 cursor-pointer'
                } ${isSelected ? 'ring-2 ring-strava border-strava' : 'border-border'}`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
                    <span className="font-space text-xs font-bold text-fg uppercase">{day}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: workout.color }}
                    />
                  </div>

                  <div className="italic-heavy text-sm text-fg leading-snug mb-1">
                    {workout.type}
                  </div>

                  {!isRest ? (
                    <>
                      <div className="text-xl font-space font-black text-strava mb-1">
                        {workout.dist} <span className="text-[10px] text-faint">KM</span>
                      </div>
                      <div className="text-[11px] font-space text-muted mb-2">
                        {workout.pace}
                      </div>
                      <p className="text-[11px] text-faint font-light line-clamp-3 leading-snug">
                        {workout.desc}
                      </p>
                    </>
                  ) : (
                    <div className="text-xs text-faint font-space mt-4">
                      Scheduled Rest
                    </div>
                  )}
                </div>

                {!isRest && (
                  <div className="mt-3 pt-2 border-t border-border/40 text-[9px] font-space text-strava/80 uppercase tracking-widest flex items-center justify-between">
                    <span>RPE {workout.rpe}</span>
                    <span>View →</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Workout Inspector Drawer */}
        {selectedDay && (
          <div className="mt-4 p-5 bg-surface-high border border-strava/40 shadow-xl animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-space text-xs font-bold bg-strava text-on-brand px-2 py-0.5 uppercase">
                  {selectedDay.dayName}
                </span>
                <span className="italic-heavy text-lg text-fg">{selectedDay.workout.type}</span>
                <span className="text-sm font-space text-strava font-bold">{selectedDay.workout.dist} KM</span>
                <span className="text-xs font-space text-muted">Target Pace: {selectedDay.workout.pace}</span>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-muted hover:text-fg text-xs font-space uppercase"
              >
                Close Details ✕
              </button>
            </div>

            {/* Structured Segment Breakdown */}
            {selectedDay.workout.segments && selectedDay.workout.segments.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-space uppercase tracking-widest text-faint mb-2">
                  Session Execution Steps
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedDay.workout.segments.map((seg, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 bg-surface border border-border text-xs font-space flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-fg">{seg.label}</div>
                        <div className="text-[10px] text-faint">{seg.km} km</div>
                      </div>
                      <div className="text-right">
                        <div className="text-strava font-bold">
                          {seg.paceSec ? `${Math.floor(seg.paceSec / 60)}:${(seg.paceSec % 60).toString().padStart(2, '0')}/km` : 'Effort'}
                        </div>
                        <div className="text-[9px] text-faint">{seg.zone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physiological Goals and Mentoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-surface border border-border">
                <div className="font-space text-strava text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                  <Activity className="w-3.5 h-3.5" /> Physiological Purpose
                </div>
                <p className="text-muted font-light leading-relaxed">
                  <strong className="text-fg font-medium">What:</strong> {selectedDay.workout.what}
                </p>
                <p className="text-muted font-light leading-relaxed mt-1">
                  <strong className="text-fg font-medium">Why:</strong> {selectedDay.workout.why}
                </p>
              </div>

              {selectedDay.workout.mentoring && (
                <div className="p-3 bg-surface border border-border">
                  <div className="font-space text-strava text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                    <Info className="w-3.5 h-3.5" /> Coaching &amp; Effort Cues
                  </div>
                  <p className="text-muted font-light leading-relaxed">
                    <strong className="text-fg font-medium">Heart Rate:</strong> {selectedDay.workout.mentoring.hrZone}
                  </p>
                  <p className="text-muted font-light leading-relaxed mt-1">
                    <strong className="text-fg font-medium">Feel:</strong> {selectedDay.workout.mentoring.feel}
                  </p>
                  <p className="text-muted font-light leading-relaxed mt-1">
                    <strong className="text-fg font-medium">Check:</strong> {selectedDay.workout.mentoring.landmark}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

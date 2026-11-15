/**
 * PYROFIT MVP — Running Injury Prevention & Rehabilitation Modal
 * Author: Ojas Ulhas Dighe
 * Date: 2026-11-15
 * Description: Evidence-based runner injury protocols: 6 core conditions, 4 prevention pillars, return-to-run criteria, and red flag warnings.
 */

import React, { useState } from 'react';
import { X, AlertTriangle, Shield, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface InjuriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'injuries' | 'prevention' | 'return' | 'redflags';

const TABS: { id: Tab; label: string }[] = [
  { id: 'injuries', label: 'Common Injuries' },
  { id: 'prevention', label: 'Prevention' },
  { id: 'return', label: 'Return to Run' },
  { id: 'redflags', label: 'Red Flags' },
];

const injuries = [
  {
    name: "Runner's Knee (PFPS)",
    risk: 'Medium',
    riskColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    cause: "Weak glutes, overpronation, sudden mileage increase, running downhill on hard surfaces.",
    symptoms: "Pain behind or around the kneecap, especially on stairs, squatting, or downhill running. Stiffness after sitting for long periods.",
    treatment: "Rest and ice. Quad and glute strengthening exercises. Foam roll the IT band and lateral quad. Avoid downhill running until resolved.",
    return: '2–6 weeks',
  },
  {
    name: 'IT Band Syndrome',
    risk: 'Medium',
    riskColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    cause: "Weak hip abductors, excessive downhill running, leg-length discrepancy, sudden mileage increase.",
    symptoms: "Sharp, burning lateral knee pain at the 30-degree bend (the impingement zone). Often clicks in. Worse on downhills.",
    treatment: "Hip abductor and glute strengthening. Foam rolling lateral thigh (not directly on the band). Reduce downhill mileage. Orthotics if overpronation present.",
    return: '4–8 weeks',
  },
  {
    name: 'Plantar Fasciitis',
    risk: 'High',
    riskColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    cause: "Tight calves, high arch or flat feet, sudden mileage spike, inadequate footwear, prolonged standing.",
    symptoms: "Sharp heel pain, worst during the first few steps in the morning or after prolonged rest. Eases with movement but can return after long runs.",
    treatment: "Calf and plantar fascia stretches (3x daily). Frozen water bottle rolling. Night splints. Custom orthotics. Consider PRP if >6 months.",
    return: '6–12 weeks',
  },
  {
    name: 'Shin Splints (MTSS)',
    risk: 'Low–Medium',
    riskColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    cause: "Poor footwear, hard surfaces, overpronation, rapid mileage increase, inadequate recovery.",
    symptoms: "Diffuse anterior or medial shin pain during and after runs. Tenderness along the inner shin bone. Dull ache at rest in severe cases.",
    treatment: "Rest, ice, compression. Transition to softer surfaces. Address footwear and gait. Progressive return with 50% mileage reduction.",
    return: '2–4 weeks',
  },
  {
    name: 'Achilles Tendinopathy',
    risk: 'High',
    riskColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    cause: "Sudden increase in speed or hill work, tight calves, inadequate warm-up, fluoroquinolone antibiotics.",
    symptoms: "Morning stiffness in the tendon. Thickening or nodule 2–6cm above heel. Pain on palpation. Worse during first minutes of running.",
    treatment: "Eccentric heel drops (Alfredson protocol: 3x15 twice daily). Reduce intensity. Load management. No stretching in acute phase.",
    return: '6–16 weeks',
  },
  {
    name: 'Stress Fracture',
    risk: 'Critical',
    riskColor: 'bg-red-700/20 text-red-300 border-red-700/40',
    cause: "Sudden mileage spike, low bone density, RED-S (Relative Energy Deficiency in Sport), insufficient recovery, running through pain.",
    symptoms: "Pinpoint bone pain that worsens with activity and doesn't resolve with rest. Swelling or bruising in the area. Pain on the 'hop test'.",
    treatment: "STOP RUNNING IMMEDIATELY. Seek medical assessment (X-ray or bone scan). Non-weight-bearing period may be required. Address nutritional root cause.",
    return: '6–12 weeks (or longer)',
  },
];

const returnProtocol = [
  { week: 'Week 1', session: 'Walk 30 min × 3', notes: 'Zero pain throughout. No running yet.' },
  { week: 'Week 2', session: 'Walk/Run — 1 min run / 4 min walk × 20 min', notes: 'Stop immediately if pain returns.' },
  { week: 'Week 3', session: 'Walk/Run — 2 min run / 3 min walk × 20 min', notes: 'Effort should feel like 4–5/10.' },
  { week: 'Week 4', session: 'Walk/Run — 3 min run / 2 min walk × 25 min', notes: 'Monitor for 24-hour post-run soreness.' },
  { week: 'Week 5', session: 'Run 20 min continuous (if pain-free)', notes: 'If pain returns, go back to Week 3.' },
  { week: 'Week 6', session: 'Run 25–30 min continuous', notes: 'Cleared for gradual structured training.' },
];

export const InjuriesModal: React.FC<InjuriesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('injuries');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-5xl mx-auto my-8 bg-carbon border border-border p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-border">
          <div>
            <div className="text-[10px] font-space text-strava tracking-[0.4em] uppercase mb-1 font-bold flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Injury Science & Prevention
            </div>
            <h2 className="italic-heavy text-3xl md:text-4xl text-fg">
              INJURY <span className="text-strava">GUIDE</span>
            </h2>
            <p className="text-muted text-sm font-light mt-1 font-space">
              Evidence-based prevention, diagnosis, and return-to-run protocols for endurance runners.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-fg hover:bg-surface border border-border transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-8 overflow-x-auto border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-space tracking-[0.2em] uppercase font-bold whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-strava text-strava'
                  : 'border-transparent text-muted hover:text-fg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* COMMON INJURIES — accordion */}
        {activeTab === 'injuries' && (
          <div className="space-y-2">
            {injuries.map((inj, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="bg-surface border border-border">
                  <button
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="italic-heavy text-base text-fg">{inj.name}</span>
                      <span className={`text-[9px] font-space uppercase tracking-widest px-2 py-0.5 border font-bold ${inj.riskColor}`}>
                        {inj.risk} Risk
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] font-space text-faint hidden sm:block">Return: {inj.return}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-strava" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4">
                      <div>
                        <div className="text-[9px] font-space text-strava uppercase tracking-widest font-bold mb-2">Root Cause</div>
                        <p className="text-xs text-muted font-light leading-relaxed">{inj.cause}</p>
                      </div>
                      <div>
                        <div className="text-[9px] font-space text-strava uppercase tracking-widest font-bold mb-2">Symptoms</div>
                        <p className="text-xs text-muted font-light leading-relaxed">{inj.symptoms}</p>
                      </div>
                      <div>
                        <div className="text-[9px] font-space text-strava uppercase tracking-widest font-bold mb-2">Treatment</div>
                        <p className="text-xs text-muted font-light leading-relaxed">{inj.treatment}</p>
                        <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-space text-fg font-bold bg-strava/10 px-2 py-1 border border-strava/20">
                          Return: {inj.return}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PREVENTION */}
        {activeTab === 'prevention' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: Activity,
                title: 'Mileage Progression',
                rules: [
                  '10% rule: Never increase weekly mileage by more than 10%',
                  'Every 4th week: cut back 20–30% (deload week)',
                  'Avoid stacking hard days: no more than 2 quality sessions/week',
                  'Long run should be max 30% of total weekly volume',
                ],
              },
              {
                icon: Shield,
                title: 'Strength Training',
                rules: [
                  '2× per week minimum. Focus on posterior chain and hips',
                  'Key exercises: single-leg deadlift, clamshells, hip thrusts, calf raises (eccentric)',
                  'Core work 3–4× per week: dead bug, Copenhagen plank, Pallof press',
                  'Start with bodyweight before adding load',
                ],
              },
              {
                icon: Activity,
                title: 'Recovery & Sleep',
                rules: [
                  '1 full rest day minimum per week',
                  'Sleep 7–9 hours — most tissue repair happens in deep sleep',
                  'Cold therapy (ice bath or cold shower) within 30 min of hard sessions',
                  'Easy runs genuinely easy: Zone 2, can hold a conversation',
                ],
              },
              {
                icon: Shield,
                title: 'Footwear',
                rules: [
                  'Replace running shoes every 500–700km',
                  'Rotate 2 pairs to allow foam recovery between runs',
                  'Match heel-to-toe drop to your gait and flexibility',
                  'Never introduce new race shoes on race day — 50+ km minimum break-in',
                ],
              },
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="bg-surface border border-border border-l-4 border-l-strava/50 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-strava/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-strava" />
                    </div>
                    <h3 className="italic-heavy text-base text-fg">{pillar.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {pillar.rules.map((rule, j) => (
                      <li key={j} className="text-xs text-muted font-light flex gap-2">
                        <span className="text-strava mt-0.5 flex-shrink-0">▸</span> {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* RETURN TO RUN */}
        {activeTab === 'return' && (
          <div className="space-y-6">
            <p className="text-muted text-sm font-light font-space leading-relaxed max-w-2xl">
              The standard Walk-to-Run reconditioning protocol. Use after any lower limb injury requiring more than 1 week off running. Prerequisite: zero pain walking at a brisk pace for 30 minutes.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-strava/10">
                    {['Week', 'Session (3× per week)', 'Key Rule'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-space text-strava uppercase tracking-widest font-bold border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {returnProtocol.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 font-space text-xs font-bold text-strava">{row.week}</td>
                      <td className="px-4 py-3 font-space text-xs text-fg">{row.session}</td>
                      <td className="px-4 py-3 text-xs text-muted font-light">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Pain threshold', value: '0 / 10', note: 'During and after each session' },
                { label: 'Soreness next day', value: '< 2 / 10', note: 'Acceptable level to continue' },
                { label: 'Setback rule', value: '1 Week Back', note: 'If pain returns, regress one full week' },
              ].map((s, i) => (
                <div key={i} className="bg-surface border border-border p-4 text-center">
                  <div className="italic-heavy text-2xl text-strava mb-1">{s.value}</div>
                  <div className="text-xs font-bold text-fg font-space">{s.label}</div>
                  <div className="text-[10px] text-faint mt-1">{s.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RED FLAGS */}
        {activeTab === 'redflags' && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted font-space">
                <strong className="text-red-400">Stop running and see a doctor</strong> if you experience any of the following. These are not regular overuse injuries — they can cause permanent damage if ignored.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  flag: 'Swelling + Bruising After Impact',
                  detail: 'Any visible swelling, bruising, or deformity after a fall or collision. Rule out fracture, ligament tear, or joint injury before returning to any activity.',
                  severity: 'URGENT',
                },
                {
                  flag: 'Pain That Wakes You At Night',
                  detail: 'Resting pain that wakes you from sleep is never normal for a soft tissue injury. It can indicate stress fracture, compartment syndrome, or tumour. Seek immediate evaluation.',
                  severity: 'URGENT',
                },
                {
                  flag: 'Clicking or Locking Joint',
                  detail: 'A joint that locks, gives way, or makes a mechanical click/clunk (not soft tissue clicking) may indicate meniscal tear, loose body, or cartilage damage. MRI indicated.',
                  severity: 'SEE DOCTOR',
                },
                {
                  flag: 'Numbness or Tingling in Foot / Leg',
                  detail: 'Altered sensation (pins and needles, numbness, burning) during or after running can indicate nerve compression, compartment syndrome, or lumbar spine pathology.',
                  severity: 'SEE DOCTOR',
                },
                {
                  flag: 'Chest Pain or Dizziness While Running',
                  detail: 'Any cardiac symptoms — chest tightness, pressure, palpitations, or dizziness during exercise — require immediate medical assessment. Stop running now.',
                  severity: 'EMERGENCY',
                },
                {
                  flag: 'No Improvement After 6 Weeks Rest',
                  detail: "Most overuse injuries respond to 2–6 weeks of rest and rehab. If you've rested properly and pain persists, seek specialist imaging (MRI, bone scan) to rule out structural pathology.",
                  severity: 'SEE SPECIALIST',
                },
              ].map((flag, i) => (
                <div key={i} className="bg-surface border border-red-500/20 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <h3 className="italic-heavy text-sm text-red-300">{flag.flag}</h3>
                    </div>
                    <span className="text-[9px] font-space uppercase tracking-widest px-2 py-0.5 border bg-red-500/20 text-red-400 border-red-500/30 font-bold flex-shrink-0">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted font-light leading-relaxed">{flag.detail}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-strava/5 border border-strava/20">
              <p className="text-xs text-faint font-space text-center">
                Not medical advice. Consult a registered sports physiotherapist or orthopaedic specialist for diagnosis and treatment. This guide is for educational purposes only.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

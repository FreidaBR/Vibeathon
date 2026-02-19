import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle, Trophy } from 'lucide-react';

// Even vertical spacing for all 30 days. Top cleared for START + WEEK 01, then Day 1.
const Y_START = 100;
const Y_END = 3320;
const N_DAYS = 30;
const KEY_WAYPOINTS = [
  [100, 480], [400, 660], [800, 480], [1200, 660], [1600, 440], [2000, 640], [2400, 420], [2800, 480], [3320, 480],
];

function lerpX(y) {
  for (let i = 0; i < KEY_WAYPOINTS.length - 1; i++) {
    const [y0, x0] = KEY_WAYPOINTS[i];
    const [y1, x1] = KEY_WAYPOINTS[i + 1];
    if (y >= y0 && y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
  }
  return KEY_WAYPOINTS[KEY_WAYPOINTS.length - 1][1];
}

const ROAD_POSITIONS = Array.from({ length: N_DAYS }, (_, i) => {
  const y = i === N_DAYS - 1 ? Y_END : Y_START + (i * (Y_END - Y_START)) / (N_DAYS - 1);
  return [Math.round(lerpX(y)), Math.round(y)];
});

// Path through all node positions
const ROAD_PATH = (() => {
  const pts = ROAD_POSITIONS;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const [px, py] = pts[i - 1];
    const cpx = (px + x) / 2;
    const cpy = (py + y) / 2;
    d += ` Q${cpx} ${cpy} ${x} ${y}`;
  }
  return d;
})();

const NODE_COLOR = '#2d2654';
function getWeekColor(day) {
  return { fill: 'url(#gNode)', stroke: NODE_COLOR };
}

function isMilestoneDay(day) {
  return day === 7 || day === 14 || day === 21 || day === 30;
}

// Split a description into up to maxParts meaningful segments for per-day subtasks
function splitDescriptionForDays(description, maxParts) {
  if (!description?.trim() || maxParts < 1) return [];
  const text = description.trim();
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean).map((s) => s.trim());
  if (sentences.length >= maxParts) return sentences.slice(0, maxParts);
  if (sentences.length === 1 && maxParts > 1) {
    const clauses = text.split(/\s*[,;]\s+|\s+and\s+|\s*—\s*/i).filter(Boolean).map((s) => s.trim());
    if (clauses.length >= maxParts) return clauses.slice(0, maxParts);
    if (clauses.length > 1) {
      const perPart = Math.ceil(clauses.length / maxParts);
      const merged = [];
      for (let i = 0; i < maxParts; i++) {
        const chunk = clauses.slice(i * perPart, (i + 1) * perPart).join(', ');
        if (chunk) merged.push(chunk);
      }
      return merged.length ? merged : [text];
    }
  }
  return sentences.length ? sentences : [text];
}

// Expand API milestones into 30 day-steps with unique task titles per day
function expandTo30Days(milestones) {
  if (!milestones?.length) return [];
  const flat = [];
  let day = 0;
  for (const m of milestones) {
    const d = Math.max(1, parseInt(m.days, 10) || 2);
    const desc = m.description || '';
    const parts = splitDescriptionForDays(desc, d);
    const baseTitle = m.title || 'Task';
    for (let i = 0; i < d && day < 30; i++) {
      day += 1;
      let title = baseTitle;
      if (parts[i]) {
        const sub = parts[i].replace(/^[\s.]*|[\s.]*$/g, '').substring(0, 50);
        title = sub.length > 20 ? sub : `${baseTitle} — ${sub}`;
      } else if (d > 1) {
        title = `${baseTitle} · Day ${i + 1}/${d}`;
      }
      flat.push({
        dayNumber: day,
        title,
        description: desc,
      });
    }
  }
  const last = flat[flat.length - 1] || { title: 'Continue', description: 'Keep building.' };
  while (flat.length < 30) {
    flat.push({
      dayNumber: flat.length + 1,
      title: `${last.title} (cont.)`,
      description: last.description,
    });
  }
  return flat.slice(0, 30);
}

export default function RoadmapSection({ milestones = [], loading, error }) {
  const [completedDays, setCompletedDays] = useState({});
  const [hoverDay, setHoverDay] = useState(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });

  const days = useMemo(() => expandTo30Days(milestones), [milestones]);

  useEffect(() => {
    if (!days.length) return;
    try {
      const key = days.map((d) => d.dayNumber + ':' + d.title).join('|');
      const savedKey = localStorage.getItem('roadmapKey');
      const saved = localStorage.getItem('roadmapCompletion');
      if (savedKey === key && saved) {
        setCompletedDays(JSON.parse(saved));
      } else {
        localStorage.setItem('roadmapKey', key);
        setCompletedDays({});
      }
    } catch (err) {
      console.error('Error loading roadmap completion:', err);
    }
  }, [days]);

  const completionPercentage = days.length
    ? Math.round((Object.values(completedDays).filter(Boolean).length / days.length) * 100)
    : 0;

  const toggleDay = (dayNum) => {
    const updated = { ...completedDays, [dayNum]: !completedDays[dayNum] };
    setCompletedDays(updated);
    try {
      localStorage.setItem('roadmapCompletion', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving roadmap completion:', err);
    }
  };

  const handleNodeMouseMove = (e, dayNum) => {
    setHoverDay(dayNum);
    let x = e.clientX + 16;
    let y = e.clientY - 14;
    if (x + 230 > window.innerWidth) x = e.clientX - 240;
    if (y + 130 > window.innerHeight) y = e.clientY - 135;
    setTipPos({ x, y });
  };

  const hasContent = milestones?.length > 0;
  const showSection = hasContent || loading || error;

  if (!showSection) return null;

  const hoverItem = hoverDay != null ? days.find((d) => d.dayNumber === hoverDay) : null;

  return (
    <section className="py-24 px-4 scroll-mt-24" id="roadmap">
      <div className="max-w-[1000px] mx-auto">
        {/* Header — same style as Skills Analysis */}
        <header className="mb-12">
          <h2 className="pixel-section-title">
            30 Day Roadmap
          </h2>
        </header>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-5"
          >
            <Loader2 className="w-12 h-12 text-[#b8892a] animate-spin" />
            <p className="font-medium text-[#1c1814]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Building your roadmap...
            </p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-[#1c1814] font-medium text-center">{error}</p>
          </motion.div>
        )}

        {hasContent && !loading && days.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl overflow-hidden bg-[#f7f4ef] p-6 md:p-10 shadow-xl"
          >
            <svg
              viewBox="0 0 960 3600"
              className="w-full h-auto block overflow-visible"
              style={{ minHeight: 3600 * 0.28 }}
            >
              <defs>
                <linearGradient id="rdGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#bab4ab" />
                  <stop offset="8%" stopColor="#cdc8c0" />
                  <stop offset="50%" stopColor="#d8d4cc" />
                  <stop offset="92%" stopColor="#cdc8c0" />
                  <stop offset="100%" stopColor="#bab4ab" />
                </linearGradient>
                <filter id="sh" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,.13)" />
                </filter>
                <filter id="gldGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="7" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="nodeSh" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,.18)" />
                </filter>
                <radialGradient id="gNode" cx="38%" cy="32%" r="68%">
                  <stop offset="0%" stopColor="#3d3564" />
                  <stop offset="100%" stopColor="#2d2654" />
                </radialGradient>
                <radialGradient id="gGold" cx="38%" cy="32%" r="68%">
                  <stop offset="0%" stopColor="#e8c060" />
                  <stop offset="100%" stopColor="#b8860b" />
                </radialGradient>
              </defs>

              {/* Decorative trees — left side (triangle foliage + rect trunk) */}
              <g fill="#D8D4CE" opacity="0.52" stroke="none">
                <g transform="translate(120, 302)"><polygon points="0,-38 24,0 -24,0"/><rect x="-5" y="0" width="10" height="22" rx="2"/></g>
                <g transform="translate(160, 548)"><polygon points="0,-34 22,0 -22,0"/><rect x="-4" y="0" width="8" height="18" rx="2"/></g>
                <g transform="translate(100, 910)"><polygon points="0,-40 26,0 -26,0"/><rect x="-5" y="0" width="10" height="20" rx="2"/></g>
                <g transform="translate(140, 1268)"><polygon points="0,-32 20,0 -20,0"/><rect x="-4" y="0" width="8" height="16" rx="2"/></g>
                <g transform="translate(90, 1649)"><polygon points="0,-36 24,0 -24,0"/><rect x="-5" y="0" width="10" height="19" rx="2"/></g>
                <g transform="translate(130, 2029)"><polygon points="0,-34 22,0 -22,0"/><rect x="-4" y="0" width="8" height="17" rx="2"/></g>
                <g transform="translate(110, 2410)"><polygon points="0,-35 23,0 -23,0"/><rect x="-4" y="0" width="8" height="18" rx="2"/></g>
                <g transform="translate(150, 2790)"><polygon points="0,-32 21,0 -21,0"/><rect x="-4" y="0" width="8" height="16" rx="2"/></g>
              </g>
              {/* Decorative trees — right side */}
              <g fill="#D8D4CE" opacity="0.52" stroke="none">
                <g transform="translate(820, 202)"><polygon points="0,-38 24,0 -24,0"/><rect x="-5" y="0" width="10" height="22" rx="2"/></g>
                <g transform="translate(860, 558)"><polygon points="0,-34 22,0 -22,0"/><rect x="-4" y="0" width="8" height="18" rx="2"/></g>
                <g transform="translate(800, 950)"><polygon points="0,-40 26,0 -26,0"/><rect x="-5" y="0" width="10" height="20" rx="2"/></g>
                <g transform="translate(840, 1308)"><polygon points="0,-32 20,0 -20,0"/><rect x="-4" y="0" width="8" height="16" rx="2"/></g>
                <g transform="translate(790, 1708)"><polygon points="0,-36 24,0 -24,0"/><rect x="-5" y="0" width="10" height="19" rx="2"/></g>
                <g transform="translate(830, 2108)"><polygon points="0,-34 22,0 -22,0"/><rect x="-4" y="0" width="8" height="17" rx="2"/></g>
                <g transform="translate(810, 2510)"><polygon points="0,-35 23,0 -23,0"/><rect x="-4" y="0" width="8" height="18" rx="2"/></g>
                <g transform="translate(850, 2910)"><polygon points="0,-32 21,0 -21,0"/><rect x="-4" y="0" width="8" height="16" rx="2"/></g>
              </g>

              {/* Animated dotted line */}
              <path
                d={ROAD_PATH}
                stroke="#b8892a"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="26 20"
                opacity="0.65"
                className="road-dash-anim"
              />

              {/* Week dividers — WEEK 01 below START, above Day 1 */}
              <g transform="translate(480,72)">
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="#b83232" filter="url(#sh)" />
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fill="white" fontFamily="Outfit, sans-serif" fontSize="10.5" fontWeight="600" letterSpacing="0.18em">
                  WEEK 01
                </text>
                <text textAnchor="middle" y="11" fill="rgba(255,255,255,.7)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10">
                  Foundation
                </text>
              </g>
              <g transform="translate(483,806)">
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="#c47a1a" filter="url(#sh)" />
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fill="white" fontFamily="Outfit, sans-serif" fontSize="10.5" fontWeight="600" letterSpacing="0.18em">
                  WEEK 02
                </text>
                <text textAnchor="middle" y="11" fill="rgba(255,255,255,.7)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10">
                  Build & Practice
                </text>
              </g>
              <g transform="translate(474,1538)">
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="#1e5fa8" filter="url(#sh)" />
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fill="white" fontFamily="Outfit, sans-serif" fontSize="10.5" fontWeight="600" letterSpacing="0.18em">
                  WEEK 03
                </text>
                <text textAnchor="middle" y="11" fill="rgba(255,255,255,.7)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10">
                  Level Up
                </text>
              </g>
              <g transform="translate(437,2370)">
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="#6b3fa0" filter="url(#sh)" />
                <rect x="-120" y="-18" width="240" height="34" rx="5" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fill="white" fontFamily="Outfit, sans-serif" fontSize="10.5" fontWeight="600" letterSpacing="0.18em">
                  WEEK 04
                </text>
                <text textAnchor="middle" y="11" fill="rgba(255,255,255,.7)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="10">
                  Ship It
                </text>
              </g>

              {/* 30 day nodes */}
              {days.map((item, index) => {
                const [px, py] = ROAD_POSITIONS[index] || [480, 3000];
                const weekStyle = getWeekColor(item.dayNumber);
                const isMilestone = isMilestoneDay(item.dayNumber);
                const completed = completedDays[item.dayNumber];
                const isCapstone = item.dayNumber === 30;

                return (
                  <g
                    key={item.dayNumber}
                    className="cursor-pointer select-none"
                    transform={`translate(${px},${py})`}
                    style={{ animationDelay: `${index * 0.04}s` }}
                    onClick={() => toggleDay(item.dayNumber)}
                    onMouseEnter={(e) => handleNodeMouseMove(e, item.dayNumber)}
                    onMouseMove={(e) => handleNodeMouseMove(e, item.dayNumber)}
                    onMouseLeave={() => setHoverDay(null)}
                  >
                    {completed ? (
                      <>
                        <circle r="32" fill="#f7f4ef" opacity="0.8" />
                        <circle r="26" fill="url(#gGold)" filter="url(#nodeSh)" />
                        <text textAnchor="middle" y="-6" fontSize="16">
                          ✓
                        </text>
                        <text textAnchor="middle" y="10" fill="white" fontFamily="Outfit, sans-serif" fontSize="10" fontWeight="600">
                          DAY {item.dayNumber}
                        </text>
                      </>
                    ) : isCapstone ? (
                      <>
                        <circle r="42" fill="#f0e8d0" opacity="0.7" />
                        <circle r="35" fill="url(#gGold)" filter="url(#nodeSh)" />
                        <text textAnchor="middle" y="-10" fontSize="22">
                          🏆
                        </text>
                        <text textAnchor="middle" y="10" fill="white" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="600" letterSpacing="0.06em">
                          DAY 30
                        </text>
                      </>
                    ) : isMilestone ? (
                      <>
                        <circle r="32" fill="#f7f4ef" opacity="0.8" />
                        <circle r="26" fill="url(#gGold)" filter="url(#nodeSh)" />
                        <text textAnchor="middle" y="-6" fontSize="14">
                          🏁
                        </text>
                        <text textAnchor="middle" y="10" fill="white" fontFamily="Outfit, sans-serif" fontSize="9" fontWeight="600">
                          DAY {item.dayNumber}
                        </text>
                      </>
                    ) : (
                      <>
                        <circle r="28" fill="none" stroke={weekStyle.stroke} strokeWidth="1.5" opacity="0" className="halo" />
                        <circle r="21" fill={weekStyle.fill} filter="url(#nodeSh)" />
                        <text textAnchor="middle" y="5.5" fill="white" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="600">
                          {item.dayNumber}
                        </text>
                      </>
                    )}
                    {/* Label card — alternate left/right (skip for capstone and last 5 days to avoid clutter) */}
                    {!completed && !isCapstone && item.dayNumber <= 25 && (index % 2 === 0 ? (
                        <g>
                          <rect x="34" y="-22" width="154" height="44" rx="7" fill="white" filter="url(#sh)" opacity="0.97" />
                          <text x="44" y="-6" fill="#1c1814" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="600">
                            {item.title.length > 22 ? item.title.slice(0, 22) + '…' : item.title}
                          </text>
                          <text x="44" y="9" fill="#7a7268" fontFamily="Outfit, sans-serif" fontSize="9.5" fontWeight="300">
                            Day {item.dayNumber}
                          </text>
                          <line x1="34" y1="-22" x2="34" y2="22" stroke={NODE_COLOR} strokeWidth="3" strokeLinecap="round" />
                        </g>
                      ) : (
                        <g>
                          <rect x="-188" y="-22" width="154" height="44" rx="7" fill="white" filter="url(#sh)" opacity="0.97" />
                          <text x="-178" y="-6" fill="#1c1814" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="600">
                            {item.title.length > 22 ? item.title.slice(0, 22) + '…' : item.title}
                          </text>
                          <text x="-178" y="9" fill="#7a7268" fontFamily="Outfit, sans-serif" fontSize="9.5" fontWeight="300">
                            Day {item.dayNumber}
                          </text>
                          <line x1="-36" y1="-22" x2="-36" y2="22" stroke={NODE_COLOR} strokeWidth="3" strokeLinecap="round" />
                        </g>
                    ))}
                  </g>
                );
              })}

              {/* Finish / Day 30 capstone */}
              <g transform="translate(480,3325)" opacity="0.85">
                <rect x="-60" y="0" width="15" height="11" fill="#1c1814" />
                <rect x="-45" y="0" width="15" height="11" fill="white" />
                <rect x="-30" y="0" width="15" height="11" fill="#1c1814" />
                <rect x="-15" y="0" width="15" height="11" fill="white" />
                <rect x="0" y="0" width="15" height="11" fill="#1c1814" />
                <rect x="15" y="0" width="15" height="11" fill="white" />
                <rect x="30" y="0" width="15" height="11" fill="#1c1814" />
                <rect x="45" y="0" width="15" height="11" fill="white" />
                <rect x="-60" y="11" width="15" height="11" fill="white" />
                <rect x="-45" y="11" width="15" height="11" fill="#1c1814" />
                <rect x="-30" y="11" width="15" height="11" fill="white" />
                <rect x="-15" y="11" width="15" height="11" fill="#1c1814" />
                <rect x="0" y="11" width="15" height="11" fill="white" />
                <rect x="15" y="11" width="15" height="11" fill="#1c1814" />
                <rect x="30" y="11" width="15" height="11" fill="white" />
                <rect x="45" y="11" width="15" height="11" fill="#1c1814" />
              </g>
              <text x="480" y="3400" textAnchor="middle" fill="#1c1814" fontFamily="Cormorant Garamond, serif" fontSize="24" fontWeight="700" fontStyle="italic">
                Launch Ready
              </text>
              <text x="480" y="3420" textAnchor="middle" fill="#b8892a" fontFamily="Outfit, sans-serif" fontSize="9.5" fontWeight="500" letterSpacing="0.25em">
                CAPSTONE · DAY 30
              </text>
            </svg>

            {/* Tooltip */}
            {hoverItem && (
              <div
                className="fixed pointer-events-none z-[999] rounded-xl bg-[#1c1814] px-4 py-3 max-w-[210px] shadow-xl transition-opacity duration-150"
                style={{
                  left: tipPos.x,
                  top: tipPos.y,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <div className="text-[10px] tracking-widest uppercase text-[#d4aa4e] font-semibold mb-1">
                  Day {hoverItem.dayNumber}
                </div>
                <h3
                  className="text-white font-semibold text-base mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {hoverItem.title}
                </h3>
                <p className="text-[11px] text-white/60 leading-snug font-light line-clamp-3">
                  {hoverItem.description}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {hasContent && !loading && completionPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r from-[#b8892a] to-[#8a5e10] text-white shadow-xl">
              <Trophy className="w-10 h-10" />
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  LAUNCH!
                </h3>
                <p className="text-white/90 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  You completed your 30-day roadmap.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -52; }
        }
        .road-dash-anim {
          animation: dash 1.8s linear infinite;
        }
        .halo:hover { opacity: 1 !important; transform: scale(1.25); }
        .halo { transition: opacity .2s, transform .2s; transform-origin: center; }
      `}</style>
    </section>
  );
}

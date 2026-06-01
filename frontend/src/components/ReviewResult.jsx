export default function ReviewResult({ review }) {
  const { matchScore, strengths, gaps, suggestions } = review.feedback;

  // Color changes based on score
  const scoreColor =
    matchScore >= 75 ? 'text-emerald-400' :
    matchScore >= 50 ? 'text-yellow-400' :
    'text-red-400';

  const ringColor =
    matchScore >= 75 ? 'stroke-emerald-400' :
    matchScore >= 50 ? 'stroke-yellow-400' :
    'stroke-red-400';

  // SVG circle math for the progress ring
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (matchScore / 100) * circumference;

  const Section = ({ title, items, color }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${color}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current ${color}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="mt-8 space-y-4 animate-fade-in">
      {/* Score card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-6">
        {/* Circular progress ring */}
        <div className="relative flex-shrink-0">
          <svg width="96" height="96" className="-rotate-90">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
            <circle
              cx="48" cy="48" r={radius}
              fill="none" strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              strokeLinecap="round"
              className={`${ringColor} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${scoreColor}`}>{matchScore}</span>
            <span className="text-xs text-white/40">/ 100</span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">
            {matchScore >= 75 ? '🎯 Strong Match' : matchScore >= 50 ? '⚡ Decent Match' : '⚠️ Needs Work'}
          </h2>
          <p className="text-sm text-white/50">
            {matchScore >= 75
              ? 'Your resume is well-aligned with this role.'
              : matchScore >= 50
              ? 'Some gaps exist — check suggestions below.'
              : 'Significant gaps found. Use suggestions to improve.'}
          </p>
        </div>
      </div>

      {/* Three sections side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Section title="✅ Strengths"   items={strengths}   color="text-emerald-400" />
        <Section title="❌ Gaps"         items={gaps}         color="text-red-400"     />
        <Section title="💡 Suggestions" items={suggestions} color="text-violet-400"  />
      </div>
    </div>
  );
}
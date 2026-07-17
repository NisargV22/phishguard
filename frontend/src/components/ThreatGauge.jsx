import React from 'react';
import { motion } from 'framer-motion';

const ThreatGauge = ({ score, size = 160, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - score * circumference;

  let color = 'stroke-emerald-400';
  if (score > 0.8) color = 'stroke-red-500';
  else if (score > 0.4) color = 'stroke-yellow-400';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Track */}
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-slate-800"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Ring */}
        <motion.circle
          className={`${color} drop-shadow-[0_0_10px_currentColor]`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Score Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white">{(score * 100).toFixed(0)}%</span>
        <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Threat</span>
      </div>
    </div>
  );
};

export default ThreatGauge;

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
}

const HealthScore: React.FC<HealthScoreProps> = ({ score, trend }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Health Score
        </h3>
        {getTrendIcon()}
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" aria-hidden="true">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score / 100) * 351.86} 351.86`}
                className={`bg-gradient-to-r ${getScoreBackground(score)}`}
                strokeLinecap="round"
                style={{
                  stroke: `url(#gradient-${score})`
                }}
              />
              <defs>
                <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'} />
                  <stop offset="100%" stopColor={score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthScore;
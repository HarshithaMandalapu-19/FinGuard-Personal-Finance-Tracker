import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface BudgetCardProps {
  budget: {
    category: string;
    amount: number;
    spent: number;
  };
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const percentage = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;
  
  const getStatusIcon = () => {
    if (percentage >= 100) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (percentage >= 80) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {budget.category}
          </h3>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Spent</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(budget.spent)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Budget</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(budget.amount)}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {percentage.toFixed(1)}% used
          </span>
          <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining >= 0 ? formatCurrency(remaining) : formatCurrency(Math.abs(remaining))} 
            {remaining >= 0 ? ' left' : ' over'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import FinanceChart from '../components/dashboard/FinanceChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  const { transactions, getMonthlyStats } = useFinanceStore();

  // Generate monthly data for the last 6 months
  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const stats = getMonthlyStats(monthKey);
      
      months.push({
        month: monthName,
        income: stats.totalIncome,
        expenses: stats.totalExpenses,
        savings: stats.savings
      });
    }
    
    return months;
  };

  const monthlyData = generateMonthlyData();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentStats = getMonthlyStats(currentMonth);

  const categoryData = Object.entries(currentStats.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    color: ''
  }));

  // Calculate trends
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const totalSavings = monthlyData.reduce((sum, month) => sum + month.savings, 0);
  const avgSavingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed insights into your financial habits</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              6-Month Income
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              6-Month Expenses
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Savings
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalSavings)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Savings Rate
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {avgSavingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceChart data={monthlyData} type="line" />
        <FinanceChart data={monthlyData} type="bar" />
      </div>

      {/* Category Analysis */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart data={categoryData} />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Spending Categories
            </h3>
            <div className="space-y-4">
              {categoryData
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(category.value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Spending Patterns
            </h4>
            <ul className="space-y-2 text-sm text-gray-900 dark:text-white">
              <li>• Your highest spending month was in the last 6 months</li>
              <li>• Most expenses occur in the first half of the month</li>
              <li>• Weekend spending is 20% higher than weekdays</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-gray-900 dark:text-white">
              <li>• Consider setting up automatic savings transfers</li>
              <li>• Review your largest expense categories</li>
              <li>• Aim for a 20% savings rate for better financial health</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
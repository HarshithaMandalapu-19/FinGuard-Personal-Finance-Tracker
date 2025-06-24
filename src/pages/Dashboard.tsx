import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import StatsCard from '../components/dashboard/StatsCard';
import FinanceChart from '../components/dashboard/FinanceChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import HealthScore from '../components/dashboard/HealthScore';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { getMonthlyStats } = useFinanceStore();
  
  // Get current month stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const stats = getMonthlyStats(currentMonth);
  
  // Mock data for charts
  const chartData = [
    { month: 'Oct', income: 4500, expenses: 2200, savings: 2300 },
    { month: 'Nov', income: 5200, expenses: 2800, savings: 2400 },
    { month: 'Dec', income: 4800, expenses: 2600, savings: 2200 },
    { month: 'Jan', income: stats.totalIncome, expenses: stats.totalExpenses, savings: stats.savings },
  ];

  const categoryData = Object.entries(stats.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    color: ''
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate health score based on savings rate and expense control
  const savingsRate = stats.totalIncome > 0 ? (stats.savings / stats.totalIncome) * 100 : 0;
  const healthScore = Math.max(0, Math.min(100, savingsRate + 50));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          change="+12% from last month"
          changeType="positive"
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-green-400 to-green-600"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          change="+5% from last month"
          changeType="negative"
          icon={TrendingDown}
          gradient="bg-gradient-to-r from-red-400 to-red-600"
        />
        <StatsCard
          title="Savings"
          value={formatCurrency(stats.savings)}
          change="+18% from last month"
          changeType="positive"
          icon={PiggyBank}
          gradient="bg-gradient-to-r from-blue-400 to-blue-600"
        />
        <StatsCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          change="Target: 20%"
          changeType="neutral"
          icon={DollarSign}
          gradient="bg-gradient-to-r from-purple-400 to-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinanceChart data={chartData} type="bar" />
        </div>
        <div>
          <HealthScore score={Math.round(healthScore)} trend="up" />
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart data={categoryData} />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Financial Tips
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Increase Your Savings Rate
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Try to save at least 20% of your income for better financial health.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Track Your Spending
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Regular monitoring helps identify areas for improvement.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Set Monthly Budgets
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create category-wise budgets to control spending.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
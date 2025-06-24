import React, { useState } from 'react';
import TransactionList from '../components/transactions/TransactionList';
import AddTransactionForm from '../components/transactions/AddTransactionForm';
import { Plus } from 'lucide-react';

const Transactions: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <TransactionList />

      {showAddForm && (
        <AddTransactionForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default Transactions;
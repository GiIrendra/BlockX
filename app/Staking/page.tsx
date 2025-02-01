"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const StakingInterface = () => {
  const [amount, setAmount] = useState("");
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakingHistory, setStakingHistory] = useState<
    { date: string; amount: number; status: string }[]
  >([]);

  const handleStake = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newStake = {
      date: new Date().toLocaleString(),
      amount: Number(amount),
      status: "Staked",
    };

    // Update staked balance
    setStakedBalance((prev) => prev + Number(amount));

    // Add to staking history
    setStakingHistory((prev) => [newStake, ...prev]);

    // Reset input
    setAmount("");
  };

  const handleUnstake = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (Number(amount) > stakedBalance) {
      alert("You cannot unstake more than your staked balance.");
      return;
    }

    const newUnstake = {
      date: new Date().toLocaleString(),
      amount: Number(amount),
      status: "Unstaked",
    };

    // Update staked balance
    setStakedBalance((prev) => prev - Number(amount));

    // Add to staking history
    setStakingHistory((prev) => [newUnstake, ...prev]);

    // Reset input
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Staking Interface
        </h1>

        {/* Balance Display */}
        <div className="bg-blue-100 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-700">
            Staked Balance
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {stakedBalance.toFixed(2)} Tokens
          </p>
        </div>

        {/* Staking Form */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount to Stake/Unstake
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleStake}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Stake
            </button>
            <button
              onClick={handleUnstake}
              className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Unstake
            </button>
          </div>
        </div>

        {/* Staking History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Staking History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stakingHistory.map((entry, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-700">{entry.date}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {entry.amount.toFixed(2)} Tokens
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          entry.status === "Staked"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StakingInterface;
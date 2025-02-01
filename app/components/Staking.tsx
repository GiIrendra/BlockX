"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface StakingPageProps {
  isDarkMode: boolean;
}

const StakingPage = ({ isDarkMode }: StakingPageProps) => {
  const [amount, setAmount] = useState("");
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakingHistory, setStakingHistory] = useState<
    { date: string; amount: number; status: string; token: string }[]
  >([]);
  const [selectedToken, setSelectedToken] = useState("Token A");
  const monthlyInterestRate = 0.05; // 5% monthly interest

  const handleStake = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const newStake = {
      date: new Date().toLocaleString(),
      amount: Number(amount),
      status: "Staked",
      token: selectedToken,
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
      token: selectedToken,
    };
    // Update staked balance
    setStakedBalance((prev) => prev - Number(amount));
    // Add to staking history
    setStakingHistory((prev) => [newUnstake, ...prev]);
    // Reset input
    setAmount("");
  };

  const calculateMonthlyEarnings = () => {
    return (stakedBalance * monthlyInterestRate).toFixed(2);
  };

  return (
    <div
      className={`min-h-[70vh] rounded-3xl shadow-custom w-full md:w-[69%] ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8"
      >
        {/* Title */}
        <h1
          className={`text-3xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-800"} mb-8`}
        >
          Stake with BlockX
        </h1>

        {/* Perks Section */}
        <div
          className={`p-6 rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center ${
            isDarkMode ? "bg-gray-800" : "bg-blue-100"
          }`}
        >
          <div>
            <h2
              className={`text-xl font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Benefits of Staking
            </h2>
            <ul className="mt-2">
              <li className="flex items-center">
                <span
                  className={`mr-2 text-green-500 ${isDarkMode ? "text-green-400" : ""}`}
                >
                  ✓
                </span>
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Earn up to 5% monthly interest
                </span>
              </li>
              <li className="flex items-center">
                <span
                  className={`mr-2 text-green-500 ${isDarkMode ? "text-green-400" : ""}`}
                >
                  ✓
                </span>
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Flexible staking and unstaking
                </span>
              </li>
              <li className="flex items-center">
                <span
                  className={`mr-2 text-green-500 ${isDarkMode ? "text-green-400" : ""}`}
                >
                  ✓
                </span>
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Choose from multiple tokens
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-4 md:mt-0">
            <p
              className={`text-lg font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            >
              Estimated Monthly Earnings:
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            >
              {calculateMonthlyEarnings()} Tokens
            </p>
          </div>
        </div>

        {/* Balance Display */}
        <div
          className={`p-6 rounded-lg mb-8 ${isDarkMode ? "bg-gray-800" : "bg-blue-100"}`}
        >
          <h2
            className={`text-xl font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Staked Balance
          </h2>
          <p
            className={`text-3xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            {stakedBalance.toFixed(2)} Tokens
          </p>
        </div>

        {/* Staking Form */}
        <div className="mb-8">
          <label
            className={`block text-sm font-bold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Amount to Stake/Unstake
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
            }`}
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

        {/* Token Selection */}
        <div className="mb-8">
          <label
            className={`block text-sm font-bold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Select Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
            }`}
          >
            <option value="Token A">Token A</option>
            <option value="Token B">Token B</option>
            <option value="Token C">Token C</option>
          </select>
        </div>

        {/* Staking History */}
        <div>
          <h2
            className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Staking History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
                >
                  <th
                    className={`px-4 py-2 text-left ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Date
                  </th>
                  <th
                    className={`px-4 py-2 text-left ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Amount
                  </th>
                  <th
                    className={`px-4 py-2 text-left ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Token
                  </th>
                  <th
                    className={`px-4 py-2 text-left ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stakingHistory.map((entry, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {entry.date}
                    </td>
                    <td
                      className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {entry.amount.toFixed(2)} Tokens
                    </td>
                    <td
                      className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {entry.token}
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

export default StakingPage;
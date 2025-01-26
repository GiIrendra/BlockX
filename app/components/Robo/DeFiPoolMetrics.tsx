"use client";
import React, { useState, useEffect, useCallback } from "react"; // Add useCallback
import { motion, AnimatePresence } from "framer-motion";

// Interface for the DeFi pool metrics data
interface DeFiPoolMetricsData {
  blockchain: string;
  pair_address: string;
  protocol: string;
  token0: string;
  token0_price: number | null;
  token0_reserve: number;
  token0_share: number;
  token0_tvl: number;
  token1: string;
  token1_price: number;
  token1_reserve: number;
  token1_share: number;
  token1_tvl: number;
  total_tvl: number;
  transactions_24hrs: number;
  transactions_24hrs_change: number;
  transactions_30d: number;
  transactions_30d_change: number;
  transactions_7d: number;
  transactions_7d_change: number;
  transactions_90d: number;
  transactions_90d_change: number;
  transactions_all: number;
  volume_24hrs: number;
  volume_24hrs_change: number | null;
  volume_30d: number;
  volume_30d_change: number | null;
  volume_7d: number;
  volume_7d_change: number | null;
  volume_90d: number;
  volume_90d_change: number | null;
  volume_all: number;
}

// Interface for the API response
interface ApiResponse {
  data: DeFiPoolMetricsData[];
  pagination: {
    has_next: boolean;
    limit: number;
    offset: number;
    total_items: number;
  };
}

const DeFiPoolMetrics = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [pairAddress, setPairAddress] = useState("0x002eceea7ed8a67bb6b75680f32e7be17d9415a7");
  const [metrics, setMetrics] = useState<DeFiPoolMetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetchDeFiPoolMetrics with useCallback
  const fetchDeFiPoolMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMetrics(null);

    try {
      const response = await fetch(
        `https://api.unleashnfts.com/api/v2/defi/pool/metrics?pair_address=${pairAddress}&offset=0&limit=30`,
        {
          method: "GET",
          headers: { accept: "application/json", "x-api-key": "f5437a86805317c7a27e24faa4e2c2be" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch DeFi pool metrics");
      }

      const data: ApiResponse = await response.json();
      if (data.data.length === 0) {
        throw new Error("No data found for the provided pair address");
      }

      setMetrics(data.data[0]);
    } catch (err) {
      setError(
        err instanceof Error
          ? "No data found. Please check the pair address and try again."
          : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [pairAddress]); // Add pairAddress as a dependency

  // Automatically fetch metrics when the component mounts or pairAddress changes
  useEffect(() => {
    fetchDeFiPoolMetrics();
  }, [fetchDeFiPoolMetrics]); // Add fetchDeFiPoolMetrics to the dependency array

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairAddress.trim()) {
      setError("Please enter a valid pair address.");
      return;
    }
    fetchDeFiPoolMetrics();
  };

  return (
    <motion.div
      className={`min-h-[80vh] w-[90%] md:w-[77%] mx-auto mt-8 mb-9 p-4 md:p-6 shadow-custom rounded-3xl ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 text-black"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={`text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        DeFi Pool Metrics
      </h1>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        className="mb-4 md:mb-6 flex flex-col md:flex-row justify-center items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Enter pair address..."
          value={pairAddress}
          onChange={(e) => setPairAddress(e.target.value)}
          className={`w-full max-w-md px-4 py-2 border rounded-md md:rounded-l-md focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500" : "border-gray-300 focus:ring-blue-500"}`}
        />
        <motion.button
          type="submit"
          className={`w-full md:w-auto px-4 py-2 rounded-md md:rounded-r-md transition-colors ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </motion.form>

      {/* Note for Sample Pair Address */}
      <motion.div
        className={`text-center text-wrap mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-sm md:text-base text-wrap">
          <span className="font-medium">Note:</span> Copy and try this:{" "}
          <span
            className={`cursor-pointer break-all underline text-wrap ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}
            onClick={() => setPairAddress("0x002eceea7ed8a67bb6b75680f32e7be17d9415a7")}
          >
            0x002eceea7ed8a67bb6b75680f32e7be17d9415a7
          </span>
        </p>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error/Warning State */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex flex-col items-center justify-center h-96"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className={`px-6 py-4 rounded-lg text-center ${isDarkMode ? "bg-yellow-800 border-yellow-700 text-yellow-200" : "bg-yellow-100 border-yellow-400 text-yellow-700"}`}>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Warning</h2>
              <p className="mb-4">{error}</p>
              <motion.button
                onClick={fetchDeFiPoolMetrics}
                className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Display */}
      <AnimatePresence>
        {metrics && (
          <motion.div
            className={`p-4 md:p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Metrics for Pair Address:{" "}
              <span className="break-all">
                {metrics.pair_address}
              </span>
            </h2>
            <div className="flex flex-wrap gap-4 overflow-x-hidden">
              {/* Token Metrics */}
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Token 0 Reserve</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  {metrics.token0_reserve.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-green-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Token 1 Reserve</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  {metrics.token1_reserve.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-red-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Total TVL</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  ${metrics.total_tvl.toFixed(2)}
                </p>
              </motion.div>

              {/* Transaction Metrics */}
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-purple-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>24h Transactions</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  {metrics.transactions_24hrs}
                </p>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-yellow-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>7d Transactions</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                  {metrics.transactions_7d}
                </p>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-pink-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>All-Time Transactions</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
                  {metrics.transactions_all}
                </p>
              </motion.div>

              {/* Volume Metrics */}
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-indigo-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>24h Volume</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                  ${metrics.volume_24hrs.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-teal-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>7d Volume</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
                  ${metrics.volume_7d.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-4 rounded-lg flex-1 min-w-[150px] max-w-[200px] ${isDarkMode ? "bg-gray-700" : "bg-orange-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>All-Time Volume</p>
                <p className={`text-xl font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
                  ${metrics.volume_all.toFixed(2)}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeFiPoolMetrics;
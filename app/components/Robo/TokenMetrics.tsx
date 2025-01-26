"use client";
import React, { useState } from "react"; // Removed useEffect
import { motion, AnimatePresence } from "framer-motion";

// Interface for the token metrics data
interface TokenMetricsData {
  "24hr_high": number;
  "24hr_high_change": number;
  "24hr_trading_volume": number;
  all_time_high: number;
  all_time_low: number;
  all_trading_volume: number;
  blockchain: string;
  chain_id: number;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number | null;
  holder_type_score: number;
  holders: number;
  holders_distribution_score: number | null;
  lp_participants_score: number;
  lp_size_score: number;
  lp_stability_score: number;
  market_cap: number | null;
  marketcap_lp_score: number;
  profitable_trade_score: number;
  token_address: string;
  token_age_score: number;
  token_holders_score: number;
  token_name: string;
  token_pair_score: number;
  token_score: number | null;
  token_symbol: string;
  total_supply: number;
  traders_score: number;
  trading_pattern_score: number;
  transactions_score: number;
  volume_liquidity_score: number;
  volume_score: number;
}

// Interface for the API response
interface ApiResponse {
  data: TokenMetricsData[];
  pagination: {
    has_next: boolean;
    limit: number;
    offset: number;
    total_items: number;
  };
}

const TokenMetrics = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [tokenAddress, setTokenAddress] = useState(""); // Empty by default
  const [metrics, setMetrics] = useState<TokenMetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenMetrics = async () => {
    setLoading(true);
    setError(null);
    setMetrics(null);

    try {
      const response = await fetch(
        `https://api.unleashnfts.com/api/v2/token/metrics?token_address=${tokenAddress}&offset=0&limit=30`,
        {
          method: "GET",
          headers: { accept: "application/json", "x-api-key": "f5437a86805317c7a27e24faa4e2c2be" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch token metrics");
      }

      const data: ApiResponse = await response.json();
      if (data.data.length === 0) {
        throw new Error("No data found for the provided token address");
      }

      setMetrics(data.data[0]);
    } catch (err) {
      setError(
        err instanceof Error
          ? "No data found. Please check the token address and try again."
          : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) {
      setError("Please enter a valid token address.");
      return;
    }
    fetchTokenMetrics();
  };

  return (
    <motion.div
      className={`min-h-auto w-[77%] mt-8 mb-9 p-5xl rounded-3xl shadow-cust md:p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 text-black"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={`text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Token Metrics
      </h1>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        className="mb-6 md:mb-8 flex flex-col md:flex-row justify-center items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Enter token address..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
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

      {/* Prompt Message */}
      {!tokenAddress && !loading && !metrics && !error && (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className={`text-lg md:text-xl font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Enter your token address to analyze metrics.
          </p>
        </motion.div>
      )}

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
                onClick={fetchTokenMetrics}
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
      <motion.div
        className={`p-4 md:p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {metrics ? `Metrics for ${metrics.token_name} (${metrics.token_symbol})` : "Token Metrics"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Price Metrics */}
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Current Price</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              {metrics ? `$${metrics.current_price}` : "N/A"}
            </p>
          </motion.div>
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-green-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>24h High</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
              {metrics ? `$${metrics["24hr_high"]}` : "N/A"}
            </p>
          </motion.div>
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-red-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>24h Trading Volume</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
              {metrics ? `$${metrics["24hr_trading_volume"]}` : "N/A"}
            </p>
          </motion.div>

          {/* Market Cap and Supply */}
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-purple-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Market Cap</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
              {metrics ? (metrics.market_cap ? `$${metrics.market_cap}` : "N/A") : "N/A"}
            </p>
          </motion.div>
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-yellow-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Circulating Supply</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
              {metrics ? metrics.circulating_supply : "N/A"}
            </p>
          </motion.div>
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-pink-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Total Supply</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>
              {metrics ? metrics.total_supply : "N/A"}
            </p>
          </motion.div>

          {/* Holder Metrics */}
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-indigo-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Holders</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              {metrics ? metrics.holders : "N/A"}
            </p>
          </motion.div>
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-teal-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Token Age Score</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
              {metrics ? metrics.token_age_score : "N/A"}
            </p>
          </motion.div>
          <motion.div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-orange-50"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Traders Score</p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>
              {metrics ? metrics.traders_score : "N/A"}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TokenMetrics;
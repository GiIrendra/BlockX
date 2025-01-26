"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Interface for the token price prediction data
interface TokenPricePredictionData {
  block_date: string;
  data_type: string;
  open: number;
  prediction: number;
  prediction_lb: number;
  prediction_ub: number;
  token: string;
  token_address: string;
  token_symbol: string;
}

// Interface for the API response
interface ApiResponse {
  data: TokenPricePredictionData[];
  pagination: {
    has_next: boolean;
    limit: number;
    offset: number;
    total_items: number;
  };
}

const TokenPricePrediction = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [tokenAddress, setTokenAddress] = useState("0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"); // Default token address (AAVE)
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "f5437a86805317c7a27e24faa4e2c2be"; // Use environment variable for API key

  const isValidTokenAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Wrap fetchData in useCallback to memoize it
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `https://api.unleashnfts.com/api/v2/token/price_prediction?token_address=${tokenAddress}&offset=0&limit=30`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [tokenAddress, apiKey]); // Add dependencies here

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTokenAddress(tokenAddress)) {
      setError("Invalid token address. Please enter a valid Ethereum address.");
      return;
    }
    fetchData();
  };

  // Fetch data on initial render and when fetchData changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <motion.div
      className={`min-h-screen mt-8 mb-9 p-4 shadow-custom rounded-3xl md:p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 text-black"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={`text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Token Price Predictions
      </h1>
      <p className={`text-sm md:text-lg text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        View historical price insights.
      </p>

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

      {/* Error Message */}
      {error && (
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={`text-red-500 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>{error}</p>
        </motion.div>
      )}

      {/* Data Display */}
      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </motion.div>
      ) : error ? (
        <motion.div
          className="flex flex-col items-center justify-center h-96"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="text-center">
            <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Error
            </h2>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
          </div>
        </motion.div>
      ) : !data || !Array.isArray(data.data) || data.data.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center h-96"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="text-center">
            <h2 className={`text-xl md:text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              No Data Found
            </h2>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              We couldn&apos;t find any predictions for the provided token address.
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTokenAddress("0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9")}
                className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              >
                Try AAVE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTokenAddress("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")}
                className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                Try UNI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTokenAddress("0x0d8775f648430679a709e98d2b0cb6250d2887ef")}
                className={`px-4 py-2 rounded-md transition-colors ${isDarkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"}`}
              >
                Try BAT
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          {/* Latest Prediction Information */}
          <motion.div
            className={`p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h2 className={`text-lg md:text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Latest Prediction for {data.data[0].token} ({data.data[0].token_symbol})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              <motion.div
                className={`p-3 md:p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Open Price</p>
                <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  ${data.data[0].open.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-3 md:p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-green-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Predicted Price</p>
                <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  ${data.data[0].prediction.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-3 md:p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-red-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Confidence Interval (Lower)</p>
                <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  ${data.data[0].prediction_lb.toFixed(2)}
                </p>
              </motion.div>
              <motion.div
                className={`p-3 md:p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-purple-50"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Confidence Interval (Upper)</p>
                <p className={`text-xl md:text-2xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                  ${data.data[0].prediction_ub.toFixed(2)}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            className={`p-4 md:p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h2 className={`text-lg md:text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Price Predictions Over Time
            </h2>
            <div className="w-full h-64 md:h-96">
              <Line
                data={{
                  labels: data.data.map((prediction) =>
                    new Date(prediction.block_date).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: "Open Price",
                      data: data.data.map((prediction) => prediction.open),
                      borderColor: isDarkMode ? "rgba(75, 192, 192, 0.8)" : "rgba(75, 192, 192, 1)",
                      fill: false,
                    },
                    {
                      label: "Predicted Price",
                      data: data.data.map((prediction) => prediction.prediction),
                      borderColor: isDarkMode ? "rgba(54, 162, 235, 0.8)" : "rgba(54, 162, 235, 1)",
                      fill: false,
                    },
                    {
                      label: "Confidence Interval (Lower Bound)",
                      data: data.data.map((prediction) => prediction.prediction_lb),
                      borderColor: isDarkMode ? "rgba(255, 99, 132, 0.8)" : "rgba(255, 99, 132, 1)",
                      borderDash: [5, 5],
                      fill: false,
                    },
                    {
                      label: "Confidence Interval (Upper Bound)",
                      data: data.data.map((prediction) => prediction.prediction_ub),
                      borderColor: isDarkMode ? "rgba(255, 99, 132, 0.8)" : "rgba(255, 99, 132, 1)",
                      borderDash: [5, 5],
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: isDarkMode ? "white" : "black",
                      },
                    },
                    tooltip: {
                      enabled: true,
                      mode: "index",
                      intersect: false,
                    },
                  },
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: "Price (USD)",
                        color: isDarkMode ? "white" : "black",
                      },
                      grid: {
                        color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                      },
                      ticks: {
                        color: isDarkMode ? "white" : "black",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                        color: isDarkMode ? "white" : "black",
                      },
                      grid: {
                        color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                      },
                      ticks: {
                        color: isDarkMode ? "white" : "black",
                      },
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TokenPricePrediction;
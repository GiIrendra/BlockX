"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define TypeScript interfaces for the API response
interface MarketData {
  block_dates: string[];
  blockchain: string;
  chain_id: number;
  price_celling_trend: number[];
  sales: number;
  sales_change: number;
  sales_trend: number[];
  transactions: number;
  transactions_change: number;
  transactions_trend: number[];
  transfers: number;
  transfers_change: number;
  transfers_trend: number[];
  updated_at: string;
  volume: number;
  volume_change: number;
  volume_trend: number[];
}

interface ApiResponse {
  data: MarketData[];
  pagination: {
    has_next: boolean;
    limit: number;
    offset: number;
    total_items: number;
  };
}

const Dashboard = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>("ethereum"); // Default to Ethereum

  // List of supported blockchains (from the error message)
  const supportedBlockchains = [
    "ethereum",
    "binance",
    "polygon",
    "solana",
    "avalanche",
    "linea",
    "bitcoin",
    "unichain_sepolia",
    "full",
  ];

  // Fetch market data for the selected blockchain
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.unleashnfts.com/api/v2/nft/market-insights/analytics?blockchain=${selectedBlockchain}`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": "f5437a86805317c7a27e24faa4e2c2be", // Replace with your actual API key
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: ApiResponse = await response.json();
        setMarketData(data.data[0]); // Set the first item as marketData
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedBlockchain]); // Re-fetch data when selectedBlockchain changes

  // Format numbers for better readability
  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Chart data for trends
  const chartData = {
    labels: marketData?.block_dates || [],
    datasets: [
      {
        label: "Price Ceiling Trend",
        data: marketData?.price_celling_trend || [],
        borderColor: isDarkMode ? "rgba(255, 99, 132, 1)" : "rgba(255, 99, 132, 0.8)",
        fill: false,
      },
      {
        label: "Sales Trend",
        data: marketData?.sales_trend || [],
        borderColor: isDarkMode ? "rgba(54, 162, 235, 1)" : "rgba(54, 162, 235, 0.8)",
        fill: false,
      },
      {
        label: "Transactions Trend",
        data: marketData?.transactions_trend || [],
        borderColor: isDarkMode ? "rgba(75, 192, 192, 1)" : "rgba(75, 192, 192, 0.8)",
        fill: false,
      },
      {
        label: "Transfers Trend",
        data: marketData?.transfers_trend || [],
        borderColor: isDarkMode ? "rgba(153, 102, 255, 1)" : "rgba(153, 102, 255, 0.8)",
        fill: false,
      },
      {
        label: "Volume Trend",
        data: marketData?.volume_trend || [],
        borderColor: isDarkMode ? "rgba(255, 206, 86, 1)" : "rgba(255, 206, 86, 0.8)",
        fill: false,
      },
    ],
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <motion.div
      className={`min-h-[80vh] px-4 mt-8 pt-5 sm:px-6 md:px-16 py-12 rounded-3xl ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-black"} shadow-custom`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className={`text-2xl sm:text-3xl font-semibold mb-8 text-center ${isDarkMode ? "text-white" : "text-blue-900"}`}>
        NFT Market Insights
      </h2>

      {/* Blockchain Selector Dropdown */}
      <motion.div
        className="flex justify-center mb-8"
        variants={itemVariants}
      >
        <select
          value={selectedBlockchain}
          onChange={(e) => setSelectedBlockchain(e.target.value)}
          className={`p-2 rounded-md border ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {supportedBlockchains.map((blockchain) => (
            <option key={blockchain} value={blockchain}>
              {blockchain}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="flex justify-center items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.div
          className={`${isDarkMode ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"} border px-4 py-3 rounded relative mb-8`}
          role="alert"
          variants={itemVariants}
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </motion.div>
      )}

      {/* Metrics Grid */}
      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12"
          variants={containerVariants}
        >
          {[
            { label: "Blockchain", value: marketData?.blockchain || "N/A" },
            { label: "Sales", value: marketData ? formatNumber(marketData.sales) : "N/A" },
            { label: "Transactions", value: marketData ? formatNumber(marketData.transactions) : "N/A" },
            { label: "Transfers", value: marketData ? formatNumber(marketData.transfers) : "N/A" },
            { label: "Volume", value: marketData ? `$${formatNumber(marketData.volume)}` : "N/A" },
          ].map((metric, index) => (
            <motion.div
              key={index}
              className={`p-4 sm:p-6 rounded-lg shadow-md text-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              variants={itemVariants}
              whileHover="hover"
            >
              <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
              <p className="text-2xl font-bold">{metric.value}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Trends Chart */}
      {!loading && !error && (
        <motion.div
          className={`p-4 sm:p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          variants={itemVariants}
        >
          <h3 className={`text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            Trends Over Time
          </h3>
          <div className="w-full h-64 sm:h-96">
            <Line
              data={chartData}
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
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Value",
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
                      text: "Time",
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
      )}
    </motion.div>
  );
};

export default Dashboard;
"use client";
import React, { useState, useEffect } from "react";
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
import Spinner from "../spinner"; // Ensure this is correctly imported

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

// Define TypeScript interfaces
interface Prediction {
  date: string;
  predicted_price: number;
}

type ViewMode = "chart" | "table";

interface HomePageProps {
  isDarkMode: boolean;
}

export default function FinalPredict({ isDarkMode }: HomePageProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const response = await fetch("../../api/predict");
        if (!response.ok) throw new Error("Failed to fetch predictions");
        const data: Prediction[] = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  const chartData = {
    labels: predictions.map((prediction) => prediction.date),
    datasets: [
      {
        label: "Predicted Price",
        data: predictions.map((prediction) => prediction.predicted_price),
        borderColor: isDarkMode ? "rgba(75, 192, 192, 0.8)" : "rgba(75, 192, 192, 1)",
        backgroundColor: isDarkMode ? "rgba(75, 192, 192, 0.2)" : "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: isDarkMode ? "rgba(75, 192, 192, 0.8)" : "rgba(75, 192, 192, 1)",
        tension: 0.4, // Smooth line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const, // Explicitly type as "top"
        labels: {
          color: isDarkMode ? "white" : "black",
        },
      },
      title: {
        display: true,
        text: "Next 10 Days Predictions",
        font: {
          size: 18,
        },
        color: isDarkMode ? "white" : "black",
      },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
        backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "white" : "black",
        bodyColor: isDarkMode ? "white" : "black",
      },
    },
    scales: {
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
      y: {
        title: {
          display: true,
          text: "Predicted Price",
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
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "chart" ? "table" : "chart"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Loading spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 m-10 rounded w-[74%] shadow-cust ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">Next 10 Days Predictions</h1>
        <button
          onClick={toggleViewMode}
          className={`mb-4 px-4 py-2 rounded transition-colors ${
            isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Switch to {viewMode === "chart" ? "Table View" : "Chart View"}
        </button>

        {viewMode === "chart" ? (
          <div className="w-full h-[400px]">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse ${
                isDarkMode ? "border-gray-700" : "border-gray-300"
              }`}>
                <thead>
                  <tr className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
                    <th className={`p-2 border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}>Date</th>
                    <th className={`p-2 border ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}>Predicted Price</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((prediction, index) => (
                    <tr
                      key={index}
                      className={`hover:${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <td className={`p-2 border ${
                        isDarkMode ? "border-gray-700" : "border-gray-300"
                      }`}>
                        {prediction.date}
                      </td>
                      <td className={`p-2 border ${
                        isDarkMode ? "border-gray-700" : "border-gray-300"
                      }`}>
                        {prediction.predicted_price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
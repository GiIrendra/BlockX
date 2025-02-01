import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type PredictionData = {
  date: string;
  openPrice: number;
  predictedPrice: number;
  confidenceLower: number;
  confidenceUpper: number;
};

interface GraphProps {
  data: PredictionData[];
}

const PredictionGraph: React.FC<GraphProps> = ({ data }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-white text-lg font-semibold mb-4">
        Price Predictions Over Time
      </h2>
      <LineChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#ffffff" />
        <YAxis stroke="#ffffff" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="openPrice" stroke="#00e4d0" />
        <Line type="monotone" dataKey="predictedPrice" stroke="#007bff" />
        <Line
          type="monotone"
          dataKey="confidenceLower"
          stroke="#ff6363"
          strokeDasharray="5 5"
        />
        <Line
          type="monotone"
          dataKey="confidenceUpper"
          stroke="#c77dff"
          strokeDasharray="5 5"
        />
      </LineChart>
    </div>
  );
};

export default PredictionGraph;

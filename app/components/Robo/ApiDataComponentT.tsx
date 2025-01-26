// ApiDataComponent.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ApiResponse } from "@/app/components/Robo/types";

interface ApiDataComponentProps {
  apiUrl: string;
  apiKey: string;
  render: (data: ApiResponse | null, loading: boolean, error: string | null) => React.ReactNode;
}

const ApiDataComponent = ({ apiUrl, apiKey, render }: ApiDataComponentProps) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err); // Use the `err` variable
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, apiKey]);

  return <>{render(data, loading, error)}</>;
};

export default ApiDataComponent;
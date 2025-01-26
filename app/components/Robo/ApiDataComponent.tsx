"use client";
import { useEffect, useState } from "react";

// Define an interface for the API response data
interface ApiResponse {
  // Define the structure of your API response here
  // Example:
  data: unknown; // Replace `unknown` with the actual structure of your API response
  pagination?: {
    has_next: boolean;
    limit: number;
    offset: number;
    total_items: number;
  };
}

interface ApiDataComponentProps {
  apiUrl: string;
  apiKey: string;
  onLoadingChange?: (loading: boolean) => void; // Callback for loading state
  render: (data: ApiResponse | null, loading: boolean, error: string | null) => JSX.Element;
}

const ApiDataComponent = ({ apiUrl, apiKey, onLoadingChange, render }: ApiDataComponentProps) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Abort controller to cancel the fetch request if the component unmounts
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        if (onLoadingChange) onLoadingChange(true); // Notify parent about loading state

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
          signal: abortController.signal, // Pass the abort signal
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();
        setData(result);
      } catch (err) {
        // Type-check the error
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
        if (onLoadingChange) onLoadingChange(false); // Notify parent about loading state
      }
    };

    fetchData();

    // Cleanup function to abort the fetch request if the component unmounts
    return () => {
      abortController.abort();
    };
  }, [apiUrl, apiKey, onLoadingChange]); // Dependencies

  return render(data, loading, error);
};

export default ApiDataComponent;
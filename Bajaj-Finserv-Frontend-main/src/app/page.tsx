"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Define the structure of the API response
interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
}

interface FilterOption {
  value: string;
  label: string;
}

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>('{"data":["M","1","334","4","B"]}');
  const [filteredResponse, setFilteredResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string>("");

  const options: FilterOption[] = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const dataArray = parsedData.data;
      if (!Array.isArray(dataArray)) throw new Error("Invalid data format");

      const response = await fetch("https://bajaj-finserv-backend-r8qm.onrender.com/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dataArray,
          full_name: "shivam_kumar_choudhary",
          dob: "05072003",
          email: "choudharyshiv420@gmail.com",
          roll_number: "2237013",
        }),
      });

      const result: ApiResponse = await response.json();
      setFilteredResponse(result);
      setError("");
    } catch {
      setError("Invalid JSON input");
      setFilteredResponse(null);
    }
  };

  const renderFilteredResponse = () => {
    if (!filteredResponse) return null;

    const { is_success, user_id, email, roll_number, numbers, alphabets, highest_alphabet } = filteredResponse;

    const fullResponse: Partial<ApiResponse> = {
      is_success,
      user_id,
      email,
      roll_number,
      numbers: selectedFilters.some((filter) => filter.value === "numbers") ? numbers : undefined,
      alphabets: selectedFilters.some((filter) => filter.value === "alphabets") ? alphabets : undefined,
      highest_alphabet: selectedFilters.some((filter) => filter.value === "highest_alphabet") ? highest_alphabet : undefined,
    };

    // Remove undefined fields from the response
    const filteredFinalResponse = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(fullResponse).filter(([_, value]) => value !== undefined)
    );

    return (
      <div className="border p-3 rounded mt-2">
        <h2 className="text-md font-bold">Filtered Response</h2>
        <pre className="text-sm">{JSON.stringify(filteredFinalResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">API Input</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows={3}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded mb-4"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <h2 className="text-lg font-semibold">Multi Filter</h2>
      <Select
        isMulti
        options={options}
        onChange={(selected) => setSelectedFilters(selected as FilterOption[])}
        className="mb-4"
      />

      {error && <p className="text-red-500">{error}</p>}
      {filteredResponse && renderFilteredResponse()}
    </div>
  );
}

"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const GpaTrendChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      
      {/* header */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-900">GPA Trend</h3>
        <p className="text-xs text-gray-400">সময়ের সাথে ফলাফলের পরিবর্তন</p>
      </div>

      {/* chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />

            <YAxis
              domain={[0, 5]}
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="gpa"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GpaTrendChart;
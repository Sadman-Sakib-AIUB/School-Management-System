import React from 'react';
import { demoData } from '../../data/mockData';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7"];

const ClassGenderPieChart = () => {

  const genderOnlyPieData = [
    {
      name: "ছাত্র",
      value: demoData.reduce((s, d) => s + d.male, 0),
    },
    {
      name: "ছাত্রী",
      value: demoData.reduce((s, d) => s + d.female, 0),
    },
  ];


  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 h-[380px]">
      <h4 className="text-xl font-black text-slate-800 mb-4">
        ক্লাসভিত্তিক ছাত্র / ছাত্রী
      </h4>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genderOnlyPieData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
          >
            <Cell fill="#059669" />
            <Cell fill="#34d399" />
          </Pie>

          <Tooltip
            formatter={(value, _, { payload }) => [
              `${value} জন`,
              `${payload.name} `,
            ]}
            contentStyle={{
              borderRadius: "1rem",
              border: "none",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassGenderPieChart;
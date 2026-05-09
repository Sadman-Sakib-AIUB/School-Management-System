import React from 'react';
import { 
  Users, GraduationCap, Briefcase, Activity, 
  TrendingUp, Download, Calendar, MoreHorizontal 
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

const ReportPage = () => {
  // Demo Data (In future, map this with Redux/Axios)
  const stats = [
    { label: "Total Students", value: "1,240", change: "+2.5%", icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Teachers", value: "82", change: "+0.4%", icon: GraduationCap, color: "bg-purple-50 text-purple-600" },
    { label: "Total Staffs", value: "45", change: "+1.2%", icon: Briefcase, color: "bg-orange-50 text-orange-600" },
    { label: "Avg. Attendance", value: "94.2%", change: "+0.8%", icon: Activity, color: "bg-emerald-50 text-emerald-600" },
  ];

  const attendanceData = [
    { name: 'Jan', students: 95, teachers: 98, staff: 90 },
    { name: 'Feb', students: 92, teachers: 97, staff: 92 },
    { name: 'Mar', students: 88, teachers: 95, staff: 89 },
    { name: 'Apr', students: 94, teachers: 99, staff: 95 },
    { name: 'May', students: 91, teachers: 96, staff: 93 },
  ];

  const passRateData = [
    { class: 'Class 6', rate: 85 },
    { class: 'Class 7', rate: 78 },
    { class: 'Class 8', rate: 92 },
    { class: 'Class 9', rate: 88 },
    { class: 'Class 10', rate: 95 },
  ];

  const distributionData = [
    { name: 'Students', value: 1200, color: '#3b82f6' },
    { name: 'Teachers', value: 80, color: '#8b5cf6' },
    { name: 'Staffs', value: 45, color: '#f59e0b' },
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Principal Reports</h1>
          <p className="text-sm text-slate-500">Overview of school performance and metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={16} /> Filter Date
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-sm font-medium text-white hover:bg-slate-800 transition-all shadow-sm">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      {/* 2. Stats Cards (Using Your Design Pattern) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Trend Line Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Attendance Trend (%)</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20}/></button>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}} />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
                <Line type="monotone" dataKey="teachers" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">User Distribution</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass Rate Bar Chart */}
        <div className="lg:col-span-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Pass Rate by Class</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passRateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px'}} />
                <Bar dataKey="rate" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportPage;
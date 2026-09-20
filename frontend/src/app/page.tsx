"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Activity, Cpu, HardDrive, Wifi, Database, CheckCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "schema">("dashboard");

  const timeLabels = ["12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30"];
  
  const telemetryData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: [25.4, 25.8, 26.1, 26.5, 26.2, 25.9, 26.4],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Humidity (%)",
        data: [55.0, 56.2, 57.1, 58.2, 57.8, 56.9, 57.5],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-7xl mx-auto border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              IoT Telemetry & Observability Engine
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            PostgreSQL Time-Series Pipeline & Microcontroller Health Monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> ESP32 Active
          </span>
          <a
            href="https://github.com/Vishnusree080905/iot-telemetry-portfolio"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            GitHub Repository
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Node Status</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">ESP32_Node_Lab_01</div>
            <div className="text-xs text-slate-500 mt-1">FW v1.4.2 | ESP32-D0WDQ6</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Wi-Fi Signal Strength</span>
              <Wifi className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">-62 dBm</div>
            <div className="text-xs text-emerald-400 mt-1">Good Connection</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Free Heap Memory</span>
              <HardDrive className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">184,320 Bytes</div>
            <div className="text-xs text-slate-500 mt-1">Optimal SRAM Allocation</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Database Engine</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">PostgreSQL 16</div>
            <div className="text-xs text-indigo-400 mt-1">Range Partitioning Active</div>
          </div>
        </div>

        <div className="flex border-b border-slate-800 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "dashboard"
                ? "border-b-2 border-emerald-400 text-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Live Telemetry Charts
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === "schema"
                ? "border-b-2 border-emerald-400 text-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Relational Schema Architecture
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Real-Time Sensor Streams</h2>
            <div className="h-72">
              <Line data={telemetryData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        )}

        {activeTab === "schema" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{`-- Time-Series Telemetry Table Partitioning
CREATE TABLE sensor_readings (
    reading_id BIGSERIAL,
    sensor_id INT NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
    reading_value DECIMAL(10, 4) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reading_id, recorded_at)
) PARTITION BY RANGE (recorded_at);`}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
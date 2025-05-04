import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartOptions,
  } from "chart.js";
  import { Doughnut, Bar } from "react-chartjs-2";
  import { Summary } from "../types";
  
  ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  interface Props {
    summary: Summary[];
  }
  
  export default function StatusChart({ summary }: Props) {
    if (!summary || summary.length === 0) {
      return <p className="text-center text-gray-500">No data available.</p>;
    }
  
    const labels = summary.map((s) => s.status.toUpperCase());
    const data = summary.map((s) => s.count);
    const backgroundColor = summary.map((s) => {
      const status = s.status.toUpperCase();
      if (status === "SUCCESS") return "#10B981"; // emerald
      if (status === "FAILED") return "#EF4444"; // red
      return "#6B7280"; // gray
    });
  
    const chartData = {
      labels,
      datasets: [
        {
          label: "Request Count",
          data,
          backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  
    const doughnutOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
    };
  
    const barOptions: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    };
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Request Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-80">
            <Doughnut data={chartData} options={doughnutOptions} />
          </div>
          <div className="relative h-80">
            <Bar data={chartData} options={barOptions} />
          </div>
        </div>
      </div>
    );
  }
  
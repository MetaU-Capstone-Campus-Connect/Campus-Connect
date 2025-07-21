import "../Home/css/MapClickModal.css";
import { useEffect } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ counts }) => {
  useEffect(() => {
    const barChart = document.getElementById("dayBarChart");
    const dayLabels = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (Chart.getChart(barChart)) {
      Chart.getChart(barChart).destroy();
    }

    new Chart(barChart, {
      type: "bar",
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: "Past User's",
            data: counts,
            backgroundColor: "#3148F6",
            borderColor: "#1C4B8F",
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
      },
    });
  }, [counts]);

  return null;
};

export default BarChart;
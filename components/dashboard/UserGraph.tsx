import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useDashboard } from "@libs/useDashboard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Box from "@components/base/Box";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

export const attendeeData = {
  labels: ["Registered", "Attended", "Invited"],
  datasets: [
    {
      data: [10, 12, 19],
      backgroundColor: [
        "rgba(255, 99, 132)",
        "rgba(54, 162, 235)",
        "rgba(75, 192, 192)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function UserGraph() {
  const { users, usersLoading } = useDashboard();

  return (
    <Box className="">
      <Box
      // color="foregroundColour"
      // className="px-6 py-8 flex md:block lg:col-span-2 h-full md:h-96 "
      >
        {/* <Box className="text-white text-md ">Attendee Information</Box> */}

        <Doughnut
          options={options as any}
          data={attendeeData}
          height={350}
          width={350}
          className="mx-auto"
        />
      </Box>
    </Box>
  );
}

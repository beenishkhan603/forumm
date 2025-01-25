import React from "react";
import { FaUsers, FaUserCheck, FaUser } from "react-icons/fa";
import { MdOutlineEventAvailable } from "react-icons/md";
import { motion } from "framer-motion";
import Box from "@components/base/Box";
import { useDashboard } from "@libs/useDashboard";

interface ActivitytabProps {
  title: string;
  image: React.ReactNode;
  amount: any | undefined;
}

const Activitytab = ({
  title,
  image,
  amount,
}: ActivitytabProps): JSX.Element => {
  return (
    <Box color="foregroundColour" className="py-10 px-4 flex w-full rounded">
      <Box className=" w-1/4 flex justify-center">
        <Box className="bg-midnight-dark p-2 flex justify-center items-center  rounded">
          {image}
        </Box>
      </Box>
      <Box className="w-3/4 text-right flex flex-col px-8 justify-between">
        <Box className="text-sm">{title}</Box>
        {amount?.length === 0 ? <Box>0</Box> : <Box>{amount}</Box>}
      </Box>
    </Box>
  );
};

export function EventDashboardTabs() {
  const { attendee, registeredUsers } = useDashboard();
  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Activitytab
          title="Attendees Invited"
          image={<FaUsers className="text-4xl text-forumm-active" />}
          amount={attendee?.length}
        />
        <Activitytab
          title="Attendees Registered"
          image={<FaUserCheck className="text-4xl text-forumm-blue" />}
          amount={registeredUsers?.length}
        />
        <Activitytab
          title="Attendees Active"
          image={<FaUser className="text-4xl text-forumm-red" />}
          amount={0}
        />
      </motion.div>
    </>
  );
}

export function OrganizerDashboardTabs({
  selectedOption,
}: {
  selectedOption: string | undefined;
}) {
  const {
    events,
    eventsByYear,
    eventsByMonth,
    users,
    usersByYear,
    usersByMonth,
    attendee,
    attendees,
    attendeesByYear,
    attendeesByMonth,
    registeredUsers,
    registeredUsersByYear,
    registeredUsersByMonth,
  } = useDashboard();
  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Activitytab
          title="Attendees Invited"
          image={<FaUsers className="text-4xl text-forumm-active" />}
          amount={
            selectedOption === "All Time Information"
              ? attendees?.length
              : selectedOption === "Current Year"
              ? attendeesByYear?.length
              : selectedOption === "Current Month"
              ? attendeesByMonth?.length
              : 0
          }
        />
        <Activitytab
          title="Attendees Registered"
          image={<FaUserCheck className="text-4xl text-forumm-blue" />}
          amount={
            selectedOption === "All Time Information"
              ? registeredUsers?.length
              : selectedOption === "Current Year"
              ? registeredUsersByYear?.length
              : selectedOption === "Current Month"
              ? registeredUsersByMonth?.length
              : 0
          }
        />
        <Activitytab
          title="Registered Users"
          image={<FaUser className="text-4xl text-forumm-red" />}
          amount={
            selectedOption === "All Time Information"
              ? users?.length
              : selectedOption === "Current Year"
              ? usersByYear?.length
              : selectedOption === "Current Month"
              ? usersByMonth?.length
              : 0
          }
        />
        <Activitytab
          title="Total Events"
          image={
            <MdOutlineEventAvailable className="text-4xl text-forumm-yellow" />
          }
          amount={
            selectedOption === "All Time Information"
              ? events?.length
              : selectedOption === "Current Year"
              ? eventsByYear?.length
              : selectedOption === "Current Month"
              ? eventsByMonth?.length
              : 0
          }
        />
      </motion.div>
    </>
  );
}

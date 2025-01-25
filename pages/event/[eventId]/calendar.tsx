import AnimatedView from "@components/event/AnimatedView";
import Box from "@components/base/Box";
import LiveEventLayout from "@layouts/LiveEventLayout";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
export default function CalendarView() {
  const localizer = momentLocalizer(moment);
  return (
    <AnimatedView className="p-8 flex flex-col">
      <Box className="text-white text-2xl">Calendar</Box>
      <Box className="flex-1 bg-white">
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
        />
      </Box>
    </AnimatedView>
  );
}

CalendarView.Layout = LiveEventLayout;

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

import Header from "../../components/Header";
import { SlCalender } from "react-icons/sl";
import { PiTimerFill } from "react-icons/pi";

const Calender = () => {
  const [events, setEvents] = useState([
    {
      title: "AI Project Submission",
      start: new Date(2025, 7, 30, 9, 0),
      end: new Date(2025, 7, 30, 23, 59),
    },
    {
      title: "Database Assignment",
      start: new Date(2025, 8, 5, 12, 0),
      end: new Date(2025, 8, 7, 23, 59),
    },
  ]);
  return (
    <div className=" min-h-screen overflow-auto lg:ml-[17%] lg:w-[83%]">
      <Header title="Calender" icon1={<PiTimerFill />} icon2={<SlCalender />} />

      <div className="max-[767px]:mt-28 px-3 h-screen md:mt-36 lg:px-0 lg:pr-2 lg:mt-23">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
};

export default Calender;

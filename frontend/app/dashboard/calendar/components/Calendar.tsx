"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Event } from "@/app/lib/api/events";

interface CalendarProps {
  events: Event[];
  onDateClick: (startStr: string, allDay: boolean) => void;
  onEventClick: (eventId: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onDateClick, onEventClick }) => {
  // Map backend Event interface to FullCalendar's EventInput
  const calendarEvents = events.map((event) => ({
    id: event.id.toString(),
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    extendedProps: {
      description: event.description,
      location: event.location,
    },
  }));

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl overflow-hidden calendar-container">
      {/* Global overrides for FullCalendar dark theme */}
      <style jsx global>{`
        .fc-theme-standard .fc-scrollgrid { border-color: rgba(255, 255, 255, 0.1); }
        .fc-theme-standard td, .fc-theme-standard th { border-color: rgba(255, 255, 255, 0.1); }
        .fc .fc-toolbar-title { color: white; font-size: 1.5rem; font-weight: 600; }
        .fc .fc-button-primary { background-color: #10b981 !important; border-color: #10b981 !important; text-transform: capitalize; }
        .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #059669 !important; border-color: #059669 !important; }
        .fc .fc-daygrid-day-number { color: #d1d5db; }
        .fc .fc-col-header-cell-cushion { color: #9ca3af; }
        .fc-event { background-color: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.5); color: #60a5fa !important; padding: 2px 4px; border-radius: 4px; cursor: pointer; }
        .fc-timegrid-slot-label-cushion { color: #9ca3af; }
        .fc .fc-timegrid-axis-cushion, .fc .fc-timegrid-slot-label-cushion { color: #9ca3af; }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        dateClick={(info) => onDateClick(info.dateStr, info.allDay)}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          onEventClick(parseInt(info.event.id, 10));
        }}
        height="75vh"
        selectable={true}
        dayMaxEvents={true}
      />
    </div>
  );
};
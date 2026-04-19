"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Event } from "@/app/lib/api/events";

interface CalendarProps {
  events: Event[];
  onDateClick: (startStr: string, allDay: boolean) => void;
  onEventClick: (eventId: number) => void;
}

const getContrastingColor = (hexcolor: string) => {
  // If no color, return white/soft blue default
  if (!hexcolor) return "#ffffff";
  
  // Remove the hash
  const hex = hexcolor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
};

export const Calendar: React.FC<CalendarProps> = ({ events, onDateClick, onEventClick }) => {
  // Map backend Event interface to FullCalendar's EventInput
  const calendarEvents = events.map((event) => ({
    id: event.id.toString(),
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    backgroundColor: `${event.color || "#3b82f6"}33`, // 20% opacity for bg
    borderColor: event.color || "#3b82f6",
    textColor: event.color || "#3b82f6",
    extendedProps: {
      description: event.description,
      location: event.location,
      tags: event.tags,
      originalColor: event.color || "#3b82f6"
    },
  }));

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { tags } = event.extendedProps;
    const color = event.borderColor;
    const isMultiDay = event.end && (new Date(event.end).getDate() !== new Date(event.start).getDate());

    return (
      <div className={`p-1.5 h-full w-full rounded-md flex flex-col gap-1 overflow-hidden transition-all hover:brightness-110 relative group`}
           style={{ 
             borderLeft: `4px solid ${color}`,
             backgroundColor: event.backgroundColor,
           }}>
        <div className="flex justify-between items-start gap-1">
          <div className="font-bold text-[11px] truncate uppercase tracking-tight" style={{ color }}>
            {event.title}
          </div>
          {isMultiDay && (
             <div className="text-[9px] px-1 bg-white/10 rounded uppercase font-mono italic opacity-60">
               Cont.
             </div>
          )}
        </div>

        {tags && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.split(",").map((tag: string, index: number) => (
              <span 
                key={index} 
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/5 font-medium whitespace-nowrap"
                style={{ color }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        
        {/* Hover effect highlight */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-2xl overflow-hidden calendar-container">
      {/* Global overrides for FullCalendar dark theme */}
      <style jsx global>{`
        .fc-theme-standard .fc-scrollgrid { border-color: rgba(255, 255, 255, 0.05); }
        .fc-theme-standard td, .fc-theme-standard th { border-color: rgba(255, 255, 255, 0.05); }
        .fc .fc-toolbar-title { color: white; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
        .fc .fc-button-primary { 
          background-color: #10b981 !important; 
          border: none !important; 
          border-radius: 10px !important;
          font-weight: 700 !important;
          text-transform: capitalize;
          padding: 8px 16px !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .fc .fc-button-primary:hover { transform: translateY(-1px); background-color: #059669 !important; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2) !important; }
        .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #047857 !important; transform: scale(0.98); }
        .fc .fc-daygrid-day-number { color: #94a3b8; font-weight: 500; font-size: 0.9rem; padding: 10px !important; }
        .fc .fc-col-header-cell-cushion { color: #64748b; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; padding: 12px 0 !important; }
        .fc-event { border: none !important; background: none !important; padding: 0 !important; }
        .fc .fc-timegrid-slot-label-cushion { color: #64748b; font-size: 0.8rem; font-weight: 500; }
        .fc .fc-timegrid-axis-cushion, .fc .fc-timegrid-slot-label-cushion { color: #64748b; }
        .fc .fc-list-event-title a { color: #e2e8f0 !important; font-weight: 600; }
        .fc .fc-list-day-cushion { background: rgba(255,255,255,0.05) !important; }
        .fc .fc-list-event:hover td { background: rgba(255,255,255,0.02) !important; }
        .fc .fc-highlight { background: rgba(16, 185, 129, 0.1) !important; }
        
        /* Side by side overlaps in timeGrid */
        .fc-timegrid-event-harness { margin: 0 1px 0 0 !important; }
        
        /* Multi-day events in dayGridMonth */
        .fc-daygrid-event { border-radius: 6px !important; margin: 1px 4px !important; }
        
        /* Scrollbar styling */
        .fc-scroller::-webkit-scrollbar { width: 6px; }
        .fc-scroller::-webkit-scrollbar-track { background: transparent; }
        .fc-scroller::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "Agenda",
        }}
        events={calendarEvents}
        dateClick={(info) => onDateClick(info.dateStr, info.allDay)}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          onEventClick(parseInt(info.event.id, 10));
        }}
        eventContent={renderEventContent}
        height="75vh"
        selectable={true}
        dayMaxEvents={true}
        slotEventOverlap={true}
        nowIndicator={true}
        allDaySlot={true}
      />
    </div>
  );
};
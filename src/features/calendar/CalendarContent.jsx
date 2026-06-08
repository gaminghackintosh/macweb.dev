import React, { useState, useContext, useMemo, useCallback } from "react";
import { WindowContext } from "@/windows";

// Списки календарей
const ICLOUD_CALENDARS = [
  { id: "home", name: "Home", color: "#a855f7", checked: true },
  { id: "calendar", name: "Calendar", color: "#f97316", checked: true },
  { id: "work", name: "Work", color: "#a855f7", checked: true },
];

const OTHER_CALENDARS = [
  { id: "birthdays", name: "Birthdays", color: "#6b7280", checked: true },
  { id: "siri", name: "Siri Suggestions", color: "#eab308", checked: true },
];

export function CalendarContent() {
  const { onClose, onMinimize, onZoom, onTitleMouseDown } = useContext(WindowContext);

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState("Month");
  const [searchQuery, setSearchQuery] = useState("");

  // Календари (состояние чекбоксов)
  const [calendars, setCalendars] = useState(() => {
    const saved = localStorage.getItem("calendar-lists");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      icloud: ICLOUD_CALENDARS,
      other: OTHER_CALENDARS,
    };
  });

  // События (хранятся в localStorage)
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendar-events");
    return saved ? JSON.parse(saved) : {};
  });

  // Сохранение при изменении
  React.useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  React.useEffect(() => {
    localStorage.setItem("calendar-lists", JSON.stringify(calendars));
  }, [calendars]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNamesShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Получаем дни месяца для основной сетки
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        date: new Date(currentYear, currentMonth, day),
        isCurrentMonth: true,
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Мини-календарь
  const miniCalendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentYear, currentMonth]);

  const isToday = useCallback((date) => {
    if (!date) return false;
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [today]);

  const isSelected = useCallback((date) => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate]);

  const getEventsForDate = useCallback((date) => {
    if (!date) return [];
    const key = formatDateKey(date);
    return events[key] || [];
  }, [events]);

  const formatDateKey = useCallback((date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  const formatMonthYear = useCallback((date) => {
    return date.toLocaleDateString("en-US", { month: 'long', year: 'numeric' });
  }, []);

  // Навигация
  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  }, [currentYear, currentMonth]);

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  }, [currentYear, currentMonth]);

  const goToToday = useCallback(() => {
    setCurrentDate(today);
    setSelectedDate(today);
  }, [today]);

  // Переключение календарей
  const toggleCalendar = useCallback((calendarId) => {
    setCalendars(prev => {
      const newCalendars = { ...prev };
      ['icloud', 'other'].forEach(section => {
        newCalendars[section] = newCalendars[section].map(cal =>
          cal.id === calendarId ? { ...cal, checked: !cal.checked } : cal
        );
      });
      return newCalendars;
    });
  }, []);

  // Управление событиями
  const [showEventInput, setShowEventInput] = useState(false);
  const [newEventText, setNewEventText] = useState("");
  const [eventForDate, setEventForDate] = useState(null);

  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
    setEventForDate(date);
    setShowEventInput(true);
    setNewEventText("");
  }, []);

  const addEvent = useCallback(() => {
    if (!newEventText.trim() || !eventForDate) return;
    const key = formatDateKey(eventForDate);
    const newEvent = {
      id: Date.now(),
      text: newEventText.trim(),
      createdAt: new Date().toISOString(),
      allDay: true,
    };
    setEvents(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newEvent]
    }));
    setNewEventText("");
    setShowEventInput(false);
  }, [newEventText, eventForDate, formatDateKey]);

  const deleteEvent = useCallback((eventId, date) => {
    const key = formatDateKey(date);
    setEvents(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(e => e.id !== eventId)
    }));
  }, [formatDateKey]);

  // Подсчёт событий для даты
  const getEventCount = useCallback((date) => {
    if (!date) return 0;
    const key = formatDateKey(date);
    return (events[key] || []).length;
  }, [events, formatDateKey]);

  // Поиск событий
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results = [];
    Object.entries(events).forEach(([dateKey, evts]) => {
      evts.forEach(evt => {
        if (evt.text.toLowerCase().includes(query)) {
          results.push({ ...evt, date: dateKey });
        }
      });
    });
    return results;
  }, [events, searchQuery]);

  return (
    <div className="calendar">
      {/* ── Title Bar ── */}
      <div className="calendar-titlebar" onMouseDown={(e) => !e.target.closest('.calendar-traffic-light') && onTitleMouseDown(e)}>
        <div className="calendar-traffic-lights">
          <button className="calendar-traffic-light calendar-traffic-light--close" onClick={onClose} />
          <button className="calendar-traffic-light calendar-traffic-light--minimize" onClick={onMinimize} />
          <button className="calendar-traffic-light calendar-traffic-light--zoom" onClick={onZoom} />
        </div>
        <div className="calendar-toolbar">
          <button className="calendar-toolbar-btn" onClick={goToToday}>Today</button>
          <div className="calendar-view-switcher">
            {['Day', 'Week', 'Month', 'Year'].map(v => (
              <button
                key={v}
                className={`calendar-view-btn ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="calendar-search">
            <svg className="calendar-search-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input
              type="text"
              className="calendar-search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="calendar-body">
        {/* Sidebar */}
        <div className="calendar-sidebar">
          {/* Create Event Button */}
          <button className="calendar-create-btn" onClick={() => {
            setEventForDate(selectedDate);
            setShowEventInput(true);
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2H9v6a1 1 0 0 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
            </svg>
          </button>

          {/* Calendars List */}
          <div className="calendar-section">
            <span className="calendar-section-title">iCloud</span>
            {calendars.icloud.map(cal => (
              <label key={cal.id} className="calendar-list-item">
                <input
                  type="checkbox"
                  checked={cal.checked}
                  onChange={() => toggleCalendar(cal.id)}
                  style={{ accentColor: cal.color }}
                />
                <span className="calendar-list-color" style={{ backgroundColor: cal.color }} />
                <span className="calendar-list-name">{cal.name}</span>
              </label>
            ))}
          </div>

          <div className="calendar-section">
            <span className="calendar-section-title">Other</span>
            {calendars.other.map(cal => (
              <label key={cal.id} className="calendar-list-item">
                <input
                  type="checkbox"
                  checked={cal.checked}
                  onChange={() => toggleCalendar(cal.id)}
                  style={{ accentColor: cal.color }}
                />
                <span className="calendar-list-color" style={{ backgroundColor: cal.color }} />
                <span className="calendar-list-name">{cal.name}</span>
              </label>
            ))}
          </div>

          {/* Mini Calendar */}
          <div className="calendar-mini-wrapper">
            <div className="calendar-mini-header">
              <button className="calendar-mini-nav" onClick={prevMonth}>‹</button>
              <span className="calendar-mini-title">{monthNames[currentMonth]} {currentYear}</span>
              <button className="calendar-mini-nav" onClick={nextMonth}>›</button>
            </div>
            <div className="calendar-mini-grid">
              {dayNamesShort.map(day => (
                <div key={day} className="calendar-mini-day-name">{day}</div>
              ))}
              {miniCalendarDays.map((date, index) => {
                const hasEvents = date && getEventCount(date) > 0;
                return (
                  <div
                    key={index}
                    className={`calendar-mini-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                    onClick={() => date && handleDateClick(date)}
                  >
                    <span className="calendar-mini-day-num">{date?.getDate()}</span>
                    {hasEvents && <span className="calendar-mini-dot" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Calendar Grid */}
        <div className="calendar-main">
          {/* Header */}
          <div className="calendar-main-header">
            <h1 className="calendar-main-title">{formatMonthYear(currentDate)}</h1>
            <div className="calendar-main-nav">
              <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
              <button className="calendar-today-btn" onClick={goToToday}>Today</button>
              <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
            </div>
          </div>

          {/* Day Names */}
          <div className="calendar-weekdays">
            {dayNamesFull.map((day, index) => (
              <div key={day} className="calendar-weekday">
                <span className="calendar-weekday-name">{dayNamesShort[index]}</span>
                <span className="calendar-weekday-full">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {daysInMonth.map((item, index) => {
              const date = item.date;
              const isCurrentMonth = item.isCurrentMonth;
              const eventCount = getEventCount(date);
              const hasEvents = eventCount > 0;

              return (
                <div
                  key={index}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <span className="calendar-day-num">{date.getDate()}</span>
                  {hasEvents && (
                    <div className="calendar-day-events">
                      {getEventsForDate(date).slice(0, 3).map((evt, i) => (
                        <div key={evt.id} className="calendar-day-event">
                          <span className="calendar-event-indicator" />
                          <span className="calendar-event-title">{evt.text}</span>
                        </div>
                      ))}
                      {eventCount > 3 && (
                        <div className="calendar-day-more">+{eventCount - 3} more</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event Input Popup */}
          {showEventInput && eventForDate && (
            <div className="calendar-event-popup">
              <div className="calendar-event-popup-header">
                <span className="calendar-popup-title">
                  {formatMonthYear(eventForDate)} {eventForDate.getDate()}
                </span>
                <button className="calendar-popup-close" onClick={() => setShowEventInput(false)}>×</button>
              </div>
              <input
                type="text"
                className="calendar-popup-input"
                placeholder="Add event..."
                value={newEventText}
                onChange={(e) => setNewEventText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                autoFocus
              />
              <button className="calendar-popup-add" onClick={addEvent}>Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
import type { DashboardSharedProps } from "../../types/dashboard";
import "../../assets/styles/GridBoard.css";
import DatePicker from "react-datepicker";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

interface TodosWidgetProps extends DashboardSharedProps {
  mode: "todos" | "dday" | "mini-calendar";
}
// type WidgetMode = "todos" | "dday" | "mini-calendar";
export const TodosWidget = ({
  tasks = [],
  setTasks,
  mode,
}: TodosWidgetProps) => {
  // const [mode, setMode] = useState<WidgetMode>("todos");
  // const modes: WidgetMode[] = ["todos", "dday", "mini-calendar"];
  const todayStr = new Date().toISOString().split("T")[0];

  const todayTasks = tasks?.filter((task) => task.dueDate === todayStr);
  const today = new Date(todayStr);

  // const handlePrev = () => {
  //   const currentIdx = modes.indexOf(mode);
  //   const prev = (currentIdx - 1 + modes.length) % modes.length;
  //   setMode(modes[prev]);
  // };

  // const handleNext = () => {
  //   const currentIdx = modes.indexOf(mode);
  //   const nextIdx = (currentIdx + 1) % modes.length;
  //   setMode(modes[nextIdx]);
  // };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentDateStr = format(selectedDate, "yyyy-MM-dd");

  const currentTodos = tasks.filter((task) => {
    if (task.isDday) {
      return false;
    }
    if (task.startDate) {
      return currentDateStr >= task.startDate && currentDateStr <= task.dueDate;
    }
    return task.dueDate === currentDateStr;
  });

  const calDday = (objDay: string) => {
    const dDay = new Date(objDay);

    const calTime = dDay.getTime() - today.getTime();
    const calDay = Math.ceil(calTime / (1000 * 60 * 60 * 24));

    if (calDay === 0) {
      return "D-DAY";
    } else if (calDay > 0) {
      return `D-${calDay}`;
    }
  };

  const dDayTasks = tasks
    .filter((t) => {
      const taskDate = new Date(t.dueDate);

      return taskDate >= today && t.status !== "done";
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 4);

  const handleToggle = (taskId: string) => {
    if (!setTasks) {
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        // task.id === taskId
        //   ? {
        //       ...task,
        //       status: task.status === "done" ? "todo" : "done",
        //     }
        //   : task,

        {
          if (task.id !== taskId) {
            return task;
          }
          const completed = task.completedDates || [];
          const isAlreadyDone = completed.includes(currentDateStr);

          const newCompletedDates = isAlreadyDone
            ? completed.filter((d) => d !== currentDateStr)
            : [...completed, currentDateStr];
          return {
            ...task,
            completedDates: newCompletedDates,
          };
        },
      ),
    );
  }; //end handleToggle

  const handleDeleteTask = (taskId: string) => {
    if (!setTasks) {
      return;
    }

    if (!window.confirm("일정을 삭제하시겠습니까?")) {
      return;
    }
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="grid-widget-item">
      {/**헤더 */}
      <div className="widget-header">
        {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button type="button" onClick={handlePrev}>
            &lt;
          </button>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: "bold",
              margin: 0,
              flex: 1,
            }}
          >
            {getHeaderTitle()}
          </h3>
          <button type="button" onClick={handleNext}>
            &gt;
          </button>
        </div> */}
        {mode === "todos" && (
          <div>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => date && setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              locale={ko}
            ></DatePicker>
          </div>
        )}
        {mode !== "mini-calendar" ? <span>{todayStr}</span> : <span></span>}
      </div>
      {/** 리스트*/}
      <div className="widget-list-container">
        {mode === "todos" &&
          (currentTodos?.length !== 0 ? (
            <ul className="">
              {currentTodos.map((t) => {
                const isDone =
                  t.completedDates?.includes(currentDateStr) ?? false;
                return (
                  <li key={t.id}>
                    <label htmlFor="">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => handleToggle(t.id)}
                      />
                      <span
                        style={{
                          textDecoration: isDone ? "line-through" : "none",
                          color: isDone ? "#9ca3af" : "#1f2937",
                        }}
                      >
                        {t.title}
                      </span>
                    </label>
                    {/**삭제 버튼 */}
                    <button
                      className="widget-delete-todos-btn"
                      onClick={() => handleDeleteTask(t.id)}
                    >
                      X
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>등록된 일정이 없습니다.</p>
          ))}
        {mode === "dday" &&
          (dDayTasks.length !== 0 ? (
            <ul>
              {dDayTasks.map((t) => (
                <li
                  key={t.id}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    [{t.dueDate.substring(5)}]{t.title}
                  </span>
                  <span style={{ color: "#3b82f6" }}>{calDday(t.dueDate)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>등록된 일정이 없습니다.</p>
          ))}
      </div>
      {mode === "mini-calendar" && (
        <Calendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={false}
          height="auto"
          events={tasks.map((t) => ({
            id: t.id,
            title: t.title,
            date: t.dueDate,
            status: t.status,
          }))}
        ></Calendar>
      )}
      {/** end "widget-list-container" */}
    </div>
  );
};

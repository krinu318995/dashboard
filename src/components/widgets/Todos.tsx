import React, { useState, useEffect } from "react";
import type {
  Widget,
  TaskItem,
  DashboardSharedProps,
} from "../../types/dashboard";
import "../../assets/styles/GridBoard.css";

import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
type WidgetMode = "todos" | "dday" | "mini-calendar";
export const TodosWidget = ({
  widgets,
  tasks = [],
  setTasks,
}: DashboardSharedProps) => {
  const [mode, setMode] = useState<WidgetMode>("todos");
  const modes: WidgetMode[] = ["todos", "dday", "mini-calendar"];
  const todayStr = new Date().toISOString().split("T")[0];

  const todayTasks = tasks?.filter((task) => task.dueDate === todayStr);
  const today = new Date(todayStr);

  const handlePrev = () => {
    const currentIdx = modes.indexOf(mode);
    const prev = (currentIdx - 1 + modes.length) % modes.length;
    setMode(modes[prev]);
  };

  const handleNext = () => {
    const currentIdx = modes.indexOf(mode);
    const nextIdx = (currentIdx + 1) % modes.length;
    setMode(modes[nextIdx]);
  };

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
  const handleToggle = (taskId: String) => {
    if (!setTasks) {
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "done" ? "todo" : "done",
            }
          : task,
      ),
    );
  }; //end

  return (
    <div className="grid-widget-item">
      {/**헤더 */}
      <div className="widget-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button type="button" onClick={handlePrev}>
            &lt;
          </button>{" "}
          <button type="button" onClick={handleNext}>
            &gt;
          </button>
        </div>
        {mode !== "mini-calendar" ? <span>{todayStr}</span> : <span></span>}
      </div>
      {/** 리스트*/}
      <div className="widget-list-container">
        {mode === "todos" &&
          (todayTasks?.length !== 0 ? (
            <ul className="">
              {todayTasks.map((t) => (
                <li key={t.id}>
                  <label htmlFor="">
                    <input
                      type="checkbox"
                      checked={t.status === "done"}
                      onChange={() => handleToggle(t.id)}
                    />
                    <span
                      style={{
                        textDecoration:
                          t.status === "done" ? "line-through" : "none",
                        color: t.status === "done" ? "#9ca3af" : "#1f2937",
                      }}
                    >
                      {t.title}
                    </span>
                  </label>
                </li>
              ))}
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
            <p></p>
          ))}
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
      </div>
    </div>
  );
};

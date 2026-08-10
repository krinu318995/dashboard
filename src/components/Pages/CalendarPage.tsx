import React, { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { TaskItem } from "../../types/dashboard.ts";
import { TodoModal } from "../modals/TodoModal.tsx";
import "../../assets/styles/Calendar.css";
import type { EventClickArg } from "@fullcalendar/core";
interface CalendarPageProps {
  tasks: TaskItem[];
  setTasks: Dispatch<SetStateAction<TaskItem[]>>;
}

export const CalendarPage = ({ tasks, setTasks }: CalendarPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectTask, setSelectTask] = useState<TaskItem | null>(null);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setSelectTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTask: TaskItem) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const addTask = (arg: { dateStr: string }) => {
    const taskTitle = prompt(`${arg.dateStr}에 추가할 일정을 입력하세요: `);

    const taskContents = prompt("상세 내용을 입력하세요") || "";

    const taskImage =
      prompt("이미지 경로 또는 데이터 스트링을 입력하세요 (선택):") ||
      undefined;
    if (!taskTitle || !taskTitle.trim()) {
      return;
    }

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title: taskTitle,
      content: taskContents,
      imageUrl: taskImage,
      dueDate: arg.dateStr,
      status: "todo",
    };

    setTasks((prev) => [...prev, newTask]);
  }; //addTask

  const calendarEvents = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    date: task.dueDate,
    backgroundColor: task.status === "done" ? "#9ca3af" : "#3b82f6",
    borderColor: task.status === "done" ? "#9ca3af" : "#3b82f6",
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    const clickedTaskId = clickInfo.event.id;

    const targetTask = tasks.find((t) => t.id === clickedTaskId);

    if (targetTask) {
      setSelectTask(targetTask);
      setSelectedDate(targetTask.dueDate);
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <h2>전체 일정 관리</h2>
      <Calendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      ></Calendar>
      <TodoModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        selectedTask={selectTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      ></TodoModal>
    </div>
  );
}; //CalendarPage

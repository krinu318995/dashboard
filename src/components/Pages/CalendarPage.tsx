import React, { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { TaskItem } from "../../types/dashboard.ts";
import { TodoModal } from "../modals/TodoModal.tsx";
import "../../assets/styles/Calendar.css";

interface CalendarPageProps {
  tasks: TaskItem[];
  setTasks: Dispatch<SetStateAction<TaskItem[]>>;
}

export const CalendarPage = ({ tasks, setTasks }: CalendarPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTask: TaskItem) => {};

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

  return (
    <div>
      <h2>전체 일정 관리</h2>
      <Calendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={[
          { title: "AI 에이전트 설계 모듈 검증", date: "2026-08-10" },
          { title: "팀 주간 회의", date: "2026-08-14" },
        ]}
        dateClick={handleDateClick}
      ></Calendar>
      <TodoModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      ></TodoModal>
    </div>
  );
}; //CalendarPage

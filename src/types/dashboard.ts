// src/types/dashboard.ts
import type { Dispatch, SetStateAction } from "react";
export type taskStatus = "todo" | "in-progress" | "done";
export type WidgetType =
  | "todo"
  | "clock"
  | "memo"
  | "weather"
  | "weather-clock";

export interface Widget {
  id: string;
  type: WidgetType;
  x: number; // Grid 위치
  y: number;
  w: number; // Grid 크기
  h: number;
  title: string; // 위젯 상단 타이틀

  // 위젯 내부에 들어갈 데이터 (일정, 메모 내용 등)
  data?: {
    tasks?: Array<{
      id: string;
      content: string;
      dueDate: string; // 계획일 (DND로 수정될 대상!)
      status: taskStatus;
    }>;
    memoText?: string;
  };
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  city: string;
  humidity: string;
}

export type setWidgetsType = Dispatch<SetStateAction<Widget[]>>;

export interface CommonWidgetProps {
  widget: Widget;
  setWidgets: setWidgetsType;
}

export interface DashboardSharedProps {
  widget: Widget[];
  setWidgets: setWidgetsType;
  tasks?: TaskItem[]; // 👈 없어도 에러가 나지 않는 선택적 속성
  setTasks?: Dispatch<SetStateAction<TaskItem[]>>; // 👈 선택적 속성
}
export interface SidebarWidgetItem {
  type: string;
  label: string;
  link?: string; // ⭐️ 이동할 경로 (선택적)
}

export interface TaskItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  dueDate: string; // 예: "2026-08-04"
  status: taskStatus;
}

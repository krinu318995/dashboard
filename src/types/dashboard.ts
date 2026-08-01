// src/types/dashboard.ts

export type WidgetType = 'todo' | 'clock' | 'memo' | 'weather' | 'weather-clock';

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
      status: 'todo' | 'in-progress' | 'done';
    }>;
    memoText?: string;
  };
}
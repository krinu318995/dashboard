import { type DragEvent } from "react";
import React, { useState } from "react";
import type {
  Widget,
  setWidgetsType,
  SidebarWidgetItem,
} from "../types/dashboard.ts";
import { useNavigate } from "react-router-dom";
interface SidebarProps {
  isOpen: boolean;
  setWidgets: setWidgetsType;
  link?: string; // ⭐️ 라우팅 경로 (선택적 속성)
}

const WIDGET_LIBRARY_ITEMS: SidebarWidgetItem[] = [
  { type: "todo", label: "일정 관리", link: "/calendar" }, // 👈 link 존재 (클릭 시 이동)
  { type: "weather", label: "날씨" }, // 👈 link 없음 (클릭 반응 없음)
  { type: "clock", label: "시계" }, // 👈 link 없음
  { type: "weather-clock", label: "날씨 / 시계" }, // 👈 link 없음
];

const dummyMemoRepository = [
  {
    memoId: "m1",
    title: "7월 결산 및 회의록",
    content: "AI 에이전트 설계 모듈 구조화 완료 및 보안 검증 진행 중...",
  },
  {
    memoId: "m2",
    title: "마트 장보기 목록",
    content: "우유, 달걀, 닭가슴살, 대파 구입할 것",
  },
  {
    memoId: "m3",
    title: "학습 체크리스트",
    content: "TypeScript 엄격 모드 다루기 및 React DND 최적화 공부",
  },
];

export const Sidebar = ({ isOpen, setWidgets }: SidebarProps) => {
  const [selectedMemoId, setSelectedMemoId] = useState<string>("");

  const navigate = useNavigate();
  if (!isOpen) {
    return null; // 사이드바가 닫혀있으면 아무것도 렌더링하지 않음
  }
  /**일반 위젯 */
  const handleDragStart = (e: DragEvent, widgetType: string) => {
    e.dataTransfer.setData("text/widget-type", widgetType); //그리드보드에서
  };

  /** todo */
  const handleLinkClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
  };
  /**메모 위젯 */
  const handleMemoDragStart = (e: DragEvent, memoId: string) => {
    const targetMemo = dummyMemoRepository.find(
      (m) => m.memoId === selectedMemoId,
    );
    if (targetMemo) {
      e.dataTransfer.setData("text/widget-type", "memo");
      e.dataTransfer.setData(
        "text/widget-memo-data",
        JSON.stringify(targetMemo),
      );
    }
  };

  const handleCreateNewMemo = () => {
    const currentTime = new Date().toLocaleString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newEmptyMemo = {
      id: `memo-${Date.now()}`,
      type: "memo" as const,
      x: 0,
      y: 0,
      w: 4,
      h: 3,
      title: `새 메모 ${currentTime}`,
      data: { memoText: "" },
    };

    setWidgets((prevWidgets: Widget[]) => [...prevWidgets, newEmptyMemo]);
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "" : "closed"}`}>
      <div className="sidebar-content">
        <h3>위젯 라이브러리</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {WIDGET_LIBRARY_ITEMS.map((item) => (
            <li
              key={item.type}
              draggable
              onClick={() => handleLinkClick(item.link)}
              onDragStart={(e) => handleDragStart(e, item.type)}
            >
              {item.label}
            </li>
            // <li draggable onDragStart={(e) => handleDragStart(e, "weather")}>
            //   날씨
            // </li>
            // <li draggable onDragStart={(e) => handleDragStart(e, "clock")}>
            //   시계
            // </li>
            // <li
            //   draggable
            //   onDragStart={(e) => handleDragStart(e, "weather-clock")}
            // >
            //   날씨 / 시계
            // </li>
          ))}
        </ul>
        <h4>메모</h4>
        <div className="sidebar-content-select-container">
          <select
            name="selectMemo"
            id=""
            value={selectedMemoId}
            onChange={(e) => setSelectedMemoId(e.target.value)}
            style={{ padding: "6px", borderRadius: "4px" }}
          >
            <option value="">새 메모 작성</option>
            {dummyMemoRepository.map((m) => (
              <option key={m.memoId} value={m.memoId}>
                {m.title}
              </option>
            ))}
          </select>
          {selectedMemoId === "" && (
            <button onClick={handleCreateNewMemo}>➕ 새 메모 작성</button>
          )}
          {selectedMemoId !== "" && (
            <div
              draggable
              onDragStart={(e) => handleMemoDragStart(e, selectedMemoId)}
              className="sidebar-content-select-container-memo-drag"
            >
              ✋ 선택한 메모를 대시보드로 드래그
            </div>
          )}
        </div>
        {/* <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li draggable onDragStart={(e) => handleDragStart(e, 'memo')}>메모장</li>
        </ul> */}
      </div>
    </aside>
  );
};

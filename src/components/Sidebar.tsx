import { memo, type DragEvent } from "react";
import { useState, useEffect } from "react";
import type {
  Widget,
  setWidgetsType,
  SidebarWidgetItem,
} from "../types/dashboard.ts";
import { useNavigate } from "react-router-dom";
interface SidebarProps {
  isOpen: boolean;
  setWidgets: setWidgetsType;
  link?: string; //라우팅 경로,
  widgets: Widget[];
}

const WIDGET_LIBRARY_ITEMS: SidebarWidgetItem[] = [
  { type: "todo", label: "플래너", link: "/calendar" },
  { type: "weather", label: "날씨" },
  { type: "clock", label: "시계" },
  { type: "weather-clock", label: "날씨 / 시계" },
];

export const Sidebar = ({ isOpen, setWidgets, widgets }: SidebarProps) => {
  // const [memoList, setMemoList] = useState<Widget[]>([]);
  const [selectedMemoId, setSelectedMemoId] = useState<string>("");

  const memoList = widgets.filter((w) => w.type === "memo");
  // useEffect(() => {
  //   try {
  //     const savedMemo = localStorage.getItem("myDashboard_memo");
  //     if (savedMemo) {
  //       const paredMemos: Widget[] = JSON.parse(savedMemo);

  //       const memosOnly = paredMemos.filter((m) => m.type === "memo");
  //       setMemoList(memosOnly);
  //     }
  //   } catch (err) {
  //     console.error(`메모 데이터 불러오기 오류 ${err}`);
  //   }
  // }, [isOpen]);

  const navigate = useNavigate();
  if (!isOpen) {
    return null; //사이드바가 닫혀있으면 아무것도 렌더링하지 않음
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
    const targetMemo = memoList.find((m) => m.id === memoId);

    if (targetMemo) {
      e.dataTransfer.setData("text/widget-type", "memo");

      const memoPayload = {
        title: targetMemo.title,
        memoText: targetMemo.data?.memoText,
        data: targetMemo.data?.imageUrl,
      };
      e.dataTransfer.setData(
        "text/widget-memo-data",
        JSON.stringify(memoPayload),
      );
    }
  };

  const handleCreateNewMemo = () => {
    const newEmptyMemo = {
      id: `memo-${Date.now()}`,
      type: "memo" as const,
      x: 0,
      y: 0,
      w: 4,
      h: 3,
      title: "",
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
            {memoList.map((m) => (
              <option key={m.id} value={m.id}>
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
      </div>
    </aside>
  );
};

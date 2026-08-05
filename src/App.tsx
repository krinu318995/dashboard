import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import type { Widget, TaskItem } from "./types/dashboard.ts";
import { GridBoard } from "./components/Pages/GridBoard.tsx";
import { CalendarPage } from "./components/Pages/CalendarPage.tsx";
import "./App.css";
import "./assets/styles/Layout.css";
import { Routes, Route } from "react-router-dom";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const [widgets, setWidgets] = useState<Widget[]>([
    // { id: 'w1', type: 'memo', x: 0, y: 0, w: 2, h: 2, title: '메모' },
    // { id: 'w2', type: 'weather', x: 2, y: 0, w: 1, h: 1, title: '날씨' },
    // { id: 'w3', type: 'todo', x: 2, y: 1, w: 1, h: 2, title: '할 일' },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const [globalTasks, setGlobalTasks] = useState<TaskItem[]>([
    //   {
    //     id: "1",
    //     content: "",
    //     title: "AI 에이전트 설계 모듈 검증",
    //     imageUrl: "",
    //     dueDate: "2026-08-10",
    //     status: "todo",
    //   },
    //   {
    //     id: "2",
    //     title: "팀 주간 회의",
    //     content: "",
    //     imageUrl: " ",
    //     dueDate: "2026-08-14",
    //     status: "todo",
    //   },
  ]);

  return (
    <div className="app-container">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-wrapper">
        <Sidebar isOpen={isSidebarOpen} setWidgets={setWidgets} />

        <main className="grid-container-wrapper">
          {/**route branch */}
          <Routes>
            <Route
              path="/"
              element={<GridBoard widgets={widgets} setWidgets={setWidgets} />}
            ></Route>
            <Route
              path="/calendar"
              element={
                <CalendarPage tasks={globalTasks} setTasks={setGlobalTasks} />
              }
            ></Route>
            {/**그리드보드가 위젯 정보를 갖고 있으므로 캘린더는 위젯 관련 정보를 넘겨받을 필요 없이 task info 만 갖고 있으면 됨*/}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

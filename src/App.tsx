import { useState } from 'react';
import {Header} from './components/Header';
import {Sidebar} from './components/Sidebar'; 
import type { Widget } from './types/dashboard.ts';
import {GridBoard} from './components/GridBoard/GridBoard';
import './App.css';
import './assets/styles/Layout.css';
function App() {


  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

const [widgets, setWidgets] = useState<Widget[]>([
  // { id: 'w1', type: 'memo', x: 0, y: 0, w: 2, h: 2, title: '메모' },
  // { id: 'w2', type: 'weather', x: 2, y: 0, w: 1, h: 1, title: '날씨' },
  // { id: 'w3', type: 'todo', x: 2, y: 1, w: 1, h: 2, title: '할 일' },
]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
<div className='app-container'>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='main-wrapper'>
        <Sidebar isOpen={isSidebarOpen} />
<main className='grid-container-wrapper'>       
   <GridBoard widgets={widgets} setWidgets={setWidgets}/></main>
      </div>
    </div>
  );
}

export default App;
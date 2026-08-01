import React from "react";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="dashboard-header">
      <div className='header-left'>
        <button className='toggle-btn' onClick={toggleSidebar}>
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        <nav className='breadcrumb'>
          <span>HOME</span>
          <span className='divider'> / </span>
          <span>Dashboard</span>
          <span className='divider'> / </span>
          <span className='current'>Main Grid</span>
        </nav>
      </div>
      <div className='header-right'>
        <button className='add-widget-btn'>+ Widget</button>
      </div>
    </header>   
  );
};
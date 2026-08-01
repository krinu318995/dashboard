import  {type DragEvent }from "react";
import React, { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
}   


const dummyMemoRepository = [
  { memoId: 'm1', title: '7월 결산 및 회의록', content: 'AI 에이전트 설계 모듈 구조화 완료 및 보안 검증 진행 중...' },
  { memoId: 'm2', title: '마트 장보기 목록', content: '우유, 달걀, 닭가슴살, 대파 구입할 것' },
  { memoId: 'm3', title: '학습 체크리스트', content: 'TypeScript 엄격 모드 다루기 및 React DND 최적화 공부' },
];

export const Sidebar  = ({ isOpen } : SidebarProps) => {

  const [selectedMemoId, setSelectedMemoId] = useState<string>('');
  if(!isOpen) {
   return null; // 사이드바가 닫혀있으면 아무것도 렌더링하지 않음
  }
  /**일반 위젯 */
  const handleDragStart = (e: DragEvent, widgetType: string) => {
    e.dataTransfer.setData('text/widget-type', widgetType);//그리드보드에서 
  } 

  /**메모 위젯 */
  const handleMemoDragStart = (e: DragEvent, memoId: string) => {
    const targetMemo = dummyMemoRepository.find((m)=> m.memoId ===selectedMemoId);
    if(targetMemo){
      e.dataTransfer.setData('text/widget-type','memo');
      e.dataTransfer.setData('text/widget-memo-data', JSON.stringify(targetMemo));

    }
  }

  return (
    <aside className={`dashboard-sidebar ${isOpen ? '' : 'closed'}`}>    
      <div className="sidebar-content">
        <h3>위젯 라이브러리</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li draggable onDragStart={(e) => handleDragStart(e, 'todo')}>일정 관리</li>
          <li draggable onDragStart={(e) => handleDragStart(e, 'weather')}>날씨</li>
          <li draggable onDragStart={(e) => handleDragStart(e, 'clock')}>시계</li>
          <li draggable onDragStart={(e) => handleDragStart(e, 'weather-clock')}>날씨/시계</li>
        </ul>
        <h4>메모</h4>
        <div style={{display:'flex', flexDirection: 'column', gap:'8px' }}>
          <select name="selectMemo" id=""
          value={selectedMemoId}
          onChange={(e)=> setSelectedMemoId(e.target.value)}
          style={{padding : '6px', borderRadius: '4px'}}>
            <option value="" disabled>Select a memo</option>
      {dummyMemoRepository.map((m) => (
        <option key={m.memoId} value={m.memoId}>
          {m.title}
        </option>
      ) )}
          </select>
      {
        selectedMemoId &&(
          <div 
          draggable
          onDragStart={handleMemoDragStart}
          style={{padding: '10px',
                background: '#e6f7ff',
                border: '1px dashed #1890ff',
                borderRadius: '4px',
                cursor: 'grab',
                textAlign: 'center',
                fontSize: '13px'}}>✋ 선택한 메모를 대시보드로 드래그</div>
        )
      }
        </div>
        {/* <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li draggable onDragStart={(e) => handleDragStart(e, 'memo')}>메모장</li>
        </ul> */}
      </div>
    </aside>
  );
};
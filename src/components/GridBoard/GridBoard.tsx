// src/components/GridBoard.tsx
import React, {useRef}from 'react';
import type {SetStateAction , DragEvent, Dispatch, MouseEvent as ReactMouseEvent}from 'react';
import  '../../assets/styles/gridboard.css';
import type { Widget , WidgetType } from '../../types/dashboard.ts';

/**컴포넌트 */
import { ClockWidgets } from '../widgets/ClockWidget.tsx';
import { WeatherWidget } from '../widgets/WeatherWidget.tsx';
import { WeatherClockWidget } from '../widgets/WeatherClockWidget.tsx';
import { MemoWidget } from '../widgets/MemoWidget.tsx';

interface GridBoardProps {
  widgets: Widget[];
  setWidgets: Dispatch<SetStateAction<Widget[]>>; // 선택적 prop
}

export const GridBoard = ({ widgets, setWidgets} : GridBoardProps ) => {

  const gridRef = useRef<HTMLDivElement>(null);
  // "gridRef는 <div> 전용 참조 객체"라고 미리 지정해둠

  const GRID_COLUMNS = 12;
  const ROW_HEIGHT = 100; // 각 행의 높이 (px)

  const handleDragStart = (e: DragEvent , id : string) => {
    e.dataTransfer.setData('text/plain', id);
  } 

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    
    if(!gridRef.current ) return;


    const existingWidgetId = e.dataTransfer.getData('text/plain');
    const newWidgetType = e.dataTransfer.getData('text/widget-type') as WidgetType; // 위젯 타입 정보 가져오기
    // if(!gridRef.current || !widgetId ) return;
    

    /**getBoundingClientRect: element의 크기, 위치 정보를 담은 DOMRect 객체를 반환한다. */
    const rect = gridRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left; // 마우스 X 좌표 (그리드 기준)
    const mouseY = e.clientY - rect.top;  // 마우스 Y 좌표 (그리드 기준)

    const columnWidth = rect.width / GRID_COLUMNS; // 각 열의 너비

    const newX = Math.floor(mouseX / columnWidth); // 새로운 X 좌표
    const newY = Math.floor(mouseY / ROW_HEIGHT); // 새로운 Y 좌표

    const clampledX = Math.max(0, Math.min(newX, GRID_COLUMNS - 1)); // 0~11 사이로 제한
    const clampledY = Math.max(0, newY); // 0 이상으로 제한

    const memoDataString = e.dataTransfer.getData('text/widget-memo-data');

    if(newWidgetType) {
      
      let defaultW = 2; 
      let defaultH = 2;
      let title = '새 위젯'
      let memoContent = '';
      if(newWidgetType === 'todo') {
        defaultW = 3;
        defaultH = 2;
        title = '일정 관리';
      }
      if(newWidgetType === 'weather') {
        defaultW = 2;
        defaultH = 2;
        title = '날씨';
      }   
      if(newWidgetType === 'clock') {
        defaultW = 2;
        defaultH = 2;
        title = '시계';
      }
      if(newWidgetType === 'weather-clock') {
        defaultW = 4;
        defaultH = 2;
        title = '날씨/시계';
      }
      if(newWidgetType === 'memo' && memoDataString) {
        const memoObj = JSON.parse(memoDataString);
        title = memoObj.title || '메모';
        memoContent = memoObj.content || '' ;
        defaultW = 4;
        defaultH = 3;
      } 
      const newWidget: Widget = {
        id: `Widget_${Date.now()}` , // 간단한 고유 ID 생성
        type: newWidgetType,  
        x : clampledX,
        y : clampledY,
        w : defaultW,
        h : defaultH,
        title : title,
        data : memoContent ? { memoText: memoContent} : undefined
      };

      setWidgets((prevWidgets: Widget[]) => [...prevWidgets, newWidget]);
      return;
    } 

    if(existingWidgetId) {
      setWidgets((prevWidgets: Widget[]) => 
        prevWidgets.map( (w) => String(w.id)=== existingWidgetId ? {
          ...w, x: clampledX, y: clampledY } : w )
      );
        }
      
  };  
  
  const handleResizeStart = (e :ReactMouseEvent, widgetId : string,  initialW : number,
    initialH:number  ) =>{
    e.stopPropagation();
    e.preventDefault();
  
    const startX = e.clientX;
    const startY = e.clientY;

    if(!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const columnWidth = rect.width / GRID_COLUMNS;

    const handleMouseMove = (moveEvent:MouseEvent) =>{
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newW = Math.max(1, initialW + Math.round(deltaX / columnWidth));
      const newH = Math.max(1, initialH + Math.round(deltaY / ROW_HEIGHT));

      setWidgets((prev)=>
      prev.map((w)=> (w.id === widgetId? {...w, w: newW, h:newH} : w)));

    }

    const handleMouseUp = () =>{
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }
  return (
    <div ref= {gridRef}
    className="grid-board-container"
    onDragOver = {handleDragOver}
    onDrop = {handleDrop}>
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="grid-widget-item"
          draggable = {true}
          onDragStart={(e) => handleDragStart(e, widget.id.toString())}
        
          style={{
            // 동적 좌표값만 style로 제어
            gridColumnStart: widget.x + 1,
            gridColumnEnd: `span ${widget.w}`,
            gridRowStart: widget.y + 1,
            gridRowEnd: `span ${widget.h}`,
          }}
        > <div className='widget-header'>
          <div className="widget-title">
            [{widget.title}]          
          </div>
            {/*삭제 버튼 추가 */}
          <button className='widget-delete-btn'
          onClick={(e)=>{ e.stopPropagation();
            setWidgets((prevWidgets: Widget[]) => prevWidgets.filter((w) => w.id !== widget.id)); 
          }}>×</button>
          </div>
          {widget.type === 'weather' && <WeatherWidget />}
          {widget.type === 'clock' && <ClockWidgets />}
          {widget.type === 'weather-clock' && <WeatherClockWidget />}
          {/* {widget.type==='memo' && widget.data?.memoText && (
            <div className='widget-memo-content' style={{marginTop:'auto'}}>
            {widget.data.memoText}
          </div>
          )} */}
          {widget.type === 'memo' && <MemoWidget widget={widget} setWidgets={setWidgets} />}
          <div className="widget-info">
            위치: ({widget.x}, {widget.y}) | 크기: {widget.w}x{widget.h}
          </div>
          <div className='widget-resize-handle'
          draggable={false}
          onMouseDown={(e)=>
            handleResizeStart(e, widget.id.toString(), widget.w, widget.h)
          }></div>
        </div>
      ))}
    </div>
  );
};
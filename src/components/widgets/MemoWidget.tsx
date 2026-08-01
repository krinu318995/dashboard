import react, { useState, useEffect } from 'react';
import '../../assets/styles/Memo.css';
import type { Widget,  MemoWidgetProps } from '../../types/dashboard.ts';
import type {ChangeEvent} from 'react';
export const MemoWidget = ({ widget, setWidgets }: MemoWidgetProps) => {

    const handleTextChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;

        setWidgets((prevWidgets) =>
            prevWidgets.map((w)=> 
                w.id === widget.id ? {
                    ...w, 
                    data : {
                        ...w.data, 
                        memoText : newText
                    },
                }: w
            )
    
        )//setWidgets

    }//handleTextChange

    return(
        <div className='memo-widget-container'>
            <textarea name="" id=""
            value={widget.data?.memoText || ''}
            onChange = {handleTextChange}
            placeholder='메모를 입력하세요'
            onMouseDown={(e)=> e.stopPropagation()} //그리드보드에서 드래그 이벤트가 발생하지 않도록 방지
            onDragStart={(e)=> {
                e.preventDefault()
                e.stopPropagation()} //그리드보드에서 드래그 이벤트가 발생하지 않도록 방지
            } //그리드보드에서 드래그 이벤트가 발생하지 않도록 방지
            className='memo-widget-textarea'
            ></textarea>
        </div>
    )
}//MemoWidget


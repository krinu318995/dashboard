import react, { useState, useEffect } from "react";
import "../../assets/styles/Memo.css";

import type { CommonWidgetProps } from "../../types/dashboard.ts";
import type { ChangeEvent, ClipboardEvent } from "react";

export const MemoWidget = ({ widget, setWidgets }: CommonWidgetProps) => {
  const [isFooterOpen, setIsFooterOpen] = useState<boolean>(false);

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "title" | "memoText",
  ) => {
    const newText = e.target.value;
    const newTitle = e.target.value;

    setWidgets((prevWidgets) =>
      // prevWidgets.map((w) =>
      //   w.id === widget.id
      //     ? {
      //         ...w,
      //         data: {
      //           ...w.data,
      //           memoText: newText,
      //         },
      //       }
      //     : w,
      // ), //prevWidgets.map

      prevWidgets.map((w) =>
        w.id !== widget.id
          ? w
          : field === "title"
            ? {
                ...w,
                title: newTitle,
              }
            : { ...w, data: { ...w.data, memoText: newText } },
      ),
    ); //setWidgets
  }; //handleTextChange

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Str = reader.result as string;

      setWidgets((prev) =>
        prev.map((w) =>
          w.id === widget.id ? { ...w, data: { imageUrl: base64Str } } : w,
        ),
      );
    };
    reader.readAsDataURL(file);
  }; // end handleImageUpload

  const handleDeleteImg = () => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widget.id
          ? { ...w, data: { ...w.data, imageUrl: undefined } }
          : w,
      ),
    );
  }; // end handleDeleteImg

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) {
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();

        if (!file) {
          continue;
        }
        e.preventDefault(); //text area 에 파일 명이 들어가는 것 방지

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Str = reader.result as string;

          setWidgets((prev) =>
            prev.map((w) =>
              w.id === widget.id
                ? {
                    ...w,
                    data: {
                      ...w,
                      imageUrl: base64Str,
                    },
                  }
                : w,
            ),
          ); // end setWidgets
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };
  return (
    <div className="memo-widget-container">
      {/**이미지 영역 */}
      {widget.data?.imageUrl && (
        <div className="memo-img-wrapper">
          <img src={widget.data.imageUrl} className="memo-img-image" />
          <button className="memo-img-del-btn" onClick={handleDeleteImg}>
            X
          </button>
        </div>
      )}
      <textarea
        name=""
        id=""
        value={widget.data?.memoText || ""}
        onChange={(e) => handleTextChange(e, "memoText")}
        placeholder="메모를 입력하세요"
        onMouseDown={(e) => e.stopPropagation()} //그리드보드에서 드래그 이벤트가 발생하지 않도록 방지
        onDragStart={
          (e) => {
            e.preventDefault();
            e.stopPropagation();
          } //그리드보드에서 드래그 이벤트가 발생하지 않도록 방지
        } //그리드보드에서 드래그 이벤트가 발생하지 않도록 방지
        onPaste={handlePaste}
        className="memo-widget-textarea"
      ></textarea>

      {/**footer */}
      <div className="memo-widget-footer-container">
        <button
          className={`memo-folder-tab ${isFooterOpen ? "open" : ""}`}
          onClick={() => setIsFooterOpen((prev) => !prev)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {isFooterOpen ? "접기 ▲" : "열기 ▼"}
        </button>
        {isFooterOpen && (
          <div className="memo-widget-footer">
            <label
              className="memo-widget-label"
              htmlFor={`file-input-${widget.id}`}
              onMouseDown={(e) => e.stopPropagation()}
            >
              이미지 첨부
            </label>
            <input
              id={`file-input-${widget.id}`}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}; //MemoWidget

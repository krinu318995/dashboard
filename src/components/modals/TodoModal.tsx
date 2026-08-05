import React, { useEffect, useState } from "react";
import type { TaskItem } from "../../types/dashboard";
import type { FC, SyntheticEvent } from "react";
import "../../assets/styles/Modals.css";
export interface TodoModalProps {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onSave: (newTask: TaskItem) => void;
}
export const TodoModal: FC<TodoModalProps> = ({
  isOpen,
  selectedDate,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("일정을 입력해 주세요.");
      return;
    }

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      content: contents, // 빈 값이어도 문자열로 허용
      imageUrl: imageUrl.trim() || undefined,
      dueDate: selectedDate,
      status: "todo",
    };

    onSave(newTask);
    setTitle("");
    setContents("");
    setImageUrl("");
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>일정 추가 ({selectedDate})</h3>
        {/**일정 제목 */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-formGroup">
            <label className="modal-label">일정</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정을 입력해 주세요."
              className="modal-input"
              required
            />
          </div>
          {/**상세 일정 */}
          <div className="modal-formGroup">
            <label className="modal-label">상세 내용</label>
            <textarea
              className="modal-textarea"
              name=""
              id=""
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              placeholder="상세 내용을 입력해 주세요."
            ></textarea>
          </div>
          {/**이미지 */}
          <div className="modal-formGroup">
            <label className="modal-label">이미지</label>
            <input
              type="file"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="modal-buttonGroup">
            <button className="modal-cancelBtn" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-saveBtn">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

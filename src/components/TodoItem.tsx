/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  isProcessed?: boolean;
  onStatusChange?: (todoId: number, newStatus: boolean) => void;
  onTitleUpdate?: (todoId: number, newTitle: string) => void;
  isLoading?: boolean;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onDelete,
  isProcessed,
  onStatusChange,
  onTitleUpdate,
  isTemp,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  useEffect(() => {
    if (!isProcessed && isEditing) {
      setIsEditing(false);
    }
  }, [isProcessed, isEditing]);

  const handleEdit = () => {
    onStatusChange?.(id, !completed);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    const trimmed = newTitle.trim();

    if (!trimmed) {
      onDelete?.(id);
      setIsEditing(false);

      return;
    }

    if (trimmed === title) {
      setIsEditing(false);

      return;
    }

    onTitleUpdate?.(id, trimmed);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleEdit}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={() => {
            const trimmed = newTitle.trim();

            if (trimmed && trimmed !== title) {
              onTitleUpdate?.(id, trimmed);
            }

            setNewTitle(title);
            setIsEditing(false);
          }}
          onKeyUp={handleKeyUp}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {!isTemp && !isProcessed && !isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(id)}
        >
          ×
        </button>
      )}
    </div>
  );
};

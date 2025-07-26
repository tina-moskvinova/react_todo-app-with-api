/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => void;
  isProcessed?: boolean;
  onStatusChange?: (todoId: number, newStatus: boolean) => void;
  renameCallback?: (todoId: number, newTitle: string) => void;
  isLoading?: boolean;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onDelete,
  isProcessed,
  onStatusChange,
  renameCallback,
  isTemp,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleEdit = () => {
    onStatusChange?.(id, !completed);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmed = newTitle.trim();

      if (!trimmed) {
        setIsProcessing(true);
        try {
          await onDelete?.(id);
          setIsEditing(false);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(ErrorMessage.DeleteTodo, error);
        } finally {
          setIsProcessing(false);
        }

        return;
      }

      if (trimmed !== title) {
        setIsProcessing(true);
        try {
          await renameCallback?.(id, trimmed);
          // setIsEditing(false); mentor's recommendation
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(ErrorMessage.Rename, error);
        } finally {
          setIsProcessing(false);
        }

        return;
      }

      setIsEditing(false);

      return;
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
          onBlur={async () => {
            const trimmed = newTitle.trim();

            if (!trimmed) {
              setIsProcessing(true);
              try {
                await onDelete?.(id);
                setIsEditing(false);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(ErrorMessage.DeleteTodo, error);
              } finally {
                setIsProcessing(false);
              }

              return;
            }

            if (trimmed !== title) {
              setIsProcessing(true);
              try {
                await renameCallback?.(id, trimmed);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(ErrorMessage.Rename, error);

                setIsProcessing(false);
              }

              return;
            }

            setIsEditing(false);
          }}
          onKeyUp={handleKeyUp}
          autoFocus
          disabled={isProcessing}
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

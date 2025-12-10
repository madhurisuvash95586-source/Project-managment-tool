import React from 'react';
export default function TaskCard({ task }) {
    const drag = e => e.dataTransfer.setData('taskId', task._id);
    return (
        <div className="task" draggable onDragStart={drag}>
            <div className="title">{task.title}</div>
            <div className="meta">{task.assignee?.name || 'Unassigned'}</div>
        </div>
    );
}
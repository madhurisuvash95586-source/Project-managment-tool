import React from 'react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ title, tasks, onDrop }) {
    const allow = e => e.preventDefault();
    const drop = e => {
        const id = e.dataTransfer.getData('taskId');
        onDrop(id);
    };
    return (
        <div className="column" onDragOver={allow} onDrop={drop}>
            <h4>{title}</h4>
            {tasks.map(t => <TaskCard key={t._id} task={t} />)}
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { request } from '../api';
import { socket } from '../socket';
import KanbanColumn from '../components/KanbanColumn';

const COLS = ['todo', 'in-progress', 'done'];

export default function Board() {
    const [tasks, setTasks] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        load();
        socket.on('task:created', t => setTasks(prev => [...prev, t]));
        socket.on('task:updated', t => setTasks(prev => prev.map(x => x._id === t._id ? t : x)));
        socket.on('task:deleted', ({ id }) => setTasks(prev => prev.filter(x => x._id !== id)));
        socket.on('time:started', e => console.log('time started', e));
        socket.on('time:stopped', e => console.log('time stopped', e));
        return () => socket.off();
    }, []);

    async function load() {
        const t = await request('/tasks');
        setTasks(t);
    }

    async function handleDrop(taskId, to) {
        await request('/tasks/' + taskId, { method: 'PUT', body: JSON.stringify({ status: to }) });
        // server emits update — UI will refresh from socket event
    }

    async function quickStartFirst() {
        if (tasks.length === 0) return alert('No tasks');
        const t = await request('/time/start', { method: 'POST', body: JSON.stringify({ taskId: tasks[0]._id }) });
        alert('Started: ' + t._id);
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Kanban Board</h2>
            <div style={{ display: 'flex', gap: 12 }}>
                {COLS.map(col => (
                    <KanbanColumn
                        key={col}
                        title={col.toUpperCase()}
                        tasks={tasks.filter(t => t.status === col)}
                        onDrop={(id) => handleDrop(id, col)}
                    />
                ))}
            </div>

            <div style={{ marginTop: 20 }}>
                <button onClick={quickStartFirst}>Start timer on first task (demo)</button>
            </div>
        </div>
    );
}
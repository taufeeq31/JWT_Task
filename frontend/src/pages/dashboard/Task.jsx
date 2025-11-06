import { useEffect, useState } from 'react';
import http from '../../api/http.js';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    const load = async () => {
        const res = await http.get('/tasks');
        setTasks(res.data);
    };

    const create = async (e) => {
        e.preventDefault();
        await http.post('/tasks', { title });
        setTitle('');
        load();
    };

    const toggle = async (task) => {
        await http.put(`/tasks/${task._id}`, { completed: !task.completed });
        load();
    };

    const remove = async (id) => {
        await http.delete(`/tasks/${id}`);
        load();
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <form onSubmit={create}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <button type="submit">Add</button>
            </form>

            {tasks.map((t) => (
                <div key={t._id}>
                    <span>{t.title}</span>
                    <span>{t.completed ? 'Done' : 'Pending'}</span>
                    <button onClick={() => toggle(t)}>Toggle</button>
                    <button onClick={() => remove(t._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

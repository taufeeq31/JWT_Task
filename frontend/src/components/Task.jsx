import { useEffect, useState } from 'react';
import http from '@/api/http';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

const Task = () => {
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(false); // for initial fetch / refresh
    const [adding, setAdding] = useState(false); // for create action
    const [serverError, setServerError] = useState('');

    const fetchTasks = async () => {
        setLoadingList(true);
        setServerError('');
        try {
            const res = await http.get('/tasks');
            setItems(res.data || []);
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to load tasks';
            setServerError(message);
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const add = async (e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) {
            setServerError('Title required');
            return;
        }
        setServerError('');
        try {
            setAdding(true);
            const res = await http.post('/tasks', { title: t });
            setItems((prev) => [res.data, ...prev]);
            setTitle('');
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to add task';
            setServerError(message);
        } finally {
            setAdding(false);
        }
    };

    const toggle = async (task) => {
        setServerError('');
        try {
            const res = await http.put(`/tasks/${task._id}`, { completed: !task.completed });
            setItems((prev) => prev.map((i) => (i._id === task._id ? res.data : i)));
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to update task';
            setServerError(message);
        }
    };

    const remove = async (id) => {
        setServerError('');
        try {
            await http.delete(`/tasks/${id}`);
            setItems((prev) => prev.filter((i) => i._id !== id));
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to delete task';
            setServerError(message);
        }
    };

    return (
        <div className="space-y-6">
            {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
            <form
                onSubmit={add}
                className="flex flex-col sm:flex-row gap-3 sm:items-start bg-white/60 p-3 rounded-md border border-[#E3E8F5]"
            >
                <Input
                    placeholder="Add a new task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white flex-1"
                />
                <Button
                    type="submit"
                    className="bg-[#5069FF] hover:bg-[#3C54E0] text-white min-w-[110px]"
                    disabled={adding}
                >
                    {adding ? 'Adding…' : 'Add Task'}
                </Button>
            </form>

            <div className="flex items-center justify-between text-xs text-[#0B1930]/70">
                <span className="font-medium tracking-tight">Tasks ({items.length})</span>
                <span>
                    {items.filter((i) => i.completed).length}/{items.length} completed
                </span>
            </div>

            <div className="grid gap-3">
                {loadingList && (
                    <div className="text-sm opacity-60 py-4 text-center">Loading tasks…</div>
                )}
                {!loadingList &&
                    items.map((t) => (
                        <Card
                            key={t._id}
                            className="flex items-center justify-between p-3 border-[#E3E8F5] hover:shadow-sm transition bg-white"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <Checkbox
                                    checked={t.completed}
                                    onCheckedChange={() => toggle(t)}
                                    className="border-[#5069FF] data-[state=checked]:bg-[#5069FF] shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span
                                        className={`text-sm font-medium truncate ${
                                            t.completed
                                                ? 'line-through opacity-60'
                                                : 'text-[#0B1930]'
                                        }`}
                                        title={t.title}
                                    >
                                        {t.title}
                                    </span>
                                    <Badge
                                        variant={t.completed ? 'default' : 'secondary'}
                                        className={`w-fit mt-1 text-[10px] ${
                                            t.completed
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-yellow-400 text-black'
                                        }`}
                                    >
                                        {t.completed ? 'Done' : 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(t._id)}
                                className="hover:bg-red-100 hover:text-red-600"
                                aria-label={`Delete ${t.title}`}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </Card>
                    ))}
                {!loadingList && items.length === 0 && (
                    <p className="text-sm opacity-60 text-center py-6 border border-dashed rounded-md bg-white/40">
                        No tasks yet
                    </p>
                )}
            </div>
        </div>
    );
};

export default Task;

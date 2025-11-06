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
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const fetchTasks = async () => {
        setLoading(true);
        setServerError('');
        try {
            const res = await http.get('/tasks');
            setItems(res.data || []);
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to load tasks';
            setServerError(message);
        } finally {
            setLoading(false);
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
            const res = await http.post('/tasks', { title: t });
            setItems((prev) => [res.data, ...prev]);
            setTitle('');
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to add task';
            setServerError(message);
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
        <Card className="border-[#E3E8F5] shadow-sm">
            <CardHeader>
                <h3 className="text-lg font-medium tracking-tight text-[#0B1930]">Task</h3>
            </CardHeader>

            <CardContent>
                {serverError ? <p className="text-sm text-red-600 mb-3">{serverError}</p> : null}

                <form onSubmit={add} className="flex gap-2 mb-6">
                    <Input
                        placeholder="Add a new task"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white"
                    />
                    <Button
                        type="submit"
                        className="bg-[#5069FF] hover:bg-[#3C54E0] text-white"
                        disabled={loading}
                    >
                        {loading ? 'Adding…' : 'Add'}
                    </Button>
                </form>

                <div className="grid gap-3">
                    {items.map((t) => (
                        <Card
                            key={t._id}
                            className="flex items-center justify-between p-3 border-[#E3E8F5] hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={t.completed}
                                    onCheckedChange={() => toggle(t)}
                                    className="border-[#5069FF] data-[state=checked]:bg-[#5069FF]"
                                />

                                <div className="flex flex-col">
                                    <span
                                        className={`text-sm font-medium ${
                                            t.completed
                                                ? 'line-through opacity-60'
                                                : 'text-[#0B1930]'
                                        }`}
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
                            >
                                <Trash2 size={16} />
                            </Button>
                        </Card>
                    ))}

                    {items.length === 0 && !loading && (
                        <p className="text-sm opacity-60 text-center py-4">No tasks yet</p>
                    )}
                </div>
            </CardContent>

            <CardFooter className="text-xs opacity-70">
                {items.filter((i) => i.completed).length}/{items.length} completed
            </CardFooter>
        </Card>
    );
};

export default Task;

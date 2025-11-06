import { useEffect, useState } from 'react';
import http from '../../api/http';
import Tasks from '../../components/Task';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import SidebarContent from '../../components/layout/Sidebar.jsx';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            setError('');
            try {
                const res = await http.get('/user/me');
                setUser(res.data);
            } catch (err) {
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    // Not authenticated → clear token and go to login
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                setError(err?.response?.data?.message || 'Failed to load user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const onLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
            <header className="w-full bg-[#0B1930] text-white px-6 py-4 flex items-center justify-between">
                <div className="text-lg font-semibold tracking-tight">Dashboard</div>

                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger className="sm:hidden text-sm underline">Menu</SheetTrigger>
                        <SheetContent side="left" className="p-6">
                            <SidebarContent user={user} onLogout={onLogout} />
                            <div className="mt-4">
                                <Button variant="outline" size="sm" onClick={onLogout} className="w-full">
                                    Logout
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="flex-1 flex">
                <aside className="hidden sm:block w-64 bg-white border-r border-[#E3E8F5] p-6">
                    <SidebarContent user={user} onLogout={onLogout} />
                </aside>

                <section className="flex-1 p-6">
                    <Card className="border-[#E3E8F5] shadow-md">
                        <CardHeader>
                            <CardTitle className="text-[#0B1930] tracking-tight">Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
                            {!loading ? <Tasks /> : <p className="text-sm opacity-70">Loading…</p>}
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}

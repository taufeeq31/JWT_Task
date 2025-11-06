import { useEffect, useState } from 'react';
import http from '../../api/http.js';

export default function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        http.get('/user/me').then((res) => setUser(res.data));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {user && <div>{user.name}</div>}
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }}
            >
                Logout
            </button>
        </div>
    );
}

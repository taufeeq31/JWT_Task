import { useState } from 'react';
import http from '../../api/http.js';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        const res = await http.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
    };

    return (
        <form onSubmit={submit}>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}

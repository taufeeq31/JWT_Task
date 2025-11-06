import { useState } from 'react';
import http from '../../api/http';
import { Button } from '@/components/ui/button.jsx';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await http.post('/auth/signup', { name, email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (err) {
            const message = err?.response?.data?.message || 'Signup failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit}>
            {error ? <p style={{ color: 'red', marginBottom: 8 }}>{error}</p> : null}
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
            />
            <Button type="submit" disabled={loading}>
                {loading ? 'Signing up…' : 'Signup'}
            </Button>
        </form>
    );
}

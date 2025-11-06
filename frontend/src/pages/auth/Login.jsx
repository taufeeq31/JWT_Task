import { useState } from 'react';
import http from '../../api/http.js';
import { Button } from '@/components/ui/button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [errors, setErrors] = useState({});

    const validate = (values) => {
        const errs = {};
        const e = (values.email || '').trim();
        const p = values.password || '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!e) errs.email = 'Email required';
        else if (!emailRegex.test(e)) errs.email = 'Invalid email';
        if (!p) errs.password = 'Password required';
        else if (p.length < 6) errs.password = 'Min 6 chars';
        return errs;
    };

    const submit = async (e) => {
        e.preventDefault();
        setServerError('');
        const payload = { email: email.trim(), password };
        const v = validate(payload);
        if (Object.keys(v).length) {
            setErrors(v);
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const res = await http.post('/auth/login', payload);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (err) {
            const message = err?.response?.data?.message || 'Login failed. Try again.';
            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-[#0B1930] text-white items-center justify-center p-12">
                <div>
                    <h1 className="text-4xl font-semibold mb-4 tracking-tight">
                        Sapphire Nightfall
                    </h1>
                    <p className="text-sm opacity-80 max-w-sm leading-6">
                        A calm entry point with disciplined contrast and restrained color.
                    </p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8FAFF] p-8">
                <form
                    onSubmit={submit}
                    noValidate
                    className="w-full max-w-sm bg-white shadow-xl rounded-xl p-8 border border-[#E3E8F5]"
                >
                    <h2 className="text-2xl font-medium mb-6 tracking-tight text-[#0B1930]">
                        Welcome Back
                    </h2>
                    {serverError && <p className="text-red-600 text-sm mb-3">{serverError}</p>}
                    <div className="mb-4">
                        <input
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5069FF]"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <input
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5069FF]"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={Boolean(errors.password)}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5069FF] hover:bg-[#3C54E0] text-white"
                    >
                        {loading ? 'Processing…' : 'Log In'}
                    </Button>
                    <div className="text-center mt-4 text-sm">
                        <a href="/signup" className="text-[#5069FF] font-medium">
                            Create account
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

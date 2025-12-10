import React, { useState } from 'react';
import { request } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
    const nav = useNavigate();
    async function submit(e) {
        e.preventDefault();
        try {
            const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            nav('/');
        } catch (err) { alert(err.message); }
    }
    return (
        <form onSubmit={submit} className="form">
            <h3>Login</h3>
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button>Login</button>
        </form>
    );
}
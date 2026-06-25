import { useState } from 'react';
import api from '../api/axios';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { checkAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            const response = await api.post(
                "/admin/login",
                formData
            );
            console.log(response.data);

            await checkAuth();

            navigate("/dashboard");
            
        }
        catch(err)
        {
            console.log(err);
        }
        
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                        QL
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Welcome to QueueLess</h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to manage your queues.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            placeholder="admin@queueless.app"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            placeholder="Enter your password"
                        />
                    </div>

                    <input
                        type="submit"
                        value="Login"
                        className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                </form>
            </section>
        </main>
    );
};

export default Login;

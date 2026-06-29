import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { checkAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const hasAutoDemoLoginRun = useRef(false);
    const isAuthenticating = isSigningIn || isDemoLoading;

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }
    const handleDemoLogin = useCallback(async () => {
        if (isAuthenticating) return;

        setIsDemoLoading(true);

        try {
            await api.post("/admin/login", {
                email: "demo@flowq.com",
                password: "flowq123",
            });

            await checkAuth();

            toast.success("Logged in as Demo");

            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.error || "Demo login failed");
        } finally {
            setIsDemoLoading(false);
        }
    }, [checkAuth, isAuthenticating, navigate]);

    useEffect(() => {
        if (searchParams.get("demo") !== "true" || hasAutoDemoLoginRun.current) return;

        hasAutoDemoLoginRun.current = true;
        setSearchParams({}, { replace: true });
        handleDemoLogin();
    }, [handleDemoLogin, searchParams, setSearchParams]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (isAuthenticating) return;

        setIsSigningIn(true);
        try {
            await api.post(
                "/admin/login",
                formData
            );
            toast.success("Logged in");

            await checkAuth();

            navigate("/dashboard");

        }
        catch (err) {
            toast.error(err.response?.data?.error || "Login failed");
        }
        finally {
            setIsSigningIn(false);
        }

    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                        FQ
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Welcome to FlowQ</h1>
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
                            disabled={isAuthenticating}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            placeholder="admin@flowq.app"
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
                            disabled={isAuthenticating}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                    >
                        {isAuthenticating ? "Signing In..." : "Login"}
                    </button>
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>

                        <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-xs uppercase tracking-wide text-slate-400">
                                OR
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={isAuthenticating}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDemoLoading ? "Signing In..." : "Explore Demo"}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-blue-600 transition hover:text-blue-700">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </section>
        </main>
    );
};

export default Login;

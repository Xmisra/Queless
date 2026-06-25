import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import JoinQueue from "../pages/JoinQueue";
import QueueManagement from "../pages/QueueManagement";

import ProtectedRoute from "./ProtectedRoute";

const ProtectedRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join/:queueId" element={<JoinQueue />} />
                <Route path="/queue/:queueId" element={<QueueManagement />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default ProtectedRoutes;

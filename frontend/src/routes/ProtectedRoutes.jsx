import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import JoinQueue from "../pages/JoinQueue";
import QueueManagement from "../pages/QueueManagement";

import ProtectedRoute from "./ProtectedRoute";

const ProtectedRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
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
                <Route
                    path="/queue/:queueId"
                    element={
                        <ProtectedRoute>
                            <QueueManagement />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default ProtectedRoutes;

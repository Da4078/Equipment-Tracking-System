
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { token } = useAuth();

    return token
        ? children
        : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return isAdmin
        ? children
        : <Navigate to="/employee-dashboard" replace />;
}

function EmployeeRoute({ children }) {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const isEmployee = user?.roles?.includes('ROLE_EMPLOYEE');

    return isEmployee
        ? children
        : <Navigate to="/dashboard" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<SignUp />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <AdminRoute>
                            <Dashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/employee-dashboard"
                    element={
                        <EmployeeRoute>
                            <EmployeeDashboard />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

import { useAuth } from './context/AuthContext';

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
    );
}

function hasRole(user, targetRole) {
    if (!user?.roles || !Array.isArray(user.roles)) return false;
    const cleanTarget = targetRole.replace('ROLE_', '').toUpperCase();
    return user.roles.some((role) => {
        const cleanRole = String(role).replace('ROLE_', '').toUpperCase();
        return cleanRole === cleanTarget;
    });
}

function AccessDenied() {
    const { logout, user } = useAuth();
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
                <h2 className="text-xl font-bold text-red-400">Account Role Not Assigned</h2>
                <p className="text-sm text-slate-400">
                    Logged in as <strong className="text-slate-200">{user?.email || 'User'}</strong>, but your Keycloak account lacks the required <code className="text-blue-400">ROLE_ADMIN</code> or <code className="text-blue-400">ROLE_EMPLOYEE</code> realm roles.
                </p>
                <button
                    onClick={logout}
                    className="w-full py-2.5 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
                >
                    Log Out & Switch Account
                </button>
            </div>
        </div>
    );
}

function PublicOnlyRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (isAuthenticated) {
        const isAdmin = hasRole(user, 'ADMIN');
        const isEmployee = hasRole(user, 'EMPLOYEE');

        if (isAdmin) return <Navigate to="/dashboard" replace />;
        if (isEmployee) return <Navigate to="/employee-dashboard" replace />;

        return <AccessDenied />;
    }

    return children;
}

function AdminRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isAdmin = hasRole(user, 'ADMIN');
    if (!isAdmin) {
        const isEmployee = hasRole(user, 'EMPLOYEE');
        if (isEmployee) return <Navigate to="/employee-dashboard" replace />;
        return <AccessDenied />;
    }

    return children;
}

function EmployeeRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isEmployee = hasRole(user, 'EMPLOYEE');
    if (!isEmployee) {
        const isAdmin = hasRole(user, 'ADMIN');
        if (isAdmin) return <Navigate to="/dashboard" replace />;
        return <AccessDenied />;
    }

    return children;
}

function RootRedirect() {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isAdmin = hasRole(user, 'ADMIN');
    const isEmployee = hasRole(user, 'EMPLOYEE');

    if (isAdmin) return <Navigate to="/dashboard" replace />;
    if (isEmployee) return <Navigate to="/employee-dashboard" replace />;

    return <AccessDenied />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicOnlyRoute>
                            <SignUp />
                        </PublicOnlyRoute>
                    }
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
                <Route path="/" element={<RootRedirect />} />
                <Route path="*" element={<RootRedirect />} />
            </Routes>
        </BrowserRouter>
    );
}
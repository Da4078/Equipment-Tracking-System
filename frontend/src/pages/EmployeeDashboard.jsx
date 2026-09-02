import { useCallback, useEffect, useState } from 'react';
import {
    Package,
    User,
    LogOut,
    RotateCcw,
    Loader2,
    AlertCircle,
    CalendarDays,
    Hash,
    Briefcase,
    Mail,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function EmployeeDashboard() {

    const { user, logout } = useAuth();

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [returningId, setReturningId] = useState(null);

    const employeeId = user?.employeeId;

    const fetchEquipment = useCallback(async () => {

        if (!employeeId) {
            setError('No employee account is associated with this user.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await api.get('/equipment');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];

            console.log('Logged in user:', user);
            console.log('Employee ID:', employeeId);
            console.log('All equipment:', data);

            const assignedToMe = data.filter(
                item =>
                    item.status === 'ASSIGNED' &&
                    item.assignedEmployeeId === employeeId
            );

            console.log('My equipment:', assignedToMe);

            setEquipment(assignedToMe);

        } catch (err) {

            console.error('Failed to load equipment:', err);

            const message =
                err.response?.data?.message ||
                'Failed to load your equipment.';

            setError(message);

        } finally {
            setLoading(false);
        }

    }, [employeeId, user]);

    useEffect(() => {
        fetchEquipment();
    }, [fetchEquipment]);

    const handleReturnEquipment = async (item) => {

        if (!item.assignmentId) {
            alert('This equipment does not contain an assignment ID.');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to return "${item.equipmentName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setReturningId(item.id);

            await api.post(
                `/assignments/${item.assignmentId}/return`
            );

            await fetchEquipment();

        } catch (err) {

            console.error('Failed to return equipment:', err);

            const message =
                err.response?.data?.message ||
                'Failed to return equipment.';

            alert(message);

        } finally {
            setReturningId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            {/* HEADER */}
            <header className="border-b border-slate-800 bg-slate-900/80">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-400" />
                        </div>

                        <div>
                            <h1 className="font-bold text-white">
                                Equipment Tracker
                            </h1>

                            <p className="text-xs text-slate-500">
                                Employee Portal
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>

                </div>

            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* WELCOME */}
                <div className="mb-8">

                    <p className="text-sm text-slate-500">
                        Welcome back
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-1">
                        {user?.email}
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Here's an overview of your company equipment.
                    </p>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Assigned Equipment
                                </p>

                                <p className="text-3xl font-bold text-white mt-2">
                                    {loading ? '...' : equipment.length}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-400" />
                            </div>

                        </div>

                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Account
                                </p>

                                <p className="text-lg font-semibold text-white mt-2">
                                    Employee
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>

                        </div>

                    </div>

                </div>

                {/* EQUIPMENT */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-800">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-400" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    My Equipment
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Equipment currently assigned to you
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="flex items-center justify-center py-16">

                            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />

                            <span className="ml-3 text-slate-400">
                                Loading your equipment...
                            </span>

                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && !error && equipment.length === 0 && (
                        <div className="py-16 text-center">

                            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-7 h-7 text-slate-500" />
                            </div>

                            <h4 className="text-lg font-semibold text-white">
                                No equipment assigned
                            </h4>

                            <p className="text-sm text-slate-500 mt-2">
                                You currently don't have any company equipment assigned to you.
                            </p>

                        </div>
                    )}

                    {/* TABLE */}
                    {!loading && equipment.length > 0 && (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-950/50">

                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-6 py-4">
                                        Equipment
                                    </th>

                                    <th className="px-6 py-4">
                                        Serial Number
                                    </th>

                                    <th className="px-6 py-4">
                                        Type
                                    </th>

                                    <th className="px-6 py-4">
                                        Assigned
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Action
                                    </th>

                                </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-800">

                                {equipment.map(item => (

                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-800/40 transition-colors"
                                    >

                                        {/* NAME */}
                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-blue-400" />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-white">
                                                        {item.equipmentName}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Equipment
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        {/* SERIAL */}
                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Hash className="w-4 h-4 text-slate-500" />
                                                {item.serialNumber || 'N/A'}
                                            </div>

                                        </td>

                                        {/* TYPE */}
                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-2 text-sm text-slate-300">

                                                <Briefcase className="w-4 h-4 text-slate-500" />

                                                {item.type || item.category || 'N/A'}

                                            </div>

                                        </td>

                                        {/* DATE */}
                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-2 text-sm text-slate-300">

                                                <CalendarDays className="w-4 h-4 text-slate-500" />

                                                {item.assignedAt
                                                    ? new Date(item.assignedAt).toLocaleDateString()
                                                    : 'N/A'
                                                }

                                            </div>

                                        </td>

                                        {/* STATUS */}
                                        <td className="px-6 py-5">

                                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">

                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />

                                                    ASSIGNED

                                                </span>

                                        </td>

                                        {/* RETURN */}
                                        <td className="px-6 py-5 text-right">

                                            <button
                                                onClick={() =>
                                                    handleReturnEquipment(item)
                                                }
                                                disabled={returningId === item.id}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >

                                                {returningId === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-4 h-4" />
                                                )}

                                                {returningId === item.id
                                                    ? 'Returning...'
                                                    : 'Return'
                                                }

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

                {/* ACCOUNT INFO */}
                <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-400" />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                My Account
                            </h3>

                            <p className="text-sm text-slate-500">
                                Your account information
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="bg-slate-950/50 rounded-xl p-4">

                            <div className="flex items-center gap-3">

                                <Mail className="w-4 h-4 text-slate-500" />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Email
                                    </p>

                                    <p className="text-sm text-slate-200 mt-1">
                                        {user?.email || 'N/A'}
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="bg-slate-950/50 rounded-xl p-4">

                            <div className="flex items-center gap-3">

                                <User className="w-4 h-4 text-slate-500" />

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Employee ID
                                    </p>

                                    <p className="text-sm text-slate-200 mt-1 break-all">
                                        {user?.employeeId || 'N/A'}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}
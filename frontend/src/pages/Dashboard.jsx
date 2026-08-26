import { useState, useEffect } from "react";
import {
    Package,
    CheckCircle2,
    Clock,
    Wrench,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Loader2,
    LogOut
} from 'lucide-react';
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const { logout, user } = useAuth();

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/equipment');
            // Handles both Spring Boot Page<T> (response.data.content) and standard List<T> (response.data)
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data?.content || []);
            setEquipment(data);
        } catch (err) {
            console.error('Failed to fetch equipment:', err);
            setError('Failed to load equipment inventory.');
            setEquipment([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this equipment item?')) return;
        try {
            await api.delete(`/equipment/${id}`);
            setEquipment((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert('Failed to delete equipment item.');
        }
    };

    // Ensure equipment is an array before performing operations
    const safeEquipment = Array.isArray(equipment) ? equipment : [];

    const filteredEquipment = safeEquipment.filter((item) => {
        const name = item.equipmentName || item.name || '';
        const category = item.type || item.category || '';
        const serial = item.serialNumber || '';

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalCount = safeEquipment.length;
    const availableCount = safeEquipment.filter((e) => e.status === "AVAILABLE").length;
    const inUseCount = safeEquipment.filter((e) => e.status === "IN_USE").length;
    const maintenanceCount = safeEquipment.filter((e) => e.status === "MAINTENANCE").length;

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide">Equipment Tracker</h1>
                        <p className="text-xs text-slate-400">Manage & Monitor Inventory</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400 hidden sm:inline">
                        Logged in as <strong className="text-slate-200">{user?.email}</strong>
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Equipment</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{totalCount}</h3>
                        </div>
                        <div className="p-3 bg-slate-800 text-slate-300 rounded-xl">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Available</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{availableCount}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-400">In Use</p>
                            <h3 className="text-2xl font-bold text-blue-400 mt-1">{inUseCount}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Maintenance</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">{maintenanceCount}</h3>
                        </div>
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                            <Wrench className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Toolbar & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name, serial number, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    {/* Filter Dropdown & Add Button */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                            <Filter className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="IN_USE">In Use</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                        </div>

                        <button
                            onClick={() => alert('Open Add Modal')}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Equipment</span>
                        </button>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            <span>Loading equipment inventory...</span>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400 text-sm">{error}</div>
                    ) : filteredEquipment.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-sm">
                            No equipment found matching your criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="px-6 py-4">Equipment Name</th>
                                    <th className="px-6 py-4">Serial Number</th>
                                    <th className="px-6 py-4">Category / Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                                {filteredEquipment.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                                        {/* Uses equipmentName, falling back to name */}
                                        <td className="px-6 py-4 font-medium text-white">
                                            {item.equipmentName || item.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            {item.serialNumber}
                                        </td>
                                        {/* Uses type, falling back to category */}
                                        <td className="px-6 py-4 text-slate-400">
                                            {item.type || item.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => alert(`Edit item ${item.id}`)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        AVAILABLE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        IN_USE: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        MAINTENANCE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    };

    const labels = {
        AVAILABLE: 'Available',
        IN_USE: 'In Use',
        MAINTENANCE: 'Maintenance',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                styles[status] || 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
        >
            {labels[status] || status}
        </span>
    );
}
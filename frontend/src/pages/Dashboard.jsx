import { useState, useEffect } from "react";
import {
    Package,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Loader2,
    LogOut,
    Mail,
    UserCheck,
    RotateCcw,
    X,
    CheckCircle2 as CheckIcon,
    XCircle as XIcon
} from 'lucide-react';
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import EquipmentModal from "../components/EquipmentModal.jsx";

export default function Dashboard() {
    // Navigation Tab State ('equipment' or 'employees')
    const [activeTab, setActiveTab] = useState('equipment');

    // Equipment State
    const [equipment, setEquipment] = useState([]);
    const [eqLoading, setEqLoading] = useState(true);
    const [eqError, setEqError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    // Assignment Workflow States
    const [assigningItem, setAssigningItem] = useState(null);
    const [activeEmployeesList, setActiveEmployeesList] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignSubmitting, setAssignSubmitting] = useState(false);
    const [assignError, setAssignError] = useState('');

    // Employee State
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(true);
    const [empError, setEmpError] = useState('');
    const [empSearchTerm, setEmpSearchTerm] = useState('');
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeFormData, setEmployeeFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        hireDate: new Date().toISOString().split('T')[0],
        department: '',
        position: '',
        active: true
    });

    const { logout, user } = useAuth();

    useEffect(() => {
        fetchEquipment();
        fetchEmployees();
    }, []);

    const fetchEquipment = async () => {
        setEqLoading(true);
        setEqError('');
        try {
            const response = await api.get('/equipment');
            const data = Array.isArray(response.data) ? response.data : (response.data?.content || []);
            setEquipment(data);
        } catch (err) {
            console.error('Failed to fetch equipment:', err);
            setEqError('Failed to load equipment inventory.');
            setEquipment([]);
        } finally {
            setEqLoading(false);
        }
    };

    const fetchEmployees = async () => {
        setEmpLoading(true);
        setEmpError('');
        try {
            const response = await api.get('/employees?page=0&size=50');
            const data = Array.isArray(response.data) ? response.data : (response.data?.content || []);
            setEmployees(data);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setEmpError('Failed to load employee directory.');
            setEmployees([]);
        } finally {
            setEmpLoading(false);
        }
    };

    // Equipment Handlers
    const handleOpenAddEquipment = () => {
        setSelectedEquipment(null);
        setIsEquipmentModalOpen(true);
    };

    const handleOpenEditEquipment = (item) => {
        setSelectedEquipment(item);
        setIsEquipmentModalOpen(true);
    };

    const handleDeleteEquipment = async (id) => {
        if (!window.confirm('Are you sure you want to retire this equipment item?')) return;
        try {
            await api.delete(`/equipment/${id}`);
            setEquipment((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert('Failed to retire equipment item.');
        }
    };

    // Assignment & Return Handlers
    const handleOpenAssignModal = async (item) => {
        setAssigningItem(item);
        setSelectedEmployeeId('');
        setAssignError('');
        setAssignLoading(true);
        try {
            const response = await api.get('/employees?page=0&size=100');
            const data = Array.isArray(response.data) ? response.data : (response.data?.content || []);
            setActiveEmployeesList(data.filter(emp => emp.active));
        } catch (err) {
            console.error('Failed to fetch active employees:', err);
            setAssignError('Could not load active employees list.');
            setActiveEmployeesList([]);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleConfirmAssign = async (e) => {
        e.preventDefault();
        if (!selectedEmployeeId || !assigningItem) return;

        setAssignSubmitting(true);
        setAssignError('');
        try {
            await api.post('/assignments', {
                employeeId: selectedEmployeeId,
                equipmentId: assigningItem.id
            });
            setAssigningItem(null);
            fetchEquipment();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to assign equipment.';
            setAssignError(msg);
        } finally {
            setAssignSubmitting(false);
        }
    };

    const handleReturnEquipment = async (itemId) => {
        if (!window.confirm('Are you sure you want to process a return for this equipment?')) return;
        try {
            await api.post(`/assignments/return/${itemId}`);
            fetchEquipment();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to return equipment.';
            alert(msg);
        }
    };

    // Employee Handlers
    const handleOpenAddEmployee = () => {
        setSelectedEmployee(null);
        setEmployeeFormData({
            firstName: '', lastName: '', email: '',
            hireDate: new Date().toISOString().split('T')[0],
            department: '', position: '', active: true
        });
        setIsEmployeeModalOpen(true);
    };

    const handleOpenEditEmployee = (emp) => {
        setSelectedEmployee(emp);
        setEmployeeFormData({
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
            department: emp.department || '',
            position: emp.position || '',
            active: emp.active ?? true
        });
        setIsEmployeeModalOpen(true);
    };

    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedEmployee) {
                await api.put(`/employees/${selectedEmployee.id}`, employeeFormData);
            } else {
                await api.post('/employees', employeeFormData);
            }
            setIsEmployeeModalOpen(false);
            fetchEmployees();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to save employee.';
            alert(message);
        }
    };

    const handleDeleteEmployee = async (id, fullName) => {
        if (!window.confirm(`Are you sure you want to offboard/delete ${fullName}? The system will block this if they hold active equipment.`)) return;
        try {
            await api.delete(`/employees/${id}`);
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } catch (err) {
            const msg = err.response?.data?.message || 'Cannot delete employee with active equipment assignments.';
            alert(msg);
        }
    };

    // Filter calculations
    const safeEquipment = Array.isArray(equipment) ? equipment : [];
    const filteredEquipment = safeEquipment.filter((item) => {
        const name = item.equipmentName || item.name || '';
        const category = item.type || item.category || '';
        const serial = item.serialNumber || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || serial.toLowerCase().includes(searchTerm.toLowerCase()) || category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const safeEmployees = Array.isArray(employees) ? employees : [];
    const filteredEmployees = safeEmployees.filter((emp) => {
        const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const dept = (emp.department || '').toLowerCase();
        const query = empSearchTerm.toLowerCase();
        return fullName.includes(query) || email.includes(query) || dept.includes(query);
    });

    const availableCount = safeEquipment.filter((e) => e.status === "AVAILABLE").length;
    const assignedCount = safeEquipment.filter((e) => e.status === "ASSIGNED").length;
    const retiredCount = safeEquipment.filter((e) => e.status === "RETIRED").length;

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
            {/* Top Navigation Bar with Tabs */}
            <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-wide">Equipment Tracker</h1>
                            <p className="text-xs text-slate-400">Inventory & Personnel Portal</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setActiveTab('equipment')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'equipment' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            <Package className="w-4 h-4" />
                            <span>Equipment</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('employees')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'employees' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Employees</span>
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {user?.email && (
                        <span className="text-sm text-slate-400 hidden sm:inline">
                            Logged in as <strong className="text-slate-200">{user.email}</strong>
                        </span>
                    )}
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

                {/* TAB 1: EQUIPMENT INVENTORY */}
                {activeTab === 'equipment' && (
                    <>
                        {/* Metric Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                    <p className="text-sm font-medium text-slate-400">Assigned</p>
                                    <h3 className="text-2xl font-bold text-blue-400 mt-1">{assignedCount}</h3>
                                </div>
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Retired</p>
                                    <h3 className="text-2xl font-bold text-slate-400 mt-1">{retiredCount}</h3>
                                </div>
                                <div className="p-3 bg-slate-800 text-slate-400 rounded-xl border border-slate-700">
                                    <XCircle className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by name, serial number, category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center">
                                    <Filter className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                    >
                                        <option value="ALL">All Statuses</option>
                                        <option value="AVAILABLE">Available</option>
                                        <option value="ASSIGNED">Assigned</option>
                                        <option value="RETIRED">Retired</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleOpenAddEquipment}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Equipment</span>
                                </button>
                            </div>
                        </div>

                        {/* Equipment Table */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                            {eqLoading ? (
                                <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                    <span>Loading equipment inventory...</span>
                                </div>
                            ) : eqError ? (
                                <div className="p-8 text-center text-red-400 text-sm">{eqError}</div>
                            ) : filteredEquipment.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 text-sm">No equipment found.</div>
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
                                                <td className="px-6 py-4 font-medium text-white">{item.equipmentName || item.name}</td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.serialNumber}</td>
                                                <td className="px-6 py-4 text-slate-400">{item.type || item.category}</td>
                                                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {item.status === 'AVAILABLE' && (
                                                            <button
                                                                onClick={() => handleOpenAssignModal(item)}
                                                                className="px-2.5 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                                                title="Assign to Employee"
                                                            >
                                                                <UserCheck className="w-3.5 h-3.5" />
                                                                <span>Assign</span>
                                                            </button>
                                                        )}
                                                        {item.status === 'ASSIGNED' && (
                                                            <button
                                                                onClick={() => handleReturnEquipment(item.id)}
                                                                className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                                                title="Return Equipment"
                                                            >
                                                                <RotateCcw className="w-3.5 h-3.5" />
                                                                <span>Return</span>
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleOpenEditEquipment(item)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors" title="Edit">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteEquipment(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors" title="Retire">
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
                    </>
                )}

                {/* TAB 2: EMPLOYEE DIRECTORY */}
                {activeTab === 'employees' && (
                    <>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, department..."
                                    value={empSearchTerm}
                                    onChange={(e) => setEmpSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <button
                                onClick={handleOpenAddEmployee}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Employee</span>
                            </button>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                            {empLoading ? (
                                <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                    <span>Loading personnel directory...</span>
                                </div>
                            ) : empError ? (
                                <div className="p-8 text-center text-red-400 text-sm">{empError}</div>
                            ) : filteredEmployees.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 text-sm">No employees found.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Contact</th>
                                            <th className="px-6 py-4">Department / Position</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                                        {filteredEmployees.map((emp) => {
                                            const fullName = `${emp.firstName} ${emp.lastName}`;
                                            return (
                                                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-white">{fullName}</td>
                                                    <td className="px-6 py-4 text-slate-400 flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                        <span>{emp.email}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-slate-200">{emp.department || 'N/A'}</div>
                                                        <div className="text-xs text-slate-500">{emp.position || 'Staff'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                                emp.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                                                            }`}>
                                                                {emp.active ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                                                                {emp.active ? 'Active' : 'Offboarded'}
                                                            </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleOpenEditEmployee(emp)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors" title="Edit">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteEmployee(emp.id, fullName)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors" title="Offboard / Delete">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Equipment Modal */}
            {isEquipmentModalOpen && (
                <EquipmentModal
                    equipment={selectedEquipment}
                    onClose={() => setIsEquipmentModalOpen(false)}
                    onSuccess={fetchEquipment}
                />
            )}

            {/* Assign Modal */}
            {assigningItem && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <UserCheck className="w-5 h-5 text-blue-500" />
                                <span>Assign Equipment</span>
                            </div>
                            <button onClick={() => setAssigningItem(null)} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmAssign} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Equipment Item</label>
                                <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200">
                                    {assigningItem.equipmentName || assigningItem.name} <span className="text-xs text-slate-500 font-mono">({assigningItem.serialNumber})</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Select Active Employee *</label>
                                {assignLoading ? (
                                    <div className="flex items-center gap-2 py-2 text-slate-400 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span>Loading staff list...</span>
                                    </div>
                                ) : (
                                    <select
                                        required
                                        value={selectedEmployeeId}
                                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">-- Choose Employee --</option>
                                        {activeEmployeesList.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.firstName} {emp.lastName} ({emp.department || 'General'})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {assignError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                                    {assignError}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setAssigningItem(null)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignSubmitting || !selectedEmployeeId}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/25 flex items-center gap-2"
                                >
                                    {assignSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>Confirm Assignment</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Employee Modal */}
            {isEmployeeModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-base font-bold text-white">
                                {selectedEmployee ? 'Edit Employee Details' : 'Add New Employee'}
                            </h2>
                            <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
                        </div>
                        <form onSubmit={handleEmployeeSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">First Name *</label>
                                    <input type="text" required value={employeeFormData.firstName} onChange={(e) => setEmployeeFormData({...employeeFormData, firstName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Last Name *</label>
                                    <input type="text" required value={employeeFormData.lastName} onChange={(e) => setEmployeeFormData({...employeeFormData, lastName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address *</label>
                                <input type="email" required value={employeeFormData.email} onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Department</label>
                                    <input type="text" value={employeeFormData.department} onChange={(e) => setEmployeeFormData({...employeeFormData, department: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Position</label>
                                    <input type="text" value={employeeFormData.position} onChange={(e) => setEmployeeFormData({...employeeFormData, position: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Hire Date</label>
                                    <input type="date" value={employeeFormData.hireDate} onChange={(e) => setEmployeeFormData({...employeeFormData, hireDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
                                </div>
                                {selectedEmployee && (
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Account Status</label>
                                        <select value={employeeFormData.active} onChange={(e) => setEmployeeFormData({...employeeFormData, active: e.target.value === 'true'})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500">
                                            <option value="true">Active</option>
                                            <option value="false">Inactive / Left</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/25">Save Employee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        AVAILABLE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        ASSIGNED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        RETIRED: 'bg-slate-800 text-slate-400 border-slate-700',
    };
    const labels = { AVAILABLE: 'Available', ASSIGNED: 'Assigned', RETIRED: 'Retired' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
            {labels[status] || status}
        </span>
    );
}
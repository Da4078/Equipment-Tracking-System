import React, { useEffect, useState } from "react";
import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Briefcase,
    Calendar,
    Mail
} from "lucide-react";
import api from "../api/axios.js";

export default function Employees(){
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        hireDate: new Date().toISOString().split('T')[0],
        department: '',
        position: '',
        active: true
    })

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true)
        setError(false)
        try{
            const response = await api.get('/employees?page=0&size=50')
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data?.content || []);
            setEmployees(data);
        } catch (err) {
            console.error('Failed to fetch employees: ', err);
            setError('Failed to load employee directory')
            setEmployees([])
        } finally {
            setLoading(false)
        }
    }

    const handleOpenAddModal = () => {
        setSelectedEmployee(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            hireDate: new Date().toISOString().split('T')[0],
            department: '',
            position: '',
            active: true
        });
        setIsModalOpen(true);
    }

    const handleOpenEditModal = (emp) => {
        setSelectedEmployee(emp);
        setFormData({
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
            department: emp.department || '',
            position: emp.position || '',
            active: emp.active ?? true
        });
        setIsModalOpen(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(selectedEmployee){
                await api.put(`/employees/${selectedEmployee.id}`, formData);
            } else {
                await api.post('/employees', formData)
            }
            setIsModalOpen(false);
            fetchEmployees();
        }catch (err){
            const message = err.respone?.data?.message || err.response?.data || 'Failed to save employee.';
            alert(typeof message === 'string' ? message : JSON.stringify(message));
        }
    };

    const handleDelete = async (id, fullName) => {
        if(!window.confirm(`Are you sure you want to offboard/delete ${fullName}? 
        Note: The system will block this if they still hold active equipment.`)) return;
        try{
            await api.delete(`/employees/${id}`);
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } catch (err){
            const errorMsg = err.response?.data?.message || 'Cannot delete employee with active equipment assignments.'
            alert(errorMsg)
        }
    }

    const safeEmployees = Array.isArray(employees) ? employees : [];

    const filteredEmployees = safeEmployees.filter((emp) => {
        const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const dept = (emp.department || '').toLowerCase();
        const query = searchTerm.toLowerCase();

        return fullName.includes(query) || email.includes(query) || dept.includes(query);
    })

    return (
        <div className="space-y-6">
            {/* Header & Search Bar Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name, email, department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Employee Data Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center p-12 text-slate-400 gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        <span>Loading personnel directory...</span>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-400 text-sm">{error}</div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        No employees found matching your search.
                    </div>
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
                                        <td className="px-6 py-4 font-medium text-white">
                                            {fullName}
                                        </td>
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
                                                    emp.active
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                                                }`}>
                                                    {emp.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    {emp.active ? 'Active' : 'Offboarded'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(emp)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-colors"
                                                    title="Edit Employee"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp.id, fullName)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                                                    title="Offboard / Delete Employee (Protected)"
                                                >
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

            {/* Create / Edit Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-base font-bold text-white">
                                {selectedEmployee ? 'Edit Employee Details' : 'Add New Employee'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-200 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                    placeholder="john.doe@company.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                        placeholder="Engineering"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Position</label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                        placeholder="Backend Developer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Hire Date</label>
                                    <input
                                        type="date"
                                        value={formData.hireDate}
                                        onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                {selectedEmployee && (
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Account Status</label>
                                        <select
                                            value={formData.active}
                                            onChange={(e) => setFormData({...formData, active: e.target.value === 'true'})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive / Left</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Save Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
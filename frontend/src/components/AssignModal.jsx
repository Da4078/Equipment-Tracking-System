import { useState, useEffect } from 'react';
import { X, UserCheck, Loader2 } from 'lucide-react';
import api from '../api/axios.js';

export default function AssignModal({ equipmentItem, onClose, onSuccess }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActiveEmployees();
    }, []);

    const fetchActiveEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/employees?page=0&size=100');
            const data = Array.isArray(response.data) ? response.data : (response.data?.content || []);
            const activeOnly = data.filter(emp => emp.active);
            setEmployees(activeOnly);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setError('Could not load active employees.');
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedEmployeeId) return;

        setSubmitting(true);
        setError('');
        try {
            await api.post('/assignments', {
                employeeId: selectedEmployeeId,
                equipmentId: equipmentItem.id
            });
            onSuccess();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to assign equipment.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <UserCheck className="w-5 h-5 text-blue-500" />
                        <span>Assign Equipment</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleAssign} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Equipment Item</label>
                        <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200">
                            {equipmentItem.equipmentName || equipmentItem.name} <span className="text-xs text-slate-500 font-mono">({equipmentItem.serialNumber})</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Select Active Employee *</label>
                        {loading ? (
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
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName} ({emp.department || 'General'})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedEmployeeId}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/25 flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Confirm Assignment</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
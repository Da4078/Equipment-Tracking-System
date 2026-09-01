import { useEffect, useState } from 'react';
import {
    X,
    Package,
    Loader2,
    AlertCircle,
    CalendarDays,
    User,
    Mail,
    Building2,
    Briefcase,
    Clock,
    CheckCircle2,
    History
} from 'lucide-react';

import api from '../api/axios.js';

export default function EmployeeEquipmentModal({
                                                   employee,
                                                   onClose
                                               }) {

    const [equipment, setEquipment] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        if (employee?.id) {
            fetchEmployeeData();
        }

    }, [employee]);

    const fetchEmployeeData = async () => {

        setLoading(true);
        setError('');

        try {

            const [
                equipmentResponse,
                assignmentsResponse
            ] = await Promise.all([
                api.get(`/employees/${employee.id}/equipment`),
                api.get(`/employees/${employee.id}/assignments`)
            ]);

            const equipmentData =
                Array.isArray(equipmentResponse.data)
                    ? equipmentResponse.data
                    : equipmentResponse.data?.content || [];

            const assignmentData =
                Array.isArray(assignmentsResponse.data)
                    ? assignmentsResponse.data
                    : assignmentsResponse.data?.content || [];

            setEquipment(equipmentData);
            setAssignments(assignmentData);

        } catch (err) {

            console.error(
                'Failed to fetch employee details:',
                err
            );

            const message =
                err.response?.data?.message ||
                'Failed to load employee details.';

            setError(message);

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                            <User className="w-6 h-6 text-blue-400" />

                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-white">
                                {employee.firstName} {employee.lastName}
                            </h2>

                            <p className="text-sm text-slate-400">
                                Employee Details
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>

                </div>


                <div className="overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                        <InfoCard
                            icon={<Mail className="w-4 h-4" />}
                            label="Email"
                            value={employee.email || 'N/A'}
                        />

                        <InfoCard
                            icon={<Building2 className="w-4 h-4" />}
                            label="Department"
                            value={employee.department || 'N/A'}
                        />

                        <InfoCard
                            icon={<Briefcase className="w-4 h-4" />}
                            label="Position"
                            value={employee.position || 'N/A'}
                        />

                        <InfoCard
                            icon={<CalendarDays className="w-4 h-4" />}
                            label="Hire Date"
                            value={
                                employee.hireDate
                                    ? formatDate(employee.hireDate)
                                    : 'N/A'
                            }
                        />

                    </div>

                    {error ? (

                        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">

                            <AlertCircle className="w-5 h-5 shrink-0" />

                            <div>

                                <p className="font-medium">
                                    Could not load employee details
                                </p>

                                <p className="text-sm mt-1 text-red-400/80">
                                    {error}
                                </p>

                            </div>

                        </div>

                    ) : loading ? (

                        <div className="flex items-center justify-center py-16 text-slate-400 gap-3">

                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />

                            Loading employee information...

                        </div>

                    ) : (

                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                <SummaryCard
                                    label="Current Equipment"
                                    value={equipment.length}
                                    icon={
                                        <Package className="w-5 h-5" />
                                    }
                                />

                                <SummaryCard
                                    label="Total Assignments"
                                    value={assignments.length}
                                    icon={
                                        <History className="w-5 h-5" />
                                    }
                                />

                                <SummaryCard
                                    label="Returned Items"
                                    value={
                                        assignments.filter(
                                            (a) => a.returnedAt
                                        ).length
                                    }
                                    icon={
                                        <CheckCircle2 className="w-5 h-5" />
                                    }
                                />

                            </div>

                            <section>

                                <div className="flex items-center justify-between mb-4">

                                    <div>

                                        <h3 className="text-sm font-semibold text-white">
                                            Current Equipment
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Equipment currently assigned to this employee
                                        </p>

                                    </div>

                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">

                                        {equipment.length}{' '}
                                        {equipment.length === 1
                                            ? 'item'
                                            : 'items'}

                                    </span>

                                </div>

                                {equipment.length === 0 ? (

                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-10 text-center">

                                        <Package className="w-10 h-10 text-slate-700 mx-auto mb-3" />

                                        <p className="text-sm text-slate-400">
                                            No equipment currently assigned.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                        {equipment.map((item) => (

                                            <div
                                                key={item.id}
                                                className="bg-slate-950 border border-slate-800 rounded-xl p-4"
                                            >

                                                <div className="flex items-start justify-between">

                                                    <div>

                                                        <h4 className="text-sm font-semibold text-white">
                                                            {item.equipmentName ||
                                                                item.name ||
                                                                'Unnamed Equipment'}
                                                        </h4>

                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {item.type ||
                                                                item.category ||
                                                                'Unknown type'}
                                                        </p>

                                                    </div>

                                                    <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        Assigned
                                                    </span>

                                                </div>

                                                <div className="mt-4 space-y-2">

                                                    <DetailRow
                                                        label="Serial Number"
                                                        value={
                                                            item.serialNumber ||
                                                            'N/A'
                                                        }
                                                    />

                                                    <DetailRow
                                                        label="Assigned"
                                                        value={
                                                            item.assignedAt
                                                                ? formatDate(item.assignedAt)
                                                                : 'N/A'
                                                        }
                                                    />

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </section>

                            <section>

                                <div className="flex items-center gap-2 mb-4">

                                    <History className="w-4 h-4 text-blue-400" />

                                    <div>

                                        <h3 className="text-sm font-semibold text-white">
                                            Assignment History
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Everything that has been assigned to this employee
                                        </p>

                                    </div>

                                </div>

                                {assignments.length === 0 ? (

                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-10 text-center">

                                        <History className="w-10 h-10 text-slate-700 mx-auto mb-3" />

                                        <p className="text-sm text-slate-400">
                                            No assignment history.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="relative">

                                        <div className="absolute left-4 top-3 bottom-3 w-px bg-slate-800" />

                                        <div className="space-y-5">

                                            {assignments.map(
                                                (assignment, index) => {

                                                    const returned =
                                                        !!assignment.returnedAt;

                                                    return (

                                                        <div
                                                            key={
                                                                assignment.id ||
                                                                index
                                                            }
                                                            className="relative pl-10"
                                                        >

                                                            <div
                                                                className={`absolute left-2 top-1 w-5 h-5 rounded-full border-4 border-slate-900 ${
                                                                    returned
                                                                        ? 'bg-emerald-500'
                                                                        : 'bg-blue-500'
                                                                }`}
                                                            />

                                                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                                                                    <div>

                                                                        <h4 className="text-sm font-semibold text-white">

                                                                            {assignment.equipmentName ||
                                                                                'Equipment'}

                                                                        </h4>

                                                                        <p className="text-xs text-slate-500 mt-1">

                                                                            {assignment.employeeName ||
                                                                                `${employee.firstName} ${employee.lastName}`}

                                                                        </p>

                                                                    </div>

                                                                    <span
                                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                                            returned
                                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                        }`}
                                                                    >

                                                                        {returned
                                                                            ? 'Returned'
                                                                            : 'Currently Assigned'}

                                                                    </span>

                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                                                                    <div>

                                                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                                                            Assigned
                                                                        </p>

                                                                        <div className="flex items-center gap-2 mt-1">

                                                                            <CalendarDays className="w-3.5 h-3.5 text-slate-500" />

                                                                            <span className="text-xs text-slate-300">
                                                                                {assignment.assignedAt
                                                                                    ? formatDate(
                                                                                        assignment.assignedAt
                                                                                    )
                                                                                    : 'N/A'}
                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                    <div>

                                                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                                                            Returned
                                                                        </p>

                                                                        <div className="flex items-center gap-2 mt-1">

                                                                            <Clock className="w-3.5 h-3.5 text-slate-500" />

                                                                            <span className="text-xs text-slate-300">
                                                                                {assignment.returnedAt
                                                                                    ? formatDate(
                                                                                        assignment.returnedAt
                                                                                    )
                                                                                    : 'Still assigned'}
                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>

                                )}

                            </section>

                        </>

                    )}

                </div>

                <div className="px-6 py-4 border-t border-slate-800 flex justify-end">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

function InfoCard({
                      icon,
                      label,
                      value
                  }) {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

            <div className="flex items-center gap-2 text-slate-500 mb-2">

                {icon}

                <span className="text-[10px] uppercase tracking-wider">
                    {label}
                </span>

            </div>

            <p className="text-sm text-slate-200 truncate">
                {value}
            </p>

        </div>
    );
}


function SummaryCard({
                         label,
                         value,
                         icon
                     }) {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs text-slate-500">
                        {label}
                    </p>

                    <p className="text-2xl font-bold text-white mt-1">
                        {value}
                    </p>

                </div>

                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    {icon}
                </div>

            </div>

        </div>
    );
}


function DetailRow({
                       label,
                       value
                   }) {
    return (
        <div className="flex items-center justify-between">

            <span className="text-xs text-slate-500">
                {label}
            </span>

            <span className="text-xs text-slate-300 font-mono">
                {value}
            </span>

        </div>
    );
}


function formatDate(value) {

    if (!value) {
        return 'N/A';
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'N/A';
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
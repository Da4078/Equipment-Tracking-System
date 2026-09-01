import { useEffect, useState } from "react";
import {
    X,
    Package,
    Loader2,
    AlertCircle,
    User,
    CalendarDays,
    ArrowDown,
    CheckCircle2
} from "lucide-react";
import api from "../api/axios.js";

export default function EquipmentHistoryModal({
                                                  equipment,
                                                  onClose
                                              }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (equipment?.id) {
            fetchHistory();
        }
    }, [equipment]);

    const fetchHistory = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                `/assignments/equipment/${equipment.id}/history`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : (response.data?.content || []);

            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch equipment history:", err);

            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to load equipment history.";

            setError(message);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between shrink-0">

                    <div className="flex items-center gap-3">

                        <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                            <Package className="w-5 h-5" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-white">
                                Equipment History
                            </h2>

                            <p className="text-sm text-slate-400 mt-0.5">
                                {equipment?.equipmentName || equipment?.name}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                </div>

                <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800">

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                Serial Number
                            </p>

                            <p className="text-xs font-mono text-slate-300 mt-1">
                                {equipment?.serialNumber || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                Type
                            </p>

                            <p className="text-xs text-slate-300 mt-1">
                                {equipment?.type || equipment?.category || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                Total Assignments
                            </p>

                            <p className="text-xs text-slate-300 mt-1">
                                {history.length}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="p-6 overflow-y-auto">

                    {loading ? (

                        <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            <span>Loading equipment history...</span>
                        </div>

                    ) : error ? (

                        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">

                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

                            <div>
                                <p className="font-medium">
                                    Could not load history
                                </p>

                                <p className="text-sm mt-1 text-red-400/80">
                                    {error}
                                </p>
                            </div>

                        </div>

                    ) : history.length === 0 ? (

                        <div className="text-center py-16">

                            <div className="p-3 bg-slate-800/60 rounded-full w-fit mx-auto mb-4">
                                <Package className="w-7 h-7 text-slate-500" />
                            </div>

                            <h3 className="text-white font-medium">
                                No assignment history
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                This equipment has never been assigned to an employee.
                            </p>

                        </div>

                    ) : (

                        <div>

                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-200">
                                        Assignment Timeline
                                    </h3>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Most recent assignment first
                                    </p>
                                </div>

                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                    {history.length}{" "}
                                    {history.length === 1 ? "assignment" : "assignments"}
                                </span>

                            </div>

                            <div className="relative">

                                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-800" />

                                <div className="space-y-6">

                                    {history.map((assignment, index) => {

                                        const isCurrent =
                                            assignment.returnedAt == null;

                                        return (
                                            <div
                                                key={assignment.id}
                                                className="relative pl-11"
                                            >

                                                <div
                                                    className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border ${
                                                        isCurrent
                                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                                            : "bg-slate-800 text-slate-500 border-slate-700"
                                                    }`}
                                                >
                                                    {isCurrent ? (
                                                        <User className="w-4 h-4" />
                                                    ) : (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    )}
                                                </div>

                                                <div
                                                    className={`rounded-xl border p-4 transition-colors ${
                                                        isCurrent
                                                            ? "bg-blue-500/5 border-blue-500/30"
                                                            : "bg-slate-950 border-slate-800"
                                                    }`}
                                                >

                                                    <div className="flex items-start justify-between gap-3">

                                                        <div>
                                                            <p className="text-sm font-semibold text-white">
                                                                {assignment.employeeName || "Unknown Employee"}
                                                            </p>

                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                Assignment #{history.length - index}
                                                            </p>
                                                        </div>

                                                        {isCurrent ? (

                                                            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                                Currently Assigned
                                                            </span>

                                                        ) : (

                                                            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                                                Returned
                                                            </span>

                                                        )}

                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/70">

                                                        <div className="flex items-start gap-2.5">

                                                            <CalendarDays className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                                                    Assigned
                                                                </p>

                                                                <p className="text-xs text-slate-300 mt-1">
                                                                    {formatDate(assignment.assignedAt)}
                                                                </p>
                                                            </div>

                                                        </div>

                                                        <div className="flex items-start gap-2.5">

                                                            <CalendarDays className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />

                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                                                    Returned
                                                                </p>

                                                                <p className="text-xs text-slate-300 mt-1">
                                                                    {formatDate(assignment.returnedAt)}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                                {index < history.length - 1 && (
                                                    <div className="absolute left-[11px] -bottom-5 text-slate-700">
                                                        <ArrowDown className="w-2.5 h-2.5" />
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                <div className="px-6 py-4 border-t border-slate-800 flex justify-end shrink-0">

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
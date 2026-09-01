import { Package, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmployeeDashboard() {

    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

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

            <main className="max-w-7xl mx-auto px-6 py-10">

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Package className="w-5 h-5 text-blue-400" />
                        </div>

                        <h3 className="text-lg font-semibold text-white">
                            My Equipment
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            View all equipment currently assigned to you.
                        </p>

                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                            <User className="w-5 h-5 text-indigo-400" />
                        </div>

                        <h3 className="text-lg font-semibold text-white">
                            My Profile
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            View your employee information and account details.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}
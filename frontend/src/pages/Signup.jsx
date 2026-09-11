import { useState } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    AlertCircle,
    Loader2,
    ArrowRight,
    Briefcase
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const signupData = {
                email,
                password,
            };

            console.log('SIGNUP DATA:', signupData);

            const response = await api.post(
                '/auth/signup',
                signupData
            );

            console.log('SIGNUP SUCCESS:', response.data);

            await login();

        } catch (err) {
            console.error(
                'SIGNUP ERROR:',
                err.response || err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to create an account.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">

            {/* Background effects */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

            <div className="absolute -bottom-32 right-10 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

            {/* Signup card */}
            <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100">

                {/* Header */}
                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl mb-3 shadow-lg shadow-blue-500/30">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Create Account
                    </h2>

                    <p className="mt-1.5 text-sm text-slate-400">
                        Create an administrator account for the Equipment Tracker
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email Address
                        </label>

                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="manager@company.com"
                                required
                                autoComplete="email"
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Password
                        </label>

                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                autoComplete="new-password"
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                                className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        <p className="mt-1.5 text-xs text-slate-500">
                            Password must contain at least 6 characters.
                        </p>
                    </div>

                    {/* Account type */}
                    <div className="pt-2 border-t border-slate-800">

                        <p className="text-sm font-medium text-slate-300 mb-3">
                            Account Type
                        </p>

                        <div className="p-4 rounded-xl border border-blue-500 bg-blue-500/10 ring-1 ring-blue-500">
                            <div className="flex items-start gap-3">

                                <Briefcase className="w-5 h-5 mt-0.5 text-blue-400" />

                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Manager
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Manage employees and equipment
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Employee information notice */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-400">
                            Employee accounts cannot be created through signup.
                            A manager creates an employee account from the
                            Employee Management section.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create an Account</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                </form>

                {/* Login link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?{' '}

                        <button
                            type="button"
                            onClick={login}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            Log in
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}
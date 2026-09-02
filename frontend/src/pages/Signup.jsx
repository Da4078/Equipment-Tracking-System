import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    AlertCircle,
    Loader2,
    ArrowRight,
    User,
    Briefcase,
    Building2,
    Calendar
} from 'lucide-react';
import api from '../api/axios';

export default function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [role, setRole] = useState('EMPLOYEE');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [hireDate, setHireDate] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setError('');

        if (newRole === 'MANAGER') {
            setFirstName('');
            setLastName('');
            setDepartment('');
            setPosition('');
            setHireDate('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const signupData = {
                email,
                password,
                role
            };

            if (role === 'EMPLOYEE') {
                signupData.firstName = firstName;
                signupData.lastName = lastName;
                signupData.department = department;
                signupData.position = position;
                signupData.hireDate = hireDate;
            }

            console.log('SIGNUP DATA:', signupData);

            const response = await api.post(
                '/auth/signup',
                signupData
            );

            console.log('SIGNUP SUCCESS:', response.data);

            navigate('/login', {
                replace: true
            });

        } catch (err) {
            console.error(
                'SIGNUP ERROR:',
                err.response || err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to create account.'
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
                        Join the Equipment Tracker
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
                                placeholder="name@company.com"
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
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Account Type
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                            {/* Employee */}
                            <button
                                type="button"
                                onClick={() => handleRoleChange('EMPLOYEE')}
                                className={`p-4 rounded-xl border text-left transition-all ${
    role === 'EMPLOYEE'
        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500'
        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
}`}
                            >
                                <User
                                    className={`w-5 h-5 mb-2 ${
    role === 'EMPLOYEE'
        ? 'text-blue-400'
        : 'text-slate-500'
}`}
                                />

                                <p className="text-sm font-semibold text-white">
                                    Employee
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                    View your equipment
                                </p>
                            </button>

                            {/* Manager */}
                            <button
                                type="button"
                                onClick={() => handleRoleChange('MANAGER')}
                                className={`p-4 rounded-xl border text-left transition-all ${
    role === 'MANAGER'
        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500'
        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
}`}
                            >
                                <Briefcase
                                    className={`w-5 h-5 mb-2 ${
    role === 'MANAGER'
        ? 'text-blue-400'
        : 'text-slate-500'
}`}
                                />

                                <p className="text-sm font-semibold text-white">
                                    Manager
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                    Manage equipment & users
                                </p>
                            </button>

                        </div>
                    </div>

                    {/* Employee information */}
                    {role === 'EMPLOYEE' && (
                        <div className="pt-2 border-t border-slate-800">

                            <p className="text-sm font-medium text-slate-300 mb-4">
                                Employee Information
                            </p>

                            <div className="space-y-4">

                                {/* First Name + Last Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* First name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            First Name
                                        </label>

                                        <div className="relative flex items-center">
                                            <User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="John"
                                                required
                                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Last name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            Last Name
                                        </label>

                                        <div className="relative flex items-center">
                                            <User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                required
                                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Department + Position */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Department */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            Department
                                        </label>

                                        <div className="relative flex items-center">
                                            <Building2 className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                                            <input
                                                type="text"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                placeholder="IT"
                                                required
                                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                            Position
                                        </label>

                                        <div className="relative flex items-center">
                                            <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                                            <input
                                                type="text"
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                                placeholder="Software Developer"
                                                required
                                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Hire Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Hire Date
                                    </label>

                                    <div className="relative flex items-center">
                                        <Calendar className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />

                                        <input
                                            type="date"
                                            value={hireDate}
                                            onChange={(e) => setHireDate(e.target.value)}
                                            required
                                            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Selected role */}
                    <div className="text-center text-xs text-slate-500">
                        Selected account type:{' '}

                        <span className="text-blue-400 font-medium">
                            {role === 'MANAGER' ? 'Manager' : 'Employee'}
                        </span>
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
                                <span>Create Account</span>
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
                            onClick={() => navigate('/login')}
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
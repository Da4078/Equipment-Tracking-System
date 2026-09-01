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
    ArrowRight
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setLoading(true);

        try {

            const response = await api.post('/auth/login', {
                email,
                password
            });

            console.log('LOGIN SUCCESS:', response.data);

            const token =
                response.data.token ||
                response.data.accessToken;

            const userData = {
                id: response.data.id,
                email: response.data.email,
                roles: response.data.roles
            };

            if (!token) {
                throw new Error(
                    'No authentication token received from server.'
                );
            }

            login(token, userData);

            if (userData.roles?.includes('ROLE_ADMIN')) {

                navigate('/dashboard', {
                    replace: true
                });

            } else if (userData.roles?.includes('ROLE_EMPLOYEE')) {

                navigate('/employee-dashboard', {
                    replace: true
                });

            } else {

                throw new Error(
                    'Your account does not have a valid role.'
                );
            }

        } catch (err) {

            console.error(
                'LOGIN ERROR DETAILS:',
                err.response || err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                'Authentication failed. Please check your credentials.'
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">

            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

            <div className="absolute -bottom-32 right-10 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100">

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl mb-3 shadow-lg shadow-blue-500/30">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Equipment Tracker
                    </h2>

                    <p className="mt-1.5 text-sm text-slate-400">
                        Log in to manage active equipment
                    </p>

                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">

                        <AlertCircle className="w-4 h-4 shrink-0" />

                        <span>{error}</span>

                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

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
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />

                        </div>

                    </div>

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
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword
                                    ? <EyeOff className="w-4 h-4" />
                                    : <EyeOff className="w-4 h-4" />
                                }
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Log In</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}

                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-slate-500">

                    Don't have an account?{' '}

                    <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        Create one
                    </button>

                </div>

            </div>

        </div>
    );
}
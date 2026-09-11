import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login();
        } catch (error) {
            console.error('Failed to launch Keycloak login:', error);
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">

            {/* Background effects */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute -bottom-32 right-10 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

            {/* Login card */}
            <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 text-center">

                {/* Header */}
                <div className="mb-8">

                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl mb-3 shadow-lg shadow-blue-500/30">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Equipment Tracker
                    </h2>

                    <p className="mt-1.5 text-sm text-slate-400">
                        Log in with your account to access the inventory portal
                    </p>

                </div>

                {/* Single Keycloak Login Trigger */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Redirecting to Keycloak...</span>
                        </>
                    ) : (
                        <>
                            <span>Log In</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Signup link */}
                <div className="mt-6 text-sm text-slate-500">
                    Don't have an account?{' '}
                    <button
                        type="button"
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
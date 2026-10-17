import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService as auth } from '@/lib/authService';
import { Button, Input, PasswordInput, Label, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/basic';
import { UserPlus, Mail, Lock, Loader2, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Building2, Stethoscope, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function RegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const plan = searchParams.get('plan') || 'free';
    const billing = searchParams.get('billing') || 'monthly';

    const handleDemoLogin = async (role: 'HOSPITAL_ADMIN' | 'DOCTOR' | 'CLINIC_ADMIN') => {
        setLoading(true);
        try {
            await auth.signInDemo(role);
            toast({
                title: '⚡ Instant Evaluator Access Granted',
                description: `Authenticated as ${role === 'HOSPITAL_ADMIN' ? 'Hospital Medical Director' : role === 'DOCTOR' ? 'Consulting Doctor' : 'Emergency Triage Lead'}`,
                className: 'bg-emerald-50 border-emerald-200 text-emerald-900'
            });
            navigate('/app');
        } catch (err: any) {
            toast({
                title: 'Demo Access Failed',
                description: err.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Sign up user via abstract AuthService
            await auth.signUp(email, password, {
                full_name: fullName,
                onboarding_plan: plan,
                onboarding_billing: billing,
                role: 'HOSPITAL_ADMIN'
            });

            setSuccess(true);
            toast({
                title: 'Account Created',
                description: 'Please check your email to verify your account.',
                className: 'bg-green-50 border-green-200 text-green-900'
            });

        } catch (err: any) {
            console.error('Registration Error:', err);
            toast({
                title: 'Registration Failed',
                description: err.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md text-center p-8 glass-card border-green-100">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</CardTitle>
                    <CardDescription className="text-slate-600 text-lg mb-8">
                        We've sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
                        Once verified, you can complete your hospital setup.
                    </CardDescription>
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white gap-2"
                    >
                        Go to Login <ArrowRight className="w-5 h-5" />
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors z-10"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </button>

            <Card className="w-full max-w-lg glass-card shadow-2xl border-white/50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="space-y-4 pt-8 text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Start your Trial
                        </CardTitle>
                        <CardDescription className="text-slate-500 text-base flex justify-center items-center gap-2">
                            <span>Setting up for</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-sm font-bold uppercase tracking-wider">
                                {plan}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-500 capitalize">{billing} Billing</span>
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 pb-8">
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Dr. Potla Sri Sharan"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="doctor@ayusetu.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Create Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <PasswordInput
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400">At least 8 characters long</p>
                        </div>

                        <div className="pt-4 space-y-4">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-xl"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Create My Account <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>

                            <div className="relative pt-1">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/90 px-3 text-slate-500 font-bold tracking-wider rounded">
                                        ⚡ Hackathon Instant Evaluator Bypass
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin('HOSPITAL_ADMIN')}
                                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 transition-all text-center group shadow-sm"
                                >
                                    <Building2 className="w-5 h-5 mb-1 text-blue-600 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold leading-tight">Admin Suite</span>
                                    <span className="text-[10px] text-blue-600 font-medium">All ERP Modules</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin('DOCTOR')}
                                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 transition-all text-center group shadow-sm"
                                >
                                    <Stethoscope className="w-5 h-5 mb-1 text-emerald-600 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold leading-tight">Doctor SOAP</span>
                                    <span className="text-[10px] text-emerald-600 font-medium">15s Rx Console</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin('CLINIC_ADMIN')}
                                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-900 transition-all text-center group shadow-sm"
                                >
                                    <ShieldAlert className="w-5 h-5 mb-1 text-rose-600 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold leading-tight">Emergency</span>
                                    <span className="text-[10px] text-rose-600 font-medium">STAT Triage</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col border-t border-slate-100/50 bg-slate-50/50 rounded-b-2xl p-6">
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Secure HIPAA-compliant registration
                    </div>
                    <p className="text-center text-slate-600 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Sign In
                        </button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

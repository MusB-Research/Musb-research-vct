import React, { useMemo } from 'react';
import { Check, X, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface PasswordStrengthProps {
    password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
    const requirements = useMemo(() => [
        { label: '10-32 Characters', test: (p: string) => p.length >= 10 && p.length <= 32 },
        { label: 'Uppercase Letter', test: (p: string) => /[A-Z]/.test(p) },
        { label: 'Lowercase Letter', test: (p: string) => /[a-z]/.test(p) },
        { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
        { label: 'Special Character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    ], []);

    const metCount = requirements.filter(req => req.test(password)).length;
    const percentage = (metCount / requirements.length) * 100;

    const getColor = () => {
        if (metCount === 0) return 'bg-slate-800';
        if (metCount <= 2) return 'bg-red-500';
        if (metCount <= 4) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getLabel = () => {
        if (metCount === 0) return 'Enter Password';
        if (metCount <= 2) return 'Weak';
        if (metCount <= 4) return 'Medium';
        return 'Strong & Secure';
    };

    if (!password) return null;

    return (
        <div className="mt-4 space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    {metCount <= 2 && <ShieldAlert size={14} className="text-red-400" />}
                    {metCount > 2 && metCount <= 4 && <Shield size={14} className="text-amber-400" />}
                    {metCount === 5 && <ShieldCheck size={14} className="text-emerald-400" />}
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Strength:
                        <span className={`ml-2 ${metCount <= 2 ? 'text-red-400' : metCount <= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {getLabel()}
                        </span>
                    </span>
                </div>
                <span className="text-[10px] font-bold text-slate-600">{metCount}/5</span>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${getColor()}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1">
                {requirements.map((req, i) => {
                    const isMet = req.test(password);
                    return (
                        <div key={i} className="flex items-center gap-2">
                            {isMet ? (
                                <Check size={12} className="text-emerald-400 shrink-0" />
                            ) : (
                                <X size={12} className="text-slate-600 shrink-0" />
                            )}
                            <span className={`text-[10px] font-medium tracking-tight ${isMet ? 'text-slate-200' : 'text-slate-500'}`}>
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordStrength;

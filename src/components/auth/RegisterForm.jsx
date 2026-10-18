'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { registerUser } from '@/actions/server/auth';
import { useAuth } from '@/context/AuthContext';

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '/dashboard';
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      agreeTerms: false,
    },
    mode: 'onTouched',
  });
  const watchedPassword = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-zinc-200 dark:bg-zinc-800' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    if (score >= 3) return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  };

  const strength = calculatePasswordStrength(watchedPassword);

  const onSubmit = async (data) => {
    setServerError('');
    setServerSuccess('');

    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (res?.success) {
        setServerSuccess(res.message || 'Sanctuary account created successfully! Redirecting...');
        login({
          id: res.userId,
          name: data.name,
          email: data.email,
          role: 'user',
        });
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1200);
      } else {
        setServerError(res?.message || 'Registration could not be completed. Please try again.');
      }
    } catch (err) {
      setServerError('A network error occurred. Please check your connection and try again.');
    }
  };

  const handleSocialRegister = (provider) => {
    setServerError(
      `Direct ${provider} sign-up is initialized. Connect provider credentials in production.`
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center px-2 sm:px-4 py-2 sm:py-4">
      <div className="mb-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Membership Enrollment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Join the Lumiere Sanctuary to receive member privileges and curated wellness experiences.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleSocialRegister('Google')}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all duration-200 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialRegister('GitHub')}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all duration-200 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer"
        >
          <FaGithub className="w-4 h-4 text-zinc-800 dark:text-white shrink-0" />
          <span>GitHub</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
        <span className="bg-zinc-50 dark:bg-zinc-900 px-3 text-xs uppercase tracking-wider text-zinc-400 font-medium absolute">
          or sign up with email
        </span>
      </div>

      {serverError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{serverError}</span>
        </div>
      )}

      {serverSuccess && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
          <span>{serverSuccess}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Eleanor Vance"
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters long' },
              })}
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-zinc-900 border rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#580F41]/30 transition-all duration-200 ${
                errors.name
                  ? 'border-rose-500 dark:border-rose-500 focus:border-rose-500'
                  : 'border-zinc-200 dark:border-zinc-800 focus:border-[#580F41] dark:focus:border-rose-400'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="eleanor@domain.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-zinc-900 border rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#580F41]/30 transition-all duration-200 ${
                errors.email
                  ? 'border-rose-500 dark:border-rose-500 focus:border-rose-500'
                  : 'border-zinc-200 dark:border-zinc-800 focus:border-[#580F41] dark:focus:border-rose-400'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className={`w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white dark:bg-zinc-900 border rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#580F41]/30 transition-all duration-200 ${
                errors.password
                  ? 'border-rose-500 dark:border-rose-500 focus:border-rose-500'
                  : 'border-zinc-200 dark:border-zinc-800 focus:border-[#580F41] dark:focus:border-rose-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password.message}</span>
            </p>
          )}
          {watchedPassword && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Password strength</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                <div
                  className={`rounded-full transition-colors duration-300 ${
                    strength.score >= 1 ? strength.color : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
                <div
                  className={`rounded-full transition-colors duration-300 ${
                    strength.score >= 2 ? strength.color : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
                <div
                  className={`rounded-full transition-colors duration-300 ${
                    strength.score >= 3 ? strength.color : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('agreeTerms', {
                required: 'You must agree to the Terms of Service & Privacy Policy',
              })}
              className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-[#580F41] focus:ring-[#580F41]/40 accent-[#580F41] cursor-pointer"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight">
              I agree to the{' '}
              <a
                href="#"
                className="text-[#580F41] dark:text-rose-400 underline hover:text-[#7a155a]"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="text-[#580F41] dark:text-rose-400 underline hover:text-[#7a155a]"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.agreeTerms.message}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3.5 px-4 rounded-xl bg-linear-to-r from-[#580F41] via-[#751457] to-[#580F41] text-white font-medium text-sm shadow-lg shadow-[#580F41]/25 hover:shadow-xl hover:shadow-[#580F41]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your sanctuary...</span>
            </div>
          ) : (
            <>
              <span>Enroll as Member</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Already have a Lumiere account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#580F41] dark:text-rose-400 hover:text-[#7a155a] dark:hover:text-rose-300 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Strict zero-spam policy & 256-bit encrypted data</span>
      </div>
    </div>
  );
};

export default RegisterForm;

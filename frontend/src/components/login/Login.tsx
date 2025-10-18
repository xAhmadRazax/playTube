import { useForm } from 'react-hook-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { LockKeyhole, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/useAuth';
import { PASSWORD_RULES } from '@/constants/constants';

interface LoginType {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<LoginType>();
  const { login, isLoading, error } = useAuthStore();
  const password = watch('password');
  const hasPasswordError = PASSWORD_RULES.some((el) => !el.valid(password));

  const submitHandler = async (data: LoginType) => {
    const userRes = await login({ identifier: data.email, password });
    if (userRes?.email) {
      return await navigate({ to: '/' });
    }
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <section
      className={`bg-zinc-950  w-[min(90%,450px)] rounded-2xl border  shadow-linear  px-6 pt-12 pb-6 
        ${password && hasPasswordError ? ' shadow-red-700/70 border-red-700' : ' shadow-zinc-700/65 border-zinc-600'} transition-all `}
    >
      <header className="flex flex-col gap-3 items-center">
        <h2 className="capitalize font-bold text-3xl text-zinc-100">
          Welcome back
        </h2>

        <div className="text-sm flex gap-1.5">
          <span className="text-zinc-300">Don't have an account yet?</span>
          <Link
            className="underline hover:no-underline text-zinc-100 font-bold outline-none  focus-visible:ring-zinc-500 focus-visible:ring-2 "
            to="/auth/register"
            aria-label="Sign up for an account"
          >
            Sign up
          </Link>
        </div>
      </header>
      <div className="border-b border-zinc-600 mt-4 w-1/4 m-auto"></div>
      <form onSubmit={handleSubmit(submitHandler)} className="">
        <div className="grid gap-6 mt-6">
          <div className="relative flex items-center">
            <label htmlFor="email" className="absolute ps-2">
              <Mail className="text-zinc-200" />
            </label>
            <input
              {...register('email')}
              required
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill"
              type="email"
              id="email"
              placeholder="Email Address"
            />
          </div>
          <div className="relative flex items-center">
            <label htmlFor="password" className="absolute ps-2">
              <LockKeyhole />
            </label>
            <input
              {...register('password')}
              autoComplete="no"
              required
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill"
              type="password"
              id="password"
              placeholder="Password"
            />
          </div>
        </div>
        <ul
          className={`text-xs grid grid-cols-2 gap-1 transition-all duration-300  
        ${password && hasPasswordError ? 'opacity-100 max-h-40 mt-6' : 'opacity-0 max-h-0 overflow-hidden'}`}
        >
          {password &&
            hasPasswordError &&
            PASSWORD_RULES.map((err) =>
              !err.valid(password) ? (
                <li
                  key={err.label}
                  className="text-red-300 flex gap-1 items-center"
                >
                  ❌ {err.label}
                </li>
              ) : (
                <li
                  key={err.label}
                  className="text-green-300 flex gap-1 items-center"
                >
                  ✅ {err.label}
                </li>
              ),
            )}
          {/* Password mismatch check */}
        </ul>

        <Button
          disabled={hasPasswordError || isLoading}
          className={`mt-8 bg-blue-600 font-bold text-base hover:bg-blue-800  text-zinc-200 cursor-pointer w-full flex focus-visible:ring-zinc-500 disabled:bg-gray-500 ${isLoading ? 'disabled:bg-indigo-500' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing
            </span>
          ) : (
            'Login'
          )}
        </Button>
      </form>
      <div className="relative flex  items-center justify-center mt-8">
        <div className="absolute border-b  border-zinc-600  w-1/4 m-auto"></div>
        <div className="absolute text-zinc-300 tracking-wide text-sm">OR</div>
      </div>
      <footer className="flex  justify-center mt-8 ">
        <Button
          className="bg-zinc-800 cursor-pointer  focus-visible:ring-zinc-500"
          size="lg"
        >
          <span>
            {' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-36 h-36"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
          </span>
        </Button>

        <div></div>
      </footer>
    </section>
  );
};

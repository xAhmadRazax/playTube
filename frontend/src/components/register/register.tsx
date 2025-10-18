import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { Calendar, LockKeyhole, Mail, User, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { DatePicker } from '../formElements/DatePicker';
import type { RegisterUserType } from '@/types/user.type';
import { useAuthStore } from '@/store/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const {
    error,
    register: registerHandler,
    checkIdentifier,
    isLoading,
  } = useAuthStore();
  const { control, register, handleSubmit, watch, trigger } =
    useForm<RegisterUserType>({ criteriaMode: 'all' });

  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [identifierCheckLoading, setIdentifierCheckLoading] = useState<{
    usernameLoading: boolean;
    emailLoading: boolean;
  }>({ usernameLoading: false, emailLoading: false });

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  const userNameValue = watch('username');
  const emailValue = watch('email');

  const passwordRules = [
    {
      label: 'At least 6 characters',
      valid: passwordValue && passwordValue.length >= 6,
    },
    {
      label: 'Must contain an uppercase letter',
      valid: /[A-Z]/.test(passwordValue),
    },
    {
      label: 'Must contain a lowercase letter',
      valid: /[a-z]/.test(passwordValue),
    },
    { label: 'Must contain a number', valid: /\d/.test(passwordValue) },
    {
      label: 'Must contain a special character',
      valid: /[!@#$%^&*]/.test(passwordValue),
    },
  ];

  const hasPasswordError = passwordValue
    ? passwordRules.some((e) => !e.valid)
    : false;

  useEffect(() => {
    if (usernameError) {
      setUsernameError('');
    }

    const timer = setTimeout(async () => {
      if (userNameValue) {
        const data = await checkIdentifier(
          userNameValue,
          () => {
            setIdentifierCheckLoading((ob) => ({
              ...ob,
              usernameLoading: true,
            }));
          },
          () => {
            setIdentifierCheckLoading((ob) => ({
              ...ob,
              usernameLoading: false,
            }));
          },
        );

        if (!data.available) {
          setUsernameError('username already exist');
        }
      }
    }, 500);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [userNameValue]);

  useEffect(() => {
    if (emailError) {
      setEmailError('');
    }
    const timer = setTimeout(async () => {
      if (emailValue) {
        const data = await checkIdentifier(
          emailValue,
          () => {
            setIdentifierCheckLoading((ob) => ({
              ...ob,
              emailLoading: true,
            }));
          },
          () => {
            setIdentifierCheckLoading((ob) => ({
              ...ob,
              emailLoading: false,
            }));
          },
        );
        if (!data.available) {
          setEmailError('email already exist');
        }
      }
    }, 500);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [emailValue]);

  const submitHandler = async (data: RegisterUserType) => {
    const userData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0],
    };
    console.log(userData);
    const userRes = await registerHandler(userData);
    if (userRes?.email) {
      await navigate({ to: '/' });
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

  console.log(userNameValue, usernameError);
  return (
    <section
      className={`bg-zinc-950  w-[min(90%,500px)] rounded-2xl border  shadow-linear   px-6 py-12 
        ${hasPasswordError ? ' shadow-red-700/70 border-red-700' : ' shadow-zinc-700/65 border-zinc-600'} transition-all `}
    >
      <header className="flex flex-col gap-3 items-center">
        <h2 className="capitalize font-bold text-3xl text-zinc-100">
          Join PlayTube
        </h2>

        <div className="text-sm flex gap-1.5">
          <span className="text-zinc-300">Already have an account?</span>
          <Link
            className="underline hover:no-underline text-zinc-100 font-bold outline-none focus-visible:ring-zinc-500 focus-visible:ring-2"
            to="/auth/login"
            aria-label="Login to your account"
          >
            Login
          </Link>
        </div>
      </header>

      <div className="border-b border-zinc-600 mt-4 w-1/4 m-auto"></div>

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="grid md:grid-cols-2 gap-6 mt-6  ">
          {/* Username */}
          <div className="relative flex items-center">
            <label htmlFor="username" className="absolute ps-2">
              <User className="text-zinc-200" />
            </label>
            <input
              {...register('username')}
              required
              className={`w-full rounded text-zinc-100 ps-10 py-1 border  outline-none  focus-visible:ring-2 no-autofill  bg-transparent placeholder:text-zinc-400 ${usernameError ? 'border-red-600 focus-visible:ring-red-500' : 'border-zinc-600 focus-visible:ring-zinc-500'}`}
              type="text"
              id="username"
              placeholder="Username"
            />
          </div>

          {/* Email */}
          <div className="relative flex items-center">
            <label htmlFor="email" className="absolute ps-2">
              <Mail className="text-zinc-200" />
            </label>
            <input
              {...register('email')}
              required
              className={`w-full rounded text-zinc-100 ps-10 py-1 border  outline-none  focus-visible:ring-2 no-autofill  placeholder:text-zinc-400 ${emailError ? 'border-red-600 focus-visible:ring-red-500' : 'border-zinc-600 focus-visible:ring-zinc-500'}`}
              type="email"
              id="email"
              placeholder="Email Address"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            <label htmlFor="password" className="absolute ps-2">
              <LockKeyhole className="text-zinc-200" />
            </label>
            <input
              {...register('password')}
              onBlur={() => trigger('password')}
              autoComplete="new-password"
              required
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill bg-transparent placeholder:text-zinc-400"
              type="password"
              id="password"
              placeholder="Password"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative flex items-center">
            <label htmlFor="confirmPassword" className="absolute ps-2">
              <LockKeyhole className="text-zinc-200" />
            </label>
            <input
              {...register('confirmPassword')}
              autoComplete="new-password"
              required
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill bg-transparent placeholder:text-zinc-400"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>

          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                name="DOB"
              />
            )}
          />

          {/* Gender */}
          <div className="relative flex items-center">
            <label htmlFor="gender" className="absolute ps-2">
              <Users className="text-zinc-200" />
            </label>
            <select
              {...register('gender')}
              required
              className={`w-full rounded ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 bg-zinc-950  invalid:text-zinc-400 text-zinc-100" `}
              id="gender"
            >
              <option value="" className="text-zinc-400">
                Select Gender
              </option>
              <option value="male" className="text-zinc-100">
                Male
              </option>
              <option value="female" className="text-zinc-100">
                Female
              </option>
              <option value="other" className="text-zinc-100">
                Other
              </option>
            </select>
          </div>
        </div>
        {/* Password validation errors */}
        <ul
          className={`text-xs grid grid-cols-2 gap-1 transition-all duration-300  
        ${usernameError || hasPasswordError || emailError ? 'opacity-100 max-h-40 mt-6' : 'opacity-0 max-h-0 overflow-hidden'}`}
        >
          {hasPasswordError &&
            passwordRules.map((err) =>
              !err.valid ? (
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

          {confirmPasswordValue && passwordValue !== confirmPasswordValue && (
            <li
              key={'confirm-password-error-check'}
              className="text-red-300 flex gap-1 items-center"
            >
              ❌ Passwords do not match
            </li>
          )}
          {userNameValue && usernameError && (
            <li className="text-red-300 flex gap-1 items-center">
              ❌ username already exists
            </li>
          )}
          {emailError && emailError && (
            <li className="text-red-300 flex gap-1 items-center">
              ❌ email already exists
            </li>
          )}
        </ul>

        <Button
          type="submit"
          disabled={hasPasswordError || isLoading}
          className={`mt-8 bg-blue-600 font-bold text-base hover:bg-blue-800 text-zinc-200 cursor-pointer w-full flex focus-visible:ring-zinc-500 disabled:bg-gray-500 ${isLoading ? 'disabled:bg-indigo-500' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="mr-3 w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </section>
  );
};

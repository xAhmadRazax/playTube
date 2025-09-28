import { Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { Calendar, LockKeyhole, Mail, User, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { DatePicker } from '../formElements/DatePicker';
import type { ChangeEvent } from 'react';
import type { RegisterUserType } from '@/types/user.type';
import { useAuthContext } from '@/contexts/AuthContext';

// const Button = ({
//   children,
//   className = '',
//   disabled = false,
//   size = 'default',
//   ...props
// }) => {
//   const sizeClasses = size === 'lg' ? 'px-6 py-3' : 'px-4 py-2'
//   return (
//     <button
//       className={`rounded font-medium transition-colors outline-none focus-visible:ring-2 ${sizeClasses} ${className}`}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   )
// }

// const Link = ({ children, to, className = '', ...props }) => (
//   <a href={to} className={className} {...props}>
//     {children}
//   </a>
// )
interface PasswordErrorType {
  hasError: boolean;
  ErrorType: 'Uppercase' | 'Numeric' | 'Special' | 'length';
  ErrorMessage: string;
  regex: RegExp;
}

const HAS_UPPERCASE_REGEX = /[A-Z]/;
const HAS_NUMBER_REGEX = /[0-9]/;
const HAS_SPECIAL_REGEX = /[^A-Za-z0-9\s]/;
const HAS_LENGTH_REGEX = /^.{6,}$/;
export const Register = () => {
  const { checkIdentifier, loading } = useAuthContext();

  const [formData, setFormData] = useState<RegisterUserType>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    // avatar: null,
    birthday: undefined,
  });

  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [identifierCheckLoading, setIdentifierCheckLoading] = useState<{
    usernameLoading: boolean;
    emailLoading: boolean;
  }>({ usernameLoading: false, emailLoading: false });
  const [passwordError, setPasswordError] = useState<Array<PasswordErrorType>>([
    {
      hasError: false,
      ErrorType: 'Uppercase',
      ErrorMessage: 'At least one uppercase letter',
      regex: HAS_UPPERCASE_REGEX,
    },
    {
      hasError: false,
      ErrorType: 'Numeric',
      ErrorMessage: 'At least one number',
      regex: HAS_NUMBER_REGEX,
    },
    {
      hasError: false,
      ErrorType: 'Special',
      ErrorMessage: 'At least one special character',
      regex: HAS_SPECIAL_REGEX,
    },
    {
      hasError: false,
      ErrorType: 'length',
      ErrorMessage: 'Min length must be 6 characters',
      regex: HAS_LENGTH_REGEX,
    },
  ]);
  const [hasPasswordError, setHasPasswordError] = useState(false);
  // const [loading, setLoading] = useState(false)

  const handleInputChange =
    (field: string) =>
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  //   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files && e.target.files[0]
  //     setFormData((prev) => ({
  //       ...prev,
  //       avatar: file,
  //     }))
  //   }

  const handleBirthdayChange = (date: Date | undefined) => {
    setFormData((val) => ({ ...val, birthday: date }));
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange('password')(e);

    const password = e.target.value;

    // Basic password validation
    // const errors = [
    //   {
    //     ErrorType: 'length',
    //     ErrorMessage: 'At least 8 characters',
    //     hasError: password.length < 8,
    //   },
    //   {
    //     ErrorType: 'uppercase',
    //     ErrorMessage: 'One uppercase letter',
    //     hasError: !/[A-Z]/.test(password),
    //   },
    //   {
    //     ErrorType: 'lowercase',
    //     ErrorMessage: 'One lowercase letter',
    //     hasError: !/[a-z]/.test(password),
    //   },
    //   {
    //     ErrorType: 'number',
    //     ErrorMessage: 'One number',
    //     hasError: !/\d/.test(password),
    //   },
    // ]

    // setPasswordError(errors)
    // setHasPasswordError(errors.some((err) => err.hasError))
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.password) {
        const updatedErrors = passwordError.map((err) => ({
          ...err,
          hasError: !err.regex.test(formData.password),
        }));

        setPasswordError(updatedErrors);
        setHasPasswordError(updatedErrors.some((err) => err.hasError));
      } else {
        // If password is empty reset all
        setPasswordError((errors) =>
          errors.map((err) => ({ ...err, hasError: false })),
        );
        setHasPasswordError(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.password]);

  useEffect(() => {
    if (usernameError) {
      setUsernameError('');
    }

    const timer = setTimeout(async () => {
      if (formData.username) {
        const data = await checkIdentifier(
          { identifier: formData.username },
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
  }, [formData.username]);

  useEffect(() => {
    if (emailError) {
      setEmailError('');
    }
    const timer = setTimeout(async () => {
      if (formData.email) {
        const data = await checkIdentifier(
          { identifier: formData.username },
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
  }, [formData.email]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => !val)) {
      return;
    }
  };

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

      <form onSubmit={submitHandler}>
        <div className="grid md:grid-cols-2 gap-6 mt-6  ">
          {/* Username */}
          <div className="relative flex items-center">
            <label htmlFor="username" className="absolute ps-2">
              <User className="text-zinc-200" />
            </label>
            <input
              required
              onChange={handleInputChange('username')}
              value={formData.username}
              className={`w-full rounded text-zinc-100 ps-10 py-1 border  outline-none  focus-visible:ring-2 no-autofill bg-transparent placeholder:text-zinc-400 ${usernameError ? 'border-red-600 focus-visible:ring-red-500' : 'border-zinc-600 focus-visible:ring-zinc-500'}`}
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
              required
              onChange={handleInputChange('email')}
              value={formData.email}
              className={`w-full rounded text-zinc-100 ps-10 py-1 border  outline-none  focus-visible:ring-2 no-autofill bg-transparent placeholder:text-zinc-400 ${usernameError ? 'border-red-600 focus-visible:ring-red-500' : 'border-zinc-600 focus-visible:ring-zinc-500'}`}
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
              onChange={handlePasswordChange}
              value={formData.password}
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
              onChange={handleInputChange('confirmPassword')}
              value={formData.confirmPassword}
              autoComplete="new-password"
              required
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill bg-transparent placeholder:text-zinc-400"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>

          {/* DOB */}
          {/* <div className="relative flex items-center">
            <label htmlFor="age" className="absolute ps-2">
              <Calendar className="text-zinc-200" />
            </label>
            <input
              required
              onChange={handleInputChange('age')}
              value={formData.age}
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill bg-transparent"
              type="number"
              id="age"
              min="13"
              max="120"
              placeholder="Age"
            />
          </div> */}
          <DatePicker
            name="DOB"
            value={formData.birthday}
            onChange={handleBirthdayChange}
          />

          {/* Gender */}
          <div className="relative flex items-center">
            <label htmlFor="gender" className="absolute ps-2">
              <Users className="text-zinc-200" />
            </label>
            <select
              required
              onChange={handleInputChange('gender')}
              value={formData.gender}
              className={`w-full rounded ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 bg-zinc-950 ${
                formData.gender ? 'text-zinc-100' : 'text-zinc-400'
              }`}
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
              <option value="prefer-not-to-say" className="text-zinc-100">
                Prefer not to say
              </option>
            </select>
          </div>

          {/* Avatar */}
          {/* <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="avatar"
              className="text-zinc-200 text-sm font-medium"
            >
              Profile Picture (optional)
            </label>
            <input
              onChange={handleAvatarChange}
              className="w-full rounded text-zinc-100 py-1 px-3 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 bg-transparent file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-zinc-700 file:text-zinc-200 file:cursor-pointer"
              type="file"
              id="avatar"
              accept="image/*"
            />
          </div> */}
        </div>

        {/* Password validation errors */}
        <ul
          className={`text-xs grid grid-cols-2 gap-1 transition-all duration-300  
        ${hasPasswordError ? 'opacity-100 max-h-40 mt-6' : 'opacity-0 max-h-0 overflow-hidden'}`}
        >
          {passwordError.map((err) =>
            err.hasError ? (
              <li
                key={err.ErrorType}
                className="text-red-300 flex gap-1 items-center"
              >
                ❌ {err.ErrorMessage}
              </li>
            ) : (
              <li
                key={err.ErrorType}
                className="text-green-300 flex gap-1 items-center"
              >
                ✅ {err.ErrorMessage}
              </li>
            ),
          )}
        </ul>

        {/* Password mismatch check */}
        {formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <div className="text-red-300 text-xs mt-2 flex gap-1 items-center">
              ❌ Passwords do not match
            </div>
          )}

        {formData.username && usernameError && (
          <div className="text-red-300 text-xs mt-2 flex gap-1 items-center">
            ❌ username already exists
          </div>
        )}
        {formData.email && emailError && (
          <div className="text-red-300 text-xs mt-2 flex gap-1 items-center">
            ❌ email already exists
          </div>
        )}
        <Button
          type="submit"
          disabled={
            hasPasswordError ||
            loading ||
            !!(
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
            )
          }
          className={`mt-8 bg-blue-600 font-bold text-base hover:bg-blue-800 text-zinc-200 cursor-pointer w-full flex focus-visible:ring-zinc-500 disabled:bg-gray-500 ${loading ? 'disabled:bg-indigo-500' : ''}`}
        >
          {loading ? (
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

      {/* <div className="relative flex items-center justify-center mt-8">
        <div className="absolute border-b border-zinc-600 w-1/4 m-auto"></div>
        <div className="absolute text-zinc-300 tracking-wide text-sm">OR</div>
      </div> */}

      {/* <footer className="flex justify-center mt-8">
        <Button
          className="bg-zinc-800 cursor-pointer focus-visible:ring-zinc-500"
          size="lg"
        >
          <span>
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
      </footer> */}
    </section>
  );
};

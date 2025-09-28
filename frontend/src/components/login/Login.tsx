import { Link, useNavigate } from '@tanstack/react-router'
import { LockKeyhole, Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'

import type { ChangeEvent, FormEvent } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'

// const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{6,}$/

const HAS_UPPERCASE_REGEX = /[A-Z]/
const HAS_NUMBER_REGEX = /[0-9]/
const HAS_SPECIAL_REGEX = /[^A-Za-z0-9\s]/
const HAS_LENGTH_REGEX = /^.{6,}$/

interface PasswordErrorType {
  hasError: boolean
  ErrorType: 'Uppercase' | 'Numeric' | 'Special' | 'length'
  ErrorMessage: string
  regex: RegExp
}
export const Login = () => {
  const navigate = useNavigate()

  const { login, loading } = useAuthContext()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [passwordError, setPasswordErrors] = useState<Array<PasswordErrorType>>(
    [
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
    ],
  )
  const [hasPasswordError, setHasPasswordError] = useState<boolean>(false)

  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setEmail(e.target.value)
  }
  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (hasPasswordError) {
      setHasPasswordError(false)
      setPasswordErrors((errors) =>
        errors.map((err) => ({ ...err, hasError: false })),
      )
    }
    setPassword(e.target.value)
  }

  useEffect(() => {
    // if (password && password.length > 0 && !PASSWORD_REGEX.test(password)) {
    //   setPasswordErrors('invalid password format')
    // } else {
    //   setPasswordErrors()
    // }

    const setTimeId = setTimeout(() => {
      if (password) {
        setPasswordErrors((errors) =>
          errors.map((err) => {
            if (!err.regex.test(password)) {
              setHasPasswordError(true)
              return { ...err, hasError: true }
            } else {
              return err
            }
          }),
        )
      }
    }, 500)
    // wso what i want? i want when use type something it check the above check
    // but if it ke
    return () => {
      clearTimeout(setTimeId)
    }
  }, [password])

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast('Fetching data...', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    if (!email || !password) {
      return
    }
    const res = await login({ identifier: email, password })
    if (res.email) {
      return await navigate({ to: '/' })
    }
  }
  return (
    <section
      className={`bg-zinc-950  w-[min(90%,400px)] rounded-2xl border  shadow-linear  px-6 pt-12 pb-6 
        ${hasPasswordError ? ' shadow-red-700/70 border-red-700' : ' shadow-zinc-700/65 border-zinc-600'} transition-all `}
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
      <form onSubmit={submitHandler} className="">
        <div className="grid gap-6 mt-6">
          <div className="relative flex items-center">
            <label htmlFor="email" className="absolute ps-2">
              <Mail className="text-zinc-200" />
            </label>
            <input
              required
              onChange={emailChangeHandler}
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
              onChange={passwordChangeHandler}
              autoComplete="no"
              required
              className="w-full rounded text-zinc-100 ps-10 py-1 border border-zinc-600 outline-none focus-visible:ring-zinc-500 focus-visible:ring-2 no-autofill"
              type="password"
              id="password"
              placeholder="Password"
            />
          </div>

          {/* {hasPasswordError ? (
            <ul className="text-xs flex flex-col gap-1">
              {passwordError.map((err) =>
                err.hasError ? (
                  <li className="text-red-300 flex gap-1 items-center ">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 stroke-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </span>{' '}
                    {err.ErrorMessage}
                  </li>
                ) : (
                  <li className="text-green-300 flex gap-1 items-center ">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 stroke-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </span>
                    {err.ErrorMessage}
                  </li>
                ),
              )}
            </ul>
          ) : (
            <></>
          )} */}
        </div>
        <ul
          className={`text-xs flex flex-col gap-1 transition-all duration-300 
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

        <Button
          disabled={hasPasswordError || loading}
          className={`mt-8 bg-blue-600 font-bold text-base hover:bg-blue-800  text-zinc-200 cursor-pointer w-full flex focus-visible:ring-zinc-500 disabled:bg-gray-500 ${loading ? 'disabled:bg-indigo-500' : ''}`}
        >
          {loading ? (
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
  )
}

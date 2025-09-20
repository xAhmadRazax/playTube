import { LockKeyhole, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'

import type { ChangeEvent, FormEvent } from 'react'
import { axios } from '@/utils/axios.util'
import { useAuthContext } from '@/contexts/AuthContext'

export const Login = () => {
  const { login } = useAuthContext()
  const [errors, setErrors] = useState(true)
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const cb = () => {}
  const emailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setEmail(e.target.value)
  }
  const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast('🦄 Wow so easy!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    if (!email || !password) {
      console.log('u are fucked boss u are fucked')
      return
    }
    const res = await login({ identifier: email, password })
    console.log(res)
  }
  return (
    <section
      className={`bg-zinc-950  w-[min(90%,400px)] rounded-2xl border  shadow-linear  px-6 py-12 
        ${!errors ? ' shadow-red-700/70 border-red-700' : ' shadow-zinc-700/65 border-zinc-600'}`}
    >
      <header className="flex flex-col gap-3 items-center">
        <h2 className="capitalize font-bold text-3xl text-zinc-100">
          Welcome back
        </h2>

        <div className="text-sm flex gap-1.5">
          <span className="text-zinc-300">Don't have an account yet?</span>
          <a
            className="underline hover:no-underline text-zinc-100 font-bold outline-none  focus-visible:ring-zinc-500 focus-visible:ring-2 "
            href="/signup"
            aria-label="Sign up for an account"
          >
            Sign up
          </a>
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
        </div>

        <Button className="mt-6 bg-blue-600 font-bold text-base hover:bg-zinc-800  text-zinc-200 cursor-pointer w-full flex focus-visible:ring-zinc-500 ">
          Login
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

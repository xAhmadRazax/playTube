import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/components/login/Login'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <Login />
    </div>
  )
}

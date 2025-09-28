import { createFileRoute } from '@tanstack/react-router'
import { Register } from '@/components/register/register'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex justify-center items-center min-h-screen my-12 md:my-0">
      <Register />
    </div>
  )
}

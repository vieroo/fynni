import { BanknoteArrowUp } from 'lucide-react'
import RegisterForm from './register-form'

export const metadata = {
  title: 'Fynni – Cadastre-se',
  description: 'Crie sua conta Fynni',
}

export default function LoginPage() {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full min-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <BanknoteArrowUp className="size-6" />
          </div>
          <span className="text-xl font-bold">Fynni</span>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}

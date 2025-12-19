'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useFormState } from '@/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader } from 'lucide-react'
import Link from 'next/link'
import { registerAction } from './actions'
import { useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()

  const [{ success, errors, message }, handleSubmit, isPending] = useFormState(
    registerAction,
    () => {
      router.push('/login')
    }
  )

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo!</CardTitle>
          <CardDescription>
            Informe seus dados para criar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {success === false && message && (
              <Alert variant="destructive">
                <AlertTriangle className="size-4" />
                <AlertTitle>Falha ao criar usuário!</AlertTitle>

                <AlertDescription>
                  <p>{message}</p>
                </AlertDescription>
              </Alert>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input id="name" name="name" type="text" />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                />

                {errors?.email && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400">
                    {errors.email[0]}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" name="password" type="password" />

                {errors?.password && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400">
                    {errors.password[0]}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm_password">
                  Confirmar Senha
                </FieldLabel>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                />

                {errors?.confirm_password && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400">
                    {errors.confirm_password[0]}
                  </p>
                )}
              </Field>

              <Field>
                <Button type="submit">
                  {isPending ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Já possui conta? <Link href="/login">Faça login aqui</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos{' '}
        <a href="#">Termos de Serviços</a> e nossa{' '}
        <a href="#">Política de Privacidade</a>.
      </FieldDescription> */}
    </div>
  )
}

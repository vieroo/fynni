'use client'

import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { accountColors } from '@/lib/account-colors'
import { accountTypes } from '@/lib/account-types'
import { Loader, Plus } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { createAccountAction } from '../actions'
import { toast } from 'sonner'

export default function AccountsDialog() {
  const [type, setType] = useState<string>()
  const [actionState, handleCreateAccount, isPending] = useActionState(
    createAccountAction,
    {
      success: false,
      message: null,
      errors: null,
    }
  )

  useEffect(() => {
    if (actionState?.success) {
      toast.success(actionState.message || 'Conta criada com sucesso!')
    }
  }, [actionState?.success])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus />
          Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
          <DialogDescription>
            Adicione uma nova conta bancária
          </DialogDescription>
        </DialogHeader>
        <form action={handleCreateAccount}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" placeholder="Banco do Brasil" />

              {actionState?.errors?.name && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {actionState.errors.name[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="balance">Saldo</Label>
              <Input id="balance" name="balance" type="number" />

              {actionState?.errors?.balance && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {actionState.errors.balance[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="type">Tipo da Conta</Label>
              <input type="hidden" name="type" value={type ?? ''} />

              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>

              {actionState?.errors?.type && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {actionState.errors.type[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="color">Cor</Label>
              <ColorPicker name="color" colors={accountColors} />

              {actionState?.errors?.color && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {actionState.errors.color[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader className="h-4 w-4" /> : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

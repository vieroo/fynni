'use client'

import { Button } from '@/components/ui/button'
import {
  ColorPicker,
  UncontrolledColorPicker,
} from '@/components/ui/color-picker'
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
import { Edit, Loader, Plus } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { createAccountAction, updateAccountAction } from '../actions'
import { toast } from 'sonner'
import { Account } from '@/schemas/finances/accounts.schema'

type AccountDialogProps = {
  mode?: 'create' | 'edit'
  account?: Account | null
}

export default function AccountsDialog({
  mode = 'create',
  account,
}: AccountDialogProps) {
  const isEdit = mode === 'edit'
  const action = isEdit ? updateAccountAction : createAccountAction

  const [type, setType] = useState<string | undefined>(account?.type)

  const [actionState, handleAction, isPending] = useActionState(action, {
    success: false,
    message: null,
    errors: null,
  })

  useEffect(() => {
    if (actionState?.success) {
      toast.success(
        actionState.message ??
          (isEdit
            ? 'Conta atualizada com sucesso!'
            : 'Conta criada com sucesso!')
      )
    }
  }, [actionState?.success, isEdit])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          variant={isEdit ? 'secondary' : 'default'}
          size={isEdit ? 'sm' : 'default'}
        >
          {isEdit ? (
            <>
              <Edit className="w-4 h-4" /> Editar Conta
            </>
          ) : (
            <>
              <Plus />
              Nova Conta
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize as informações da conta'
              : 'Adicione uma nova conta bancária'}
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction}>
          {isEdit && <input type="hidden" name="id" value={account!.id} />}

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Banco do Brasil"
                defaultValue={account?.name}
              />

              {actionState?.errors?.name && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {actionState.errors.name[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="balance">Saldo</Label>
              <Input
                id="balance"
                name="balance"
                type="number"
                defaultValue={account?.balance}
              />

              {actionState?.errors?.balance && (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {actionState.errors.balance[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="type">Tipo da Conta</Label>
              <input type="hidden" name="type" value={type ?? ''} />

              <Select
                value={type}
                onValueChange={setType}
                defaultValue={account?.type}
              >
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
              <UncontrolledColorPicker
                name="color"
                defaultValue={account?.color}
                colors={accountColors}
              />

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
              {isPending ? (
                <Loader className="h-4 w-4" />
              ) : isEdit ? (
                'Salvar'
              ) : (
                'Cadastrar'
              )}{' '}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

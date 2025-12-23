'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Trash2, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { deleteAccountAction } from '../actions'

type DeleteAccountDialogProps = {
  accountId: string
}

export function DeleteAccountDialog({ accountId }: DeleteAccountDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    setIsPending(true)
    try {
      const result = await deleteAccountAction(accountId)
      toast.success(result.message)
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao deletar conta')
    } finally {
      setIsPending(false)
      setIsOpen(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Deletar Conta</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar esta conta? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? <Loader className="h-4 w-4" /> : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

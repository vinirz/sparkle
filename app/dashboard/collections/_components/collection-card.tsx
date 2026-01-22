"use client"

import { ChevronRight, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { deleteCollection, updateCollection } from "../../actions"
import { useRouter } from "next/navigation"

interface CollectionCardProps {
    collection: {
        id: string
        name: string
        created_at: string
        questions?: { count: number }[] | null
    }
}

export function CollectionCard({ collection }: CollectionCardProps) {
    const [openDelete, setOpenDelete] = useState(false)
    const [openRename, setOpenRename] = useState(false)
    const [newName, setNewName] = useState(collection.name)
    const [isPending, startTransition] = useTransition()

    const router = useRouter()
    
    const questionCount = collection.questions?.[0]?.count ?? 0

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteCollection(collection.id)
                toast.success("Coleção excluída.")
            } catch {
                toast.error("Erro ao excluir coleção.")
            }
        })
    }

    const handleRename = () => {
        startTransition(async () => {
            try {
                await updateCollection(collection.id, newName)
                setOpenRename(false)
                toast.success("Coleção renomeada.")
            } catch {
                toast.error("Erro ao renomear coleção.")
            }
        })
    }

    return (
        <>
            <div 
                onClick={() => router.push(`/dashboard/collections/${collection.id}`)}
                className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:border-yellow-400/50 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-yellow-400 transition-colors"></div>
                    <div>
                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{collection.name}</p>
                        <p className="text-[10px] text-neutral-400">{questionCount} {questionCount === 1 ? 'questão' : 'questões'}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-neutral-400 hover:text-neutral-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setOpenRename(true); }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Renomear
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={(e) => { e.stopPropagation(); setOpenDelete(true); }}
                                className="focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a coleção "{collection.name}" e todas as questões associadas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            {isPending ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={openRename} onOpenChange={setOpenRename}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renomear Coleção</DialogTitle>
                        <DialogDescription>
                            Digite um novo nome para a coleção.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input 
                                id="name" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenRename(false)}>Cancelar</Button>
                        <Button onClick={handleRename} disabled={isPending}>
                            {isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

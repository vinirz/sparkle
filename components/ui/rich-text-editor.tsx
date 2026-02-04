"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  ImageIcon, 
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useState, useCallback } from "react"
import { toast } from "sonner"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  collectionId: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, collectionId, className }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  
  const editor = useEditor({
    extensions: [
        StarterKit,
        ImageExtension.configure({
            inline: true,
            allowBase64: true,
        }),
        Placeholder.configure({
            placeholder: placeholder || 'Digite aqui...',
            emptyEditorClass: 'is-editor-empty',
        })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-full w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 p-4 min-h-[inherit] [&_.is-editor-empty]:text-muted-foreground [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:pointer-events-none [&_.is-editor-empty]:before:h-0',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Sincronizar value externo se mudar drasticamente (opcional, cuidado com loops)
  // Mas para form controlled, geralmente só inicializamos content. 
  // O Tiptap gerencia seu estado interno.

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione uma imagem válida.")
        return
    }

    setIsUploading(true)
    const supabase = createClient()

    try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${collectionId}/${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from("question-images")
            .upload(fileName, file)

        if (uploadError) {
            throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
            .from("question-images")
            .getPublicUrl(fileName)

        editor?.chain().focus().setImage({ src: publicUrl }).run()
        toast.success("Imagem adicionada!")
    } catch (error) {
        console.error(error)
        toast.error("Erro ao fazer upload da imagem.")
    } finally {
        setIsUploading(false)
        // Reset input
        e.target.value = ""
    }
  }, [collectionId, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn("flex flex-col gap-2 rounded-md w-full", className)}>
      <div className="flex items-center gap-1 p-1 bg-muted/10 rounded-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-primary' : ''}
          type="button"
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-primary' : ''}
          type="button"
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="relative">
            <Button
            variant="ghost"
            size="icon"
            type="button"
            title="Adicionar Imagem"
            disabled={isUploading}
            >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            </Button>
            <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
            />
        </div>
      </div>
      <EditorContent editor={editor} className="flex-1 min-h-0 overflow-y-auto" />
    </div>
  )
}

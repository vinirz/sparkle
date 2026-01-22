"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Pix } from "@/lib/pix"
import { QRCodeSVG } from "qrcode.react"
import { Check, Copy, Heart, Sparkles, QrCode, Keyboard } from "lucide-react"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Label } from "recharts"

export default function ProPage() {
    const [copied, setCopied] = useState(false)
    const [message, setMessage] = useState<string>('')
    
    const pixKey = "pixme.viniciusreis@gmail.com"
    const sanitizeString = (text: string): string => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9 ]/g, "");
    }
    const payload = useMemo(() => {
        const pix = new Pix(
            pixKey,
            sanitizeString(message).slice(0, 50),
            "Vinicius e Patricia",
            "Minas Gerais",
            "SPARKLE01",
        )
        return pix.getPayload()
    }, [message])

    const handleCopy = () => {
        navigator.clipboard.writeText(payload)
        setCopied(true)
        toast.success("Código Pix Copia e Cola copiado!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="h-full w-full p-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center justify-center gap-5 max-w-3xl w-full text-center space-y-2 mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  <Sparkles className="w-3 h-3" />
                  Sparkle Pro
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight">
                  Faça parte do nosso <span className="text-yellow-500">sonho</span>.
                </h1>
                <p className="text-xl text-neutral-500 max-w-xl mx-auto">
                  O Sparkle é totalmente gratuito! Mas se você quiser nos ajudar a dar o próximo passo como casal, ficaremos eternamente gratos.
                </p>
            </div>

            <GlassCard className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12 items-center">
                <div className="space-y-6 text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                             Olá! 👋
                        </h3>
                        <p className="text-neutral-600 mt-2 leading-relaxed">
                            Eu sou o Vinicius e desenvolvi o Sparkle com muito carinho para ajudar nos seus estudos. 
                            Mas tenho um segredo: fiz esse app pensando também no futuro.
                        </p>
                        <p className="text-neutral-600 mt-4 leading-relaxed">
                            Eu e minha noiva, Patrícia, estamos planejando nosso casamento! 
                            Não cobramos mensalidade no Sparkle, mas se o app te ajudou e você quiser retribuir, 
                            qualquer contribuição para o nosso "porquinho" do casamento será recebida com muita alegria! ❤️
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-neutral-600">
                            <Check className="w-5 h-5 text-yellow-500" />
                            <span>Ajude um casal apaixonado</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-600">
                            <Check className="w-5 h-5 text-yellow-500" />
                            <span>Apoie o desenvolvimento open-source</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-600">
                            <Check className="w-5 h-5 text-yellow-500" />
                            <span>Ganhe +1000 pontos de karma instantâneo</span>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-2">
                        <Heart className="w-8 h-8 fill-current" />
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-lg text-neutral-900">Contribua com Pix</h4>
                        <p className="text-sm text-neutral-500">Qualquer valor ajuda muito!</p>
                    </div>

                      <div className="w-full flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                          
                        <div className="w-full">
                            <Label>Mensagem</Label>
                            <Input 
                                maxLength={50}
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="Escreva uma mensagem de carinho..."
                                className="text-center text-sm text-neutral-500 border-none shadow-none bg-transparent focus-visible:ring-0 placeholder:text-neutral-300 h-auto py-1"
                            />
                        </div>

                          <div className="bg-white p-4 rounded-xl border border-neutral-200 mx-auto shadow-sm">
                              <QRCodeSVG value={payload} size={180} level="M" />
                          </div>

                            <div className="w-full bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                              <code className="text-[10px] font-mono text-neutral-400 truncate flex-1 text-left">
                                  {payload}
                              </code>
                              <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 text-xs gap-2 shrink-0">
                                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                  {copied ? "Copiado" : "Copiar"}
                              </Button>
                          </div>
                      </div>
                </div>
            </GlassCard>

            <p className="mt-12 text-sm text-neutral-400">
                 Feito com amor por Vinicius & Patrícia
            </p>
        </div>
    )
}

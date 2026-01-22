import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export function SquareBackground({children}: {children: ReactNode}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="relative z-20">
        {children}
      </div>

    </div>
  );
}

export default function Home() {
  return (
    <SquareBackground>
      <div className="flex flex-col min-h-screen items-center">
        <header className="fixed my-5 flex w-full h-fit justify-between px-24">
          <span className="text-2xl flex items-center justify-center gap-3">
            <Image src="/sparkle.svg" alt="logo" width={150} height={512}/>
          </span>
          
          <span className="text-2xl flex items-center justify-center gap-3">
            <Button variant="default" className="px-7">
              <Link href="/sign-in">
                Entrar
              </Link>
            </Button>
            <Button variant="outline">
              <Link href="/sign-up">
                Criar conta
              </Link>
            </Button>
          </span>
        </header>

        <section className="w-screen h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-6xl font-bold">
              Estude com o <span className="text-primary">Sparkle</span>
            </h1>
            <h4 className="w-2/3 text-lg text-center text-secondary/60 font-semibold">
              O banco de questões que vai acelerar sua aprovação.
              Organize, estude e domine qualquer prova com nossa plataforma inteligente.
            </h4>

            <Button variant="default" className="px-12! py-6 group">
              <Link href="/sign-up">
                Começar Agora
              </Link>
              <ArrowRight className="group-hover:translate-x-2 transition-all" />
            </Button>
          </div>
        </section>
        
        <section className="relative w-screen h-[30vh] flex items-center justify-center">
          <div className="absolute h-[30vh] w-2/3 flex flex-col items-center justify-center gap-6 bg-primary -top-24 rounded-2xl text-">
            <h1 className="text-3xl font-bold">
              Pronto para brilhar brilhar nos estudos?
            </h1>
            <h4 className="w-1/2 text-lg text-center text-secondary/60 font-semibold">
              Junte-se a milhares de estudantes que já estão usando o Sparkle para alcançar seus objetivos.
            </h4>

            <Button variant="secondary" className="px-12! py-6">
              <Link href="/sign-up">
                Criar conta grátis
              </Link>
            </Button>
          </div>
        </section>
        
        <section className="w-screen h-[20vh] text-center flex flex-col items-center justify-center gap-10">
          <Image src="/sparkle.svg" alt="logo" width={90} height={512}/>
          <h1 className="opacity-50">
            Criado com ❤️ por <br />
            Vinicius Reis e Patrícia Ferreira
          </h1>
        </section>
      </div>
    </SquareBackground>
  );
}

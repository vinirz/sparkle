'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

export default function SignUp(){
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if(password !== confirmPassword){
      toast.error('As senhas não conferem');
      return;
    }

    if(!username || !email || !password || !confirmPassword){
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const supabase = createClient()
    const { data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })

    if(error){
      console.error('Error creating user:', error.message);
      toast.error('Erro ao criar conta!');
      return;
    }

    if(data){
      toast.success('Conta criada com sucesso!');
      redirect('/sign-in')
    }
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/3 bg-background flex flex-col items-center justify-center px-10 py-32">
        <span className="w-full mb-10">
          <Button variant="ghost" className="py-6 group">
            <ArrowLeft className="group-hover:-translate-x-2 transition-all" />
            <Link href="/">
              Voltar ao início
            </Link>
          </Button>
        </span>

        <span className="flex flex-col w-full mb-10 pl-3 gap-1">
          <h1 className="text-xl font-bold">
            Crie sua conta, rápido e fácil!
          </h1>

          <h2 className="flex gap-2 text-sm text-muted-foreground">
            Ja possui uma conta?
            <Link href="/sign-in" className="text-primary hover:underline">
              Faça login
            </Link>
          </h2>
        </span>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-5 px-2">
          <Input ref={usernameRef} type="text" placeholder="Nome de usuário" className="w-full h-11 bg-border focus:border-2 focus:border-foreground" />
          <Input ref={emailRef} type="email" placeholder="Email" className="w-full h-11 bg-border focus:border-2 focus:border-foreground" />
          <Input ref={passwordRef} type="password" placeholder="Senha" className="w-full h-11 bg-border focus:border-2 focus:border-foreground" />
          <Input ref={confirmPasswordRef} type="password" placeholder="Confirme sua senha" className="w-full h-11 bg-border focus:border-2 focus:border-foreground" />
          <Button variant="default" className="w-full mt-5 h-10">
            Criar conta
          </Button>
        </form>
      </div>
      <div className="w-2/3 bg-primary"></div>
    </div>
  )
}
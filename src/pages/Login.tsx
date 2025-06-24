import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/login`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      navigate("/home");
    } else {
      toast.error("Verifique seus dados e tente novamente.", {
        description: (
          <span className="text-gray-400">
            Ocorreu um erro ao fazer login, verifique seus dados e tente
            novamente.
          </span>
        ),
        duration: 5000,
        style: {
          color: "red",
          fontWeight: "bolder",
        },
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 flex-col">
        <h1 className="text-4xl font-bold mb-3">Conecta+</h1>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center p-4">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Faça seu login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4 w-full cursor-pointer">
                Entrar
              </Button>
            </form>

            <div className="flex items-center gap-4 my-3">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => navigate("/register")}
                variant="outline"
                className="flex items-center relative justify-between cursor-pointer"
              >
                <span className="abosolute left-0 right-0 text-center w-full cursor-pointer">
                  Faça um cadastro
                </span>
                <User className="" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;

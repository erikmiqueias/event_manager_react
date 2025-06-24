import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const RegisterUser = () => {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    address: "",
    jobTitle: "",
    company: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [submit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form }),
      }
    );

    if (response.ok) {
      const toastInterval = setInterval(() => {
        toast.success("Usuário cadastrado com sucesso!", {
          duration: 3000,
          style: {
            color: "green",
            fontWeight: "bolder",
          },
          position: "top-center",
          onAutoClose: () => {
            clearInterval(toastInterval);
            navigate("/home");
            setSubmit(true);
          },
        });
      }, 3000);
    } else {
      setOpenDialog(true);
    }
  };

  return (
    <>
      {form.password !== confirmPassword ? (
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Senhas não coincidem</AlertDialogTitle>
              <AlertDialogDescription>
                As senhas não coincidem. Por favor, tente novamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                autoFocus
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Fechar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {submit
                  ? "Formulário Enviado :)"
                  : "Erro no envio do formulário :("}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {submit
                  ? "O formulário foi enviado com sucesso!"
                  : "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpenDialog(false);
                  navigate("/login");
                }}
              >
                Fechar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 flex-col">
        <h1 className="text-4xl font-bold mb-3">Conecta+</h1>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center p-4">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="max-h-96 overflow-y-auto" onSubmit={handleSubmit}>
              <div className="grid col-span-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="userName">Nome de Usuário *</Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Digite seu nome de usuário"
                    onChange={(e) =>
                      setForm({ ...form, userName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="email">Email *</Label>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="phoneNumber">Número de Telefone *</Label>
                  </div>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="address">Endereço *</Label>
                  </div>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Digite seu endereço"
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="jobTitle">Cargo *</Label>
                  </div>
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="Digite seu cargo"
                    onChange={(e) =>
                      setForm({ ...form, jobTitle: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="company">Empresa *</Label>
                  </div>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Digite sua empresa"
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha *</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">
                      Confirme sua senha *
                    </Label>
                  </div>
                  <Input
                    id="confirmePassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="mt-4 w-full cursor-pointer">
                  Entrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RegisterUser;

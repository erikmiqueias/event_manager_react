import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import Layout from "@/components/Layout";
import useAuthentication from "@/hooks/useAuthentication";
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

const EventRegistration = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const events = location?.state?.event;

  const { event_name, event_date, event_local, event_publicity } = events;
  const { userId } = useAuthentication();

  const [formData, setFormData] = useState({
    eventName: "",
    email: "",
    phoneNumber: "",
    agreedToTerms: false,
  });
  const [accessCode, setAccessCode] = useState("");
  const [, setAlreadyJoined] = useState(false);
  const [ensureAccessCode, setEnsureAccessCode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.eventName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.agreedToTerms
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.", {
        description: "Todos os campos devem ser preenchidos.",
        duration: 5000,
        style: {
          color: "red",
          fontWeight: "bolder",
        },
        position: "bottom-center",
        dismissible: true,
      });
      return;
    }

    // monta o body dinamicamente
    const payload: any = {
      userId,
      email: formData.email,
      fullName: formData.eventName,
      phoneNumber: formData.phoneNumber,
      agreedToTerms: formData.agreedToTerms,
    };

    if (event_publicity === "PRIVATE") {
      if (!accessCode) {
        setEnsureAccessCode(true);
        return;
      }
      payload.accessCode = accessCode;
    }
    try {
      console.log(eventId);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/event/${eventId}/join`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Inscrição realizada com sucesso!", {
          duration: 3000,
          style: {
            color: "green",
            fontWeight: "bolder",
          },
          position: "top-center",
        });

        setFormData({
          eventName: "",
          email: "",
          phoneNumber: "",
          agreedToTerms: false,
        });
      } else if (
        response.status === 409 ||
        response.status === 400 ||
        response.status === 500
      ) {
        setAlreadyJoined(true);
        setOpenDialog(true);
        setFormData({
          eventName: "",
          email: "",
          phoneNumber: "",
          agreedToTerms: false,
        });
      } else {
        const err = await response.text();
        toast.error(err, {
          duration: 5000,
          style: {
            color: "red",
            fontWeight: "bolder",
          },
          position: "bottom-center",
          dismissible: true,
        });
        setFormData({
          eventName: "",
          email: "",
          phoneNumber: "",
          agreedToTerms: false,
        });
      }
    } catch (err) {
      toast.error("Ocorreu um erro ao se inscrever.", {
        duration: 5000,
        style: {
          color: "red",
          fontWeight: "bolder",
        },
        position: "bottom-center",
        dismissible: true,
      });
      setFormData({
        eventName: "",
        email: "",
        phoneNumber: "",
        agreedToTerms: false,
      });
    }
  };

  return (
    <Layout>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você já está inscrito</AlertDialogTitle>
            <AlertDialogDescription>
              Parece que você já se inscreveu neste evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDialog(false)} autoFocus>
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {event_publicity === "PRIVATE" && (
        <AlertDialog open={ensureAccessCode} onOpenChange={setEnsureAccessCode}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Insira o código de acesso</AlertDialogTitle>
              <AlertDialogDescription>
                Código de acesso obrigatório para eventos privados
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setEnsureAccessCode(false)}
                autoFocus
              >
                Fechar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Event summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Inscrição para o Evento</span>
            </CardTitle>
            <CardDescription>{event_name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(event_date).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(event_date).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{event_local}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {events.max_participants > 0
                    ? `${events.max_participants} Vagas`
                    : "Vagas ilimitadas"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Badge variant="outline">{event.price}</Badge> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration form */}
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Inscrição</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para confirmar sua participação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Pessoais</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.eventName}
                      onChange={(e) =>
                        setFormData({ ...formData, eventName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  {event_publicity === "PRIVATE" && (
                    <div className="space-y-2">
                      <Label htmlFor="accessCode">Código de Acesso *</Label>
                      <Input
                        id="accessCode"
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreedToTerms: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="agreeToTerms">
                    Concordo com os termos e condições do evento *
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Ao marcar essa opção, você concorda com os termos e
                    condições do evento.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                size="lg"
                disabled={!formData.agreedToTerms}
              >
                Confirmar Inscrição
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventRegistration;

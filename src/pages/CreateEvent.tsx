import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Save } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { userId } = useAuthentication();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: "",
    eventDetails: "",
    eventDate: "",
    duration: "",
    durationUnit: "horas",
    eventFormat: "PRESENCIAL",
    eventLocal: "",
    eventPublicity: "PUBLIC",
    price: "0.00",
    maxParticipants: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/event`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
          duration: Number(formData.duration),
          maxParticipants: Number(formData.maxParticipants),
          price: Number(formData.price),
          eventDate: new Date(formData.eventDate).toISOString(),
        }),
      }
    );
    if (response.ok) {
      setOpenDialog(true);
      setSubmit(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Layout>
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
                navigate("/");
              }}
            >
              Fechar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Criar Evento</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Evento</CardTitle>
            <CardDescription>
              Preencha as informações para criar seu evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Evento *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.eventName}
                    onChange={(e) =>
                      handleInputChange("eventName", e.target.value)
                    }
                    placeholder="Digite o nome do seu evento"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.eventDetails}
                    onChange={(e) =>
                      handleInputChange("eventDetails", e.target.value)
                    }
                    placeholder="Descreva seu evento em detalhes"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data e Horário</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário *</Label>
                    <Input
                      id="time"
                      type="datetime-local"
                      value={formData.eventDate}
                      onChange={(e) =>
                        handleInputChange("eventDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      placeholder="Ex: 4"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationUnit">Unidade</Label>
                    <Select
                      value={formData.durationUnit}
                      onValueChange={(value) =>
                        handleInputChange("durationUnit", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutos">Minutos</SelectItem>
                        <SelectItem value="horas">Horas</SelectItem>
                        <SelectItem value="dias">Dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location and Type */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Local e Tipo</h3>

                <div className="space-y-2">
                  <Label>Tipo de Evento</Label>
                  <RadioGroup
                    value={formData.eventFormat}
                    onValueChange={(value) =>
                      handleInputChange("eventFormat", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PRESENCIAL" id="PRESENCIAL" />
                      <Label htmlFor="PRESENCIAL">Presencial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="REMOTE" id="remoto" />
                      <Label htmlFor="remoto">Remoto</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    {formData.eventFormat === "PRESENCIAL"
                      ? "Endereço"
                      : "Link da Reunião"}{" "}
                    *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.eventLocal}
                    onChange={(e) =>
                      handleInputChange("eventLocal", e.target.value)
                    }
                    placeholder={
                      formData.eventFormat === "PRESENCIAL"
                        ? "Endereço completo"
                        : "Link do Zoom, Teams, etc."
                    }
                    required
                  />
                </div>
              </div>

              {/* Privacy and Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacidade e Preço</h3>

                <div className="space-y-2">
                  <Label>Privacidade do Evento</Label>
                  <RadioGroup
                    value={formData.eventPublicity}
                    onValueChange={(value) =>
                      handleInputChange("eventPublicity", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUBLIC" id="PUBLI" />
                      <Label htmlFor="PUBLIC">Público</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PRIVATE" id="PRIVATE" />
                      <Label htmlFor="PRIVATE">Privado</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">
                      Máximo de Participantes
                    </Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) =>
                        handleInputChange("maxParticipants", e.target.value)
                      }
                      placeholder="Deixe vazio para ilimitado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 cursor-pointer"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEvent;

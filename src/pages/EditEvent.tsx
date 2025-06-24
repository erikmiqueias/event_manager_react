import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import { parseDurationToMinutes } from "@/helpers/parsedDurationToMinutes";
import { toast } from "sonner";

const EditEvent = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState<Partial<Record<string, any>>>({});

  const handleInputChange = (field: string, value: string) => {
    setEvent((prev) => {
      const updated = { ...prev };

      if (value === "" || value === null || value === undefined) {
        delete updated[field];
      } else {
        updated[field] = value;
      }

      return updated;
    });
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredEvent = Object.fromEntries(
      Object.entries(event).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    const durationInMinutes = parseDurationToMinutes(
      filteredEvent.duration,
      filteredEvent.durationUnit
    );

    if (filteredEvent.duration !== undefined) {
      filteredEvent.duration = durationInMinutes;
    }
    if (filteredEvent.maxParticipants !== undefined) {
      filteredEvent.maxParticipants = Number(filteredEvent.maxParticipants);
    }
    if (filteredEvent.price !== undefined) {
      filteredEvent.price = Number(filteredEvent.price);
    }
    console.log(filteredEvent as any);
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/event/${eventId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...filteredEvent,
        }),
      }
    );

    if (!response.ok) {
      toast.error("Erro ao editar evento", {
        style: {
          color: "red",
          fontWeight: "bold",
        },
        duration: 4000,
        position: "top-center",
        description: (
          <span className="text-gray-400">
            Erro ao editar evento, tente novamente mais tarde
          </span>
        ),
      });
      return;
    }

    toast.success("Evento editado com sucesso!", {
      style: {
        color: "green",
        fontWeight: "bold",
      },
      description: (
        <span className="text-gray-400">
          Editado em {new Date().toLocaleString()}
        </span>
      ),
      duration: 4000,
      position: "top-center",
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Editar Evento</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
            <CardDescription>
              Atualize as informações do seu evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditEvent} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>

                <div className="space-y-2">
                  <Label htmlFor="eventname">Nome do Evento</Label>
                  <Input
                    id="name"
                    type="text"
                    onChange={(e) =>
                      handleInputChange("eventName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDetails">Descrição</Label>
                  <Textarea
                    id="eventDetails"
                    onChange={(e) =>
                      handleInputChange("eventDetails", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data e Horário</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Data</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      onChange={(e) =>
                        handleInputChange("eventDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração</Label>
                    <Input
                      id="duration"
                      type="number"
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationUnit">Unidade</Label>
                    <Select
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
                    onValueChange={(value) =>
                      handleInputChange("eventFormat", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PRESENCIAL" id="presencial" />
                      <Label htmlFor="presencial">Presencial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="REMOTE" id="remoto" />
                      <Label htmlFor="remoto">Remoto</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventLocal">Local do Evento</Label>
                  <Input
                    id="eventLocal"
                    type="text"
                    onChange={(e) =>
                      handleInputChange("eventLocal", e.target.value)
                    }
                    placeholder="Digite o local do evento"
                  />
                </div>
              </div>

              {/* Privacy and Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacidade e Preço</h3>

                <div className="space-y-2">
                  <Label>Privacidade do Evento</Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleInputChange("eventPublicity", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUBLIC" id="publico" />
                      <Label htmlFor="publico">Público</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PRIVATE" id="privado" />
                      <Label htmlFor="privado">Privado</Label>
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
                      onChange={(e) =>
                        handleInputChange("maxParticipants", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 cursor-pointer">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button type="button" variant="outline" className="flex-1">
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

export default EditEvent;

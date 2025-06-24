// src/pages/events/EventDetails.tsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  Globe,
  Lock,
  Calendar,
  KeyRound,
  Copy,
} from "lucide-react";
import Layout from "@/components/Layout";
import { formatDuration } from "@/helpers/formateDuration";
import useAuthentication from "@/hooks/useAuthentication";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const EventDetails = () => {
  const { userId } = useAuthentication();
  const { eventId } = useParams();
  const location = useLocation();
  const {
    user_id,
    event_name,
    duration,
    event_date,
    event_details,
    event_local,
    event_publicity,
    event_format,
    access_code,
  } = location?.state?.event;

  const isLoadingUser = userId === undefined;
  const navigate = useNavigate();
  const [value] = useState<string>(access_code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copiado para a área de transferência!");
    } catch (err) {
      toast.error("Erro ao copiar o conteúdo");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {event_name}
              </h1>
              <Badge
                variant={event_publicity === "PUBLIC" ? "default" : "secondary"}
              >
                {event_publicity === "PUBLIC" ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" /> Público
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" /> Privado
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o evento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event_details}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {new Date(event_date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event_date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duração</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(duration)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {event_format === "PRESENCIAL" ? "Presencial" : "Remoto"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event_local}
                    </p>
                  </div>
                </div>

                {userId === user_id && event_publicity === "PRIVATE" && (
                  <div className="flex items-center space-x-3">
                    <KeyRound className="w-5 h-5 text-muted-foreground" />
                    <div className="relative w-full">
                      <Input value={access_code} readOnly className="pr-10" />
                      <Copy
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer"
                        onClick={handleCopy}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <Button
                  onClick={() => {
                    if (userId && userId !== user_id) {
                      navigate(`/event/${eventId}/register`, {
                        state: { ...location?.state, userId },
                      });
                    }
                  }}
                  className="w-full cursor-pointer"
                  size="lg"
                  disabled={isLoadingUser || userId === user_id}
                >
                  {isLoadingUser ? "Carregando..." : "Inscrever-se Agora"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;

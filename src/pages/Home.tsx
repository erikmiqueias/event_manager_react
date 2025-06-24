import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Globe, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import type { Event } from "@/types/event";
import { formatDuration } from "@/helpers/formateDuration";
import useAuthentication from "@/hooks/useAuthentication";
import Loading from "@/components/Loading";

const Home = () => {
  const [events, setEvents] = useState<Event[] | null>(null as Event[] | null);
  const { userId } = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/events?limit=10&offset=0&userId=${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.length === 0) {
          setEvents([]);
          setIsLoading(false);
        }
        setEvents(data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Eventos Disponíveis
            </h1>
            <p className="text-muted-foreground">
              Descubra e participe de eventos incríveis
            </p>
          </div>
          <Link to="/create-event">
            <Button className="cursor-pointer">Criar Evento</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center w-full h-screen">
            <div className="absolute top-10 overflow-h-clip">
              <Loading />
            </div>
          </div>
        )}

        {events?.length === 0 && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Não há eventos disponíveis
                  </h3>
                  <p className="text-muted-foreground">
                    Não encontramos nenhum evento disponível no momento.
                  </p>
                </div>
                <Link to="/create-event">
                  <Button className="cursor-pointer">
                    Criar Primeiro Evento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{event.event_name}</CardTitle>
                  <Badge
                    variant={
                      event.event_publicity === "PUBLIC"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {event.event_publicity === "PUBLIC" ? (
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(event.event_date).toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })}{" "}
                    às{" "}
                    {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/Sao_Paulo",
                    })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.event_local}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {event.max_participants > 0
                      ? `${event.max_participants} Vagas`
                      : "Vagas Ilimitadas"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline">
                    {formatDuration(Number(event.duration))}
                  </Badge>
                  <Link to={`/event/${event.id}`} state={{ event }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;

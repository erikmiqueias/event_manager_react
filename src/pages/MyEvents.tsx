import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Clock,
  MapPin,
  Users,
  Globe,
  Lock,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import useAuthentication from "@/hooks/useAuthentication";
import type { Event } from "@/types/event";
import { formatDuration } from "@/helpers/formateDuration";
import Loading from "@/components/Loading";

const MyEvents = () => {
  const [events, setEvents] = useState<Event[] | null>(null as Event[] | null);
  const { userId } = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);

  const deleteEvent = (eventId: string) => {
    const deletedEvent = events?.find((event) => event.id === eventId);
    setEvents(events!.filter((event) => event.id !== eventId));

    let undo = false;

    const timeoutId = setTimeout(async () => {
      if (!undo && deletedEvent) {
        await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/event/${eventId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
      }
    }, 4000); // tempo igual ao duration do toast

    toast("Evento deletado com sucesso!", {
      duration: 4000,
      position: "top-center",
      description: (
        <span className="text-gray-400">
          Deletado em {new Date().toLocaleString("pt-BR")}
        </span>
      ),
      action: {
        label: "Desfazer",
        onClick: () => {
          undo = true;
          clearTimeout(timeoutId);
          setEvents((prevEvents) => [
            ...(prevEvents as Event[]),
            deletedEvent!,
          ]);
        },
      },
    });
  };

  useEffect(() => {
    if (!userId) return;
    try {
      const fetchEvents = async () => {
        if (!userId) return;
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/events/${userId}`,
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
      };
      fetchEvents();
    } catch (err) {
      setIsLoading(false);
      toast.error("Erro ao buscar eventos");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Eventos</h1>
            <p className="text-muted-foreground">
              Gerencie os eventos que você criou
            </p>
          </div>
          <Link to="/create-event">
            <Button className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center w-full h-screen">
            <div className="absolute top-10 overflow-h-clip">
              <Loading />
            </div>
          </div>
        )}

        {events?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Nenhum evento criado
                  </h3>
                  <p className="text-muted-foreground">
                    Você ainda não criou nenhum evento. Comece criando seu
                    primeiro evento!
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
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {event.event_name}
                    </CardTitle>
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
                      {new Date(event.event_date).toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      às{" "}
                      {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.event_local}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {event.max_participants > 0
                        ? event.max_participants
                        : "Vagas ilimitadas"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline">
                      {formatDuration(Number(event.duration))}
                    </Badge>
                    <div className="flex space-x-2">
                      <Link to={`/event/${event.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteEvent(event.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Link to={`/event/${event.id}`} state={{ event }}>
                        <Button size="sm" className="cursor-pointer">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyEvents;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Globe, Lock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import type { Event } from "@/types/event";
import useAuthentication from "@/hooks/useAuthentication";
import { formatDuration } from "@/helpers/formateDuration";
import Loading from "@/components/Loading";
import { toast } from "sonner";

const ParticipatedEvents = () => {
  const [participatedEvents, setParticipatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userId } = useAuthentication();

  useEffect(() => {
    const fetchEventsAttended = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/user/events/joined/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setParticipatedEvents(data);
        }
      } catch (err) {
        toast.error("Erro ao buscar os eventos");
        setParticipatedEvents([]);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsAttended();
  }, [userId]);

  const upcomingEvents = participatedEvents.filter(
    (event) => new Date(event.event_date) > new Date()
  );

  const pastEvents = participatedEvents.filter(
    (event) => new Date(event.event_date) <= new Date()
  );

  const renderEventCard = (event: Event) => (
    <Card key={event.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{event?.event_name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                event?.event_publicity === "PUBLIC" ? "default" : "secondary"
              }
            >
              {event?.event_publicity === "PUBLIC" ? (
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            {new Date(event?.event_date).toLocaleDateString("pt-BR")} às{" "}
            {new Date(event?.event_date).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {event?.event_local}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            {event?.max_participants} participantes
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline">
            {formatDuration(Number(event?.duration))}
          </Badge>
          <div className="flex space-x-2">
            <Link to={`/event/${event?.id}`} state={{ event }}>
              <Button className="cursor-pointer" variant="outline" size="sm">
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Meus Agendamentos
          </h1>
          <p className="text-muted-foreground">
            Veja os eventos em que você se inscreveu ou participou
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center w-full h-screen">
            <div className="absolute top-10 overflow-h-clip">
              <Loading />
            </div>
          </div>
        )}

        {!isLoading && participatedEvents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Nenhum evento encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Você ainda não se inscreveu em nenhum evento. Explore
                    eventos disponíveis!
                  </p>
                </div>
                <Link to="/home">
                  <Button className="cursor-pointer">Explorar Eventos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && upcomingEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Próximos Eventos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map(renderEventCard)}
            </div>
          </div>
        )}

        {!isLoading && pastEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Eventos Passados</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map(renderEventCard)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ParticipatedEvents;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Calendar, Users, Info, User, Menu, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/user";
import useAuthentication from "@/hooks/useAuthentication";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const location = useLocation();
  const { userId } = useAuthentication();

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Meus Eventos", href: "/my-events", icon: Calendar },
    { name: "Meus Agendamentos", href: "/participated-events", icon: Users },
    { name: "Criar Evento", href: "/create-event", icon: Plus },
    { name: "Sobre", href: "/about", icon: Info },
    { name: "Detalhes da Conta", href: "/profile", icon: User },
    { name: "Sair", href: "/", icon: X },
  ];

  useEffect(() => {
    if (!userId) return;
    const fetchUserProfile = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const camelCaseData = {
        userName: data.username,
        email: data.email,
        phoneNumber: data.phone_number,
        address: data.address,
        bio: data.bio,
        imageUrl: data.image_url,
        jobTitle: data.job_title,
        company: data.company,
      };
      setUser(camelCaseData as UserProfile);
    };

    if (user === null) {
      fetchUserProfile().catch((error) => {
        console.error("Erro ao obter perfil do usuário:", error);
      });
    }
  }, [userId]);

  const logout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      window.location.href = "/";
    } else {
      toast.error("Erro ao sair da sessão!");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Conecta+</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden cursor-pointer"
            >
              <X className="h-4 w-4 cursor-pointer" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => {
                    setSidebarOpen(false);
                    if (item.name === "Sair") {
                      logout();
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="h-full w-full object-cover"
                  src={user?.imageUrl ? user.imageUrl : ""}
                />
                <AvatarFallback>
                  {user?.imageUrl ? user.imageUrl : "JS"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.userName?.split(" ")[0].toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Top bar */}
          <div className="bg-card border-b px-4 py-3 flex items-center justify-between lg:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="h-full w-full object-cover"
                  src={user?.imageUrl ? user.imageUrl : ""}
                />
                <AvatarFallback>
                  {user?.imageUrl ? user.imageUrl : "JS"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {user?.userName?.split(" ")[0].toUpperCase()}
              </span>
            </div>
          </div>

          {/* Page content */}
          <main className="p-6">{children}</main>
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Layout;

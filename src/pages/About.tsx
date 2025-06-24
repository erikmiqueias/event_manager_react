import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Globe, Shield, Star, Heart } from "lucide-react";
import Layout from "@/components/Layout";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Gestão Completa",
      description: "Crie, edite e gerencie seus eventos com facilidade total",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com milhares de pessoas interessadas em eventos",
    },
    {
      icon: Globe,
      title: "Eventos Públicos e Privados",
      description:
        "Organize eventos abertos ao público ou exclusivos para convidados",
    },
    {
      icon: Shield,
      title: "Plataforma Segura",
      description:
        "Seus dados e eventos estão protegidos com criptografia avançada",
    },
  ];

  const stats = [
    { label: "Eventos Criados", value: "10,000+" },
    { label: "Usuários Ativos", value: "50,000+" },
    { label: "Cidades Alcançadas", value: "500+" },
    { label: "Anos de Experiência", value: "5+" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Conecta+</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A plataforma completa para criar, gerenciar e participar de eventos
            incríveis. Conectamos pessoas através de experiências memoráveis.
          </p>
        </div>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Nossa Missão</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que os melhores momentos da vida acontecem quando as
              pessoas se reúnem. Nossa missão é facilitar a criação e
              participação em eventos que inspiram, educam e conectam pessoas ao
              redor do mundo. Desde pequenos meetups até grandes conferências,
              nossa plataforma oferece todas as ferramentas necessárias para
              tornar cada evento um sucesso.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Nossos Números</span>
            </CardTitle>
            <CardDescription>
              Veja o impacto que estamos causando na comunidade de eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
            <CardDescription>
              Três passos simples para começar a usar nossa plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Crie sua Conta</h3>
                  <p className="text-muted-foreground">
                    Registre-se gratuitamente e configure seu perfil em poucos
                    minutos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Explore ou Crie Eventos
                  </h3>
                  <p className="text-muted-foreground">
                    Descubra eventos interessantes ou crie os seus próprios
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Participe e Conecte-se</h3>
                  <p className="text-muted-foreground">
                    Inscreva-se em eventos e faça conexões valiosas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Entre em Contato</CardTitle>
            <CardDescription>
              Tem dúvidas ou sugestões? Adoraríamos ouvir você!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-muted-foreground">contato@eventosapp.com</p>
              </div>
              <div>
                <h4 className="font-semibold">Telefone</h4>
                <p className="text-muted-foreground">(11) 9999-9999</p>
              </div>
              <div>
                <h4 className="font-semibold">Endereço</h4>
                <p className="text-muted-foreground">
                  Rua das Tecnologias, 123
                  <br />
                  São Paulo, SP - 01234-567
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;

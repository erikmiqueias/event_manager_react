import React, { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import Layout from "@/components/Layout";
import type { UserProfile } from "@/types/user";
import useAuthentication from "@/hooks/useAuthentication";

const Profile = () => {
  const [editing, setEditing] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Omit<UserProfile, "id">>({
    username: "John Doe",
    email: "bZ2tI@example.com",
    phone_number: "+1 (123) 456-7890",
    address: "123 Main Street, City",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image_url: "https://via.placeholder.com/150",
    job_title: "Software Engineer",
    company: "Example Company",
  });

  const [tempData, setTempData] = useState(profileData);
  const { userId } = useAuthentication();

  const handleEdit = (field: string) => {
    setEditing(field);
    setTempData(profileData);
  };

  useEffect(() => {
    if (!userId) return;
    console.log(userId);
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
      setProfileData(data);
    };

    fetchUserProfile();
  }, [profileData, userId]);

  const handleSave = (field: string) => {
    setProfileData({ ...profileData, [field]: (tempData as any)[field] });
    setEditing(null);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setEditing(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-lg">JS</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">{profileData.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profileData.job_title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profileData.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Suas informações básicas e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">
                        Nome Completo
                      </Label>
                      {editing === "name" ? (
                        <Input
                          value={tempData.username}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              username: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editing === "name" ? (
                      <>
                        <Button size="sm" onClick={() => handleSave("name")}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("name")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Email</Label>
                      {editing === "email" ? (
                        <Input
                          value={tempData.email}
                          onChange={(e) =>
                            setTempData({ ...tempData, email: e.target.value })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editing === "email" ? (
                      <>
                        <Button size="sm" onClick={() => handleSave("email")}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("email")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Telefone</Label>
                      {editing === "phone" ? (
                        <Input
                          value={tempData.phone_number}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              phone_number: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editing === "phone" ? (
                      <>
                        <Button size="sm" onClick={() => handleSave("phone")}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("phone")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Localização</Label>
                      {editing === "location" ? (
                        <Input
                          value={tempData.address}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              address: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editing === "location" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave("location")}
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("location")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Empresa</Label>
                      {editing === "company" ? (
                        <Input
                          value={tempData.company}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              company: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editing === "company" ? (
                      <>
                        <Button size="sm" onClick={() => handleSave("company")}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("company")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Position */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Cargo</Label>
                      {editing === "position" ? (
                        <Input
                          value={tempData.job_title}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              job_title: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.job_title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {editing === "position" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave("position")}
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("position")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre Mim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editing === "bio" ? (
                      <Textarea
                        value={tempData.bio}
                        onChange={(e) =>
                          setTempData({ ...tempData, bio: e.target.value })
                        }
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {profileData.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {editing === "bio" ? (
                      <>
                        <Button size="sm" onClick={() => handleSave("bio")}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("bio")}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

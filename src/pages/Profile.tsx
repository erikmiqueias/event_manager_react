import { useEffect, useRef, useState } from "react";
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
import { toast } from "sonner";
import React from "react";

const Profile = () => {
  const [editing, setEditing] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Omit<UserProfile, "id">>({
    userName: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    imageUrl: "",
    jobTitle: "",
    company: "",
  });

  const [tempData, setTempData] = useState(profileData);
  const { userId } = useAuthentication();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_SIZE = 10 * 1024 * 1024;
    const file = e.target?.files?.[0];
    if (!file || !userId) return;

    if (file.size > MAX_SIZE) {
      toast.error("Arquivo muito grande! Máximo permitido: 10MB", {
        position: "top-center",
        duration: 4000,
        style: { color: "red", fontWeight: "bolder" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/edit/${userId}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar imagem");
      }

      const data = await response.json();

      if (data.image_url) {
        setProfileData((prev) => ({ ...prev, imageUrl: data.image_url }));
      }

      toast.success("Imagem atualizada com sucesso!", {
        duration: 3000,
        style: { color: "green", fontWeight: "bolder" },
        position: "top-center",
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar imagem", {
        duration: 4000,
        style: { color: "red", fontWeight: "bolder" },
        position: "top-center",
      });
    }
  };

  const handleEdit = (field: string) => {
    setEditing(field);
    setTempData(profileData);
  };

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
        userName: data.user_name,
        email: data.email,
        phoneNumber: data.phone_number,
        address: data.address,
        bio: data.bio,
        imageUrl: data.image_url,
        jobTitle: data.job_title,
        company: data.company,
      };
      setProfileData(camelCaseData);
    };

    fetchUserProfile();
  }, [userId]);

  const fieldMap = {
    name: "userName",
    email: "email",
    phone: "phoneNumber",
    location: "address",
    position: "jobTitle",
    company: "company",
    bio: "bio",
  };

  const handleSave = async (field: string) => {
    const mappedField = (fieldMap as Record<string, keyof UserProfile>)[field];
    if (!mappedField) return;

    setEditing(null);

    const updateData = {
      [mappedField]: (tempData as UserProfile)[mappedField],
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user/edit/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar dados");

      setProfileData((prev) => ({
        ...prev,
        [mappedField]: (tempData as UserProfile)[mappedField],
      }));

      toast.success("Dados atualizados com sucesso!", {
        duration: 3000,
        style: {
          color: "green",
          fontWeight: "bolder",
        },
        position: "top-center",
      });
    } catch {
      toast.error("Ocorreu um erro ao atualizar os dados.", {
        duration: 5000,
        style: {
          color: "red",
          fontWeight: "bolder",
        },
        position: "top-center",
      });
    }
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
                    <Avatar
                      className="w-24 h-24 rounded-full border-2 border-gray-600 overflow-hidden"
                      aria-description="Profile Picture"
                    >
                      <AvatarImage
                        className="w-full h-full object-cover"
                        src={
                          profileData.imageUrl
                            ? profileData.imageUrl
                            : `https://imgs.search.brave.com/LfT4VM9SMkLyEHKwbi3VoUjiHGvy38OBUR2EE5tN3D4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIy/MzY3MTM5Mi92ZWN0/b3IvZGVmYXVsdC1w/cm9maWxlLXBpY3R1/cmUtYXZhdGFyLXBo/b3RvLXBsYWNlaG9s/ZGVyLXZlY3Rvci1p/bGx1c3RyYXRpb24u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXMwYVRkbVQ1YVU2/YjhvdDdWS20xMURl/SUQ2TmN0UkNwQjc1/NXJBMUJJUDA9https://imgs.search.brave.com/LfT4VM9SMkLyEHKwbi3VoUjiHGvy38OBUR2EE5tN3D4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90
                            /by5jb20vaWQvMTIy/MzY3MTM5Mi92ZWN0/b3IvZGVmYXVsdC1w/cm9maWxlLXBpY3R1/cmUtYXZhdGFyLXBo
                            /b3RvLXBsYWNlaG9s/ZGVyLXZlY3Rvci1p/bGx1c3RyYXRpb24u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXMwYVRkbVQ1YVU2/YjhvdDdWS20xMURl
                            /SUQ2TmN0UkNwQjc1/NXJBMUJJUDA9`
                        }
                      />
                      <AvatarFallback className="text-lg">JS</AvatarFallback>
                    </Avatar>

                    {/* Botão de editar que abre o seletor de arquivo */}
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 cursor-pointer"
                      onClick={handleAvatarEditClick}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    {/* Input de arquivo oculto */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="font-semibold">{profileData.userName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profileData.jobTitle}
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
                          value={tempData.userName}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              userName: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.userName}
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
                          value={tempData.phoneNumber}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.phoneNumber}
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
                          value={tempData.jobTitle}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              jobTitle: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profileData.jobTitle}
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
                        value={tempData.bio ?? ""}
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

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { User, Mail, MapPin, Phone, Calendar, Award, Edit, Camera, Save, X, TrendingUp } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { toast } from "@/components/ui/use-toast"
// import DashboardLayout from "@/components/dashboard-layout"
// import LevelUserCard from "@/components/LevelUserCard"
// import { UserStats } from "@/types/types"

// interface UserProfile {
//   id: string
//   name: string
//   email: string
//   role: string
//   userType: string
//   points: number
//   level: number
//   createdAt: string
//   profile: {
//     bio?: string
//     address?: string
//     city?: string
//     state?: string
//     zipCode?: string
//     phone?: string
//     avatarUrl?: string
//   }
//   badges: {
//     id: string
//     name: string
//     description: string
//     imageUrl: string
//   }[]
// }

// export default function ProfilePage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [profile, setProfile] = useState<UserProfile | null>(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState({
//     name: "",
//     bio: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     phone: "",
//   })
//   const [stats, setStats] = useState<UserStats>({
//     totalPoints: 0,
//     level: 1,
//     activityCount: 0,
//     recentActivities: [],
//   })

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setIsLoading(true)
//         const response = await fetch("/api/profile")

//         if (!response.ok) {
//           throw new Error("Error al obtener perfil")
//         }

//         const data = await response.json()
//         setProfile(data)
//         setFormData({
//           name: data.name,
//           bio: data.profile?.bio || "",
//           address: data.profile?.address || "",
//           city: data.profile?.city || "",
//           state: data.profile?.state || "",
//           zipCode: data.profile?.zipCode || "",
//           phone: data.profile?.phone || "",
//         })
//       } catch (error) {
//         console.error("Error al cargar perfil:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [])

//   useEffect(() => {
//     const fetchUserStats = async () => {
//       try {
//         setIsLoading(true)

//         // Obtener estadísticas del usuario
//         const statsResponse = await fetch("/api/stats")
//         if (!statsResponse.ok) {
//           throw new Error("Error al obtener estadísticas")
//         }
//         const statsData = await statsResponse.json()

//         // Obtener actividades recientes
//         const activitiesResponse = await fetch("/api/activities?limit=3")
//         if (!activitiesResponse.ok) {
//           throw new Error("Error al obtener actividades")
//         }
//         const activitiesData = await activitiesResponse.json()

//         // Obtener datos del usuario (incluye nivel)
//         const userResponse = await fetch("/api/auth/session")
//         if (!userResponse.ok) {
//           throw new Error("Error al obtener datos del usuario")
//         }
//         const userData = await userResponse.json()

//         setStats({
//           totalPoints: statsData.totalPoints || 0,
//           level: userData.user?.level || 1,
//           activityCount: statsData.activityCount || 0,
//           recentActivities: activitiesData.activities || [],
//         })
//       } catch (error) {
//         console.error("Error al cargar datos del dashboard:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchUserStats()
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSave = async () => {
//     try {
//       setIsLoading(true)

//       const response = await fetch("/api/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Error al actualizar perfil")
//       }

//       const updatedProfile = await response.json()

//       // Actualizar el estado local
//       setProfile(updatedProfile)
//       setIsEditing(false)

//       toast({
//         title: "Perfil actualizado",
//         description: "Tu perfil ha sido actualizado correctamente",
//       })
//     } catch (error) {
//       console.error("Error al actualizar perfil:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Error al actualizar perfil",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCancel = () => {
//     // Restaurar los datos originales
//     if (profile) {
//       setFormData({
//         name: profile.name,
//         bio: profile.profile?.bio || "",
//         address: profile.profile?.address || "",
//         city: profile.profile?.city || "",
//         state: profile.profile?.state || "",
//         zipCode: profile.profile?.zipCode || "",
//         phone: profile.profile?.phone || "",
//       })
//     }
//     setIsEditing(false)
//   }

//   // Función para formatear la fecha
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat("es-MX", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     }).format(date)
//   }

//   // Función para obtener las iniciales del nombre
//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//   }


//   return (
//     <DashboardLayout>
//       <div className="flex flex-col gap-8 m-5 sm:m-10">
//         <div className="p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-black to-slate-800 rounded-xl">
//           <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
//           <p className="">Gestiona tu información personal y visualiza tus logros</p>
//         </div>

//         {isLoading ? (
//           <div className="flex items-center justify-center h-40">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//           </div>
//         ) : profile ? (
//           <>
//             <div className="grid gap-6 md:grid-cols-3">
//               <Card className="md:col-span-1">
//                 <CardHeader className="relative">
//                   <div className="flex flex-col items-center">
//                     <div className="relative">
//                       <Avatar className="h-24 w-24">
//                         <AvatarImage src={profile.profile?.avatarUrl || ""} alt={profile.name} />
//                         <AvatarFallback className="text-2xl bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
//                           {getInitials(profile.name)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="absolute bottom-0 right-0 rounded-full bg-background"
//                       >
//                         <Camera className="h-4 w-4" />
//                         <span className="sr-only">Cambiar foto</span>
//                       </Button>
//                     </div>
//                     <CardTitle className="mt-4 text-xl">{profile.name}</CardTitle>
//                     <CardDescription>{profile.email}</CardDescription>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <LevelUserCard />
//                   </div>

//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2 text-sm">
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-muted-foreground">Miembro desde:</span>
//                       <span>{formatDate(profile.createdAt)}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm">
//                       <User className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-muted-foreground">Tipo de usuario:</span>
//                       <span>
//                         {profile.userType === "INDIVIDUAL"
//                           ? "Individual"
//                           : profile.userType === "SCHOOL"
//                             ? "Escuela"
//                             : profile.userType === "COMMUNITY"
//                               ? "Comunidad"
//                               : "Gobierno"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm">
//                       <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-muted-foreground">Total de actividades:</span>
//                       <span>{stats.activityCount}</span>
//                     </div>
//                   </div>

//                   <div className="pt-4">
//                     <h3 className="font-medium flex items-center gap-2 mb-2">
//                       <Award className="h-4 w-4 text-muted-foreground" />
//                       Insignias
//                     </h3>
//                     {profile.badges && profile.badges.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {profile.badges.map((badge) => (
//                           <Badge
//                             key={badge.id}
//                             variant="outline"
//                             className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
//                           >
//                             <img src={badge.imageUrl || "/placeholder.svg"} alt={badge.name} className="h-4 w-4" />
//                             {badge.name}
//                           </Badge>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-muted-foreground">
//                         Aún no has obtenido insignias. Completa actividades para desbloquearlas.
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="md:col-span-2">
//                 <Tabs defaultValue="info">
//                   <CardHeader>
//                     <div className="flex justify-between items-center">
//                       <CardTitle>Información Personal</CardTitle>
//                       {!isEditing ? (
//                         <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
//                           <Edit className="mr-2 h-4 w-4" />
//                           Editar
//                         </Button>
//                       ) : (
//                         <div className="flex gap-2">
//                           <Button variant="outline" size="sm" onClick={handleCancel}>
//                             <X className="mr-2 h-4 w-4" />
//                             Cancelar
//                           </Button>
//                           <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSave}>
//                             <Save className="mr-2 h-4 w-4" />
//                             Guardar
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="info">Información</TabsTrigger>
//                       <TabsTrigger value="security">Seguridad</TabsTrigger>
//                     </TabsList>
//                   </CardHeader>
//                   <CardContent>
//                     <TabsContent value="info" className="space-y-6">
//                       {isEditing ? (
//                         // Formulario de edición
//                         <>
//                           <div className="grid gap-2">
//                             <label htmlFor="name" className="text-sm font-medium">
//                               Nombre completo
//                             </label>
//                             <Input id="name" name="name" value={formData.name} onChange={handleChange} />
//                           </div>
//                           <div className="grid gap-2">
//                             <label htmlFor="bio" className="text-sm font-medium">
//                               Biografía
//                             </label>
//                             <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
//                           </div>
//                           <div className="grid gap-4 md:grid-cols-2">
//                             <div className="grid gap-2">
//                               <label htmlFor="address" className="text-sm font-medium">
//                                 Dirección
//                               </label>
//                               <Input id="address" name="address" value={formData.address} onChange={handleChange} />
//                             </div>
//                             <div className="grid gap-2">
//                               <label htmlFor="city" className="text-sm font-medium">
//                                 Ciudad
//                               </label>
//                               <Input id="city" name="city" value={formData.city} onChange={handleChange} />
//                             </div>
//                           </div>
//                           <div className="grid gap-4 md:grid-cols-2">
//                             <div className="grid gap-2">
//                               <label htmlFor="state" className="text-sm font-medium">
//                                 Estado
//                               </label>
//                               <Input id="state" name="state" value={formData.state} onChange={handleChange} />
//                             </div>
//                             <div className="grid gap-2">
//                               <label htmlFor="zipCode" className="text-sm font-medium">
//                                 Código Postal
//                               </label>
//                               <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
//                             </div>
//                           </div>
//                           <div className="grid gap-2">
//                             <label htmlFor="phone" className="text-sm font-medium">
//                               Teléfono
//                             </label>
//                             <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
//                           </div>
//                         </>
//                       ) : (
//                         // Vista de información
//                         <>
//                           <div className="space-y-1">
//                             <h3 className="font-medium flex items-center gap-2">
//                               <User className="h-4 w-4 text-muted-foreground" />
//                               Nombre completo
//                             </h3>
//                             <p>{profile.name}</p>
//                           </div>
//                           <div className="space-y-1">
//                             <h3 className="font-medium flex items-center gap-2">
//                               <Mail className="h-4 w-4 text-muted-foreground" />
//                               Correo electrónico
//                             </h3>
//                             <p>{profile.email}</p>
//                           </div>
//                           {profile.profile?.bio && (
//                             <div className="space-y-1">
//                               <h3 className="font-medium">Biografía</h3>
//                               <p className="text-muted-foreground">{profile.profile.bio}</p>
//                             </div>
//                           )}
//                           <div className="pt-2">
//                             <h3 className="font-medium mb-2">Información de contacto</h3>
//                             <div className="grid gap-4 md:grid-cols-2">
//                               {profile.profile?.address && (
//                                 <div className="flex items-start gap-2">
//                                   <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
//                                   <div>
//                                     <p>{profile.profile.address}</p>
//                                     <p>
//                                       {profile.profile.city}, {profile.profile.state} {profile.profile.zipCode}
//                                     </p>
//                                   </div>
//                                 </div>
//                               )}
//                               {profile.profile?.phone && (
//                                 <div className="flex items-center gap-2">
//                                   <Phone className="h-4 w-4 text-muted-foreground" />
//                                   <p>{profile.profile.phone}</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </>
//                       )}
//                     </TabsContent>
//                     <TabsContent value="security">
//                       <div className="space-y-6">
//                         <div className="space-y-2">
//                           <h3 className="font-medium">Cambiar contraseña</h3>
//                           <p className="text-sm text-muted-foreground">
//                             Actualiza tu contraseña para mantener tu cuenta segura
//                           </p>
//                         </div>
//                         <div className="grid gap-4">
//                           <div className="grid gap-2">
//                             <label htmlFor="current-password" className="text-sm font-medium">
//                               Contraseña actual
//                             </label>
//                             <Input id="current-password" type="password" />
//                           </div>
//                           <div className="grid gap-2">
//                             <label htmlFor="new-password" className="text-sm font-medium">
//                               Nueva contraseña
//                             </label>
//                             <Input id="new-password" type="password" />
//                           </div>
//                           <div className="grid gap-2">
//                             <label htmlFor="confirm-password" className="text-sm font-medium">
//                               Confirmar nueva contraseña
//                             </label>
//                             <Input id="confirm-password" type="password" />
//                           </div>
//                         </div>
//                         <Button className="bg-green-600 hover:bg-green-700">Actualizar contraseña</Button>
//                       </div>
//                     </TabsContent>
//                   </CardContent>
//                 </Tabs>
//               </Card>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Mis Logros</CardTitle>
//                 <CardDescription>Visualiza tus insignias y reconocimientos</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {profile.badges && profile.badges.length > 0 ? (
//                   <div className="grid gap-6 md:grid-cols-3">
//                     {profile.badges.map((badge) => (
//                       <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg">
//                         <img src={badge.imageUrl || "/placeholder.svg"} alt={badge.name} className="h-20 w-20 mb-4" />
//                         <h3 className="font-medium">{badge.name}</h3>
//                         <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
//                       </div>
//                     ))}
//                     <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg border-dashed">
//                       <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
//                         <Award className="h-10 w-10 text-muted-foreground" />
//                       </div>
//                       <h3 className="font-medium">Próxima insignia</h3>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Continúa participando para desbloquear más insignias
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-10">
//                     <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
//                       <Award className="h-10 w-10 text-muted-foreground" />
//                     </div>
//                     <h3 className="font-medium">Aún no tienes insignias</h3>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       Completa actividades para desbloquear insignias y reconocimientos
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter>
//                 <p className="text-sm text-muted-foreground">
//                   Las insignias se otorgan automáticamente al cumplir ciertos hitos en la plataforma.
//                 </p>
//               </CardFooter>
//             </Card>
//           </>
//         ) : (
//           <div className="text-center py-10">
//             <h3 className="text-lg font-medium">No se pudo cargar el perfil</h3>
//             <p className="text-muted-foreground mt-1">Intenta recargar la página</p>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   )
// }
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react"; // Añadir useRef
import {
  User, Mail, MapPin, Phone, Calendar, Award, Edit, Camera, Save, X, Trash2, // Añadir Trash2
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge as UiBadge } from "@/components/ui/badge"; // Renombrar para evitar conflicto
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/dashboard-layout";
import LevelUserCard from "@/components/LevelUserCard";
import { UserStats, Activity, UserProfileData } from "@/types/types"; // Asumo que Activity está en types
import { validateAvatarFile } from "@/lib/s3-service"; // Para validación en frontend




export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para estado de envío de formulario
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    activityCount: 0,
    recentActivities: [],
  });

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Error al obtener perfil");
      const data: UserProfileData = await response.json();
      setProfile(data);
      setFormData({
        name: data.name,
        bio: data.profile?.bio || "",
        address: data.profile?.address || "",
        city: data.profile?.city || "",
        state: data.profile?.state || "",
        zipCode: data.profile?.zipCode || "",
        phone: data.profile?.phone || "",
      });
      // Limpiar preview si se recargan los datos del servidor
      setAvatarPreviewUrl(null);
      setSelectedAvatarFile(null);

    } catch (error) {
      console.error("Error al cargar perfil:", error);
      toast({ title: "Error", description: "No se pudo cargar el perfil.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();

    // Fetch user stats (código original, adaptado)
    const fetchUserStats = async () => {
      // ... (tu lógica actual para fetchUserStats, asegurándote de que no interfiera o
      // combine los datos de nivel si ya vienen de /api/profile)
      // Por simplicidad, este fetch se mantiene, pero considera si `profile.level` es suficiente.
      try {
        const statsResponse = await fetch("/api/stats");
        if (!statsResponse.ok) throw new Error("Error al obtener estadísticas");
        const statsData = await statsResponse.json();

        const activitiesResponse = await fetch("/api/activities?limit=3");
        if (!activitiesResponse.ok) throw new Error("Error al obtener actividades");
        const activitiesData = await activitiesResponse.json();

        // El nivel ya debería venir de /api/profile, pero si quieres mantener esta lógica:
        // const userResponse = await fetch("/api/auth/session"); 
        // if (!userResponse.ok) throw new Error("Error al obtener datos del usuario");
        // const userData = await userResponse.json();

        setStats({
          totalPoints: statsData.totalPoints || 0,
          level: profile?.level || statsData.level || 1, // Priorizar nivel de /api/profile
          activityCount: statsData.activityCount || 0,
          recentActivities: activitiesData.activities || [],
        });
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };
    fetchUserStats();
  }, []); // Cuidado con la dependencia de `profile` aquí si `WorkspaceUserStats` lo usa.


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateAvatarFile(file); // Usa la función de s3-service
      if (!validation.valid) {
        toast({ title: "Archivo inválido", description: validation.error, variant: "destructive" });
        setSelectedAvatarFile(null);
        setAvatarPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Limpiar input
        return;
      }
      setSelectedAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("bio", formData.bio);
    payload.append("address", formData.address);
    payload.append("city", formData.city);
    payload.append("state", formData.state);
    payload.append("zipCode", formData.zipCode);
    payload.append("phone", formData.phone);

    if (selectedAvatarFile) {
      payload.append("avatarFile", selectedAvatarFile);
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: payload, // Enviar FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar perfil");
      }

      const updatedProfile: UserProfileData = await response.json();
      setProfile(updatedProfile); // Actualizar perfil con datos del backend (incluye nueva signedAvatarUrl)
      setFormData({ // Actualizar formData también por si el usuario sigue editando otros campos
        name: updatedProfile.name,
        bio: updatedProfile.profile?.bio || "",
        address: updatedProfile.profile?.address || "",
        city: updatedProfile.profile?.city || "",
        state: updatedProfile.profile?.state || "",
        zipCode: updatedProfile.profile?.zipCode || "",
        phone: updatedProfile.profile?.phone || "",
      });

      setSelectedAvatarFile(null); // Limpiar archivo seleccionado
      setAvatarPreviewUrl(null); // Limpiar preview
      if (fileInputRef.current) fileInputRef.current.value = ""; // Limpiar input

      setIsEditing(false);
      toast({ title: "Perfil actualizado", description: "Tu perfil ha sido actualizado correctamente." });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.profile?.avatarUrl) { // avatarUrl es la fileKey
      toast({ title: "Info", description: "No hay foto de perfil para eliminar." });
      return;
    }
    setIsSubmitting(true);
    const payload = new FormData();
    // Enviar los datos actuales del formulario para no perderlos si solo se borra el avatar
    // y el usuario no había guardado otros cambios.
    // Opcionalmente, podrías hacer que "eliminar avatar" sea una acción separada que no
    // afecte los campos de texto no guardados. Por ahora, se envían.
    payload.append("name", formData.name);
    payload.append("bio", formData.bio);
    // ... (añadir otros campos del formData si quieres que se guarden junto con la eliminación del avatar)
    payload.append("deleteAvatar", "true");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la foto de perfil");
      }
      const updatedProfile: UserProfileData = await response.json();
      setProfile(updatedProfile); // El backend enviará profile.signedAvatarUrl como null
      setSelectedAvatarFile(null);
      setAvatarPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast({ title: "Foto de perfil eliminada", description: "Tu foto de perfil ha sido eliminada." });
    } catch (error) {
      console.error("Error al eliminar avatar:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        bio: profile.profile?.bio || "",
        address: profile.profile?.address || "",
        city: profile.profile?.city || "",
        state: profile.profile?.state || "",
        zipCode: profile.profile?.zipCode || "",
        phone: profile.profile?.phone || "",
      });
    }
    setSelectedAvatarFile(null);
    setAvatarPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric", month: "long", year: "numeric",
    }).format(date);
  };

  const getInitials = (name: string = "") => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";
  };

  // Input de archivo oculto
  const AvatarInput = () => (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleAvatarChange}
      accept=".jpg,.jpeg,.png,.webp"
      style={{ display: "none" }}
      disabled={isSubmitting}
    />
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8 m-5 sm:m-10 items-center justify-center h-screen">
          <h3 className="text-lg font-medium">No se pudo cargar el perfil</h3>
          <p className="text-muted-foreground mt-1">Intenta recargar la página o contacta a soporte.</p>
          <Button onClick={fetchProfileData}>Reintentar</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {AvatarInput()} {/* Renderizar el input oculto */}
      <div className="flex flex-col gap-8 m-5 sm:m-10">
        <div className="p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-black to-slate-800 rounded-xl">
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="">Gestiona tu información personal y visualiza tus logros</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="relative">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={avatarPreviewUrl || profile.profile?.signedAvatarUrl || ""}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-2xl bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Botón para cambiar/subir foto */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-background"
                    onClick={triggerAvatarUpload}
                    disabled={isSubmitting}
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Cambiar foto</span>
                  </Button>
                </div>
                {/* Botón para eliminar foto, solo si hay una y no hay preview */}
                {profile.profile?.avatarUrl && !avatarPreviewUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-500 hover:text-red-700"
                    onClick={handleDeleteAvatar}
                    disabled={isSubmitting}
                    title="Eliminar foto de perfil"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Eliminar foto
                  </Button>
                )}
                {/* Indicador si hay una foto seleccionada para subir/cambiar */}
                {avatarPreviewUrl && (
                  <p className="text-xs text-green-600 mt-1">Nueva foto seleccionada</p>
                )}

                <CardTitle className="mt-4 text-xl">{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <LevelUserCard /> {/* Asumo que este componente obtiene datos internamente o vía props */}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Miembro desde:</span>
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tipo de usuario:</span>
                  <span>
                    {profile.userType === "INDIVIDUAL" ? "Individual"
                      : profile.userType === "SCHOOL" ? "Escuela"
                        : profile.userType === "COMMUNITY" ? "Comunidad"
                          : "Gobierno"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Total de actividades:</span>
                  <span>{stats.activityCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Puntos:</span>
                  <span>{profile.points}</span> {/* Mostrar puntos del perfil */}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Nivel:</span>
                  <span>{profile.level}</span> {/* Mostrar nivel del perfil */}
                </div>
              </div>
              <div className="pt-4">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-muted-foreground" /> Insignias
                </h3>
                {profile.profile?.badges && profile.profile.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.profile.badges.map((badge) => (
                      <UiBadge
                        key={badge.id}
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      >
                        <img src={badge.imageUrl || "/placeholder.svg"} alt={badge.name} className="h-4 w-4" />
                        {badge.name}
                      </UiBadge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aún no has obtenido insignias.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <Tabs defaultValue="info">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Información Personal</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={isSubmitting}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
                        <X className="mr-2 h-4 w-4" /> Cancelar
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="security">Seguridad</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="info" className="space-y-6">
                  {isEditing ? (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Nombre completo</label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="bio" className="text-sm font-medium">Biografía</label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} disabled={isSubmitting} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label htmlFor="address" className="text-sm font-medium">Dirección</label>
                          <Input id="address" name="address" value={formData.address} onChange={handleChange} disabled={isSubmitting} />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="city" className="text-sm font-medium">Ciudad</label>
                          <Input id="city" name="city" value={formData.city} onChange={handleChange} disabled={isSubmitting} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label htmlFor="state" className="text-sm font-medium">Estado</label>
                          <Input id="state" name="state" value={formData.state} onChange={handleChange} disabled={isSubmitting} />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="zipCode" className="text-sm font-medium">Código Postal</label>
                          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} disabled={isSubmitting} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <h3 className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />Nombre completo</h3>
                        <p>{profile.name}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />Correo electrónico</h3>
                        <p>{profile.email}</p>
                      </div>
                      {profile.profile?.bio && (
                        <div className="space-y-1">
                          <h3 className="font-medium">Biografía</h3>
                          <p className="text-muted-foreground">{profile.profile.bio}</p>
                        </div>
                      )}
                      <div className="pt-2">
                        <h3 className="font-medium mb-2">Información de contacto</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {profile.profile?.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p>{profile.profile.address}</p>
                                <p>{profile.profile.city}, {profile.profile.state} {profile.profile.zipCode}</p>
                              </div>
                            </div>
                          )}
                          {profile.profile?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <p>{profile.profile.phone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="security">
                  {/* ... (código original de la pestaña de seguridad, no modificado por esta tarea) ... */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Cambiar contraseña</h3>
                      <p className="text-sm text-muted-foreground">
                        Actualiza tu contraseña para mantener tu cuenta segura
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="current-password" className="text-sm font-medium">
                          Contraseña actual
                        </label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="new-password" className="text-sm font-medium">
                          Nueva contraseña
                        </label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">
                          Confirmar nueva contraseña
                        </label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">Actualizar contraseña</Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        <Card>
          {/* ... (código original de la tarjeta de logros, no modificado por esta tarea) ... */}
          <CardHeader>
            <CardTitle>Mis Logros</CardTitle>
            <CardDescription>Visualiza tus insignias y reconocimientos</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.profile?.badges && profile.profile.badges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {profile.profile.badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <img src={badge.imageUrl || "/placeholder.svg"} alt={badge.name} className="h-20 w-20 mb-4" />
                    <h3 className="font-medium">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg border-dashed">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Award className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Próxima insignia</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Continúa participando para desbloquear más insignias
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                  <Award className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Aún no tienes insignias</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Completa actividades para desbloquear insignias y reconocimientos
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Las insignias se otorgan automáticamente al cumplir ciertos hitos en la plataforma.
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
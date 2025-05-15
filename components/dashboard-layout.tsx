"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Leaf, Map, User, LogOut, Menu, X, LayoutDashboard, BarChart2, Award, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import toast from "react-hot-toast"

import { UserProfileData, UserStats } from "@/types/types"
import LevelUserCard from "./LevelUserCard"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfileData>({
    id: "",
    name: "",
    email: "",
    role: "",
    userType: "",
    points: 0,
    level: 1,
    createdAt: "",
    profile: {
      id: "",
      bio: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      avatarUrl: "",
      signedAvatarUrl: "",
      badges: [],
    },
  })

  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    activityCount: 0,
    recentActivities: [],
  })


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const userDataResponse = await fetch("/api/profile");
        if (!userDataResponse.ok) {
          throw new Error("Error al obtener perfil de usuario");
        }

        const userData = await userDataResponse.json();

        setProfile({
          id: userData.id || "",
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "",
          userType: userData.userType || "",
          points: userData.points ?? 0,
          level: userData.level ?? 1,
          createdAt: userData.createdAt || "",
          profile: {
            id: userData.profile?.id || "",
            bio: userData.profile?.bio || "",
            address: userData.profile?.address || "",
            city: userData.profile?.city || "",
            state: userData.profile?.state || "",
            zipCode: userData.profile?.zipCode || "",
            phone: userData.profile?.phone || "",
            avatarUrl: userData.profile?.avatarUrl || "",
            signedAvatarUrl: userData.profile?.signedAvatarUrl || "",
            badges: Array.isArray(userData.badges)
              ? userData.badges.map((badge: any) => ({
                id: badge.id || "",
                name: badge.name || "",
                description: badge.description || "",
                imageUrl: badge.imageUrl || "",
              }))
              : [],
          },
        });
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData(); // Ejecutar función
  }, []);


  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setIsLoading(true)

        // Obtener estadísticas del usuario
        const statsResponse = await fetch("/api/stats")
        if (!statsResponse.ok) {
          throw new Error("Error al obtener estadísticas")
        }
        const statsData = await statsResponse.json()

        // Obtener actividades recientes
        const activitiesResponse = await fetch("/api/activities?limit=3")
        if (!activitiesResponse.ok) {
          throw new Error("Error al obtener actividades")
        }
        const activitiesData = await activitiesResponse.json()

        // Obtener datos del usuario (incluye nivel)
        const userResponse = await fetch("/api/auth/session")
        if (!userResponse.ok) {
          throw new Error("Error al obtener datos del usuario")
        }
        const userData = await userResponse.json()

        setStats({
          totalPoints: statsData.totalPoints || 0,
          level: userData.user?.level || 1,
          activityCount: statsData.activityCount || 0,
          recentActivities: activitiesData.activities || [],
        })
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Has cerrado sesión correctamente")
        router.push("/")
      } else {
        toast.error("Error al cerrar sesión")
      }

      // Redirigir a la página de inicio
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast.error("No se pudo cerrar sesión")
    }
  }

  if (isLoading) {
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  }

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header para móviles */}
      <header className="bg-white py-4 px-4 flex justify-between items-center lg:hidden">
        <Link href="/dashboard" className="flex items-center">
          <Leaf className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-xl font-bold">EcoTrack MX</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <Leaf className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-xl font-bold">EcoTrack MX</span>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cerrar menú</span>
                  </Button>
                </SheetTrigger>
              </div>


              <div className="flex flex-col items-center mb-6 py-4 border-b border-gray-200">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profile?.avatarUrl || ""} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium">{ }</p>
                  <p className="text-sm text-gray-500">usuario@ejemplo.com</p>
                </div>
              </div>

              <nav className="flex-1">
                <MobileNavItem
                  href="/dashboard"
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  label="Dashboard"
                  active={pathname === "/dashboard"}
                />
                <MobileNavItem
                  href="/estadisticas"
                  icon={<BarChart2 className="h-5 w-5" />}
                  label="Estadísticas"
                  active={pathname === "/estadisticas"}
                />
                <MobileNavItem
                  href="/actividades"
                  icon={<Leaf className="h-5 w-5" />}
                  label="Actividades"
                  active={pathname === "/actividades"}
                />
                {/* <MobileNavItem
                  href="/user/dynamics"
                  icon={<Zap className="h-5 w-5" />}
                  label="Dinámicas"
                  active={pathname === "/user/dynamics"}
                /> */}
                <MobileNavItem
                  href="/recompensas"
                  icon={<Award className="h-5 w-5" />}
                  label="Recompensas"
                  active={pathname === "/recompensas"}
                />
                <MobileNavItem
                  href="/badges"
                  icon={<Medal className="h-5 w-5" />}
                  label="Insignias"
                  active={pathname === "/badges"}
                />
                <MobileNavItem
                  href="/mapa"
                  icon={<Map className="h-5 w-5" />}
                  label="Mapa"
                  active={pathname === "/mapa"}
                />
                <MobileNavItem
                  href="/perfil"
                  icon={<User className="h-5 w-5" />}
                  label="Mi Perfil"
                  active={pathname === "/perfil"}
                />
              </nav>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Layout para escritorio */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white">
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center">
              <Leaf className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-xl font-bold">EcoTrack MX</span>
            </Link>
          </div>

          <div className="flex flex-col items-center py-6 border-b border-gray-200">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={avatarPreviewUrl || profile.profile?.signedAvatarUrl || ""}
                alt={profile.name}
              />
            </Avatar>
            <div className="text-center flex flex-col gap-2">
              <p className="font-medium">{profile?.name.toString()}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <div className="mt-2 flex items-center justify-center space-x-1">
                <span className="bg-blue-700 text-blue-50 text-xs px-2 py-1 rounded-full">Actividades: {stats.activityCount}</span>
              </div>
              <LevelUserCard />
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link href="/dashboard">
              <NavItem
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Dashboard"
                active={pathname === "/dashboard"}
              />
            </Link>
            <Link href="/estadisticas">
              <NavItem
                icon={<BarChart2 className="h-5 w-5" />}
                label="Estadísticas"
                active={pathname === "/estadisticas"}
              />
            </Link>
            <Link href="/actividades">
              <NavItem
                icon={<Leaf className="h-5 w-5" />}
                label="Actividades"
                active={pathname === "/actividades"}
              />
            </Link>
            {/* <Link>
            <NavItem
              href="/user/dynamics"
              icon={<Zap className="h-5 w-5" />}
              label="Dinámicas"
              active={pathname === "/user/dynamics"}
            />
            </Link> */}
            <Link href="/recompensas">
              <NavItem
                icon={<Award className="h-5 w-5" />}
                label="Recompensas"
                active={pathname === "/recompensas"}
              />
            </Link>
            <Link href="/badges">
              <NavItem
                icon={<Medal className="h-5 w-5" />}
                label="Insignias"
                active={pathname === "/badges"}
              />
            </Link>
            <Link href="/mapa">
              <NavItem
                icon={<Map className="h-5 w-5" />}
                label="Mapa"
                active={pathname === "/mapa"}
              />
            </Link>
            <Link href="/perfil">
              <NavItem
                icon={<User className="h-5 w-5" />}
                label="Mi Perfil"
                active={pathname === "/perfil"}
              />
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <footer className="py-6 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 EcoTrack MX. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terminos" className="text-sm text-muted-foreground hover:underline">
              Términos
            </Link>
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:underline">
              Privacidad
            </Link>
            <Link href="/contacto" className="text-sm text-muted-foreground hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={`w-full justify-start ${active ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  )
}

function MobileNavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link href={href} className="block">
      <Button
        variant={active ? "default" : "ghost"}
        className={`w-full justify-start ${active ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-700 hover:bg-gray-100"}`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  )
  // return (
  //   <div className="flex min-h-screen flex-col">
  //     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  //       <div className="container flex h-16 items-center justify-between">
  //         <div className="flex items-center gap-2">
  //           <Sheet>
  //             <SheetTrigger asChild>
  //               <Button variant="ghost" size="icon" className="md:hidden">
  //                 <Menu className="h-5 w-5" />
  //                 <span className="sr-only">Toggle menu</span>
  //               </Button>
  //             </SheetTrigger>
  //             <SheetContent side="left" className="w-64">
  //               <div className="flex items-center gap-2 mb-8">
  //                 <Leaf className="h-6 w-6 text-green-600" />
  //                 <span className="text-xl font-bold">EcoTrack MX</span>
  //                 <Button variant="ghost" size="icon" className="ml-auto">
  //                   <X className="h-5 w-5" />
  //                   <span className="sr-only">Close</span>
  //                 </Button>
  //               </div>
  //               <nav className="flex flex-col gap-4">
  //                 {navigation.map((item) => {
  //                   const isActive = pathname === item.href
  //                   return (
  //                     <Link
  //                       key={item.name}
  //                       href={item.href}
  //                       className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${isActive
  //                         ? "bg-green-100 text-green-900 dark:bg-green-800/30 dark:text-green-50"
  //                         : "hover:bg-muted"
  //                         }`}
  //                     >
  //                       <item.icon className={`h-4 w-4 ${isActive ? "text-green-600" : ""}`} />
  //                       {item.name}
  //                     </Link>
  //                   )
  //                 })}
  //                 <Button
  //                   variant="ghost"
  //                   className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm justify-start hover:bg-muted"
  //                   onClick={handleLogout}
  //                 >
  //                   <LogOut className="h-4 w-4" />
  //                   Cerrar sesión
  //                 </Button>
  //               </nav>
  //             </SheetContent>
  //           </Sheet>
  //           <Link href="/dashboard" className="flex items-center gap-2">
  //             <Leaf className="h-6 w-6 text-green-600" />
  //             <span className="text-xl font-bold hidden md:inline">EcoTrack MX</span>
  //           </Link>
  //         </div>
  //         <nav className="hidden md:flex gap-6">
  //           {navigation.map((item) => {
  //             const isActive = pathname === item.href
  //             return (
  //               <Link
  //                 key={item.name}
  //                 href={item.href}
  //                 className={`text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  //                   }`}
  //               >
  //                 {item.name}
  //               </Link>
  //             )
  //           })}
  //         </nav>
  //         <div className="flex items-center gap-4">
  //           {user?.role === "ADMIN" && (
  //             <Link href="/admin">
  //               <Button variant="outline" size="icon">
  //                 <Settings className="h-4 w-4" />
  //                 <span className="sr-only">Administración</span>
  //               </Button>
  //             </Link>
  //           )}
  //           <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
  //             <LogOut className="h-5 w-5" />
  //             <span className="sr-only">Cerrar sesión</span>
  //           </Button>
  //         </div>
  //       </div>
  //     </header>
  //     <main className="flex-1 container py-6">{children}</main>
  //     <footer className="border-t py-6">
  //       <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
  //         <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
  //           © 2025 EcoTrack MX. Todos los derechos reservados.
  //         </p>
  //         <div className="flex gap-4">
  //           <Link href="/terminos" className="text-sm text-muted-foreground hover:underline">
  //             Términos
  //           </Link>
  //           <Link href="/privacidad" className="text-sm text-muted-foreground hover:underline">
  //             Privacidad
  //           </Link>
  //           <Link href="/contacto" className="text-sm text-muted-foreground hover:underline">
  //             Contacto
  //           </Link>
  //         </div>
  //       </div>
  //     </footer>
  //   </div>
  // )
}


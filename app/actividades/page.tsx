// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { PlusCircle, Search, Filter, Recycle, TreePine, Droplets, Lightbulb, Leaf, BookOpen } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import DashboardLayout from "@/components/dashboard-layout"

// interface Activity {
//   id: string
//   title: string
//   description: string | null
//   type: string
//   quantity: number
//   unit: string
//   points: number
//   date: string
//   createdAt: string
//   user: {
//     name: string
//   }
// }

// export default function ActivitiesPage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [activities, setActivities] = useState<Activity[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filter, setFilter] = useState("all")

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         setIsLoading(true)
//         const response = await fetch("/api/activities")

//         if (!response.ok) {
//           throw new Error("Error al obtener actividades")
//         }

//         const data = await response.json()
//         setActivities(data.activities || [])
//       } catch (error) {
//         console.error("Error al cargar actividades:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchActivities()
//   }, [])

//   // Función para obtener el icono según el tipo de actividad
//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case "RECYCLING":
//         return <Recycle className="h-5 w-5 text-green-600" />
//       case "TREE_PLANTING":
//         return <TreePine className="h-5 w-5 text-amber-600" />
//       case "WATER_SAVING":
//         return <Droplets className="h-5 w-5 text-blue-600" />
//       case "ENERGY_SAVING":
//         return <Lightbulb className="h-5 w-5 text-yellow-600" />
//       case "COMPOSTING":
//         return <Leaf className="h-5 w-5 text-green-600" />
//       case "EDUCATION":
//         return <BookOpen className="h-5 w-5 text-purple-600" />
//       default:
//         return <Leaf className="h-5 w-5 text-green-600" />
//     }
//   }

//   // Función para formatear la fecha
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat("es-MX", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     }).format(date)
//   }

//   // Filtrar actividades
//   const filteredActivities = activities.filter((activity) => {
//     const matchesSearch =
//       activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
//     const matchesFilter = filter === "all" || activity.type === filter
//     return matchesSearch && matchesFilter
//   })

//   return (
//     <DashboardLayout>
//       <div className="flex flex-col gap-8 m-5 sm:m-10">
//         <div className="p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
//           <h1 className="text-3xl font-bold tracking-tight">Actividades</h1>
//           <p className="">Gestiona y visualiza tus actividades ecológicas</p>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 justify-between">
//           <div className="flex flex-col md:flex-row gap-4 flex-1">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Buscar actividades..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <Filter className="mr-2 h-4 w-4" />
//                 <SelectValue placeholder="Filtrar por tipo" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos los tipos</SelectItem>
//                 <SelectItem value="RECYCLING">Reciclaje</SelectItem>
//                 <SelectItem value="TREE_PLANTING">Plantación</SelectItem>
//                 <SelectItem value="WATER_SAVING">Ahorro de agua</SelectItem>
//                 <SelectItem value="ENERGY_SAVING">Ahorro de energía</SelectItem>
//                 <SelectItem value="COMPOSTING">Compostaje</SelectItem>
//                 <SelectItem value="EDUCATION">Educación</SelectItem>
//                 <SelectItem value="OTHER">Otros</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Link href="/actividades/nueva">
//             <Button className="bg-green-600 hover:bg-green-700">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               Nueva actividad
//             </Button>
//           </Link>
//         </div>

//         <Tabs defaultValue="list" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-4">
//             <TabsTrigger value="list">Lista</TabsTrigger>
//             <TabsTrigger value="calendar">Calendario</TabsTrigger>
//           </TabsList>
//           <TabsContent value="list" className="space-y-4">
//             {isLoading ? (
//               <div className="flex items-center justify-center h-40">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : filteredActivities.length > 0 ? (
//               filteredActivities.map((activity) => (
//                 <Card key={activity.id} className="border-4 border-green-200 rounded-xl transition-all ease-linear hover:border-green-600">
//                   <CardContent className="p-6">
//                     <div className="flex items-start gap-4">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
//                         {getActivityIcon(activity.type)}
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <h3 className="font-semibold text-lg">{activity.title}</h3>
//                           <div className="flex items-center gap-1 text-green-600 font-medium">
//                             +{activity.points} pts
//                           </div>
//                         </div>
//                         <p className="text-muted-foreground mt-1">{activity.description}</p>
//                         <div className="flex flex-wrap gap-4 mt-2 text-sm">
//                           <div className="flex items-center gap-1">
//                             <span className="text-muted-foreground">Cantidad:</span>
//                             <span>
//                               {activity.quantity} {activity.unit}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span className="text-muted-foreground">Fecha:</span>
//                             <span>{formatDate(activity.date)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <div className="text-center py-10">
//                 <h3 className="text-lg font-medium">No se encontraron actividades</h3>
//                 <p className="text-muted-foreground mt-1">Intenta cambiar los filtros o registra una nueva actividad</p>
//                 <Link href="/actividades/nueva" className="mt-4 inline-block">
//                   <Button className="bg-green-600 hover:bg-green-700">
//                     <PlusCircle className="mr-2 h-4 w-4" />
//                     Nueva actividad
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </TabsContent>
//           <TabsContent value="calendar">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Vista de calendario</CardTitle>
//                 <CardDescription>Visualiza tus actividades en formato de calendario</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-10">
//                   <p className="text-muted-foreground">La vista de calendario estará disponible próximamente</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Search, Filter, Recycle, TreePine, Droplets, Lightbulb, Leaf, BookOpen, FileQuestion, ImageOff } from "lucide-react" // Añadido FileQuestion, ImageOff
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import Image from "next/image"

interface Activity {
  id: string
  title: string
  description: string | null
  type: string
  quantity: number
  unit: string
  points: number
  date: string
  createdAt: string
  user: {
    name: string
  }
  evidence: {
    fileUrl: string;
    fileType: string;
    fileName: string;
    fileSize: number;
    format: string;
    description?: string | null;
  }[] | null;
}

export default function ActivitiesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/activities") // Asegúrate que esta API devuelva el campo 'evidence'

        if (!response.ok) {
          throw new Error("Error al obtener actividades")
        }

        const data = await response.json()
        // Asegúrate que cada actividad en data.activities tenga el campo 'evidence' (string[])
        setActivities(data.activities || [])
      } catch (error) {
        console.error("Error al cargar actividades:", error)
        setActivities([]) // En caso de error, establecer un array vacío
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "RECYCLING": return <Recycle className="h-5 w-5 text-green-600" />;
      case "TREE_PLANTING": return <TreePine className="h-5 w-5 text-amber-600" />;
      case "WATER_SAVING": return <Droplets className="h-5 w-5 text-blue-600" />;
      case "ENERGY_SAVING": return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case "COMPOSTING": return <Leaf className="h-5 w-5 text-lime-600" />; // Color ajustado para diferenciar de Recycle
      case "EDUCATION": return <BookOpen className="h-5 w-5 text-purple-600" />;
      default: return <Leaf className="h-5 w-5 text-gray-500" />; // Default a un color neutro
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const inferMediaType = (url: string): 'image' | 'video' | 'unknown' => {
    const lowerUrl = url.toString().toLowerCase();
    if (/\.(jpeg|jpg|gif|png|webp)$/.test(lowerUrl)) {
      return 'image';
    }
    if (/\.(mp4|webm|ogg)$/.test(lowerUrl)) {
      return 'video';
    }
    return 'unknown';
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filter === "all" || activity.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 m-5 sm:m-10">
        <div className="p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
          <h1 className="text-3xl font-bold tracking-tight">Actividades</h1>
          <p className="">Gestiona y visualiza tus actividades ecológicas</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar actividades..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="RECYCLING">Reciclaje</SelectItem>
                <SelectItem value="TREE_PLANTING">Plantación</SelectItem>
                <SelectItem value="WATER_SAVING">Ahorro de agua</SelectItem>
                <SelectItem value="ENERGY_SAVING">Ahorro de energía</SelectItem>
                <SelectItem value="COMPOSTING">Compostaje</SelectItem>
                <SelectItem value="EDUCATION">Educación</SelectItem>
                <SelectItem value="OTHER">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/actividades/nueva">
            <Button className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva actividad
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4"> {/* Ajustado para mejor responsive */}
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="border-2 border-green-200 rounded-xl transition-all ease-linear hover:border-green-500 shadow-sm hover:shadow-md">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{activity.title}</h3>
                          <div className="flex items-center gap-1 text-green-600 font-medium mt-1 sm:mt-0">
                            +{activity.points} pts
                          </div>
                        </div>
                        {activity.description && (
                          <p className="text-muted-foreground mt-1 text-sm">{activity.description}</p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Cantidad:</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {activity.quantity} {activity.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Fecha:</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(activity.date)}</span>
                          </div>
                        </div>

                        {/* Sección para mostrar Evidencias (Imágenes/Videos) */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {activity.evidence && activity.evidence.map((evidence, index) => (
                            <div key={index} className="relative border rounded-lg overflow-hidden">
                              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                {evidence.fileType === "image" ? (
                                  <Image src={evidence.fileUrl} alt={evidence.fileName} width={500} height={500} priority className="w-full h-full object-contain" />
                                ) : evidence.fileType === "video" ? (
                                  <video src={evidence.fileUrl} controls className="w-full h-full object-contain" />
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-2">
                                    {/* Puedes usar un icono genérico para otros tipos de archivo si es necesario */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375H17.25m0 0a3.375 3.375 0 10-6.75 0M19.5 12.75h-2.25m0 0a3.375 3.375 0 01-3.375 3.375H9.75m0 0v-3.75m0 0a3.375 3.375 0 00-3.375-3.375H6m.375 9.375a3 3 0 11-6 0m6 0a3 3 0 00-3-3H.375M19.5 14.25a3 3 0 01-3-3h-.375m0 0a3.375 3.375 0 10-6.75 0M19.5 12.75v-2.25A3.375 3.375 0 0016.125 7.125h-8.25A3.375 3.375 0 004.5 9.75v7.5A3.375 3.375 0 007.875 20.625h8.25A3.375 3.375 0 0019.5 17.25v-2.625z" />
                                    </svg>
                                    <span className="mt-2 text-sm text-gray-500 truncate">{evidence.fileName}</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-2 text-sm truncate bg-green-600 text-white">
                                <p>
                                  Evidencia de la actividad: {activity.title}
                                </p>
                                <span className="flex gap-2">
                                  Puntos obtenidos:
                                  <p className="font-bold border-b">
                                    +{activity.points} pts</p>
                                </span>
                              </div>
                              {/* <div className="p-2 text-sm truncate bg-white dark:bg-gray-300">
                                {evidence.fileName} ({(evidence.fileSize / (1024 * 1024)).toFixed(2)} MB)
                              </div> */}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No se encontraron actividades</h3>
                <p className="text-muted-foreground mt-1">Intenta cambiar los filtros o registra una nueva actividad.</p>
                <Link href="/actividades/nueva" className="mt-4 inline-block">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva actividad
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Vista de calendario</CardTitle>
                <CardDescription>Visualiza tus actividades en formato de calendario.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground">La vista de calendario estará disponible próximamente.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
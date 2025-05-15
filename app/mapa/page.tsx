"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Clock, Phone, Mail, Globe, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"

interface RecyclingCenter {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  zipCode?: string
  phone?: string
  email?: string
  website?: string
  latitude: number
  longitude: number
  openingHours?: string
  materials: {
    id: string
    name: string
    category: string
  }[]
}

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [centers, setCenters] = useState<RecyclingCenter[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setCenters([
        {
          id: "1",
          name: "Centro de Reciclaje Municipal",
          description: "Centro oficial de reciclaje del municipio",
          address: "Av. Principal 123",
          city: "Ciudad de México",
          state: "CDMX",
          zipCode: "01000",
          phone: "55 1234 5678",
          email: "contacto@reciclajemunicipal.mx",
          website: "www.reciclajemunicipal.mx",
          latitude: 19.432608,
          longitude: -99.133209,
          openingHours: "Lun-Vie: 9:00-18:00, Sáb: 9:00-14:00",
          materials: [
            { id: "1", name: "Plástico", category: "PLASTIC" },
            { id: "2", name: "Papel y Cartón", category: "PAPER" },
            { id: "3", name: "Vidrio", category: "GLASS" },
            { id: "4", name: "Metal", category: "METAL" },
          ],
        },
        {
          id: "2",
          name: "EcoRecicla",
          description: "Centro especializado en reciclaje de electrónicos",
          address: "Calle Tecnología 456",
          city: "Ciudad de México",
          state: "CDMX",
          zipCode: "01010",
          phone: "55 8765 4321",
          latitude: 19.422608,
          longitude: -99.143209,
          openingHours: "Lun-Vie: 10:00-19:00",
          materials: [
            { id: "5", name: "Electrónicos", category: "ELECTRONIC" },
            { id: "6", name: "Baterías", category: "HAZARDOUS" },
          ],
        },
        {
          id: "3",
          name: "Composta Comunitaria",
          description: "Centro de compostaje comunitario",
          address: "Parque Ecológico, Zona Verde",
          city: "Ciudad de México",
          state: "CDMX",
          latitude: 19.442608,
          longitude: -99.123209,
          openingHours: "Sáb-Dom: 9:00-13:00",
          materials: [{ id: "7", name: "Residuos Orgánicos", category: "ORGANIC" }],
        },
        {
          id: "4",
          name: "Recicladora Industrial",
          description: "Centro de reciclaje industrial para grandes volúmenes",
          address: "Zona Industrial 789",
          city: "Toluca",
          state: "Estado de México",
          phone: "722 123 4567",
          email: "info@recicladoraindustrial.mx",
          latitude: 19.292569,
          longitude: -99.655435,
          materials: [
            { id: "1", name: "Plástico", category: "PLASTIC" },
            { id: "2", name: "Papel y Cartón", category: "PAPER" },
            { id: "3", name: "Vidrio", category: "GLASS" },
            { id: "4", name: "Metal", category: "METAL" },
            { id: "8", name: "Textiles", category: "OTHER" },
          ],
        },
        {
          id: "5",
          name: "Centro de Acopio Escolar",
          description: "Centro de acopio en escuela primaria",
          address: "Escuela Primaria Ambiental",
          city: "Cuernavaca",
          state: "Morelos",
          latitude: 18.921129,
          longitude: -99.234047,
          openingHours: "Lun-Vie: 8:00-14:00",
          materials: [
            { id: "1", name: "Plástico", category: "PLASTIC" },
            { id: "2", name: "Papel y Cartón", category: "PAPER" },
          ],
        },
      ])
      setIsLoading(false)
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filtrar centros
  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.state.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === "all" || center.materials.some((material) => material.category === filter)

    return matchesSearch && matchesFilter
  })

  // Función para obtener el color del badge según la categoría
  const getMaterialColor = (category: string) => {
    switch (category) {
      case "PLASTIC":
        return "bg-blue-100 text-blue-800 "
      case "PAPER":
        return "bg-yellow-100 text-yellow-800"
      case "GLASS":
        return "bg-green-100 text-green-800"
      case "METAL":
        return "bg-gray-100 text-gray-800"
      case "ORGANIC":
        return "bg-lime-100 text-lime-800"
      case "ELECTRONIC":
        return "bg-purple-100 text-purple-800"
      case "HAZARDOUS":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 m-5 sm:m-10">
        <div className="p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-slate-500 to-slate-700 rounded-xl">
          <h1 className="text-3xl font-bold tracking-tight">Mapa de Centros de Acopio</h1>
          <p className="">Encuentra centros de acopio y redes de apoyo ambiental cercanos</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, dirección o ciudad..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los materiales</SelectItem>
              <SelectItem value="PLASTIC">Plástico</SelectItem>
              <SelectItem value="PAPER">Papel y Cartón</SelectItem>
              <SelectItem value="GLASS">Vidrio</SelectItem>
              <SelectItem value="METAL">Metal</SelectItem>
              <SelectItem value="ORGANIC">Orgánicos</SelectItem>
              <SelectItem value="ELECTRONIC">Electrónicos</SelectItem>
              <SelectItem value="HAZARDOUS">Peligrosos</SelectItem>
              <SelectItem value="OTHER">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          <TabsContent value="map">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Card className="h-[500px] overflow-hidden">
                  <CardContent className="p-0 h-full">
                    {mapLoaded ? (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <div className="text-center p-4">
                          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Mapa interactivo con Google Maps API (simulado)</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            En una implementación real, aquí se mostraría un mapa interactivo con los centros de acopio
                            marcados
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="h-[500px] overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Centros de Acopio</CardTitle>
                    <CardDescription>{filteredCenters.length} centros encontrados</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto h-[calc(500px-73px)]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                    ) : filteredCenters.length > 0 ? (
                      <div className="space-y-1">
                        {filteredCenters.map((center) => (
                          <div
                            key={center.id}
                            className={`p-3 cursor-pointer hover:bg-muted transition-colors ${selectedCenter?.id === center.id ? "bg-muted" : ""
                              }`}
                            onClick={() => setSelectedCenter(center)}
                          >
                            <h3 className="font-medium">{center.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{center.address}</p>
                            <p className="text-xs text-muted-foreground">
                              {center.city}, {center.state}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No se encontraron centros de acopio</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {selectedCenter && (
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedCenter.name}</CardTitle>
                      <CardDescription>{selectedCenter.description}</CardDescription>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setSelectedCenter(null)}>
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Cerrar</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          Dirección
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedCenter.address}, {selectedCenter.city}, {selectedCenter.state}{" "}
                          {selectedCenter.zipCode && selectedCenter.zipCode}
                        </p>
                      </div>

                      {selectedCenter.openingHours && (
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Horario
                          </h3>
                          <p className="text-muted-foreground">{selectedCenter.openingHours}</p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium mb-2">Materiales aceptados</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCenter.materials.map((material) => (
                            <Badge key={material.id} variant="outline" className={getMaterialColor(material.category)}>
                              {material.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedCenter.phone && (
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            Teléfono
                          </h3>
                          <p className="text-muted-foreground">{selectedCenter.phone}</p>
                        </div>
                      )}

                      {selectedCenter.email && (
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Correo electrónico
                          </h3>
                          <p className="text-muted-foreground">{selectedCenter.email}</p>
                        </div>
                      )}

                      {selectedCenter.website && (
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            Sitio web
                          </h3>
                          <p className="text-muted-foreground">{selectedCenter.website}</p>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Cómo llegar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="list">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : filteredCenters.length > 0 ? (
              <div className="space-y-4">
                {filteredCenters.map((center) => (
                  <Card key={center.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold">{center.name}</h3>
                          <p className="text-muted-foreground mt-1">{center.description}</p>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {center.address}, {center.city}, {center.state} {center.zipCode && center.zipCode}
                              </span>
                            </div>

                            {center.openingHours && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{center.openingHours}</span>
                              </div>
                            )}

                            {center.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{center.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="md:w-1/3">
                          <h4 className="font-medium mb-2">Materiales aceptados:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.materials.map((material) => (
                              <Badge
                                key={material.id}
                                variant="outline"
                                className={getMaterialColor(material.category)}
                              >
                                {material.name}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-4">
                            <Button className="w-full bg-green-600 hover:bg-green-700">Ver detalles</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No se encontraron centros de acopio</h3>
                <p className="text-muted-foreground mt-1">Intenta cambiar los filtros o la búsqueda</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

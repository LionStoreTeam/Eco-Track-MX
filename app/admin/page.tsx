"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/dashboard-layout"
import toast from 'react-hot-toast';


export default function AdminRewardsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pointsCost: 100,
    category: "PRODUCT",
    available: true,
    hasQuantity: false,
    quantity: 1,
    hasExpiration: false,
    expiresAt: null as Date | null,
  })

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        if (!data.user || data.user.role !== "ADMIN") {
          toast.error("Acceso denegado. No tienes permisos para acceder a esta página")
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Error al verificar permisos:", error)
        toast.error("Error. No se pudo verificar tus permisos")
        router.push("/dashboard")
      }
    }

    checkAdmin()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pointsCost" || name === "quantity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      expiresAt: date,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Preparar datos para enviar
      const rewardData = {
        title: formData.title,
        description: formData.description,
        pointsCost: formData.pointsCost,
        category: formData.category,
        available: formData.available,
        quantity: formData.hasQuantity ? formData.quantity : null,
        expiresAt: formData.hasExpiration ? formData.expiresAt : null,
      }

      // Enviar datos a la API
      const response = await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rewardData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear la recompensa")
      }

      const result = await response.json()

      toast.success("Recompensa creada correctamente.")

      // Resetear formulario
      setFormData({
        title: "",
        description: "",
        pointsCost: 100,
        category: "PRODUCT",
        available: true,
        hasQuantity: false,
        quantity: 1,
        hasExpiration: false,
        expiresAt: null,
      })
    } catch (error) {
      console.error("Error al crear recompensa:", error)
      toast.error("Error al crear la recompensa")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (!isAdmin) {
    return null // No debería llegar aquí, pero por si acaso
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 m-5 sm:m-10">
        <div className="p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-black to-slate-800 rounded-xl">
          <h1 className="text-3xl font-bold tracking-tight">Administración de Recompensas</h1>
          <p className="">Crea nuevas recompensas para los usuarios de la plataforma</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Crear Nueva Recompensa</CardTitle>
            <CardDescription>
              Completa el formulario para crear una nueva recompensa que estará disponible para todos los usuarios.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Descuento en tienda ecológica"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe los detalles de la recompensa"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pointsCost">Costo en Puntos</Label>
                  <Input
                    id="pointsCost"
                    name="pointsCost"
                    type="number"
                    min={1}
                    value={formData.pointsCost}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DISCOUNT">Descuento</SelectItem>
                      <SelectItem value="WORKSHOP">Taller</SelectItem>
                      <SelectItem value="PRODUCT">Producto</SelectItem>
                      <SelectItem value="RECOGNITION">Reconocimiento</SelectItem>
                      <SelectItem value="EXPERIENCE">Experiencia</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => handleSwitchChange("available", checked)}
                />
                <Label htmlFor="available">Disponible inmediatamente</Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasQuantity"
                    checked={formData.hasQuantity}
                    onCheckedChange={(checked) => handleSwitchChange("hasQuantity", checked)}
                  />
                  <Label htmlFor="hasQuantity">Cantidad limitada</Label>
                </div>

                {formData.hasQuantity && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="quantity">Cantidad disponible</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={handleChange}
                      required={formData.hasQuantity}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasExpiration"
                    checked={formData.hasExpiration}
                    onCheckedChange={(checked) => handleSwitchChange("hasExpiration", checked)}
                  />
                  <Label htmlFor="hasExpiration">Fecha de expiración</Label>
                </div>

                {formData.hasExpiration && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="expiresAt">Fecha de expiración</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.expiresAt && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.expiresAt ? (
                            format(formData.expiresAt, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.expiresAt || undefined}
                          onSelect={handleDateChange as any}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/admin")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Crear Recompensa
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

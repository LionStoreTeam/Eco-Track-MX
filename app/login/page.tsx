"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, Eye, EyeOff } from "lucide-react" // Importa los iconos Eye y EyeOff
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const callbackUrlLoginFailed = searchParams.get("callbackUrl") || "/login"

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false) // Nuevo estado para la visibilidad de la contraseña

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      toast.error("Correo electrónico y contraseña son obligatorios")
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error("Los datos ingresados son incorrectos")
        router.push(callbackUrlLoginFailed)

      } else {
        toast.success("Bienvenido")

        // Redirigir a la página solicitada o al dashboard
        router.push(callbackUrl)
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error) // Remove later
      toast.error("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-600" />
        <span className="font-bold">EcoTrack MX</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a la plataforma</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Cambia el tipo de input según la visibilidad
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Link href="/recuperar-password" className="text-sm text-green-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-green-600 hover:underline">
                Registrarse
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
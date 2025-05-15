"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Recycle, Droplets, TreePine } from "lucide-react"
import { BackgroundLines } from "@/components/ui/background-lines"
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">EcoTrack MX</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <BackgroundLines>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:from-green-950/20 dark:to-background">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Eco Track MX - Gestión y educación ambiental comunitaria
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Una plataforma para que escuelas, comunidades y gobiernos locales lleven un seguimiento y educación
                    sobre hábitos ambientales sostenibles.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <TypeAnimation
                      sequence={[
                        // Same substring at the start will only be typed out once, initially
                        'Inicia Sesión',
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                        'Registrate',
                        1000,
                        'Y comienza la aventura',
                        1000,
                        'EcoTrack MX',
                        1000,
                      ]}
                      wrapper="span"
                      speed={50}
                      style={{ fontSize: '2em', display: 'inline-block' }}
                      repeat={Infinity}
                    />
                  </div>
                </div>
                <div className="mx-auto grid max-w-[500px] grid-cols-2 gap-4">
                  <div className="grid gap-4">
                    <div className="rounded-xl bg-green-100 dark:bg-green-900/20 p-8 text-center transition">
                      <Recycle className="mx-auto h-10 w-10 text-green-600 mb-2" />
                      <h3 className="font-semibold">Reciclaje</h3>
                    </div>
                    <div className="rounded-xl bg-blue-100 dark:bg-blue-900/20 p-8 text-center transition">
                      <Droplets className="mx-auto h-10 w-10 text-blue-600 mb-2" />
                      <h3 className="font-semibold">Ahorro de agua</h3>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-xl bg-amber-100 dark:bg-amber-900/20 p-8 text-center transition">
                      <TreePine className="mx-auto h-10 w-10 text-amber-600 mb-2" />
                      <h3 className="font-semibold">Reforestación</h3>
                    </div>
                    <div className="rounded-xl bg-purple-100 dark:bg-purple-900/20 p-8 text-center transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto h-10 w-10 text-purple-600 mb-2"
                      >
                        <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
                        <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
                        <path d="M8 10a2 2 0 1 1 4 0c0 .5-.5 2-2 2" />
                        <path d="M10 14h.01" />
                      </svg>
                      <h3 className="font-semibold">Educación</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </BackgroundLines>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">¿Cómo funciona?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Registra tus actividades ecológicas, gana puntos y contribuye a un futuro más sostenible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Registra actividades</h3>
                <p className="text-center text-muted-foreground">
                  Documenta tus acciones ecológicas como reciclaje, ahorro de agua o plantación de árboles.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Gana puntos</h3>
                <p className="text-center text-muted-foreground">
                  Acumula puntos por cada actividad que registres y sube de nivel.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-600"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Obtén recompensas</h3>
                <p className="text-center text-muted-foreground">
                  Canjea tus puntos por beneficios locales, descuentos y reconocimientos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
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

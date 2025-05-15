import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (city) where.city = city;
    if (state) where.state = state;

    // Filtrar por material si se proporciona
    let centers;
    if (materialId) {
      centers = await prisma.recyclingCenter.findMany({
        where,
        include: {
          materials: {
            include: {
              material: true,
            },
            where: {
              materialId,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      });
      // Filtrar centros que tienen el material especificado
      centers = centers.filter(
        (center: { materials: string | any[] }) => center.materials.length > 0
      );
    } else {
      centers = await prisma.recyclingCenter.findMany({
        where,
        include: {
          materials: {
            include: {
              material: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      });
    }

    // Contar total para paginación (ajustado para filtro de material)
    let total;
    if (materialId) {
      total = await prisma.centerMaterial.count({
        where: {
          materialId,
          center: where,
        },
        distinct: ["centerId"],
      });
    } else {
      total = await prisma.recyclingCenter.count({ where });
    }

    return NextResponse.json({
      centers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener centros de acopio:", error);
    return NextResponse.json(
      { error: "Error al obtener centros de acopio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      website,
      latitude,
      longitude,
      openingHours,
      materials,
    } = body;

    // Validar datos
    if (!name || !address || !city || !state) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Crear centro de acopio
    const center = await prisma.recyclingCenter.create({
      data: {
        name,
        description,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        website,
        latitude,
        longitude,
        openingHours,
        materials: materials
          ? {
              create: materials.map((materialId: string) => ({
                material: {
                  connect: {
                    id: materialId,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        materials: {
          include: {
            material: true,
          },
        },
      },
    });

    return NextResponse.json(center);
  } catch (error) {
    console.error("Error al crear centro de acopio:", error);
    return NextResponse.json(
      { error: "Error al crear centro de acopio" },
      { status: 500 }
    );
  }
}

// Función getSession importada pero no definida aquí
async function getSession() {
  // Esta función debería estar definida en @/lib/auth
  // Para este ejemplo, simulamos un administrador
  return {
    id: "1",
    role: "ADMIN",
  };
}

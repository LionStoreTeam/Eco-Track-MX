// import { type NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getSession } from "@/lib/auth";
// import { z } from "zod";

// // Definimos los puntos fijos para cada tipo de actividad
// const ACTIVITY_POINTS = {
//   RECYCLING: 5, // 5 puntos por kg
//   TREE_PLANTING: 5, // 5 puntos por árbol
//   WATER_SAVING: 2, // 2 puntos por litro
//   ENERGY_SAVING: 2, // 2 puntos por kWh
//   COMPOSTING: 5, // 5 puntos por kg
//   EDUCATION: 5, // 5 puntos por hora
//   OTHER: 2, // 2 puntos por unidad
// };

// // Esquema de validación para la API
// const activitySchema = z.object({
//   title: z
//     .string()
//     .min(10, { message: "El título debe tener al menos 10 caracteres" })
//     .max(30, { message: "El título no puede tener más de 30 caracteres" }),
//   description: z
//     .string()
//     .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
//     .max(100, {
//       message: "La descripción no puede tener más de 100 caracteres",
//     }),
//   type: z.enum(
//     [
//       "RECYCLING",
//       "TREE_PLANTING",
//       "WATER_SAVING",
//       "ENERGY_SAVING",
//       "COMPOSTING",
//       "EDUCATION",
//       "OTHER",
//     ],
//     {
//       message: "Tipo de actividad inválido",
//     }
//   ),
//   quantity: z
//     .number()
//     .positive({ message: "La cantidad debe ser mayor a 0" })
//     .min(1, { message: "La cantidad mínima es 1" })
//     .max(20, { message: "La cantidad máxima permitida es 20" }),
//   unit: z.string().min(1, { message: "La unidad es requerida" }),
//   date: z.string().refine((date) => !isNaN(Date.parse(date)), {
//     message: "Fecha inválida",
//   }),
//   groupId: z.string().optional(),
//   evidence: z
//     .array(
//       z.object({
//         fileUrl: z.string(),
//         fileType: z.string(),
//         description: z.string().optional(),
//       })
//     )
//     .optional(),
// });

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId") || session.id;
//     const groupId = searchParams.get("groupId");
//     const type = searchParams.get("type");
//     const page = Number.parseInt(searchParams.get("page") || "1");
//     const limit = Number.parseInt(searchParams.get("limit") || "10");
//     const skip = (page - 1) * limit;

//     // Construir filtros
//     const where: any = {};

//     // Si no es admin, solo mostrar actividades del usuario actual
//     if (session.role !== "ADMIN") {
//       where.userId = session.id as string;
//     } else if (userId) {
//       where.userId = userId as string;
//     }

//     if (groupId) where.groupId = groupId;
//     if (type) where.type = type;

//     // Obtener actividades
//     const activities = await prisma.activity.findMany({
//       where,
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         group: true,
//         evidence: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       skip,
//       take: limit,
//     });

//     // Contar total para paginación
//     const total = await prisma.activity.count({ where });

//     return NextResponse.json({
//       activities,
//       pagination: {
//         total,
//         page,
//         limit,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error al obtener actividades:", error);
//     return NextResponse.json(
//       { error: "Error al obtener actividades" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     const body = await request.json();

//     // Validar datos con Zod
//     try {
//       activitySchema.parse(body);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return NextResponse.json(
//           {
//             error: "Datos inválidos",
//             details: error.errors,
//           },
//           { status: 400 }
//         );
//       }
//       throw error;
//     }

//     const {
//       title,
//       description,
//       type,
//       quantity,
//       unit,
//       date,
//       groupId,
//       evidence,
//     } = body;

//     // Calcular puntos según el tipo de actividad y cantidad
//     const pointsPerUnit =
//       ACTIVITY_POINTS[type as keyof typeof ACTIVITY_POINTS] ||
//       ACTIVITY_POINTS.OTHER;
//     const points = Math.floor(quantity * pointsPerUnit);

//     // Crear actividad
//     const activity = await prisma.activity.create({
//       data: {
//         title,
//         description,
//         type,
//         quantity,
//         unit,
//         points,
//         date: new Date(date),
//         userId: session.id as string,
//         groupId,
//         evidence: evidence
//           ? {
//               create: evidence.map((e: any) => ({
//                 fileUrl: e.fileUrl,
//                 fileType: e.fileType,
//                 description: e.description,
//               })),
//             }
//           : undefined,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         group: true,
//         evidence: true,
//       },
//     });

//     // Actualizar puntos del usuario
//     await prisma.user.update({
//       where: { id: session.id as string },
//       data: {
//         points: {
//           increment: points,
//         },
//       },
//     });

//     // Actualizar nivel del usuario si es necesario
//     const user = await prisma.user.findUnique({
//       where: { id: session.id as string },
//       select: { points: true, level: true },
//     });

//     if (user) {
//       const newLevel = Math.floor(user.points / 500) + 1;
//       if (newLevel > user.level) {
//         await prisma.user.update({
//           where: { id: session.id as string },
//           data: { level: newLevel },
//         });
//       }
//     }

//     return NextResponse.json(activity);
//   } catch (error) {
//     console.error("Error al crear actividad:", error);
//     return NextResponse.json(
//       { error: "Error al crear actividad" },
//       { status: 500 }
//     );
//   }
// }
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import {
  uploadFileToS3,
  validateFile,
  MIN_FILES,
  MAX_FILES,
} from "@/lib/s3-service";

// Definimos los puntos fijos para cada tipo de actividad
const ACTIVITY_POINTS = {
  RECYCLING: 5, // 5 puntos por kg
  TREE_PLANTING: 5, // 5 puntos por árbol
  WATER_SAVING: 2, // 2 puntos por litro
  ENERGY_SAVING: 2, // 2 puntos por kWh
  COMPOSTING: 5, // 5 puntos por kg
  EDUCATION: 5, // 5 puntos por hora
  OTHER: 2, // 2 puntos por unidad
};

// Esquema de validación para la API
const activitySchema = z.object({
  title: z
    .string()
    .min(10, { message: "El título debe tener al menos 10 caracteres" })
    .max(30, { message: "El título no puede tener más de 30 caracteres" }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(100, {
      message: "La descripción no puede tener más de 100 caracteres",
    }),
  type: z.enum(
    [
      "RECYCLING",
      "TREE_PLANTING",
      "WATER_SAVING",
      "ENERGY_SAVING",
      "COMPOSTING",
      "EDUCATION",
      "OTHER",
    ],
    {
      message: "Tipo de actividad inválido",
    }
  ),
  quantity: z
    .number()
    .positive({ message: "La cantidad debe ser mayor a 0" })
    .min(1, { message: "La cantidad mínima es 1" })
    .max(20, { message: "La cantidad máxima permitida es 20" }),
  unit: z.string().min(1, { message: "La unidad es requerida" }),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha inválida",
  }),
  groupId: z.string().optional(),
  evidence: z
    .array(
      z.object({
        fileUrl: z.string(),
        fileType: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.id;
    const groupId = searchParams.get("groupId");
    const type = searchParams.get("type");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    // Si no es admin, solo mostrar actividades del usuario actual
    if (session.role !== "ADMIN") {
      where.userId = session.id as string;
    } else if (userId) {
      where.userId = userId as string;
    }

    if (groupId) where.groupId = groupId;
    if (type) where.type = type;

    // Obtener actividades
    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        group: true,
        evidence: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Contar total para paginación
    const total = await prisma.activity.count({ where });

    return NextResponse.json({
      activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    return NextResponse.json(
      { error: "Error al obtener actividades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar si la solicitud es multipart/form-data
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Procesar formulario con archivos
      const formData = await request.formData();

      // Extraer datos del formulario
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const type = formData.get("type") as string;
      const quantity = Number.parseFloat(formData.get("quantity") as string);
      const unit = formData.get("unit") as string;
      const date = formData.get("date") as string;
      const groupId = (formData.get("groupId") as string) || undefined;

      // Validar datos básicos con Zod
      try {
        activitySchema.parse({
          title,
          description,
          type,
          quantity,
          unit,
          date,
          groupId,
          evidence: [], // Placeholder para pasar la validación
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: "Datos inválidos",
              details: error.errors,
            },
            { status: 400 }
          );
        }
        throw error;
      }

      // Procesar archivos de evidencia
      const files = formData.getAll("evidence") as File[];

      // Validar cantidad de archivos
      if (files.length < MIN_FILES) {
        return NextResponse.json(
          { error: `Debes subir al menos ${MIN_FILES} archivo como evidencia` },
          { status: 400 }
        );
      }

      if (files.length > MAX_FILES) {
        return NextResponse.json(
          { error: `No puedes subir más de ${MAX_FILES} archivos` },
          { status: 400 }
        );
      }

      // Validar cada archivo
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }
      }

      // Subir archivos a S3
      const evidencePromises = files.map(async (file) => {
        return await uploadFileToS3(file);
      });

      const evidenceResults = await Promise.all(evidencePromises);

      // Calcular puntos según el tipo de actividad y cantidad
      const pointsPerUnit =
        ACTIVITY_POINTS[type as keyof typeof ACTIVITY_POINTS] ||
        ACTIVITY_POINTS.OTHER;
      const points = Math.floor(quantity * pointsPerUnit);

      // Crear actividad con evidencias
      const activity = await prisma.activity.create({
        data: {
          title,
          description,
          type: type as any,
          quantity,
          unit,
          points,
          date: new Date(date),
          userId: session.id as string,
          groupId,
          evidence: {
            create: evidenceResults.map((e) => ({
              fileUrl: e.fileUrl,
              fileType: e.fileType,
              fileName: e.fileName,
              fileSize: e.fileSize,
              format: e.format,
            })),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          group: true,
          evidence: true,
        },
      });

      // Actualizar puntos del usuario
      await prisma.user.update({
        where: { id: session.id as string },
        data: {
          points: {
            increment: points,
          },
        },
      });

      // Actualizar nivel del usuario si es necesario
      const user = await prisma.user.findUnique({
        where: { id: session.id as string },
        select: { points: true, level: true },
      });

      if (user) {
        const newLevel = Math.floor(user.points / 500) + 1;
        if (newLevel > user.level) {
          await prisma.user.update({
            where: { id: session.id as string },
            data: { level: newLevel },
          });
        }
      }

      return NextResponse.json(activity);
    } else {
      // Procesar solicitud JSON normal (mantener compatibilidad con el código existente)
      const body = await request.json();

      // Validar datos con Zod
      try {
        activitySchema.parse(body);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: "Datos inválidos",
              details: error.errors,
            },
            { status: 400 }
          );
        }
        throw error;
      }

      const {
        title,
        description,
        type,
        quantity,
        unit,
        date,
        groupId,
        evidence,
      } = body;

      // Calcular puntos según el tipo de actividad y cantidad
      const pointsPerUnit =
        ACTIVITY_POINTS[type as keyof typeof ACTIVITY_POINTS] ||
        ACTIVITY_POINTS.OTHER;
      const points = Math.floor(quantity * pointsPerUnit);

      // Crear actividad
      const activity = await prisma.activity.create({
        data: {
          title,
          description,
          type,
          quantity,
          unit,
          points,
          date: new Date(date),
          userId: session.id as string,
          groupId,
          evidence: evidence
            ? {
                create: evidence.map((e: any) => ({
                  fileUrl: e.fileUrl,
                  fileType: e.fileType,
                  description: e.description,
                  fileName: e.fileName || "unknown",
                  fileSize: e.fileSize || 0,
                  format: e.format || "unknown",
                })),
              }
            : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          group: true,
          evidence: true,
        },
      });

      // Actualizar puntos del usuario
      await prisma.user.update({
        where: { id: session.id as string },
        data: {
          points: {
            increment: points,
          },
        },
      });

      // Actualizar nivel del usuario si es necesario
      const user = await prisma.user.findUnique({
        where: { id: session.id as string },
        select: { points: true, level: true },
      });

      if (user) {
        const newLevel = Math.floor(user.points / 500) + 1;
        if (newLevel > user.level) {
          await prisma.user.update({
            where: { id: session.id as string },
            data: { level: newLevel },
          });
        }
      }

      return NextResponse.json(activity);
    }
  } catch (error) {
    console.error("Error al crear actividad:", error);
    return NextResponse.json(
      { error: "Error al crear actividad" },
      { status: 500 }
    );
  }
}

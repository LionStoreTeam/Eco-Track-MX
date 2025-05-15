// import { type NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId") || session.id;
//     const groupId = searchParams.get("groupId");
//     const period = searchParams.get("period") || "month"; // day, week, month, year, all

//     // Determinar fecha de inicio según el período
//     let startDate: Date | null = null;
//     const now = new Date();

//     if (period !== "all") {
//       startDate = new Date();

//       switch (period) {
//         case "day":
//           startDate.setHours(0, 0, 0, 0);
//           break;
//         case "week":
//           startDate.setDate(now.getDate() - now.getDay());
//           startDate.setHours(0, 0, 0, 0);
//           break;
//         case "month":
//           startDate.setDate(1);
//           startDate.setHours(0, 0, 0, 0);
//           break;
//         case "year":
//           startDate.setMonth(0, 1);
//           startDate.setHours(0, 0, 0, 0);
//           break;
//       }
//     }

//     // Construir filtros
//     const where: any = {};
//     if (startDate) {
//       where.date = {
//         gte: startDate,
//       };
//     }

//     if (userId) {
//       where.userId = userId;
//     }

//     if (groupId) {
//       where.groupId = groupId;
//     }

//     // Obtener estadísticas por tipo de actividad
//     const activityStats = await prisma.activity.groupBy({
//       by: ["type"],
//       where,
//       _sum: {
//         quantity: true,
//         points: true,
//       },
//       _count: {
//         id: true,
//       },
//     });

//     // Obtener total de puntos del usuario o grupo
//     let totalPoints = 0;
//     if (userId && !groupId) {
//       const user = await prisma.user.findUnique({
//         where: { id: userId as string },
//         select: { points: true },
//       });
//       totalPoints = user?.points || 0;
//     } else if (groupId) {
//       // Sumar puntos de todos los miembros del grupo
//       const groupMembers = await prisma.groupMember.findMany({
//         where: { groupId: groupId as string },
//         include: {
//           user: {
//             select: { points: true },
//           },
//         },
//       });
//       totalPoints = groupMembers.reduce(
//         (sum: any, member: { user: { points: any } }) =>
//           sum + (member.user?.points || 0),
//         0
//       );
//     }

//     // Obtener actividades recientes
//     const recentActivities = await prisma.activity.findMany({
//       where,
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "desc",
//       },
//       take: 5,
//     });

//     // Obtener estadísticas por período de tiempo (para gráficos)
//     const timeSeriesWhere = { ...where };
//     const timeSeries = await prisma.$queryRaw`
//       SELECT
//         date_trunc('day', "date") as day,
//         SUM(points) as total_points,
//         COUNT(*) as activity_count
//       FROM "Activity"
//       WHERE ${timeSeriesWhere}
//       GROUP BY day
//       ORDER BY day ASC
//       LIMIT 30
//     `;

//     return NextResponse.json({
//       activityStats,
//       totalPoints,
//       recentActivities,
//       timeSeries,
//     });
//   } catch (error) {
//     console.error("Error al obtener estadísticas:", error);
//     return NextResponse.json(
//       { error: "Error al obtener estadísticas" },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.id;
    const groupId = searchParams.get("groupId");
    const period = searchParams.get("period") || "month"; // day, week, month, year, all

    // Determinar fecha de inicio según el período
    let startDate: Date | null = null;
    const now = new Date();

    if (period !== "all") {
      startDate = new Date();

      switch (period) {
        case "day":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case "month":
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "year":
          startDate.setMonth(0, 1);
          startDate.setHours(0, 0, 0, 0);
          break;
      }
    }

    // Construir filtros
    const where: any = {};
    if (startDate) {
      where.date = {
        gte: startDate,
      };
    }

    if (userId) {
      where.userId = userId as string;
    }

    if (groupId) {
      where.groupId = groupId;
    }

    // Obtener estadísticas por tipo de actividad
    const activityStats = await prisma.activity.groupBy({
      by: ["type"],
      where,
      _sum: {
        quantity: true,
        points: true,
      },
      _count: {
        id: true,
      },
    });

    // Obtener total de puntos del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: { points: true },
    });
    const totalPoints = user?.points || 0;

    // Obtener conteo total de actividades
    const activityCount = await prisma.activity.count({
      where: { userId: userId as string },
    });

    // Obtener actividades recientes
    const recentActivities = await prisma.activity.findMany({
      where: { userId: userId as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    // Calcular métricas de impacto
    const recyclingActivities = await prisma.activity.findMany({
      where: {
        userId: userId as string,
        type: "RECYCLING",
      },
      select: {
        quantity: true,
      },
    });
    const recycledMaterials = recyclingActivities.reduce(
      (sum, activity) => sum + activity.quantity,
      0
    );

    const treePlantingActivities = await prisma.activity.findMany({
      where: {
        userId: userId as string,
        type: "TREE_PLANTING",
      },
      select: {
        quantity: true,
      },
    });
    const treesPlanted = treePlantingActivities.reduce(
      (sum, activity) => sum + activity.quantity,
      0
    );

    const waterSavingActivities = await prisma.activity.findMany({
      where: {
        userId: userId as string,
        type: "WATER_SAVING",
      },
      select: {
        quantity: true,
      },
    });
    const waterSaved = waterSavingActivities.reduce(
      (sum, activity) => sum + activity.quantity,
      0
    );

    const energySavingActivities = await prisma.activity.findMany({
      where: {
        userId: userId as string,
        type: "ENERGY_SAVING",
      },
      select: {
        quantity: true,
      },
    });
    const energySaved = energySavingActivities.reduce(
      (sum, activity) => sum + activity.quantity,
      0
    );

    // Obtener estadísticas por período de tiempo (para gráficos)
    // Agrupar por día para los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeSeriesData = await prisma.activity.groupBy({
      by: ["date"],
      where: {
        userId: userId as string,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        points: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const timeSeries = timeSeriesData.map((data) => ({
      date: data.date.toISOString(),
      points: data._sum.points || 0,
      count: data._count.id,
    }));

    return NextResponse.json({
      totalPoints,
      activityCount,
      activityStats,
      recentActivities,
      timeSeries,
      impactMetrics: {
        recycledMaterials,
        treesPlanted,
        waterSaved,
        energySaved,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}

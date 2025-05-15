// import { type NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     // Obtener usuario con su perfil
//     const user = await prisma.user.findUnique({
//       where: { id: session.id as string },
//       include: {
//         profile: {
//           include: {
//             badges: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Usuario no encontrado" },
//         { status: 404 }
//       );
//     }

//     // Construir respuesta
//     const response = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       userType: user.userType,
//       points: user.points,
//       createdAt: user.createdAt.toISOString(),
//       profile: user.profile
//         ? {
//             id: user.profile.id,
//             bio: user.profile.bio,
//             address: user.profile.address,
//             city: user.profile.city,
//             state: user.profile.state,
//             zipCode: user.profile.zipCode,
//             phone: user.profile.phone,
//             avatarUrl: user.profile.avatarUrl,
//             badges: user.profile.badges || [],
//           }
//         : null,
//     };

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error al obtener perfil:", error);
//     return NextResponse.json(
//       { error: "Error al obtener perfil" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//     }

//     const body = await request.json();
//     const { name, bio, address, city, state, zipCode, phone } = body;

//     // Validar datos
//     if (!name) {
//       return NextResponse.json(
//         { error: "El nombre es requerido" },
//         { status: 400 }
//       );
//     }

//     // Actualizar usuario
//     const updatedUser = await prisma.user.update({
//       where: { id: session.id as string },
//       data: {
//         name,
//         profile: {
//           upsert: {
//             create: {
//               bio,
//               address,
//               city,
//               state,
//               zipCode,
//               phone,
//             },
//             update: {
//               bio,
//               address,
//               city,
//               state,
//               zipCode,
//               phone,
//             },
//           },
//         },
//       },
//       include: {
//         profile: {
//           include: {
//             badges: true,
//           },
//         },
//       },
//     });

//     // Construir respuesta
//     const response = {
//       id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       userType: updatedUser.userType,
//       points: updatedUser.points,
//       createdAt: updatedUser.createdAt.toISOString(),
//       profile: updatedUser.profile
//         ? {
//             id: updatedUser.profile.id,
//             bio: updatedUser.profile.bio,
//             address: updatedUser.profile.address,
//             city: updatedUser.profile.city,
//             state: updatedUser.profile.state,
//             zipCode: updatedUser.profile.zipCode,
//             phone: updatedUser.profile.phone,
//             avatarUrl: updatedUser.profile.avatarUrl,
//             badges: updatedUser.profile.badges || [],
//           }
//         : null,
//     };

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error al actualizar perfil:", error);
//     return NextResponse.json(
//       { error: "Error al actualizar perfil" },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  uploadAvatarToS3,
  deleteFileFromS3,
  getSignedFileUrl,
  validateAvatarFile,
} from "@/lib/s3-service"; // Importar nuevas funciones

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      include: {
        profile: {
          include: {
            badges: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    let signedAvatarUrl: string | null = null;
    if (user.profile?.avatarUrl) {
      // avatarUrl ahora es la fileKey
      try {
        signedAvatarUrl = await getSignedFileUrl(user.profile.avatarUrl);
      } catch (e) {
        console.error("Error al generar signed URL para avatar en GET:", e);
        // No bloquear la respuesta si falla la generación de URL, pero sí loguear
      }
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
      points: user.points,
      level: user.level, // Asegurar que el nivel se incluye
      createdAt: user.createdAt.toISOString(),
      profile: user.profile
        ? {
            id: user.profile.id,
            bio: user.profile.bio,
            address: user.profile.address,
            city: user.profile.city,
            state: user.profile.state,
            zipCode: user.profile.zipCode,
            phone: user.profile.phone,
            avatarUrl: user.profile.avatarUrl, // Esta es la fileKey
            signedAvatarUrl: signedAvatarUrl, // URL firmada para visualización
            badges: user.profile.badges || [],
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string | null;
    const address = formData.get("address") as string | null;
    const city = formData.get("city") as string | null;
    const state = formData.get("state") as string | null;
    const zipCode = formData.get("zipCode") as string | null;
    const phone = formData.get("phone") as string | null;
    const avatarFile = formData.get("avatarFile") as File | null;
    const deleteAvatar = formData.get("deleteAvatar") === "true"; // Para manejar la eliminación

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.id as string },
      include: { profile: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    let newAvatarFileKey: string | null | undefined =
      currentUser.profile?.avatarUrl; // Mantener la actual por defecto

    if (deleteAvatar) {
      if (currentUser.profile?.avatarUrl) {
        await deleteFileFromS3(currentUser.profile.avatarUrl);
        newAvatarFileKey = null;
      }
    } else if (avatarFile) {
      const validation = validateAvatarFile(avatarFile);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || "Archivo de avatar inválido" },
          { status: 400 }
        );
      }

      // Si hay un avatar antiguo, eliminarlo primero
      if (currentUser.profile?.avatarUrl) {
        await deleteFileFromS3(currentUser.profile.avatarUrl);
      }
      // Subir el nuevo avatar
      const s3Response = await uploadAvatarToS3(
        avatarFile,
        "userimageprofile/"
      );
      newAvatarFileKey = s3Response.fileKey;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id as string },
      data: {
        name,
        profile: {
          upsert: {
            create: {
              bio,
              address,
              city,
              state,
              zipCode,
              phone,
              avatarUrl: newAvatarFileKey,
            },
            update: {
              bio,
              address,
              city,
              state,
              zipCode,
              phone,
              avatarUrl: newAvatarFileKey,
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            badges: true,
          },
        },
      },
    });

    let signedAvatarUrl: string | null = null;
    if (updatedUser.profile?.avatarUrl) {
      try {
        signedAvatarUrl = await getSignedFileUrl(updatedUser.profile.avatarUrl);
      } catch (e) {
        console.error("Error al generar signed URL para avatar en PUT:", e);
      }
    }

    const response = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      userType: updatedUser.userType,
      points: updatedUser.points,
      level: updatedUser.level,
      createdAt: updatedUser.createdAt.toISOString(),
      profile: updatedUser.profile
        ? {
            id: updatedUser.profile.id,
            bio: updatedUser.profile.bio,
            address: updatedUser.profile.address,
            city: updatedUser.profile.city,
            state: updatedUser.profile.state,
            zipCode: updatedUser.profile.zipCode,
            phone: updatedUser.profile.phone,
            avatarUrl: updatedUser.profile.avatarUrl, // fileKey
            signedAvatarUrl: signedAvatarUrl, // Nueva URL firmada
            badges: updatedUser.profile.badges || [],
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al actualizar perfil";
    return NextResponse.json(
      { error: "Error al actualizar perfil: " + errorMessage },
      { status: 500 }
    );
  }
}

// import {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { v4 as uuidv4 } from "uuid";

// // Configuración del cliente S3
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
//   },
// });

// const bucketName = process.env.AWS_BUCKET_NAME || "";

// // Tipos de archivos permitidos
// export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// export const ALLOWED_VIDEO_TYPES = ["video/mp4", "image/gif"]; // GIF se considera como video para este caso
// export const ALLOWED_FILE_TYPES = [
//   ...ALLOWED_IMAGE_TYPES,
//   ...ALLOWED_VIDEO_TYPES,
// ];
// export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// export const MAX_FILES = 3;
// export const MIN_FILES = 1;

// // Función para generar un nombre de archivo único
// export const generateUniqueFileName = (originalName: string): string => {
//   const extension = originalName.split(".").pop();
//   return `${uuidv4()}.${extension}`;
// };

// // Función para subir un archivo a S3
// export const uploadFileToS3 = async (
//   file: File
// ): Promise<{
//   fileName: string;
//   fileUrl: string;
//   fileType: string;
//   fileSize: number;
//   format: string;
// }> => {
//   const fileName = generateUniqueFileName(file.name);
//   const fileBuffer = await file.arrayBuffer();
//   const format = file.name.split(".").pop()?.toLowerCase() || "";

//   const params = {
//     Bucket: bucketName,
//     Key: fileName,
//     Body: Buffer.from(fileBuffer),
//     ContentType: file.type,
//   };

//   try {
//     await s3Client.send(new PutObjectCommand(params));

//     // Generar URL firmada para acceso inmediato
//     const fileUrl = await getSignedFileUrl(fileName);

//     // Determinar el tipo de archivo (imagen o video)
//     const fileType = ALLOWED_IMAGE_TYPES.includes(file.type)
//       ? "image"
//       : "video";

//     console.log("Nombre de archivo", fileName);
//     console.log("URL de archivo", fileUrl);

//     return {
//       fileName,
//       fileUrl,
//       fileType,
//       fileSize: file.size,
//       format,
//     };
//   } catch (error) {
//     console.error("Error al subir archivo a S3:", error);
//     throw new Error("Error al subir el archivo");
//   }
// };

// // Función para obtener la URL firmada de un archivo en S3
// export const getSignedFileUrl = async (fileName: string): Promise<string> => {
//   const params = {
//     Bucket: bucketName,
//     Key: fileName,
//   };

//   try {
//     const command = new GetObjectCommand(params);
//     const signedUrl = await getSignedUrl(s3Client, command, {
//       expiresIn: undefined,
//     }); // URL válida por 1 hora
//     console.log(signedUrl);

//     return signedUrl;
//   } catch (error) {
//     console.error("Error al obtener URL firmada:", error);
//     throw new Error("Error al obtener la URL del archivo");
//   }
// };

// // Función para eliminar un archivo de S3
// export const deleteFileFromS3 = async (fileName: string): Promise<void> => {
//   const params = {
//     Bucket: bucketName,
//     Key: fileName,
//   };

//   try {
//     await s3Client.send(new DeleteObjectCommand(params));
//   } catch (error) {
//     console.error("Error al eliminar archivo de S3:", error);
//     throw new Error("Error al eliminar el archivo");
//   }
// };

// // Función para validar un archivo
// export const validateFile = (
//   file: File
// ): { valid: boolean; error?: string } => {
//   // Validar tipo de archivo
//   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//     return {
//       valid: false,
//       error:
//         "Tipo de archivo no permitido. Solo se permiten JPG, PNG, JPEG, WEBP, MP4 y GIF.",
//     };
//   }

//   // Validar tamaño de archivo
//   if (file.size > MAX_FILE_SIZE) {
//     return {
//       valid: false,
//       error: "El archivo excede el tamaño máximo permitido de 5MB.",
//     };
//   }

//   return { valid: true };
// };
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.AWS_BUCKET_NAME || "";

// Tipos de archivos permitidos (solo imágenes para avatar)
export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
// Mantén estos para otras subidas si es necesario, o crea variantes
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "image/gif"];
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
];

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB para avatares
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB general

// Función para generar un nombre de archivo único
export const generateUniqueFileName = (originalName: string): string => {
  const extension = originalName.split(".").pop()?.toLowerCase();
  return `${uuidv4()}.${extension}`;
};

// Función para subir un archivo a S3 (modificada para avatares)
export const uploadAvatarToS3 = async (
  file: File,
  folderPrefix: string = "userimageprofile/" // Carpeta específica para avatares
): Promise<{
  fileKey: string; // Clave del objeto en S3
  fileName: string; // Nombre original
  fileType: string; // Mime type
  fileSize: number;
  format: string;
}> => {
  const uniqueFileName = generateUniqueFileName(file.name);
  const fileKey = `${folderPrefix}${uniqueFileName}`; // Key completa incluyendo la carpeta
  const fileBuffer = await file.arrayBuffer();
  const format = file.name.split(".").pop()?.toLowerCase() || "";

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));

    console.log("Archivo subido a S3. Key:", fileKey);

    return {
      fileKey,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      format,
    };
  } catch (error) {
    console.error("Error al subir archivo a S3:", error);
    throw new Error("Error al subir el archivo de avatar");
  }
};

// Función para obtener la URL firmada de un archivo en S3
// Se usará para generar URLs temporales para visualización
export const getSignedFileUrl = async (
  fileKey: string
  // expiresIn: undefined // 1 hora por defecto, ajustable
): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const command = new GetObjectCommand(params);
    // const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    const signedUrl = await getSignedUrl(s3Client, command);
    console.log("URL firmada generada:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error al obtener URL firmada:", error);
    throw new Error("Error al obtener la URL del archivo");
  }
};

// Función para eliminar un archivo de S3
export const deleteFileFromS3 = async (fileKey: string): Promise<void> => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log("Archivo eliminado de S3. Key:", fileKey);
  } catch (error) {
    console.error("Error al eliminar archivo de S3:", error);
    // No relanzar el error necesariamente, podría ser que el archivo ya no exista
    // o manejarlo según la política de la aplicación.
    // throw new Error("Error al eliminar el archivo de S3");
  }
};

// Función para validar un archivo (específica para avatares)
export const validateAvatarFile = (
  file: File
): { valid: boolean; error?: string } => {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        "Tipo de archivo no permitido. Solo se permiten JPG, PNG, JPEG, WEBP.",
    };
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return {
      valid: false,
      error: "El archivo excede el tamaño máximo permitido de 5MB.",
    };
  }

  return { valid: true };
};

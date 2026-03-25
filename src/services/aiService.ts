/**
 * Función para enviar las imágenes y parámetros al servidor local.
 * Ahora utiliza variables de entorno para la conectividad dinámica.
 */

// Extraemos la URL de la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

export const predictTryOn = async (
  personFile: File, 
  garmentBlob: Blob,
  garmentDescription: string,
  category: string,
  userId: string 
): Promise<string> => {
  try {
    // 1. Convertimos las imágenes a Data URIs
    const [personUri, garmentUri] = await Promise.all([
      fileToDataUri(personFile),
      blobToDataUri(garmentBlob)
    ]);

    // 2. Llamada al servidor utilizando la variable de entorno centralizada
    const response = await fetch(`${API_URL}/api/try-on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personUri,
        garmentUri,
        garmentDescription,
        category,
        userId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en el servidor");
    }

    const data = await response.json();

    // 3. Retornamos la URL de la imagen generada (manejo de array o string)
    return Array.isArray(data.image) ? data.image[0] : data.image;

  } catch (error: any) {
    console.error("Error al conectar con el servidor Musa:", error);
    throw new Error(
      error.message || "No se pudo obtener la imagen. Revisa la conexión con el servidor en .env"
    );
  }
};

// --- Funciones auxiliares (Mantenidas íntegras) ---

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const blobToDataUri = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
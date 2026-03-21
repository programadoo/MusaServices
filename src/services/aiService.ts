/**
 * Función para enviar las imágenes y parámetros al servidor local.
 */
export const predictTryOn = async (
  personFile: File, 
  garmentBlob: Blob,
  garmentDescription: string,
  category: string
): Promise<string> => {
  try {
    // 1. Convertimos las imágenes a Data URIs
    const [personUri, garmentUri] = await Promise.all([
      fileToDataUri(personFile),
      blobToDataUri(garmentBlob)
    ]);

    // 2. Llamamos a tu servidor local usando la IP de tu PC para que el móvil pueda conectar
    const response = await fetch('http://192.168.0.104:3001/api/try-on', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personUri,
        garmentUri,
        garmentDescription,
        category
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en el servidor");
    }

    const data = await response.json();

    // 3. Retornamos la URL de la imagen generada
    return data.image;

  } catch (error: any) {
    console.error("Error al conectar con el servidor Musa:", error);
    // Este mensaje aparecerá en el alert de tu modal cuando falle la conexión
    throw new Error("No se pudo obtener la imagen. Asegúrate de que tu PC y móvil estén en el mismo Wi-Fi y el servidor esté encendido.");
  }
};

// Funciones auxiliares para convertir archivos a formato de texto (DataURI)
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
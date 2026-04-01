const API_URL = import.meta.env.VITE_API_URL;

// Definimos una interfaz para la respuesta para que TypeScript no se queje en el Modal
interface TryOnResponse {
  image: string;
  output: string;
  remainingCredits: number; // Nombre unificado con tu AuthContext
}

/**
 * Servicio de Inteligencia Artificial - Musa AI
 * Conecta el Frontend con el motor de Replicate a través del Backend blindado.
 */
export const predictTryOn = async (
  personFile: File, 
  garmentBlob: Blob,
  garmentDescription: string,
  category: string,
  userId: string 
): Promise<TryOnResponse> => { // Ahora retorna el objeto completo
  try {
    // 1. Validación de Entrada
    if (!garmentDescription.trim() || !category) {
      throw new Error("Por favor, completa la descripción y categoría de la prenda.");
    }

    // 2. Recuperación del Token
    const token = localStorage.getItem('token'); 
    if (!token) {
      throw new Error("SESION_INVALIDA"); 
    }

    // 3. Conversión de imágenes a Data URIs
    const [personUri, garmentUri] = await Promise.all([
      fileToDataUri(personFile),
      blobToDataUri(garmentBlob)
    ]);

    // 4. Llamada al servidor
    const response = await fetch(`${API_URL}/api/try-on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        personUri,
        garmentUri,
        garmentDescription: garmentDescription.trim(),
        category,
        userId
      }),
    });

    // 5. Manejo de Errores
    if (!response.ok) {
      let errorMsg = "Error inesperado en Musa Engine.";
      
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error("Su sesión ha expirado. Por favor, ingrese de nuevo.");
      }

      // Si el backend envía un error de créditos, lo capturamos aquí
      errorMsg = errorData.error || errorMsg;
      throw new Error(errorMsg);
    }

    // 6. Procesamiento de Resultado
    const data = await response.json();
    
    // Retornamos el objeto tal cual lo necesita el ModalTryOn
    return {
      image: data.image,
      output: data.image, // Mantenemos output por compatibilidad con el modal anterior
      remainingCredits: data.creditsLeft || data.remainingCredits 
    };

  } catch (error: any) {
    if (error.message === "SESION_INVALIDA") {
      throw new Error("Debes iniciar sesión para usar Musa AI.");
    }
    
    console.error("❌ Error en el Servicio Musa:", error.message);
    throw error;
  }
};

/**
 * Utilidades de Conversión
 */
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error al procesar la foto."));
    reader.readAsDataURL(file);
  });
};

const blobToDataUri = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Error al procesar la prenda."));
    reader.readAsDataURL(blob);
  });
};
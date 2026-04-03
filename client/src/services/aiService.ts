const API_URL = import.meta.env.VITE_API_URL;

// Interfaces profesionales para TypeScript
export interface StartJobResponse {
  jobId: string;
  remainingCredits: number;
}

export interface JobStatusResponse {
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: number;
  result?: { imageUrl: string }; // La URL de la imagen cuando termine
  error?: string;
}

/**
 * 1. INICIAR EL PROCESO (Start Job)
 * Envía las imágenes a la cola de BullMQ en el servidor.
 */
export const startTryOnJob = async (
  personFile: File, 
  garmentBlob: Blob,
  garmentDescription: string,
  category: string,
  userId: string 
): Promise<StartJobResponse> => {
  try {
    if (!garmentDescription.trim() || !category) {
      throw new Error("Por favor, completa la descripción y categoría de la prenda.");
    }

    const token = localStorage.getItem('token'); 
    if (!token) throw new Error("SESION_INVALIDA"); 

    const [personUri, garmentUri] = await Promise.all([
      fileToDataUri(personFile),
      blobToDataUri(garmentBlob)
    ]);

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        throw new Error("Su sesión ha expirado. Por favor, ingrese de nuevo.");
      }
      throw new Error(errorData.error || "Error inesperado al iniciar Musa Engine.");
    }

    // El backend ahora debe devolver { jobId, remainingCredits }
    const data = await response.json();
    return {
      jobId: data.jobId,
      remainingCredits: data.remainingCredits || data.creditsLeft
    };

  } catch (error: any) {
    if (error.message === "SESION_INVALIDA") {
      throw new Error("Debes iniciar sesión para usar Musa AI.");
    }
    console.error("❌ Error iniciando Musa Engine:", error.message);
    throw error;
  }
};

/**
 * 2. CONSULTAR ESTADO (Check Status)
 * Pregunta al servidor en qué estado se encuentra el Job (waiting, active, completed, failed).
 */
export const checkJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Sesión inválida al consultar estado.");

  const response = await fetch(`${API_URL}/api/try-on/status/${jobId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo verificar el estado del procesamiento.");
  }

  return await response.json();
};

/**
 * Utilidades de Conversión (Intactas)
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
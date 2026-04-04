const API_URL = import.meta.env.VITE_API_URL;

// 1. Mejoramos la interfaz para que TypeScript no dé problemas en el Modal
export interface JobStatusResponse {
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: number;
  result?: string | { imageUrl: string }; // Soportamos ambos formatos por seguridad
  error?: string;
}

export interface StartJobResponse {
  jobId: string;
  remainingCredits: number;
}

/**
 * 1. INICIAR EL PROCESO (Start Job)
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
        throw new Error("Su sesión ha expirado.");
      }
      throw new Error(errorData.error || "Error al iniciar Musa Engine.");
    }

    const data = await response.json();
    return {
      jobId: data.jobId,
      remainingCredits: data.remainingCredits || data.creditsLeft
    };

  } catch (error: any) {
    console.error("❌ Error en startTryOnJob:", error.message);
    throw error;
  }
};

/**
 * 2. CONSULTAR ESTADO (Check Status)
 * Corregido para manejar IDs especiales de BullMQ (4:1)
 */
export const checkJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    const err: any = new Error("Sesión inválida.");
    err.response = { status: 401 };
    throw err;
  }

  // CRÍTICO: Usamos encodeURIComponent para que el ":" del ID no rompa la URL
  const safeJobId = encodeURIComponent(jobId);

  const response = await fetch(`${API_URL}/api/try-on/status/${safeJobId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err: any = new Error(errorData.error || "Error al verificar estado.");
    err.response = { status: response.status }; 
    throw err;
  }

  return await response.json();
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
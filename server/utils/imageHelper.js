import sharp from 'sharp';

export const optimizeImage = async (base64String, label = "Imagen") => {
  if (!base64String || !base64String.includes('base64')) return base64String;
  try {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    if (buffer.length > 10 * 1024 * 1024) {
      throw new Error(`${label} excede el límite de 10MB.`);
    }

    const optimized = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true }) 
      .toBuffer();
      
    return `data:image/jpeg;base64,${optimized.toString('base64')}`;
  } catch (error) {
    throw new Error(`Error en ${label}: ${error.message}`);
  }
};
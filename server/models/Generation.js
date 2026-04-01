import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personImage: String,
  garmentImage: String,
  resultImage: String, 
  category: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Generation', generationSchema);
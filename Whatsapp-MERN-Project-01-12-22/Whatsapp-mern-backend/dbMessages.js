import mongoose from "mongoose";

const whatsappSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  name: { type: String, required: true },
  received: Boolean,
});

export default mongoose.model("messagecontents", whatsappSchema);

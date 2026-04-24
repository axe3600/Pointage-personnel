import mongoose from "mongoose"

const pointageSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  date: String,
  arrival: String,
  departure: String,
  hours: String,
  status: String,
  category: String,
  reason: String
}, { timestamps: true })

export default mongoose.model("Pointage", pointageSchema);
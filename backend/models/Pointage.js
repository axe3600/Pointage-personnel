import mongoose from "mongoose"

const pointageSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,

  // ✅ AJOUT IMPORTANT (scan sécurisé)
  matricule: String,     // identifiant unique employé
  ipAddress: String,     // pour reconnaître le téléphone

  date: String,
  arrival: String,
  departure: String,
  hours: String,
  status: String,
  category: String,
  reason: String
}, { timestamps: true })

export default mongoose.model("Pointage", pointageSchema);
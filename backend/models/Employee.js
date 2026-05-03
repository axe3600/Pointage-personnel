import mongoose from "mongoose"

// 🔥 Générateur matricule
const generateMatricule = () => {
  return "EMP-" + Math.random().toString(36).substring(2, 8).toUpperCase()
}

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  position: String,
  department: String,
  hireDate: String,
  address: String,

  // ✅ MATRICULE AUTO
  matricule: {
    type: String,
    unique: true,
    default: generateMatricule
  }

}, { timestamps: true })

export default mongoose.model("Employee", employeeSchema)
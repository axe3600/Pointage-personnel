import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  position: String,
  department: String,
  hireDate: String,
  address: String,

  // ✅ AJOUT IMPORTANT
  matricule: {
    type: String,
    unique: true
  }

}, { timestamps: true })

export default mongoose.model("Employee", employeeSchema);
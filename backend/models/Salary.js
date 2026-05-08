import mongoose from "mongoose"

const salarySchema = new mongoose.Schema({

  employe: {
    type: String,
    required: true
  },

  mois: {
    type: String,
    required: true
  },

  annee: {
    type: Number,
    required: true
  },

  presences: {
    type: Number,
    default: 0
  },

  absences: {
    type: Number,
    default: 0
  },

  retards: {
    type: Number,
    default: 0
  },

  heures: {
    type: Number,
    default: 0
  },

  tauxHoraire: {
    type: Number,
    default: 0
  },

  salaireBase: {
    type: Number,
    default: 0
  },

  deductions: {
    type: Number,
    default: 0
  },

  salaireNet: {
    type: Number,
    default: 0
  },

  devise: {
    type: String,
    default: "FCFA"
  },

  statut: {
    type: String,
    default: "Payé"
  },

  datePaiement: {
    type: Date,
    default: Date.now
  }

})

const Salary =
  mongoose.model("Salary", salarySchema)

export default Salary
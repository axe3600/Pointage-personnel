import express from "express"
import Employee from "../models/Employee.js"

const router = express.Router()

// 🔥 AJOUTER EMPLOYÉ
router.post("/", async (req, res) => {
  try {
    const employee = new Employee(req.body)
    await employee.save()

    res.json({ message: "Employé enregistré", employee })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ❌ SUPPRIMER UN EMPLOYÉ
router.delete("/:id", async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id)
      res.json({ message: "Employé supprimé" })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// 🔥 LISTER EMPLOYÉS
router.get("/", async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 })
  res.json(employees)
})

export default router;
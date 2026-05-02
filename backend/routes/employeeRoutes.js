import express from "express"
import Employee from "../models/Employee.js"

const router = express.Router()

// 🔥 GET
router.get("/", async (req, res) => {
  try {
    const data = await Employee.find()
    res.json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Erreur récupération" })
  }
})

// 🔥 POST (CORRIGÉ + SÉCURISÉ)
router.post("/", async (req, res) => {
  try {

    console.log("BODY RECU 👉", req.body) // 🔥 DEBUG IMPORTANT

    // ✅ Validation minimale
    if (!req.body.firstName || !req.body.lastName) {
      return res.status(400).json({ message: "Champs obligatoires manquants" })
    }

    const newEmployee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email || "",
      phone: req.body.phone || "",
      position: req.body.position || "",
      department: req.body.department || "",
      hireDate: req.body.hireDate || "",
      address: req.body.address || ""
    })

    await newEmployee.save()

    res.status(201).json(newEmployee)

  } catch (err) {
    console.log("ERREUR BACKEND ❌", err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id)
    res.json({ message: "Supprimé" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Erreur suppression" })
  }
})

export default router
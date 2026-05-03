import express from "express"
import Employee from "../models/Employee.js"

const router = express.Router()

// 🔥 Fonction générer matricule unique
const generateMatricule = () => {
  const random = Math.floor(1000 + Math.random() * 9000)
  return "EMP" + random
}

// 🔥 GET
router.get("/", async (req, res) => {
  try {
    const data = await Employee.find()
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération" })
  }
})

// 🔥 POST
router.post("/", async (req, res) => {
  try {

    if (!req.body.firstName || !req.body.lastName) {
      return res.status(400).json({ message: "Champs obligatoires manquants" })
    }

    let matricule
    let exists = true

    // 🔥 garantir unicité
    while (exists) {
      matricule = generateMatricule()
      const check = await Employee.findOne({ matricule })
      if (!check) exists = false
    }

    const newEmployee = new Employee({
      ...req.body,
      matricule // ✅ AJOUT ICI
    })

    await newEmployee.save()

    res.status(201).json(newEmployee)

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id)
    res.json({ message: "Supprimé" })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression" })
  }
})

export default router;
import express from "express"
import Pointage from "../models/Pointage.js"
import Employee from "../models/Employee.js"

const router = express.Router()

router.post("/scan", async (req, res) => {

  const { matricule } = req.body

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress

  const now = new Date()
  const today = now.toLocaleDateString()

  try {

    // 🔥 chercher pointage en cours
    const existing = await Pointage.findOne({
      ipAddress: ip,
      date: today,
      departure: "-"
    }).sort({ createdAt: -1 })

    // =========================
    // 🔥 DÉPART
    // =========================
    if (existing) {

      existing.departure = now.toLocaleTimeString()

      const diff = (new Date() - existing.createdAt) / (1000 * 60 * 60)
      existing.hours = diff.toFixed(2) + "h"

      await existing.save()

      return res.json({
        type: "departure",
        data: existing
      })
    }

    // =========================
    // 🔥 ARRIVÉE
    // =========================
    if (!matricule) {
      return res.status(400).json({ message: "Matricule requis" })
    }

    // 🔥 récupérer employé
    const employee = await Employee.findOne({ matricule })

    if (!employee) {
      return res.status(404).json({ message: "Employé introuvable" })
    }

    // 🔥 logique retard
    const isLate =
      now.getHours() > 8 ||
      (now.getHours() === 8 && now.getMinutes() > 0)

    const newPointage = new Pointage({
      matricule,
      firstName: employee.firstName,
      lastName: employee.lastName,
      ipAddress: ip,
      date: today,
      arrival: now.toLocaleTimeString(),
      departure: "-",
      hours: "-",
      status: isLate ? "En retard" : "Présent",
      category: "pointage",
      reason: "QR Scan"
    })

    await newPointage.save()

    res.json({
      type: "arrival",
      data: newPointage
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})


// 🔥 NOUVELLE ROUTE POUR FRONT
router.get("/", async (req, res) => {
  try {
    const data = await Pointage.find().sort({ createdAt: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: "Erreur" })
  }
})

export default router;
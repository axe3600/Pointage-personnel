import express from "express"
import Pointage from "../models/Pointage.js"
import Employee from "../models/Employee.js"

const router = express.Router()

// 🔥 GET ALL (inchangé)
router.get("/", async (req, res) => {
  try {
    const data = await Pointage.find().sort({ createdAt: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération" })
  }
})


// 🔥 SCAN INTELLIGENT (ARRIVÉE / DÉPART AUTO)
router.post("/scan", async (req, res) => {
  try {
    const { matricule } = req.body

    if (!matricule) {
      return res.status(400).json({ message: "Matricule requis" })
    }

    // 🔍 Trouver employé
    const employee = await Employee.findOne({ matricule })

    if (!employee) {
      return res.status(404).json({ message: "Employé introuvable ❌" })
    }

    // 🔐 IP utilisateur
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress

    const now = new Date()
    const today = now.toLocaleDateString()

    // 🔍 Chercher pointage existant
    const existing = await Pointage.findOne({
      matricule,
      date: today,
      ipAddress: ip,
      departure: "-"
    }).sort({ createdAt: -1 })

    // =========================
    // ✅ ARRIVÉE
    // =========================
    if (!existing) {
      const newPointage = new Pointage({
        matricule,
        ipAddress: ip,

        // 🔥 LIAISON EMPLOYÉ
        firstName: employee.firstName,
        lastName: employee.lastName,

        date: today,
        arrival: now.toLocaleTimeString(),
        departure: "-",
        hours: "-",
        status: "Présent",
        category: "pointage",
        reason: "QR Scan"
      })

      await newPointage.save()

      return res.json({
        type: "arrival",
        message: `✅ Arrivée enregistrée (${employee.firstName})`,
        data: newPointage
      })
    }

    // =========================
    // 👋 DÉPART
    // =========================
    existing.departure = now.toLocaleTimeString()

    const diff = (new Date() - existing.createdAt) / (1000 * 60 * 60)
    existing.hours = diff.toFixed(2) + "h"

    await existing.save()

    res.json({
      type: "departure",
      message: `👋 Départ enregistré (${employee.firstName})`,
      data: existing
    })

  } catch (err) {
    console.log("ERREUR SCAN ❌", err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})


// 🔥 TEST
router.get("/scan", (req, res) => {
  res.json({ message: "Utilise POST pour scanner" })
})

export default router
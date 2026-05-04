import express from "express"
import Pointage from "../models/Pointage.js"
import Employee from "../models/Employee.js"

const router = express.Router()

router.post("/scan", async (req, res) => {

  try {

    const { matricule } = req.body

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress

    const now = new Date()
    const today = now.toLocaleDateString("en-GB")

    // 🔥 1. CHECK SI DÉJÀ POINTÉ (ARRIVÉ)
    const existing = await Pointage.findOne({
      ipAddress: ip,
      date: today,
      departure: "-"
    }).sort({ createdAt: -1 })

    // =========================
    // ✅ CAS DÉPART
    // =========================
    if (existing) {

      existing.departure = now.toLocaleTimeString()

      const diff = (now - new Date(existing.createdAt)) / (1000 * 60 * 60)
      existing.hours = diff.toFixed(2) + "h"

      await existing.save()

      return res.json({
        type: "departure",
        departureTime: existing.departure
      })
    }

    // =========================
    // ❌ SI PAS DE MATRICULE → ERREUR
    // =========================
    if (!matricule) {
      return res.status(400).json({
        message: "Matricule requis"
      })
    }

    // 🔥 2. TROUVER EMPLOYÉ
    const employee = await Employee.findOne({ matricule })

    if (!employee) {
      return res.status(404).json({
        message: "Employé introuvable"
      })
    }

    // 🔥 3. CALCUL RETARD (8h)
    const hour = now.getHours()
    const minute = now.getMinutes()

    const isLate = hour > 8 || (hour === 8 && minute > 0)

    // 🔥 4. CRÉER POINTAGE
    const newPointage = new Pointage({
      firstName: employee.firstName,
      lastName: employee.lastName,
      matricule,
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

    // 🔥 5. RESPONSE PROPRE (IMPORTANT)
    res.json({
      type: "arrival",
      arrivalTime: newPointage.arrival,
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName
      }
    })

  } catch (err) {
    console.log("❌ ERREUR SCAN :", err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

export default router;
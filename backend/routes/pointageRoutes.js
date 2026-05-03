import express from "express"
import Pointage from "../models/Pointage.js"

const router = express.Router()

// 🔥 SCAN INTELLIGENT
router.post("/scan", async (req, res) => {

  const { matricule } = req.body

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress

  const now = new Date()
  const today = now.toLocaleDateString()

  try {

    // =========================
    // 🔥 1. CHERCHER SI DÉJÀ ARRIVÉ (PAR IP)
    // =========================
    const existing = await Pointage.findOne({
      ipAddress: ip,
      date: today,
      departure: "-"
    }).sort({ createdAt: -1 })

    // =========================
    // 🔥 CAS DÉPART (AUTO)
    // =========================
    if (existing) {

      existing.departure = now.toLocaleTimeString()

      const diff = (new Date() - existing.createdAt) / (1000 * 60 * 60)
      existing.hours = diff.toFixed(2) + "h"

      await existing.save()

      return res.json({
        type: "departure",
        message: "👋 Départ enregistré",
        departureTime: existing.departure
      })
    }

    // =========================
    // 🔥 CAS ARRIVÉE
    // =========================
    if (!matricule) {
      return res.status(400).json({
        message: "Matricule requis pour arrivée"
      })
    }

    const newPointage = new Pointage({
      matricule,
      ipAddress: ip,
      date: today,
      arrival: now.toLocaleTimeString(),
      departure: "-",
      hours: "-",
      status: "Présent",
      category: "pointage",
      reason: "QR Scan"
    })

    await newPointage.save()

    res.json({
      type: "arrival",
      message: "✅ Arrivée enregistrée",
      data: newPointage
    })

  } catch (err) {
    console.log("Erreur scan :", err)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

export default router
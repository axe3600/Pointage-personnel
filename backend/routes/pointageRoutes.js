import express from "express"
import Pointage from "../models/Pointage.js"

const router = express.Router()

// 🔥 GET ALL (inchangé)
router.get("/", async (req, res) => {
  const data = await Pointage.find().sort({ createdAt: -1 })
  res.json(data)
})


// 🔥 SCAN INTELLIGENT (ARRIVÉE / DÉPART AUTO)
router.post("/scan", async (req, res) => {

  // ✅ on reçoit matricule
  const { matricule } = req.body

  // ✅ récupérer IP du téléphone
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress

  const now = new Date()
  const today = now.toLocaleDateString()

  // 🔎 chercher si déjà pointé aujourd'hui avec cette IP
  const existing = await Pointage.findOne({
    matricule,
    date: today,
    ipAddress: ip,
    departure: "-" // encore présent
  }).sort({ createdAt: -1 })


  // =========================
  // 🔥 CAS 1 → ARRIVÉE
  // =========================
  if (!existing) {

    const newPointage = new Pointage({
      matricule,
      ipAddress: ip,
      firstName: "", // optionnel si tu veux relier plus tard
      lastName: "",
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
      message: "✅ Arrivée enregistrée",
      data: newPointage
    })
  }


  // =========================
  // 🔥 CAS 2 → DÉPART AUTO
  // =========================
  existing.departure = now.toLocaleTimeString()

  const diff = (new Date() - existing.createdAt) / (1000 * 60 * 60)
  existing.hours = diff.toFixed(2) + "h"

  await existing.save()

  res.json({
    type: "departure",
    message: "👋 Départ enregistré",
    data: existing
  })
})


// 🔥 TEST
router.get("/scan", (req, res) => {
  res.json({ message: "Utilise POST pour scanner" })
})

export default router;
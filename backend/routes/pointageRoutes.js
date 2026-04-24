import express from "express"
import Pointage from "../models/Pointage.js"

const router = express.Router()

// 🔥 GET ALL
router.get("/", async (req, res) => {
  const data = await Pointage.find().sort({ createdAt: -1 })
  res.json(data)
})

// 🔥 ARRIVÉE
router.post("/arrival", async (req, res) => {

  const { firstName } = req.body

  const now = new Date()

  const newPointage = new Pointage({
    firstName,
    date: now.toLocaleDateString(),
    arrival: now.toLocaleTimeString(),
    departure: "-",
    hours: "-",
    status: "Présent",
    category: "pointage",
    reason: "QR"
  })

  await newPointage.save()

  res.json({ message: "Arrivée enregistrée" })
})

// 🔥 DÉPART
router.post("/departure", async (req, res) => {

  const { firstName } = req.body

  const last = await Pointage.findOne({
    firstName,
    departure: "-"
  }).sort({ createdAt: -1 })

  if (!last) {
    return res.status(400).json({ message: "Pas d'arrivée trouvée" })
  }

  const now = new Date()

  last.departure = now.toLocaleTimeString()

  const diff = (new Date() - last.createdAt) / (1000 * 60 * 60)
  last.hours = diff.toFixed(2) + "h"

  await last.save()

  res.json({ message: "Départ enregistré" })
})

// 🔥 SCAN QR
router.post("/scan", (req, res) => {
    const { name, type } = req.body
  
    const now = new Date()
  
    const formatTime = (date) =>
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  
    const pointage = {
      category: "pointage",
      date: now.toLocaleDateString(),
      firstName: name,
      lastName: "",
      arrival: type === "arrival" ? formatTime(now) : "-",
      departure: type === "departure" ? formatTime(now) : "-",
      hours: "-",
      status: "Présent",
      reason: "QR Scan"
    }
  
    res.json(pointage)
  })

export default router;
import express from "express"
import Pointage from "../models/Pointage.js"
import Employee from "../models/Employee.js"

const router = express.Router()

// =======================================
// ✅ GET TOUS LES POINTAGES
// =======================================
router.get("/", async (req, res) => {

  try {

    const pointages = await Pointage.find()
      .sort({ createdAt: -1 })

    res.json(pointages)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Erreur récupération pointages"
    })
  }
})

// =======================================
// ✅ POINTAGE MANUEL
// =======================================
router.post("/manual", async (req, res) => {

  try {

    const pointage = new Pointage(req.body)

    await pointage.save()

    res.status(201).json(pointage)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Erreur pointage manuel"
    })
  }
})

// =======================================
// ✅ SCAN QR CODE
// =======================================
router.post("/scan", async (req, res) => {

  try {

    const { matricule } = req.body

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress

    const now = new Date()

    // 🔥 IMPORTANT
    const today = new Date().toISOString()

    // =======================================
    // ✅ CHECK SI ARRIVÉE EXISTE
    // =======================================
    const existing = await Pointage.findOne({
      ipAddress: ip,
      departure: "-"
    }).sort({ createdAt: -1 })

    // =======================================
    // ✅ DÉPART
    // =======================================
    if (existing) {

      existing.departure = now.toLocaleTimeString()

      const diff =
        (now - new Date(existing.createdAt)) /
        (1000 * 60 * 60)

      existing.hours = diff.toFixed(2) + "h"

      await existing.save()

      return res.json({
        type: "departure",
        departureTime: existing.departure
      })
    }

    // =======================================
    // ❌ MATRICULE MANQUANT
    // =======================================
    if (!matricule) {

      return res.status(400).json({
        message: "Matricule requis"
      })
    }

    // =======================================
    // ✅ TROUVER EMPLOYÉ
    // =======================================
    const employee = await Employee.findOne({
      matricule
    })

    if (!employee) {

      return res.status(404).json({
        message: "Employé introuvable"
      })
    }

    // =======================================
    // ✅ RETARD
    // =======================================
    const hour = now.getHours()
    const minute = now.getMinutes()

    const isLate =
      hour > 8 ||
      (hour === 8 && minute > 0)

    // =======================================
    // ✅ CREATE POINTAGE
    // =======================================
    const newPointage = new Pointage({

      firstName: employee.firstName,
      lastName: employee.lastName,

      matricule,
      ipAddress: ip,

      date: today,

      arrival: now.toLocaleTimeString(),

      departure: "-",

      hours: "-",

      status: isLate
        ? "En retard"
        : "Présent",

      category: "pointage",

      reason: "QR Scan"
    })

    await newPointage.save()

    // =======================================
    // ✅ RESPONSE
    // =======================================
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

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
})

export default router;
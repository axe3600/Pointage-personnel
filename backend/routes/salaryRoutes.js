import express from "express"
import Salary from "../models/Salary.js"

const router = express.Router()

// =========================
// 🔥 ENREGISTRER SALAIRES
// =========================
router.post("/", async (req, res) => {

  try {

    const salaries = req.body

    // 🔥 VÉRIFICATION
    if (!Array.isArray(salaries)) {

      return res.status(400).json({
        message:
          "Les données doivent être un tableau"
      })
    }

    // 🔥 STOCKAGE DOUBLONS
    const duplicates = []

    // 🔥 BOUCLE
    for (const salary of salaries) {

      const existingSalary =
        await Salary.findOne({

          employe: salary.employe,
          mois: salary.mois,
          annee: salary.annee

        })

      // 🔥 SI EXISTE
      if (existingSalary) {

        duplicates.push(
          `${salary.employe}`
        )
      }
    }

    // 🔥 SI DOUBLONS
    if (duplicates.length > 0) {

      return res.status(400).json({

        message:
          `Salaires déjà enregistrés pour : ${duplicates.join(", ")}`
      })
    }

    // 🔥 INSERTION
    const saved =
      await Salary.insertMany(salaries)

    res.status(201).json(saved)

  } catch (err) {

    console.log("Erreur salaires :", err)

    res.status(500).json({
      message: "Erreur serveur"
    })
  }
})

export default router
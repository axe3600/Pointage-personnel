import express from "express"
import Salary from "../models/Salary.js"

const router = express.Router()

// =========================
// 🔥 ENREGISTRER SALAIRES
// =========================
router.post("/", async (req, res) => {
  try {

    const salaries = req.body

    // =========================
    // 🔥 VÉRIFICATION
    // =========================
    if (!Array.isArray(salaries)) {
      return res.status(400).json({
        message:
          "Les données doivent être un tableau"
      })
    }

    // =========================
    // 🔥 TABLEAUX
    // =========================
    const newSalaries = []
    const duplicates = []

    // =========================
    // 🔥 BOUCLE
    // =========================
    for (const salary of salaries) {

      // 🔥 NOM PROPRE
      const cleanName =
        salary.employe
          ?.replace(/\s+/g, " ")
          .trim()

      // ❌ IGNORER INVALIDES
      if (
        !cleanName ||
        cleanName === "undefined undefined"
      ) {
        continue
      }

      // =========================
      // 🔥 RECHERCHE DOUBLON
      // =========================
      const existingSalary =
        await Salary.findOne({
          employe: cleanName,
          mois: salary.mois,
          annee: salary.annee
        })

      // =========================
      // 🔥 SI EXISTE
      // =========================
      if (existingSalary) {

        duplicates.push({
          employe: cleanName
        })

      } else {

        // =========================
        // 🔥 AJOUT PROPRE
        // =========================
        newSalaries.push({
          ...salary,
          employe: cleanName
        })

      }
    }

    // =========================
    // 🔥 INSERTION
    // =========================
    if (newSalaries.length > 0) {

      await Salary.insertMany(
        newSalaries
      )

    }

    // =========================
    // 🔥 SI TOUT DÉJÀ EXISTE
    // =========================
    if (
      newSalaries.length === 0 &&
      duplicates.length > 0
    ) {

      return res.status(400).json({
        message:
          "Les salaires des employés sont déjà enregistrés pour cette période",
        inserted: 0,
        ignored: duplicates.length,
        duplicates
      })

    }

    // =========================
    // 🔥 RÉPONSE SUCCESS
    // =========================
    res.status(201).json({
      message:
        "Validation terminée",
      inserted:
        newSalaries.length,
      ignored:
        duplicates.length,
      duplicates
    })

  } catch (err) {

    console.log(
      "Erreur salaires :",
      err
    )

    res.status(500).json({
      message:
        "Erreur serveur"
    })

  }
})

// =========================
// 🔥 RECUPERER SALAIRES
// =========================
router.get("/", async (req, res) => {
  try {

    const salaires =
      await Salary.find()
        .sort({
          datePaiement: -1
        })

    res.json(salaires)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Erreur serveur"
    })

  }
})

// =========================
// 🔥 SUPPRIMER SALAIRE
// =========================
router.delete("/:id", async (req, res) => {
  try {

    await Salary.findByIdAndDelete(
      req.params.id
    )

    res.status(200).json({
      message: "Salaire supprimé"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: "Erreur suppression"
    })

  }
})

export default router
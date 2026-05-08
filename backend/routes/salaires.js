const express = require("express")

const router = express.Router()

const Salaire = require("../models/Salaire")

// 🔥 ENREGISTRER SALAIRES
router.post("/", async (req, res) => {

  try {

    const salaires = req.body

    // 🔥 INSERTION
    await Salaire.insertMany(salaires)

    res.status(200).json({
      success: true,
      message: "Salaires enregistrés"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    })
  }
})

module.exports = router
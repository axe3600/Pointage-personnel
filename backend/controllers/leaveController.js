import Leave from "../models/Leave.js"

// 🔥 AJOUT CONGÉ
export const createLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body)
    await leave.save()

    res.status(201).json(leave)
  } catch (err) {
    res.status(500).json({ error: "Erreur création congé" })
  }
}

// 🔥 GET TOUS LES CONGÉS
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 })
    res.json(leaves)
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération congés" })
  }
}

// 🔥 SUPPRESSION
export const deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id)
    res.json({ message: "Congé supprimé" })
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression" })
  }
}

// 🔥 UPDATE STATUS (option PRO)
export const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )

    res.json(leave)
  } catch (err) {
    res.status(500).json({ error: "Erreur update" })
  }
}
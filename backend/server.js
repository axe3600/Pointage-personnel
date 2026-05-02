import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import pointageRoutes from "./routes/pointageRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// 🔥 ROUTE
app.use("/api/pointages", pointageRoutes)
app.use("/api/employees", employeeRoutes)

// 🔥 TEST ROUTE SIMPLE
app.get("/", (req, res) => {
  res.send("API fonctionne 🚀")
})

// 🔥 DEBUG ENV
console.log("MONGO_URI =", process.env.MONGO_URI)

// 🔥 CONNEXION MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log("Erreur Mongo:", err))

// 🔥 PORT
const PORT = process.env.PORT || 5000

// ✅ IMPORTANT (MANQUAIT)
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})
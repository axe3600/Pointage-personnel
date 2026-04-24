import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// ✅ IMPORT ROUTE ICI Logique API
import pointageRoutes from "./routes/pointageRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// ✅ UTILISATION ROUTE ICI
app.use("/api/pointages", pointageRoutes)

// 🔗 Connexion DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err))

// 🚀 Lancement serveur
app.listen(5000, () => {
  console.log("Serveur lancé sur port 5000")
});
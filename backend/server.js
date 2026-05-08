import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import pointageRoutes from "./routes/pointageRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"
import leaveRoutes from "./routes/leaveRoutes.js"
import salaryRoutes from "./routes/salaryRoutes.js"

dotenv.config()

const app = express()


// ✅ CORS (UNE SEULE FOIS)
app.use(cors({
  origin: "*" // ⚠️ en prod tu peux limiter à ton domaine Vercel
}))

// ✅ Parser JSON
app.use(express.json())

// 🔥 ROUTES
app.use("/api/pointages", pointageRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/salaires", salaryRoutes)

// 🔥 TEST
app.get("/", (req, res) => {
  res.send("API fonctionne 🚀")
})

// 🔥 DEBUG (évite d'afficher en prod)
console.log("MONGO_URI =", process.env.MONGO_URI)

// 🔥 CONNEXION MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log("Erreur Mongo:", err))

// 🔥 PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})
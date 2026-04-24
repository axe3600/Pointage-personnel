import { useState } from "react"

function LoginModal({ onLogin }) {

  // 🔄 toggle SIGN IN / SIGN UP
  const [mode, setMode] = useState("signin")

  // 🔥 form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

// Gérer plusieurs admins( stocker plusieurs utilisateurs, garder l’utilisateur connecté à part, adapter login / register / affichage)
  // 🔐 SIGN UP
  const handleRegister = () => {

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Remplis tous les champs")
      return
    }
  
    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
  
    // 🔥 récupérer users existants
    const users = JSON.parse(localStorage.getItem("users")) || []
  
    // ❌ éviter doublon email
    const exists = users.find(u => u.email === form.email)
    if (exists) {
      alert("Cet email existe déjà")
      return
    }
  
    // 🆔 ID unique
    const newUser = {
      ...form,
      id: "EMP" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toLocaleDateString()
    }
  
    // 💾 sauvegarde
    const updatedUsers = [...users, newUser]
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  
    alert("Compte créé ! Connecte-toi")
  
    setMode("signin")
  }


  // 🔐 SIGN IN
const handleLogin = () => {

  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find(
    u => u.email === form.email && u.password === form.password
  )

  if (!user) {
    alert("Email ou mot de passe incorrect")
    return
  }

  const now = new Date()
  const updatedUser = {
    ...user,
    lastLogin: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // 🔥 mettre à jour dans la liste
  const updatedUsers = users.map(u =>
    u.email === user.email ? updatedUser : u
  )

  localStorage.setItem("users", JSON.stringify(updatedUsers))

  // 🔥 utilisateur connecté
  localStorage.setItem("currentUser", JSON.stringify(updatedUser))
  localStorage.setItem("isAuth", "true")

  onLogin()
}

  return (
<div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* 🔥 SWITCH */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 rounded-lg text-sm ${
              mode === "signin"
                ? "bg-white shadow font-medium"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm ${
              mode === "signup"
                ? "bg-white shadow font-medium"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* 🔥 TITLE */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "signin" ? "Connexion" : "Créer un compte"}
        </h2>

        <div className="space-y-4">

          {/* SIGN UP FIELDS */}
          {mode === "signup" && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </>
          )}

          {/* COMMON */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {/* CONFIRM PASSWORD */}
          {mode === "signup" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Répéter le mot de passe"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          )}

          {/* 🔥 BUTTON */}
          <button
            onClick={mode === "signin" ? handleLogin : handleRegister}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            {mode === "signin" ? "Se connecter" : "S'inscrire"}
          </button>

        </div>

      </div>
</div>
  )
}

export default LoginModal;
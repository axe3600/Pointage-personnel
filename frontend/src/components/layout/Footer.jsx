import { useState } from "react"

function Footer() {

  // 🔥 état popup
  const [activeStep, setActiveStep] = useState(null)

  // 🔥 contenu dynamique des 3 étapes
  const steps = {
    1: {
      title: "Pointer l'arrivée",
      description: `
        Dès votre arrivée au travail, cliquez sur "Pointer Arrivée".
        Le système enregistre automatiquement l'heure exacte.

        👉 Important :
        - Arriver après 08h00 = retard automatique
        - Assurez-vous d'entrer votre nom correctement
      `
    },
    2: {
      title: "Pointer le départ",
      description: `
        À la fin de votre journée, cliquez sur "Pointer Départ".

        👉 Le système calcule automatiquement :
        - Vos heures travaillées
        - Votre statut (Présent / Retard)

        ⚠️ Vous devez pointer l'arrivée avant !
      `
    },
    3: {
      title: "Suivre vos statistiques",
      description: `
        Consultez vos performances en temps réel :

        📊 Vous verrez :
        - Heures totales
        - Heures du mois
        - Retards
        - Taux de présence

        🎯 Objectif : rester à 100% de ponctualité !
      `
    }
  }

  return (
    <div className="max-w-8xl mx-auto px-4 mt-10 mb-10">

        {/* Conteneur principal */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

          {/* Titre */}
        <h3 className="text-gray-700 font-semibold mb-6">
          Comment utiliser le système de pointage
        </h3>

          {/* Cartes */}
        <div className="grid grid-cols-3 gap-6">

          {[1, 2, 3].map((num) => (
            <div
              key={num}
              onClick={() => setActiveStep(num)}
              className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mb-3">
                {num}
              </div>

              <h4 className="font-semibold mb-2">
                {steps[num].title}
              </h4>

              <p className="text-sm text-gray-500">
                {steps[num].description.slice(0, 80)}...
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* ============================ */}
      {/* 🔥 POPUP MODAL */}
      {/* ============================ */}
      {activeStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-blue-100 relative animate-fadeIn">

            {/* ❌ CLOSE */}
            <button
              onClick={() => setActiveStep(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* 🔵 NUMERO */}
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full mb-4">
              {activeStep}
            </div>

            {/* 🔥 TITLE */}
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {steps[activeStep].title}
            </h3>

            {/* 🔥 TEXT */}
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {steps[activeStep].description}
            </p>

            {/* 🔥 BUTTON */}
            <button
              onClick={() => setActiveStep(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Compris 👍
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default Footer;
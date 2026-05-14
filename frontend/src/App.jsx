import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import ScanPage from "./pages/ScanPage"
import EmployeePage from "./pages/EmployeePage"
import HistoriqueGlobal from "./pages/HistoriqueGlobal"
import HistoriquePaiements from "./pages/HistoriquePaiements"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* Page principale */}
        <Route path="/" element={<Dashboard />} />

        {/* 🔥 PAGE QR SCAN */}
        <Route path="/scan" element={<ScanPage />} />

           {/* 🔥 enregistrement employé */}
        <Route path="/Enregistrement-Employe" element={<EmployeePage />} />

        <Route path="/historique-global" element={<HistoriqueGlobal />}
/>
           {/* 🔥 Historique de Paiements des employés */}
<Route path="/historique-paiements" element={<HistoriquePaiements />} />
      
      </Routes>

    </BrowserRouter>
  )
}

export default App;
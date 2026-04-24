import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import ScanPage from "./pages/ScanPage"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* Page principale */}
        <Route path="/" element={<Dashboard />} />

        {/* 🔥 PAGE QR SCAN */}
        <Route path="/scan" element={<ScanPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App;
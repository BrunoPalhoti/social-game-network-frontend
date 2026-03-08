import Login from "@/presentation/pages/Login";
import Home from "@/presentation/pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<Login />} />
        <Route path="/criar-conta" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

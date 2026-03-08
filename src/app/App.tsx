import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../presentation/pages/Home";
import Login from "../presentation/pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<Login />} />
        <Route path="/criar-conta" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

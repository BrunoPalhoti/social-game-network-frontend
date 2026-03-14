import Login from "@/presentation/pages/Login";
import Home from "@/presentation/pages/Home";
import Profile from "@/presentation/pages/Profile";
import { Layout } from "@/presentation/components/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<Login />} />
        <Route path="/criar-conta" element={<Login />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/profile" element={<Layout />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

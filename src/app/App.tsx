import Login from "@/presentation/pages/Login";
import Profile from "@/presentation/pages/Profile";
import { Layout } from "@/presentation/components/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Layout />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Routes, Route } from "react-router";
import { LandingPage, LoginPage } from "./pages";

export const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

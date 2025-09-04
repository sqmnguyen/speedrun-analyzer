import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home.tsx";
import RunPage from "./pages/Run.tsx";
import StatisticsPage from "./pages/Statistics.tsx";
import PredictionPage from "./pages/Predictions.tsx";
import Header from "./components/Header.tsx"

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* id + slug pattern (stable id, human slug) */}
        <Route path="/runs" element={<RunPage />} />
        {/* standalone statistics page */}
        <Route path="/statistics" element = {<StatisticsPage />} />
        {/* predictor page */}
        <Route path="/predictions" element = {<PredictionPage />} />
        {/* 404 */}
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </div>
    
    
    

  );
}


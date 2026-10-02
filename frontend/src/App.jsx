import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Plants from "./pages/Plants";
import PlantDetail from "./pages/PlantDetail";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetail />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">🌿 LeafLog · Grow something good</footer>
    </>
  );
}

export default App;

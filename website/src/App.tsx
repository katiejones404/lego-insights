import { HashRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { Overview } from "./pages/Overview";
import { Themes } from "./pages/Themes";
import { Colors } from "./pages/Colors";
import { Parts } from "./pages/Parts";
import { Minifigs } from "./pages/Minifigs";

function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <NavBar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/minifigs" element={<Minifigs />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;

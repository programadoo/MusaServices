import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClothesSwap from "./pages/ClothesSwap";
import InfoProducts from "./pages/InfoProducts";
import EcommerceState from "./shared/context/ecommerceState";
function App() {
  return (
    <>
      <EcommerceState>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/swap" element={<ClothesSwap />} />
            <Route path="/info" element={<InfoProducts />} />
          </Routes>
        </BrowserRouter>
      </EcommerceState>
    </>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./pages/Product";
import AdminPanel from "./pages/AdminPanal";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

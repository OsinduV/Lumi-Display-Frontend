import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./pages/Product";
import AdminPanel from "./pages/AdminPanal";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow min-h-screen">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

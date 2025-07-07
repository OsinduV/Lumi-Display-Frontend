import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import ProductList from "./pages/Product";
// import AdminPanel from "./pages/AdminPanal";
import ProductForm from "./components/ProductForm";
import ViewProductsPage from "./pages/ViewProductsPage";
import BulkCreateProductsPage from "./pages/BulkCreateProductPage";
import AdminProductManage from "./pages/AdminProductManage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow min-h-screen">
        <Routes>
          <Route path="/" element={<ViewProductsPage />} />
          <Route path="/create" element={<ProductForm />} />
          <Route path="/bulk" element={<BulkCreateProductsPage />} />
          <Route path="/admin-panel" element={<AdminProductManage />} />

          {/* <Route path="/create" element={<CreateProductPage />} />
          <Route path="/view" element={<ViewProductsPage />} /> */}
        </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

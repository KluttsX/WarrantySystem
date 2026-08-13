import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import ClientsPage from "./pages/Clients";
import ProductsPage from "./pages/Products";
import WarrantiesPage from "./pages/Warranties";
import ClaimsPage from "./pages/Claims";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<DashboardPage></DashboardPage>} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="warranties" element={<WarrantiesPage />} />
          <Route path="claims" element={<ClaimsPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll as getClients } from "../services/clientService";
import { getAll as getProducts } from "../services/productService";
import { getAll as getWarranties } from "../services/warrantyService";
import { getAll as getClaims } from "../services/claimService";

const Icons = {
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Package: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Shield: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Alert: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  TrendingUp: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Clock: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Chart: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const Dashboard = () => {
  const [data, setData] = useState({
    clients: [],
    products: [],
    warranties: [],
    claims: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clientsRes, productsRes, warrantiesRes, claimsRes] =
        await Promise.all([getClients(), getProducts(), getWarranties(), getClaims()]);

      const clients = clientsRes.data?.data || [];
      const products = productsRes.data?.data || [];
      const warranties = warrantiesRes.data?.data || [];
      const claims = claimsRes.data?.data || [];

      setData({ clients, products, warranties, claims });
    } catch (err) {
      setError("Error al cargar los datos del dashboard");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalClients: data.clients.length,
    totalProducts: data.products.length,
    totalWarranties: data.warranties.length,
    totalClaims: data.claims.length,
  };

  const warrantiesByStatus = {
    active: data.warranties.filter((w) => w.status === "Activa").length,
    expired: data.warranties.filter((w) => w.status === "Expirada").length,
    cancelled: data.warranties.filter((w) => w.status === "Cancelada").length,
  };

  const claimsByStatus = {
    pending: data.claims.filter((c) => c.status === "Pendiente").length,
    inProgress: data.claims.filter((c) => c.status === "En Proceso").length,
    resolved: data.claims.filter((c) => c.status === "Resuelta").length,
    rejected: data.claims.filter((c) => c.status === "Rechazada").length,
  };

  const recentClients = data.clients.slice(-5).reverse();
  const recentWarranties = data.warranties.slice(-5).reverse();
  const recentClaims = data.claims.slice(-5).reverse();

  const warrantyPercentage = stats.totalWarranties > 0 
    ? Math.round((warrantiesByStatus.active / stats.totalWarranties) * 100) 
    : 0;
  
  const claimResolutionRate = stats.totalClaims > 0 
    ? Math.round((claimsByStatus.resolved / stats.totalClaims) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <Icons.Alert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl text-gray-800 font-bold mb-2">
              Panel de Control
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5 text-gray-500" />
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>           
        </div>
      </div>

      {/* Stats Cards - Diseño mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Clientes */}
        <Link
          to="/clients"
          className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Icons.Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Registro
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalClients}
            </h3>
            <p className="text-sm text-gray-600">Clientes registrados</p>
          </div>
        </Link>

        {/* Productos */}
        <Link
          to="/products"
          className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                <Icons.Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Catálogo
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalProducts}
            </h3>
            <p className="text-sm text-gray-600">Productos en catálogo</p>
          </div>
        </Link>

        {/* Garantías */}
        <Link
          to="/warranties"
          className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Icons.Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {warrantyPercentage}% activas
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalWarranties}
            </h3>
            <p className="text-sm text-gray-600">Garantías totales</p>
          </div>
        </Link>

        {/* Reclamaciones */}
        <Link
          to="/claims"
          className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
                <Icons.Alert className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {claimResolutionRate}% resueltas
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalClaims}
            </h3>
            <p className="text-sm text-gray-600">Reclamaciones totales</p>
          </div>
        </Link>
      </div>

      {/* Gráficos y Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
        {/* Distribución de Garantías - Circular */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Distribución de Garantías
            </h3>
            <Icons.Chart className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12"
                  strokeDasharray={`${warrantyPercentage} ${100 - warrantyPercentage}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{warrantyPercentage}%</span>
                <span className="text-xs text-gray-500">Activas</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Activas', count: warrantiesByStatus.active, color: 'bg-green-500' },
              { label: 'Expiradas', count: warrantiesByStatus.expired, color: 'bg-red-500' },
              { label: 'Canceladas', count: warrantiesByStatus.cancelled, color: 'bg-gray-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estado de Reclamaciones - Cards detalladas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Estado de Reclamaciones
            </h3>
            <Icons.Alert className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Icons.Clock className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded-full">
                  Pendientes
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{claimsByStatus.pending}</p>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Icons.Alert className="w-6 h-6 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-600 bg-white px-2 py-1 rounded-full">
                  En Proceso
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{claimsByStatus.inProgress}</p>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-xs font-medium text-green-600 bg-white px-2 py-1 rounded-full">
                  Resueltas
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{claimsByStatus.resolved}</p>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-red-50 to-red-100 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Icons.Alert className="w-6 h-6 text-red-600" />
                <span className="text-xs font-medium text-red-600 bg-white px-2 py-1 rounded-full">
                  Rechazadas
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{claimsByStatus.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registros Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Clientes Recientes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Clientes Recientes</h3>
            <Link
              to="/clients"
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              Ver todos
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div
                  key={client.id}
                  className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md shrink-0">
                    <span className="text-sm font-bold text-white">
                      {client.firstName?.[0] || "?"}{client.lastName?.[0] || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{client.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No hay clientes registrados
              </div>
            )}
          </div>
        </div>

        {/* Garantías Recientes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Garantías Recientes</h3>
            <Link
              to="/warranties"
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              Ver todas
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentWarranties.length > 0 ? (
              recentWarranties.map((warranty) => (
                <div
                  key={warranty.id}
                  className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md shrink-0">
                    <Icons.Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Garantía #{warranty.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Producto ID: {warranty.productId}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                      warranty.status === "Activa"
                        ? "bg-green-100 text-green-800"
                        : warranty.status === "Expirada"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {warranty.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No hay garantías registradas
              </div>
            )}
          </div>
        </div>

        {/* Reclamaciones Recientes */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Reclamaciones Recientes</h3>
            <Link
              to="/claims"
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              Ver todas
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentClaims.length > 0 ? (
              recentClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md shrink-0">
                    <Icons.Alert className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Reclamación #{claim.id}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {claim.description || "Sin descripción"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                      claim.status === "Resuelta"
                        ? "bg-green-100 text-green-800"
                        : claim.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : claim.status === "Rechazada"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {claim.status || "Pendiente"}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No hay reclamaciones registradas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getAll, create, remove, update } from "../services/warrantyService";
import { getAll as getProducts } from "../services/productService";
import { getAll as getClients } from "../services/clientService";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "Pendiente";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateForInput = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00") return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeStatus = (status) => {
  if (!status) return "Activa";
  
  const statusMap = {
    'Active': 'Activa',
    'Expired': 'Expirada',
    'Cancelled': 'Cancelada',
    'Activa': 'Activa',
    'Expirada': 'Expirada',
    'Cancelada': 'Cancelada'
  };
  
  return statusMap[status] || status;
};

const Warranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [viewModal, setViewModal] = useState(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const [warrantiesRes, productsRes, clientsRes] = await Promise.all([
        getAll(),
        getProducts(),
        getClients()
      ]);
      
      const warrantiesApiResult = warrantiesRes.data;
      const productsApiResult = productsRes.data;
      const clientsApiResult = clientsRes.data;

      if (warrantiesApiResult.success && productsApiResult.success && clientsApiResult.success) {
        setWarranties(warrantiesApiResult.data);
        setProducts(productsApiResult.data);
        setClients(clientsApiResult.data);
      } else {
        setError(
          warrantiesApiResult.errorMessage || productsApiResult.errorMessage || clientsApiResult.errorMessage || "Hubo un error al obtener los datos",
        );
      }
    } catch {
      setError("Error de red al intentar conectar con la DataBase");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Producto #${productId}`;
  };

  const getClientName = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.clientId) return "Sin cliente";
    
    const client = clients.find(c => c.id === product.clientId);
    return client ? `${client.firstName} ${client.lastName}` : `Cliente #${product.clientId}`;
  };

  const openUpdateModal = (warranty) => {
    setSelectedWarranty(warranty);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedWarranty(null);
    setIsUpdateModalOpen(false);
  };

  const openViewModal = (warranty) => {
    setViewModal(warranty);
  };

  const closeViewModal = () => {
    setViewModal(null);
  };

  useEffect(() => {
    (async () => {
      await fetchWarranties();
    })();
  }, []);

  const searchTerm = searchId.toLowerCase();

  const filteredWarranties = warranties.filter((warranty) => {
    const productName = getProductName(warranty.productId).toLowerCase();
    const clientName = getClientName(warranty.productId).toLowerCase();
    return (
      productName.includes(searchTerm) ||
      clientName.includes(searchTerm) ||
      warranty.status?.toLowerCase().includes(searchTerm) ||
      warranty.id?.toString().includes(searchTerm)
    );
  });

  const ViewDetailsModal = () => {
    if (!viewModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={closeViewModal}>
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Términos y Condiciones
            </h2>
            <button
              type="button"
              onClick={closeViewModal}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-6">
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-500">Garantía #{viewModal.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                normalizeStatus(viewModal.status) === 'Activa' ? 'bg-green-100 text-green-800' :
                normalizeStatus(viewModal.status) === 'Expirada' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {normalizeStatus(viewModal.status)}
              </span>
              <span className="text-sm text-gray-500">{getProductName(viewModal.productId)}</span>
              <span className="text-sm text-gray-500">{getClientName(viewModal.productId)}</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {viewModal.termsAndConditions || "Sin términos y condiciones"}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</h3>
                <p className="text-sm text-gray-600">{formatDate(viewModal.startDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Fecha de Fin</h3>
                <p className="text-sm text-gray-600">{formatDate(viewModal.endDate)}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button
              type="button"
              onClick={closeViewModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CreateWarranty = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
      productId: "",
      startDate: "",
      endDate: "",
      status: "Activa",
      termsAndConditions: "",
    });

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
      setIsModalOpen(false);
      setFormData({
        productId: "",
        startDate: "",
        endDate: "",
        status: "Activa",
        termsAndConditions: "",
      });
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setIsSubmitting(true);
        const response = await create(formData);
        const apiResult = response.data;

        if (apiResult.success) {
          closeModal();
          fetchWarranties();
        } else {
          alert(apiResult.errorMessage || "Hubo un error al crear la garantía");
        }
      } catch {
        alert("Error de red al intentar crear la garantía");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <>
        <button
          type="button"
          onClick={openModal}
          className="w-full sm:w-auto px-3.5 py-2 text-sm text-white font-semibold bg-red-600 border border-red-600 rounded-md cursor-pointer flex justify-center items-center gap-2 transition-colors duration-300 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 fill-white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
          </svg>
          Nueva Garantía
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Nueva Garantía
                </h2>
              </div>

              <form className="px-6 py-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative">
                    <label
                      htmlFor="productId"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Producto
                    </label>
                    <select
                      id="productId"
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (ID: {product.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="startDate"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="endDate"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="status"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Estado
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="Activa">Activa</option>
                      <option value="Expirada">Expirada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div className="relative col-span-full">
                    <label
                      htmlFor="termsAndConditions"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Términos y Condiciones
                    </label>
                    <textarea
                      id="termsAndConditions"
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleChange}
                      placeholder="Describe los términos y condiciones de la garantía..."
                      rows="3"
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="py-2 px-4 text-sm rounded-md font-medium cursor-pointer text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-4 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-red-600 bg-red-600 hover:bg-red-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  const DeleteWarranty = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta garantía?",
    );

    if (!confirmDelete) return;

    try {
      const response = await remove(id);

      if (response.status === 204 || response.status === 200) {
        await fetchWarranties();
      } else {
        alert("Hubo un error inesperado al eliminar la garantía");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red al intentar eliminar la garantía");
    }
  };

  const UpdateWarranty = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
      if (selectedWarranty) {
        const normalizedStatus = normalizeStatus(selectedWarranty.status);
        setFormData({
          productId: selectedWarranty.productId || "",
          startDate: formatDateForInput(selectedWarranty.startDate),
          endDate: formatDateForInput(selectedWarranty.endDate),
          status: normalizedStatus,
          termsAndConditions: selectedWarranty.termsAndConditions || "",
        });
      }
    }, [selectedWarranty]);

    const closeModal = () => {
      if (isSubmitting) return;
      setFormData(null);
      closeUpdateModal();
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setIsSubmitting(true);
        await update(selectedWarranty.id, formData);
        closeModal();
        await fetchWarranties();
      } catch {
        alert("Error de red al intentar modificar la garantía");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isUpdateModalOpen || !selectedWarranty || !formData) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Modificar Garantía
            </h2>
          </div>

          <form className="px-6 py-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <div className="relative">
                <label
                  htmlFor="updateProductId"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Producto
                </label>
                <select
                  id="updateProductId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (ID: {product.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label
                  htmlFor="updateStartDate"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="updateStartDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateEndDate"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  id="updateEndDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateStatus"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Estado
                </label>
                <select
                  id="updateStatus"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="Activa">Activa</option>
                  <option value="Expirada">Expirada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="relative col-span-full">
                <label
                  htmlFor="updateTermsAndConditions"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Términos y Condiciones
                </label>
                <textarea
                  id="updateTermsAndConditions"
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleChange}
                  placeholder="Describe los términos y condiciones de la garantía..."
                  rows="3"
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="py-2 px-4 text-sm rounded-md font-medium cursor-pointer text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-4 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-red-600 bg-red-600 hover:bg-red-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-2xl sm:text-4xl text-gray-700 font-bold">
            Gestión de Garantías
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Realizar el seguimiento y la gestión de las garantías de los productos.
          </p>
        </div>

        {CreateWarranty()}
        {UpdateWarranty()}
        {ViewDetailsModal()}
      </div>

      <form
        className="mt-4 w-full mx-auto"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-white outline-1 -outline-offset-1 outline-slate-300 focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-red-400">
          <label htmlFor="search" className="sr-only">
            Search
          </label>

          <input
            type="search"
            id="search"
            value={searchId}
            placeholder="Buscar por ID, Producto, Cliente o Estado..."
            className="text-sm text-slate-900 w-full outline-none"
            onChange={(e) => setSearchId(e.target.value)}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            className="size-4 fill-slate-400 ml-auto"
            aria-hidden="true"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z" />
          </svg>
        </div>
      </form>

      <div className="mt-5 items-center flex flex-col">
        {loading && (
          <div role="status">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-9 animate-[spin_0.8s_linear_infinite] fill-red-600 dark:fill-red-500"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
            </svg>
            <span className="sr-only">Loading…</span>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="w-full mx-auto border border-slate-200 rounded-md overflow-x-auto">
            <table className="w-full">
              <thead className="text-slate-900 text-left text-sm font-semibold border-b border-slate-300 whitespace-nowrap">
                <tr className="bg-slate-50">
                  <th scope="col" className="px-4 py-3.5">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Producto
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Cliente
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Fecha de Inicio
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Fecha de Fin
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Términos y Condiciones
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Creado el
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Modificado el
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm divide-y divide-slate-200">
                {warranties.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No hay garantías registradas.
                    </td>
                  </tr>
                ) : filteredWarranties.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No se encontraron resultados para "{searchId}"
                    </td>
                  </tr>
                ) : (
                  filteredWarranties.map((warranty) => (
                    <tr key={warranty.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                        {warranty.id}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {getProductName(warranty.productId)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {getClientName(warranty.productId)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(warranty.startDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(warranty.endDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          normalizeStatus(warranty.status) === 'Activa' ? 'bg-green-100 text-green-800' :
                          normalizeStatus(warranty.status) === 'Expirada' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {normalizeStatus(warranty.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-800 max-w-xs">
                        {warranty.termsAndConditions ? (
                          <button
                            type="button"
                            onClick={() => openViewModal(warranty)}
                            className="text-left hover:text-blue-600 transition-colors cursor-pointer w-full"
                            title="Ver términos y condiciones completos"
                          >
                            <span className="line-clamp-1">
                              {warranty.termsAndConditions}
                            </span>
                          </button>
                        ) : (
                          <span className="text-gray-400">Sin términos</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(warranty.createdDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {warranty.updatedDate ? formatDate(warranty.updatedDate) : "No modificado"}
                      </td>

                      <td className="px-4 py-4 flex gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(warranty)}
                          className="text-sm text-blue-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                          aria-label="Modificar Garantía"
                          title="Modificar Garantía"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4 fill-blue-700"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => DeleteWarranty(warranty.id)}
                          className="text-sm text-red-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                          aria-label="Eliminar Garantía"
                          title="Eliminar Garantía"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4 fill-red-500"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warranties;
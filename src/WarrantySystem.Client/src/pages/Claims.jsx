/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getAll, create, remove, update } from "../services/claimService";
import { getAll as getWarranties } from "../services/warrantyService";
import { getAll as getProducts } from "../services/productService";

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

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeStatus = (status) => {
  if (!status) return "Pendiente";
  
  const statusMap = {
    'Pending': 'Pendiente',
    'InProgress': 'En Proceso',
    'In Progress': 'En Proceso',
    'Resolved': 'Resuelta',
    'Rejected': 'Rechazada',
    'Pendiente': 'Pendiente',
    'En Proceso': 'En Proceso',
    'Resuelta': 'Resuelta',
    'Rechazada': 'Rechazada'
  };
  
  return statusMap[status] || status;
};

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [viewModal, setViewModal] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const [claimsRes, warrantiesRes, productsRes] = await Promise.all([
        getAll(),
        getWarranties(),
        getProducts()
      ]);
      
      const claimsApiResult = claimsRes.data;
      const warrantiesApiResult = warrantiesRes.data;
      const productsApiResult = productsRes.data;

      if (claimsApiResult.success && warrantiesApiResult.success && productsApiResult.success) {
        setClaims(claimsApiResult.data);
        setWarranties(warrantiesApiResult.data);
        setProducts(productsApiResult.data);
      } else {
        setError("Hubo un error al obtener los datos");
      }
    } catch {
      setError("Error de red al intentar conectar con la DataBase");
    } finally {
      setLoading(false);
    }
  };

  const getWarrantyInfo = (warrantyId) => {
    const warranty = warranties.find(w => w.id === warrantyId);
    if (!warranty) return `Garantía #${warrantyId}`;
    
    const product = products.find(p => p.id === warranty.productId);
    const productName = product ? product.name : `Producto #${warranty.productId}`;
    
    return `${productName} (Garantía #${warrantyId})`;
  };

  const openUpdateModal = (claim) => {
    setSelectedClaim(claim);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedClaim(null);
    setIsUpdateModalOpen(false);
  };

  const openViewModal = (claim, field) => {
    setViewModal({ claim, field });
  };

  const closeViewModal = () => {
    setViewModal(null);
  };

  useEffect(() => {
    (async () => {
      await fetchClaims();
    })();
  }, []);

  const searchTerm = searchId.toLowerCase();

  const filteredClaims = claims.filter((claim) => {
    const warrantyInfo = getWarrantyInfo(claim.warrantyId).toLowerCase();
    return (
      warrantyInfo.includes(searchTerm) ||
      claim.status?.toLowerCase().includes(searchTerm) ||
      claim.issueDescription?.toLowerCase().includes(searchTerm) ||
      claim.id?.toString().includes(searchTerm)
    );
  });

  const ViewDetailsModal = () => {
    if (!viewModal) return null;

    const { claim, field } = viewModal;
    const isDescription = field === 'description';
    const content = isDescription ? claim.issueDescription : claim.resolutionDetails;
    const title = isDescription ? 'Descripción del Problema' : 'Detalles de la Resolución';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={closeViewModal}>
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              {title}
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
              <span className="text-sm text-gray-500">Reclamación #{claim.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                normalizeStatus(claim.status) === 'Resuelta' ? 'bg-green-100 text-green-800' :
                normalizeStatus(claim.status) === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                normalizeStatus(claim.status) === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {normalizeStatus(claim.status)}
              </span>
              <span className="text-sm text-gray-500">{getWarrantyInfo(claim.warrantyId)}</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {content || "Sin información disponible"}
              </p>
            </div>

            {isDescription && claim.resolutionDetails && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Detalles de la Resolución
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {claim.resolutionDetails}
                  </p>
                </div>
              </div>
            )}

            {!isDescription && claim.issueDescription && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Descripción del Problema
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {claim.issueDescription}
                  </p>
                </div>
              </div>
            )}
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

  const CreateClaim = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
      warrantyId: "",
      claimDate: getCurrentDate(),
      issueDescription: "",
      status: "Pendiente",
      resolutionDate: "",
      resolutionDetails: "",
    });

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
      setIsModalOpen(false);
      setFormData({
        warrantyId: "",
        claimDate: getCurrentDate(),
        issueDescription: "",
        status: "Pendiente",
        resolutionDate: "",
        resolutionDetails: "",
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
        
        const dataToSend = {
          warrantyId: Number(formData.warrantyId),
          claimDate: formData.claimDate,
          issueDescription: formData.issueDescription,
          status: formData.status,
          resolutionDate: formData.resolutionDate || null,
          resolutionDetails: formData.resolutionDetails || null,
        };
        
        const response = await create(dataToSend);
        const apiResult = response.data;

        if (apiResult.success) {
          closeModal();
          fetchClaims();
        } else {
          alert(apiResult.errorMessage || "Hubo un error al crear la reclamación");
        }
      } catch {
        alert("Error de red al intentar crear la reclamación");
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
          Nueva Reclamación
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Nueva Reclamación
                </h2>
              </div>

              <form className="px-6 py-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative">
                    <label
                      htmlFor="warrantyId"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Garantía
                    </label>
                    <select
                      id="warrantyId"
                      name="warrantyId"
                      value={formData.warrantyId}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    >
                      <option value="">Seleccionar garantía</option>
                      {warranties.map((warranty) => {
                        const product = products.find(p => p.id === warranty.productId);
                        const productName = product ? product.name : `Producto #${warranty.productId}`;
                        return (
                          <option key={warranty.id} value={warranty.id}>
                            {productName} (Garantía #{warranty.id})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="claimDate"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Fecha de Reclamación
                    </label>
                    <input
                      type="date"
                      id="claimDate"
                      name="claimDate"
                      value={formData.claimDate}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative col-span-full">
                    <label
                      htmlFor="issueDescription"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Descripción del Problema
                    </label>
                    <textarea
                      id="issueDescription"
                      name="issueDescription"
                      value={formData.issueDescription}
                      onChange={handleChange}
                      placeholder="Describe el problema o motivo de la reclamación..."
                      required
                      rows="3"
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 resize-none"
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
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Resuelta">Resuelta</option>
                      <option value="Rechazada">Rechazada</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="resolutionDate"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Fecha de Resolución
                    </label>
                    <input
                      type="date"
                      id="resolutionDate"
                      name="resolutionDate"
                      value={formData.resolutionDate}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative col-span-full">
                    <label
                      htmlFor="resolutionDetails"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Detalles de la Resolución
                    </label>
                    <textarea
                      id="resolutionDetails"
                      name="resolutionDetails"
                      value={formData.resolutionDetails}
                      onChange={handleChange}
                      placeholder="Describe cómo se resolvió la reclamación..."
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

  const DeleteClaim = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta reclamación?",
    );

    if (!confirmDelete) return;

    try {
      const response = await remove(id);

      if (response.status === 204 || response.status === 200) {
        await fetchClaims();
      } else {
        alert("Hubo un error inesperado al eliminar la reclamación");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red al intentar eliminar la reclamación");
    }
  };

  const UpdateClaim = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
      if (selectedClaim) {
        const normalizedStatus = normalizeStatus(selectedClaim.status);
        setFormData({
          warrantyId: selectedClaim.warrantyId || "",
          claimDate: formatDateForInput(selectedClaim.claimDate),
          issueDescription: selectedClaim.issueDescription || "",
          status: normalizedStatus,
          resolutionDate: selectedClaim.resolutionDate 
            ? formatDateForInput(selectedClaim.resolutionDate)
            : "",
          resolutionDetails: selectedClaim.resolutionDetails || "",
        });
      }
    }, [selectedClaim]);

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
        
        const dataToSend = {
          warrantyId: Number(formData.warrantyId),
          claimDate: formData.claimDate,
          issueDescription: formData.issueDescription,
          status: formData.status,
          resolutionDate: formData.resolutionDate || null,
          resolutionDetails: formData.resolutionDetails || null,
        };
        
        await update(selectedClaim.id, dataToSend);
        closeModal();
        await fetchClaims();
      } catch {
        alert("Error de red al intentar modificar la reclamación");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isUpdateModalOpen || !selectedClaim || !formData) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Modificar Reclamación
            </h2>
          </div>

          <form className="px-6 py-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <div className="relative">
                <label
                  htmlFor="updateWarrantyId"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Garantía
                </label>
                <select
                  id="updateWarrantyId"
                  name="warrantyId"
                  value={formData.warrantyId}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                >
                  <option value="">Seleccionar garantía</option>
                  {warranties.map((warranty) => {
                    const product = products.find(p => p.id === warranty.productId);
                    const productName = product ? product.name : `Producto #${warranty.productId}`;
                    return (
                      <option key={warranty.id} value={warranty.id}>
                        {productName} (Garantía #{warranty.id})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="relative">
                <label
                  htmlFor="updateClaimDate"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Fecha de Reclamación
                </label>
                <input
                  type="date"
                  id="updateClaimDate"
                  name="claimDate"
                  value={formData.claimDate}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative col-span-full">
                <label
                  htmlFor="updateIssueDescription"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Descripción del Problema
                </label>
                <textarea
                  id="updateIssueDescription"
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  placeholder="Describe el problema o motivo de la reclamación..."
                  required
                  rows="3"
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 resize-none"
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
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelta">Resuelta</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>

              <div className="relative">
                <label
                  htmlFor="updateResolutionDate"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Fecha de Resolución
                </label>
                <input
                  type="date"
                  id="updateResolutionDate"
                  name="resolutionDate"
                  value={formData.resolutionDate}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative col-span-full">
                <label
                  htmlFor="updateResolutionDetails"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Detalles de la Resolución
                </label>
                <textarea
                  id="updateResolutionDetails"
                  name="resolutionDetails"
                  value={formData.resolutionDetails}
                  onChange={handleChange}
                  placeholder="Describe cómo se resolvió la reclamación..."
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
            Gestión de Reclamaciones
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Revisar y tramitar las reclamaciones de los clientes.
          </p>
        </div>

        {CreateClaim()}
        {UpdateClaim()}
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
            placeholder="Buscar por ID, Garantía, Descripción o Estado..."
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
                    Garantía
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Fecha de Reclamación
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Descripción
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Fecha de Resolución
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Detalles de la Resolución
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
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No hay reclamaciones registradas.
                    </td>
                  </tr>
                ) : filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No se encontraron resultados para "{searchId}"
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                        {claim.id}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {getWarrantyInfo(claim.warrantyId)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(claim.claimDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 max-w-xs">
                        <button
                          type="button"
                          onClick={() => openViewModal(claim, 'description')}
                          className="text-left hover:text-blue-600 transition-colors cursor-pointer"
                          title="Ver descripción completa"
                        >
                          <span className="line-clamp-1">
                            {claim.issueDescription}
                          </span>
                        </button>
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          normalizeStatus(claim.status) === 'Resuelta' ? 'bg-green-100 text-green-800' :
                          normalizeStatus(claim.status) === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          normalizeStatus(claim.status) === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {normalizeStatus(claim.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(claim.resolutionDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 max-w-xs">
                        {claim.resolutionDetails ? (
                          <button
                            type="button"
                            onClick={() => openViewModal(claim, 'resolution')}
                            className="text-left hover:text-blue-600 transition-colors cursor-pointer"
                            title="Ver detalles completos"
                          >
                            <span className="line-clamp-1">
                              {claim.resolutionDetails}
                            </span>
                          </button>
                        ) : (
                          <span className="text-gray-400">Sin detalles</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(claim.createdDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {claim.updatedDate ? formatDate(claim.updatedDate) : "No modificado"}
                      </td>

                      <td className="px-4 py-4 flex gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(claim)}
                          className="text-sm text-blue-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                          aria-label="Modificar Reclamación"
                          title="Modificar Reclamación"
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
                          onClick={() => DeleteClaim(claim.id)}
                          className="text-sm text-red-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                          aria-label="Eliminar Reclamación"
                          title="Eliminar Reclamación"
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

export default Claims;
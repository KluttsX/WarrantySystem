import { useState, useEffect } from "react";
import { getAll, create, remove, update } from "../services/productService";

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAll();
      const apiResult = response.data;

      if (apiResult.success) {
        setProducts(apiResult.data);
      } else {
        setError(
          apiResult.errorMessage || "Hubo un error al obtener los productos",
        );
      }
    } catch {
      setError("Error de red al intentar conectar con la DataBase");
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedProduct(null);
    setIsUpdateModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);

  const searchTerm = searchId.toLowerCase();

  const filteredProducts = products.filter((product) => {
    return (
      product.name?.toLowerCase().includes(searchTerm) ||
      product.serialNumber?.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm) ||
      product.model?.toLowerCase().includes(searchTerm) ||
      product.id?.toString().includes(searchTerm)
    );
  });

  const CreateProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
      name: "",
      serialNumber: "",
      brand: "",
      model: "",
      purchaseDate: "",
      clientId: "",
    });

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
      setIsModalOpen(false);
      setFormData({
        name: "",
        serialNumber: "",
        brand: "",
        model: "",
        purchaseDate: "",
        clientId: "",
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
          fetchProducts();
        } else {
          alert(apiResult.errorMessage || "Hubo un error al crear el producto");
        }
      } catch {
        alert("Error de red al intentar crear el producto");
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
          Nuevo Producto
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Nuevo Producto
                </h2>
              </div>

              <form className="px-6 py-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej. Laptop"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="serialNumber"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Número de Serie
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      placeholder="Ej. XS-2426465"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="brand"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Marca
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Ej. Samsung"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="model"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Modelo
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="Ej. Galaxy S21"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="purchaseDate"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Fecha de Compra
                    </label>
                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="clientId"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      ID del Cliente
                    </label>
                    <input
                      type="number"
                      id="clientId"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      placeholder="Ej. 123"
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
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

  const DeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?",
    );

    if (!confirmDelete) return;

    try {
      const response = await remove(id);

      if (response.status === 204 || response.status === 200) {
        await fetchProducts();
      } else {
        alert("Hubo un error inesperado al eliminar el producto");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red al intentar eliminar el producto");
    }
  };

  const UpdateProduct = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
      if (selectedProduct) {
        setFormData({
          name: selectedProduct.name || "",
          serialNumber: selectedProduct.serialNumber || "",
          brand: selectedProduct.brand || "",
          model: selectedProduct.model || "",
          purchaseDate: formatDateForInput(selectedProduct.purchaseDate),
          clientId: selectedProduct.clientId || "",
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct]);

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
        await update(selectedProduct.id, formData);
        closeModal();
        await fetchProducts();
      } catch {
        alert("Error de red al intentar modificar el producto");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isUpdateModalOpen || !selectedProduct || !formData) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Modificar Producto
            </h2>
          </div>

          <form className="px-6 py-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <div className="relative">
                <label
                  htmlFor="updateName"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="updateName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Laptop"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateSerialNumber"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Número de Serie
                </label>
                <input
                  type="text"
                  id="updateSerialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Ej. XS-2426465"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateBrand"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Marca
                </label>
                <input
                  type="text"
                  id="updateBrand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej. Samsung"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateModel"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Modelo
                </label>
                <input
                  type="text"
                  id="updateModel"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Ej. Galaxy S21"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updatePurchaseDate"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Fecha de Compra
                </label>
                <input
                  type="date"
                  id="updatePurchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateClientId"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  ID del Cliente
                </label>
                <input
                  type="number"
                  id="updateClientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  placeholder="Ej. 123"
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
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
            Catálogo de productos
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Visualiza y organiza tus productos registrados.
          </p>
        </div>

        {CreateProduct()}
        {UpdateProduct()}
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
            placeholder="Buscar por ID, Nombre, Serie, Marca o Modelo..."
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
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Número de Serie
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Marca
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Modelo
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Fecha de Compra
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    ID Cliente
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No se encontraron resultados para "{searchId}"
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                        {product.id}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {product.name}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {product.serialNumber}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {product.brand}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {product.model}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(product.purchaseDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {product.clientId || "Sin cliente"}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(product.createdDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {product.updatedDate ? formatDate(product.updatedDate) : "No modificado"}
                      </td>

                      <td className="px-4 py-4 flex gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(product)}
                          className="text-sm text-blue-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                          aria-label="Modificar Producto"
                          title="Modificar Producto"
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
                          onClick={() => DeleteProduct(product.id)}
                          className="text-sm text-red-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                          aria-label="Eliminar Producto"
                          title="Eliminar Producto"
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

export default Products;
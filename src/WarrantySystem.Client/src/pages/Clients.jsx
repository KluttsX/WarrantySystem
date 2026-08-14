import { useState, useEffect } from "react";
import { getAll, create, remove, update } from "../services/clientService";

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

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getAll();
      const apiResult = response.data;

      if (apiResult.success) {
        setClients(apiResult.data);
      } else {
        setError(
          apiResult.errorMessage || "Hubo un error al obtener los clientes",
        );
      }
    } catch {
      setError("Error de red al intentar conectar con la DataBase");
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (client) => {
    setSelectedClient(client);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedClient(null);
    setIsUpdateModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      await fetchClients();
    })();
  }, []);

  const searchTerm = searchId.toLowerCase();

  const filteredClients = clients.filter((client) => {
    return (
      client.firstName?.toLowerCase().includes(searchTerm) ||
      client.lastName?.toLowerCase().includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm) ||
      client.id?.toString().includes(searchTerm)
    );
  });

  const CreateClient = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
    });

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
      });
    };

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "phoneNumber") {
        const sanitizedValue = value.replace(/[^0-9-]/g, "");
        setFormData({ ...formData, [name]: sanitizedValue });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setIsSubmitting(true);
        const response = await create(formData);
        const apiResult = response.data;

        if (apiResult.success) {
          closeModal();
          fetchClients();
        } else {
          alert(apiResult.errorMessage || "Hubo un error al crear el cliente");
        }
      } catch {
        alert("Error de red al intentar crear el cliente");
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
          Nuevo Cliente
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Nuevo Cliente
                </h2>
              </div>

              <form className="px-6 py-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="relative">
                    <label
                      htmlFor="firstName"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Ej. Eleazar"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="lastName"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ej. Del Rosario"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="phoneNumber"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="809-000-0000"
                      required
                      className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                    />
                  </div>

                  <div className="relative col-span-full">
                    <label
                      htmlFor="address"
                      className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Calle principal #123, Ciudad"
                      required
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

  const DeleteClient = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?",
    );

    if (!confirmDelete) return;

    try {
      const response = await remove(id);

      if (response.status === 204 || response.status === 200) {
        await fetchClients();
      } else {
        alert("Hubo un error inesperado al eliminar el cliente");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red al intentar eliminar el cliente");
    }
  };

  const UpdateClient = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
    });

    useEffect(() => {
      if (selectedClient) {
        setFormData({
          firstName: selectedClient.firstName || "",
          lastName: selectedClient.lastName || "",
          email: selectedClient.email || "",
          phoneNumber: selectedClient.phoneNumber || "",
          address: selectedClient.address || "",
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClient]);

    const closeModal = () => {
      if (isSubmitting) return;

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
      });

      closeUpdateModal();
    };

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "phoneNumber") {
        const sanitizedValue = value.replace(/[^0-9-]/g, "");
        setFormData({ ...formData, [name]: sanitizedValue });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setIsSubmitting(true);
        await update(selectedClient.id, formData);
        closeModal();
        await fetchClients();
      } catch {
        alert("Error de red al intentar modificar el cliente");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isUpdateModalOpen || !selectedClient) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Modificar Cliente
            </h2>
          </div>

          <form className="px-6 py-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <div className="relative">
                <label
                  htmlFor="updateFirstName"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="updateFirstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ej. Eleazar"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateLastName"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="updateLastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ej. Del Rosario"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updateEmail"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="updateEmail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="updatePhoneNumber"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="updatePhoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="809-000-0000"
                  required
                  className="block w-full px-4 py-3 text-sm text-slate-900 bg-transparent rounded-md outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                />
              </div>

              <div className="relative col-span-full">
                <label
                  htmlFor="updateAddress"
                  className="absolute -top-2 left-4 bg-white px-1.5 text-xs font-medium text-slate-900"
                >
                  Dirección
                </label>
                <input
                  type="text"
                  id="updateAddress"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle principal #123, Ciudad"
                  required
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
            Gestión de Clientes
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Maneja tus clientes y su información de manera eficiente.
          </p>
        </div>

        {CreateClient()}
        {UpdateClient()}
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
            placeholder="Buscar por ID, Nombre, Apellido o Email..."
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
                    Apellido
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Teléfono
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Dirección
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
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No hay clientes registrados.
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No se encontraron resultados para "{searchId}"
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                        {client.id}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {client.firstName}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {client.lastName}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {client.email}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {client.phoneNumber}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {client.address}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {formatDate(client.createdDate)}
                      </td>

                      <td className="px-4 py-4 text-slate-800 whitespace-nowrap">
                        {client.updatedDate ? formatDate(client.updatedDate) : "No modificado"}
                      </td>

                      <td className="px-4 py-4 flex gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(client)}
                          className="text-sm text-blue-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                          aria-label="Modificar Cliente"
                          title="Modificar Cliente"
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
                          onClick={() => DeleteClient(client.id)}
                          className="text-sm text-red-700 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                          aria-label="Eliminar Cliente"
                          title="Eliminar Cliente"
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

export default Clients;
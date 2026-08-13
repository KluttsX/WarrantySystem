import {
  LuBox,
  LuPackage,
  LuUser,
  LuShieldCheck,
  LuFileWarning,
} from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  const SIDEBAR_LINKS = [
    { id: 1, path: "/", name: "Resumen", icon: LuBox },
    { id: 2, path: "/clients", name: "Clientes", icon: LuUser },
    { id: 3, path: "/products", name: "Productos", icon: LuPackage },
    { id: 4, path: "/warranties", name: "Garantías", icon: LuShieldCheck },
    { id: 5, path: "/claims", name: "Reclamaciones", icon: LuFileWarning },
  ];

  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-none pt-8 px-4 bg-white">
      <div className="mb-8">
        <div className="items-center gap-3 hidden md:flex">
          <div className="h-11 w-11 items-center flex justify-center rounded-2xl bg-gray-100">
            <p className="text-md font-bold text-gray-700">WS</p>
          </div>

          <div className="flex flex-col">
            <p className="text-md font-semibold text-gray-900">
              WarrantySystem
            </p>

            <p className="text-xs text-gray-500">Gestión de garantías</p>
          </div>
        </div>

        <div className="h-10 w-10 flex md:hidden items-center justify-center rounded-2xl bg-gray-100">
          <p className="text-xs font-bold text-gray-700">WS</p>
        </div>
      </div>

      <div className="h-px bg-gray-100"></div>

      <ul className="mt-6 space-y-6">
        {SIDEBAR_LINKS.map((link, index) => {
          const active = location.pathname === link.path;

          return (
            <li
              key={index}
              className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-red-400 ${
                active ? "bg-red-100 text-red-400" : ""
              }`}
            >
              <Link
                to={link.path}
                className="flex justify-center md:justify-start items-center md:space-x-5"
              >
                <span>{link.icon()}</span>

                <span className="text-sm text-gray-500 hidden md:flex">
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

    
    </div>
  );
};

export default SideBar;

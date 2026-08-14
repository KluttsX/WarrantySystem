import { useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    
   const pages = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of your warranty system."
  },
  "/clients": {
    title: "Client Management",
    subtitle: "Manage your customers and their information."
  },
  "/products": {
    title: "Product Catalog",
    subtitle: "View and organize your registered products."
  },
  "/warranties": {
    title: "Warranty Management",
    subtitle: "Track and manage product warranties."
  },
  "/claims": {
    title: "Claims Management",
    subtitle: "Review and process customer claims."
  }
};

    const currentPage = pages[location.pathname] || pages["/"];
  return (
    <div className='flex flex-col justify-center items-start p-8'>
        <h1 className='text-4xl text-gray-700 font-bold'>{currentPage.title}</h1>
        <p className="mt-1 text-gray-500">{currentPage.subtitle}</p>
    </div>
  )
}

export default Header
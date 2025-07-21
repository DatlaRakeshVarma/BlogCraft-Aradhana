import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PenTool } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <div
          className="flex items-center justify-center cursor-pointer text-blue-500 hover:text-blue-700"
          onClick={() => (window.location.href = "/")}
        >
          <PenTool className="w-6 h-6 mr-2" />
          <span className="underline">Return Home</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
function App() {
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  function handleSearch(newSearchText) {
    setSearchText(newSearchText);
  }

  // Handle screen resize to detect mobile view
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "ml-64" : "md:ml-24"
        } `}
        onClick={() => {
          if (isMobile) setIsSidebarOpen(false);
        }}
      >
        <Outlet context={{ searchText, setSearchText }} />
      </div>
    </>
  );
}

export default App;

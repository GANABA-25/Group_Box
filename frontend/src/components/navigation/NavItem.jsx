import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const NavItem = ({ to, icon: Icon, label, activePaths = [], children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = activePaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const toggleDropdown = (e) => {
    if (e.target.tagName.toLowerCase() !== "a") {
      setIsOpen((prev) => !prev);
    }
  };

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="flex flex-col">
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-between gap-2 px-3 py-2 cursor-pointer rounded-xl 
          transition-all duration-200 ${
            isActive
              ? "bg-white/10 backdrop-blur-md font-Montserrat-Bold"
              : "hover:bg-white/10"
          }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon />}
          {to ? <Link to={to}>{label}</Link> : <span>{label}</span>}
        </div>

        {children && (
          <span className="text-sm">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
      </div>

      {children && isOpen && (
        <div className="ml-6 mt-2 flex flex-col gap-1">
          {childArray.map((child, index) => {
            const childPath = child.props.to;
            const isChildActive = location.pathname === childPath;

            return (
              <div
                key={index}
                className={`rounded-xl transition-all duration-200 ${
                  isChildActive
                    ? "bg-white/20 backdrop-blur-md font-Montserrat-Bold"
                    : "hover:bg-white/10"
                }`}
              >
                {child}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NavItem;

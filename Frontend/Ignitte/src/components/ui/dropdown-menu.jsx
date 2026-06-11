import { createContext, useContext, useState, useRef, useEffect } from "react";

const DropdownContext = createContext(null);

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children, className = '' }) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext);
  return (
    <div className={`cursor-pointer inline-flex ${className}`} onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children, className = '', align = 'center' }) => {
  const { isOpen } = useContext(DropdownContext);
  if (!isOpen) return null;

  let alignClass = "left-1/2 -translate-x-1/2";
  if (align === "start") alignClass = "left-0";
  if (align === "end") alignClass = "right-0";

  return (
    <div className={`absolute top-full mt-2 z-50 min-w-[8rem] rounded-md border bg-popover text-popover-foreground shadow-md ${alignClass} ${className}`}>
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, className = '', onClick }) => {
  const { setIsOpen } = useContext(DropdownContext);
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={(e) => {
        setIsOpen(false);
        if (onClick) onClick(e);
      }}
    >
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = ({ className = '' }) => (
  <div className={`-mx-1 my-1 h-px bg-muted ${className}`} />
);

export const DropdownMenuLabel = ({ children, className = '' }) => (
  <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
    {children}
  </div>
);

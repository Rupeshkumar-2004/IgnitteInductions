import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shadow-none font-body-md text-body-md">
      {/* Logo */}
      <Link to="/" className="font-headline-md text-headline-md font-bold text-primary-container hover:opacity-90 transition-opacity">
        IgnitteInductions
      </Link>

      <ul className="hidden md:flex gap-stack-lg items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-label-md text-label-md hover:text-primary-container transition-colors duration-200 block ${isActive
                ? "text-primary-container font-bold border-b-2 border-primary-container pb-1"
                : "text-on-surface-variant"
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isAuthenticated ? "/apply" : "/login"}
            className={({ isActive }) =>
              `font-label-md text-label-md hover:text-primary-container transition-colors duration-200 block ${isActive
                ? "text-primary-container font-bold border-b-2 border-primary-container pb-1"
                : "text-on-surface-variant"
              }`
            }
          >
            Apply
          </NavLink>
        </li>
        {isAuthenticated && (
          <li>
            <NavLink
              to={getDashboardLink()}
              className={({ isActive }) =>
                `font-label-md text-label-md hover:text-primary-container transition-colors duration-200 block ${isActive
                  ? "text-primary-container font-bold border-b-2 border-primary-container pb-1"
                  : "text-on-surface-variant"
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
        )}
      </ul>

      {/* Action / Profile Buttons */}
      <div className="flex items-center gap-stack-md">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-on-surface-variant hover:text-primary-container transition-colors duration-200 flex items-center justify-center p-stack-sm cursor-pointer outline-none">
              <span className="material-symbols-outlined select-none text-[28px]">account_circle</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-surface-container border border-outline-variant/30 rounded-xl p-2 shadow-xl">
              <div className="px-3 py-2 text-xs text-on-surface-variant border-b border-outline-variant/20 mb-1">
                Signed in as <span className="font-bold text-on-surface">{user?.fullName}</span>
              </div>
              <DropdownMenuItem className="!p-0 bg-transparent hover:bg-transparent">
                <Link to={getDashboardLink()} className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-variant hover:text-primary-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  Dashboard
                </Link>
              </DropdownMenuItem>
              {user?.role === 'student' && (
                <DropdownMenuItem className="!p-0 bg-transparent hover:bg-transparent">
                  <Link to="/apply" className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-variant hover:text-primary-container transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">assignment</span>
                    Apply Now
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-outline-variant/20 my-1" />
              <DropdownMenuItem onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error-container/20 hover:text-error transition-colors cursor-pointer">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-on-surface-variant hover:text-primary-container text-sm font-label-md px-3 py-1.5 transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-primary-container text-surface font-label-md text-label-md px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
              Join Now
            </Link>
          </div>
        )}

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-on-surface hover:text-primary-container transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 flex flex-col p-4 gap-3 md:hidden z-40">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors text-sm font-label-md block ${isActive ? "text-primary-container font-bold" : "text-on-surface"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={isAuthenticated ? "/apply" : "/login"}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors text-sm font-label-md block ${isActive ? "text-primary-container font-bold" : "text-on-surface"
              }`
            }
          >
            Apply
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 hover:bg-surface-variant rounded-lg transition-colors text-sm font-label-md block ${isActive ? "text-primary-container font-bold" : "text-on-surface"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="px-4 py-2 text-left text-error hover:bg-error-container/20 rounded-lg transition-colors text-sm font-label-md flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 bg-transparent border border-outline text-on-surface font-label-md text-label-md rounded-full hover:bg-surface-variant transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 bg-primary-container text-surface font-label-md text-label-md rounded-full hover:opacity-90 transition-opacity"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
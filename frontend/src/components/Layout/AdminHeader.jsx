import React, { useState, useContext } from 'react';
import { Menu, X, LayoutDashboard, Package, Scissors, Users, FileText, CreditCard, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const isActive = (path) => location.pathname.includes(path) ? "text-brand-maroon font-bold bg-brand-maroon/5 rounded-lg" : "text-gray-600 hover:text-brand-maroon hover:bg-gray-50 rounded-lg";

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Orders', path: '/admin/orders', icon: Package },
        { name: 'Products', path: '/admin/products', icon: Scissors },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'CMS', path: '/admin/cms', icon: FileText },
        { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">

                {/* Brand */}
                <div className="flex items-center gap-3">
                    <Link to="/admin/dashboard" className="text-xl font-serif font-bold text-brand-maroon tracking-wide">
                        Mahalxmi <span className="text-brand-gold">Admin</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 ${isActive(link.path)}`}
                        >
                            <link.icon size={18} />
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="lg:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="flex flex-col p-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 text-base ${isActive(link.path)}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <link.icon size={20} />
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 my-2 pt-2">
                            <button
                                onClick={() => { setIsOpen(false); handleLogout(); }}
                                className="flex items-center gap-3 px-4 py-3 text-red-600 w-full text-left font-medium"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;

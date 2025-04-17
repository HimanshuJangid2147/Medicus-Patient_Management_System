import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    CalendarIcon, UserIcon, TagIcon, CogIcon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAdminStore } from '../../store/useAdminStore';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { admin, adminlogout } = useAdminStore();
    const navigate = useNavigate();

    return (
        <aside className="hidden lg:block w-64 h-full bg-white border-r border-gray-200 flex-shrink-0 shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                    <img src="https://res.cloudinary.com/dkjreh2ll/image/upload/v1744134727/Logoo_rxxq4g.svg" alt="Logo" className="h-8" />
                    <h1 className="text-xl font-bold text-gray-800">&nbsp;Medicus</h1>
                </div>
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/admin/appointments"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-md font-medium w-full text-left ${
                                    isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <CalendarIcon className="h-5 w-5 mr-3" />
                            Appointments
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/categories"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-md font-medium w-full text-left ${
                                    isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <TagIcon className="h-5 w-5 mr-3" />
                            Categories
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/patients"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-md font-medium w-full text-left ${
                                    isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <UserIcon className="h-5 w-5 mr-3" />
                            Patients
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/doctors"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-md font-medium w-full text-left ${
                                    isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <UserIcon className="h-5 w-5 mr-3" />
                            Doctors
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-md font-medium w-full text-left ${
                                    isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <CogIcon className="h-5 w-5 mr-3" />
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="font-bold text-gray-700">{admin?.name?.charAt(0) || 'A'}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{admin?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{admin?.email || 'admin@medicus.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={adminlogout}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
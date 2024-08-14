import React from "react";

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon, isActive, onClick }) => {
  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        className={`flex items-center p-2 rounded-lg dark:text-white group ${isActive ? 'bg-gray-200 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {/* Mostrar texto apenas em telas médias ou maiores */}
        <span className="flex-1 ms-3 whitespace-nowrap hidden md:block">{name}</span>
      </a>
    </li>
  );
};

export default SidebarItem;

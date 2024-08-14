import React, { useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMoon, faSun, faUsers } from "@fortawesome/free-solid-svg-icons";
import { AgentInfo } from "../utils/types";

// Defina o tipo para os itens da sidebar
type SidebarItemType = "Dashboard" | "Agentes";

interface SidebarProps {
  activeItem: SidebarItemType;
  onItemClick: (item: SidebarItemType) => void;
  agentInfo: AgentInfo | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, agentInfo }) => {
  const items: { name: SidebarItemType; icon: JSX.Element }[] = [
    { name: "Dashboard", icon: <FontAwesomeIcon className="w-5 h-5" icon={faHome} /> },
    { name: "Agentes", icon: <FontAwesomeIcon className="w-5 h-5" icon={faUsers} /> },
  ];

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
    setDarkMode(savedDarkMode);
    if (darkMode) {
      document.getElementById("root")?.classList.add("dark");
    } else {
      document.getElementById("root")?.classList.remove("dark");
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  return (
    <div className="w-1/6 bg-gray-100 flex flex-col border-r border-gray-300 rounded-tl-lg rounded-bl-lg dark:bg-neutral-900 dark:text-white">
      <div className="h-full px-3 py-4 flex flex-col justify-between">
        <div>
          <div className="text-center py-4 border-b border-gray-300 flex items-center justify-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white hidden md:block" id="jobName">
              {agentInfo?.job}
            </h2>
          </div>
          <ul className="space-y-2 font-medium mt-4">
            {items.map(({ name, icon }) => (
              <SidebarItem
                key={name}
                name={name}
                icon={icon}
                isActive={activeItem === name}
                onClick={() => onItemClick(name)}
              />
            ))}
          </ul>
        </div>
        <div className="relative mt-auto">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-16 py-3 px-4 flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg text-gray-800 shadow-sm hover:bg-gray-50 dark:text-white dark:hover:bg-neutral-700"
          >
            <FontAwesomeIcon className="w-6 h-6" icon={darkMode ? faSun : faMoon} />
          </button>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;

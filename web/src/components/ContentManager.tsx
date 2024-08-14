import React from "react";
import Dashboard from "./Dasboard";
import Agentes from "./Agentes";
import { Agents, PlayersData } from "../utils/types";

interface ContentManagerProps {
  activeItem: string;
  agents: Agents[];
  playersData: PlayersData[];
  requestAllAgents: () => void;
  requestPlayersData: () => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({ activeItem, requestAllAgents, agents, playersData, requestPlayersData }) => {
  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <Dashboard />;
      case "Agentes":
        return <Agentes requestPlayersData={requestPlayersData} requestAllAgents={requestAllAgents} agents={agents} playersData={playersData} />;
      case "Inbox":
        return <div>Inbox Content</div>;
      case "Users":
        return <div>Users Content</div>;
      case "Products":
        return <div>Products Content</div>;
      default:
        return <div>Select an item from the sidebar</div>;
    }
  };

  return <div className="flex-1 p-4 bg-gray-100 dark:bg-neutral-900">{renderContent()}</div>;
};

export default ContentManager;

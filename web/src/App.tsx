import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ContentManager from './components/ContentManager';
import { PlayersData } from './utils/types';

interface AgentInfo {
  job: string;
  jobString: string;
  nome: string;
}

interface Agent {
  Id: number;
  Nome: string;
  Cargo: string;
  Status: boolean;
}

interface AppProps {
  agentInfo: AgentInfo | null;
  agents: Agent[];
  playersData: PlayersData[];
  requestAgentInfo: () => void;
  requestAllAgents: () => void;
  requestPlayersData: () => void;
}

type SidebarItem = "Dashboard" | "Agentes";

const App: React.FC<AppProps> = ({
  agentInfo,
  agents,
  playersData,
  requestAllAgents,
  requestPlayersData,
}) => {

  const [activeItem, setActiveItem] = useState<SidebarItem>("Dashboard");

  const handleClick = (item: SidebarItem) => {
    setActiveItem(item);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col w-[1200px] h-[700px] bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-1">
          <Sidebar activeItem={activeItem} onItemClick={handleClick} agentInfo={agentInfo} />
          <div className="flex-1 flex flex-col">
            <Topbar agentInfo={agentInfo} />
            <ContentManager playersData={playersData} requestPlayersData={requestPlayersData} agents={agents} requestAllAgents={requestAllAgents} activeItem={activeItem} />
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;

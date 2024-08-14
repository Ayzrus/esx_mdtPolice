import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Agents, AgentInfo, PlayersData } from './utils/types';
import { defaultOptions, fetchWithRetry } from './utils/fetchData';

// Tipos das mensagens NUI que podemos esperar
type NuiMessageAction = 'open' | 'close' | 'updateAgentInfo' | 'updateAgents' | 'updateAllPlayersData';

interface NuiMessage {
  action: NuiMessageAction;
  visible?: boolean;
  data?: AgentInfo | Agents[] | PlayersData[];
}

const RootComponent = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [agents, setAgents] = useState<Agents[]>([]);
  const [playersData, setPlayersData] = useState<PlayersData[]>([]);

  // Função para escutar mensagens NUI
  useEffect(() => {
    const listenForNuiMessages = (callback: (data: NuiMessage) => void) => {
      const eventListener = (event: MessageEvent) => {
        if (event.data && event.data.action) {
          callback(event.data);
        }
      };

      window.addEventListener('message', eventListener);

      // Cleanup function
      return () => {
        window.removeEventListener('message', eventListener);
      };
    };

    listenForNuiMessages((data) => {
      switch (data.action) {
        case 'open':
          if (typeof data.visible === 'boolean') {
            setIsVisible(data.visible);
            if (data.visible) {
              requestAgentInfo();
              requestAllAgents();
              requestPlayersData();
            }
          }
          break;
        case 'close':
          if (typeof data.visible === 'boolean') {
            setIsVisible(data.visible);
          }
          break;
        case 'updateAgentInfo':
          if (data.data && 'nome' in data.data) {
            setAgentInfo(data.data as AgentInfo);
          }
          break;
        case 'updateAgents':
          if (Array.isArray(data.data)) {
            setAgents(data.data as Agents[]);
          }
          break;
        case 'updateAllPlayersData':
          if (Array.isArray(data.data)) {
            setPlayersData(data.data as PlayersData[]);
          }
          break;
        default:
          break;
      }
    });
  }, []);

  const requestAgentInfo = async () => {
    try {
      const data = await fetchWithRetry('getInfoAgent', defaultOptions);
      setAgentInfo(data);
    } catch (error) {
      console.error('Failed to fetch agent info:', error);
    }
  };

  const requestAllAgents = async () => {
    try {
      const data = await fetchWithRetry('getAllAgents', defaultOptions);
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agent info:', error);
    }
  };

  const requestPlayersData = async () => {
    try {
      const data = await fetchWithRetry('getAllPlayersData', defaultOptions);
      setPlayersData(data);
    } catch (error) {
      console.error('Failed to fetch playersData info:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        await fetchWithRetry('close', defaultOptions);
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <StrictMode>
        {isVisible ? (
          <App
            agentInfo={agentInfo}
            agents={agents}
            playersData={playersData}
            requestAgentInfo={requestAgentInfo}
            requestAllAgents={requestAllAgents}
            requestPlayersData={requestPlayersData}
          />
        ) : null}
      </StrictMode>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<RootComponent />);

import React from "react";
import { AgentInfo } from "../utils/types";

interface TopbarProps {
  agentInfo: AgentInfo | null;
}

const Topbar: React.FC<TopbarProps> = ({ agentInfo }) => {

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-4 dark:bg-neutral-900 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <h5 className="text-2xl font-extrabold text-gray-900 dark:text-white flex-1">
          <span id="titleAgent">Olá,</span>
          <small className="ms-2 font-semibold text-gray-500 dark:text-gray-400">
            <strong className="font-semibold text-gray-900 dark:text-white">
              <span id="playerName">{agentInfo?.nome}</span>
            </strong>
          </small>
        </h5>
        <kbd className="min-h-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-white border border-gray-200 font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
          ESC
        </kbd><span className="ml-1 font-semibold text-gray-900 dark:text-white">para fechar</span>
      </div>
      <p className="mb-0 text-sm text-gray-500 dark:text-gray-400" id="jobInfo">{agentInfo?.jobString}</p>
    </div>
  );
};

export default Topbar;

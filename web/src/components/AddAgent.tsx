import React, { useState } from 'react';
import { PlayersData } from '../utils/types';

interface AddAgentProps {
  isOpen: boolean;
  playersData: PlayersData[];
  onClose: () => void; // Added to handle close actions
}

const AddAgent: React.FC<AddAgentProps> = ({ isOpen, onClose, playersData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PlayersData | null>(null);
  console.log(playersData)

  // Toggle dropdown visibility
  const handleToggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // Update search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  // Select item from dropdown
  const handleSelectItem = (item: PlayersData) => {
    setSelectedItem(item);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Filter players based on search term
  const filteredPlayers = playersData.filter(player =>
    player.Nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null; // Render nothing if modal is not open

  return (
    <div
      id="hs-scale-animation-modal"
      className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="hs-scale-animation-modal-label"
      tabIndex={-1}
    >
      <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-xl w-full max-w-lg mx-4 sm:mx-6">
        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
          <h3 id="hs-scale-animation-modal-label" className="text-gray-800 dark:text-white font-bold">
            Contratar um novo Agente.
          </h3>
          <button
            type="button"
            className="text-gray-800 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-full p-2"
            aria-label="Close"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
        </div>
        <div className="p-4 relative">
          <div className="relative">
            <input
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              type="text"
              role="combobox"
              aria-expanded={isDropdownOpen}
              value={searchTerm || (selectedItem ? selectedItem.Nome : '')}
              onClick={handleToggleDropdown}
              onChange={handleSearch}
              placeholder="Search or select a player"
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              aria-expanded={isDropdownOpen}
              onClick={handleToggleDropdown}
            >
              <svg
                className="w-6 h-6 text-gray-500 dark:text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
            </div>
          </div>
          {isDropdownOpen && (
            <div
              className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-neutral-900 dark:border-neutral-700"
            >
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <div
                    key={player.Id}
                    className="cursor-pointer py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200"
                    onClick={() => handleSelectItem(player)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{player.Nome}</span>
                      {selectedItem && selectedItem.Id === player.Id && (
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-2 px-4 text-sm text-gray-600 dark:text-neutral-400">Não foi achado nenhum jogador com esse nome</div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
          <button
            type="button"
            className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            onClick={onClose}
          >
            Fechar
          </button>
          <button
            type="button"
            className="py-2 px-3 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
          >
            Contratar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;

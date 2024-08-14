import React, { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faArrowsRotate, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Agents, PlayersData } from "../utils/types";
import AddAgent from "./AddAgent";

interface AgentesProps {
  agents: Agents[];
  playersData: PlayersData[];
  requestAllAgents: () => void;
  requestPlayersData: () => void;
}

const Agentes: React.FC<AgentesProps> = ({ requestAllAgents, agents, playersData, requestPlayersData }) => {
  const [search, setSearch] = useState<string>("");
  const [cargoSearch, setCargoSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // Estado para gerenciar o bloqueio do botão
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    // Atualizar a contagem total de páginas quando os dados ou o número de itens por página mudar
    const filteredData = agents.filter(player =>
    (player.Nome.toLowerCase().includes(search.toLowerCase()) &&
      player.Cargo.toLowerCase().includes(cargoSearch.toLowerCase()) &&
      (statusFilter === "" ||
        (statusFilter === "online" && player.Status) ||
        (statusFilter === "offline" && !player.Status)))
    );
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [agents, search, cargoSearch, statusFilter, itemsPerPage]);

  const filteredData = agents.filter(player =>
  (player.Nome.toLowerCase().includes(search.toLowerCase()) &&
    player.Cargo.toLowerCase().includes(cargoSearch.toLowerCase()) &&
    (statusFilter === "" ||
      (statusFilter === "online" && player.Status) ||
      (statusFilter === "offline" && !player.Status)))
  );

  const refreshData = () => {
    if (isButtonDisabled) return; // Não faz nada se o botão estiver desabilitado

    setLoading(true);
    setIsButtonDisabled(true); // Bloqueia o botão
    requestAllAgents();

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Reabilita o botão após 1 minuto (60000 ms)
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 60000);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleCargoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCargoSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOpenModal = () => {
    setModalVisible(!modalVisible)
    requestPlayersData()
  }

  const handleCloseModal = () => {
    setModalVisible(!modalVisible)
  }

  return (
    <>
      <div>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                {/* Filtros e Pesquisa */}
                <div className="py-3 px-4 flex items-center gap-4">
                  <div className="flex flex-grow gap-4 items-center">
                    <div className="relative max-w-xs flex-grow">
                      <label className="sr-only">Procurar por Nome</label>
                      <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        className={`py-2 px-3 ps-9 block w-full border border-gray-200 dark:border-neutral-700 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                        placeholder="Procurar por Nome"
                        disabled={loading}
                      />
                      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                        <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="relative max-w-xs flex-grow">
                      <label className="sr-only">Procurar por Cargo</label>
                      <input
                        type="text"
                        value={cargoSearch}
                        onChange={handleCargoChange}
                        className={`py-2 px-3 ps-9 block w-full border border-gray-200 dark:border-neutral-700 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                        placeholder="Procurar por Cargo"
                        disabled={loading}
                      />
                      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                        <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="relative max-w-xs flex-grow">
                      <label htmlFor="status-filter" className="sr-only">Filtrar por Status</label>
                      <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className={`py-2 px-3 block w-full border border-gray-200 dark:border-neutral-700 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
                        disabled={loading}
                      >
                        <option value="">Todos Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <button type="button" className="flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        <span className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                          <span className="sr-only">Loading...</span>
                        </span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={refreshData}
                          type="button"
                          className={`py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={isButtonDisabled}
                        >
                          <FontAwesomeIcon className="shrink-0 size-4" icon={faArrowsRotate} />
                        </button>
                        <button onClick={handleOpenModal} type="button" className="py-3 px-4 flex justify-center items-center size-[46px] text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                          <FontAwesomeIcon className="shrink-0 size-4" icon={faAdd} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden">
                  {loading ? (
                    <div className="flex justify-center items-center h-60">
                      <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                      <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nome</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Cargo</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Status</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-800 dark:divide-neutral-700">
                        {currentItems.map((player, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{player.Nome}</td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{player.Cargo}</td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                              {player.Status ? (
                                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-500 text-white">Online</span>
                              ) : (
                                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-500 text-white">Offline</span>
                              )}
                            </td>
                            <td className="flex justify-center items-center">
                              <button type="button" className="py-2 px-3 mt-1 flex justify-center items-center size-[36px] text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                                <FontAwesomeIcon className="w-3 h-3" icon={faEdit} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="py-1 px-4">
                  <nav className="flex items-center space-x-1" aria-label="Pagination">
                    <button
                      type="button"
                      className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      aria-label="Previous"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      <span aria-hidden="true">«</span>
                      <span className="sr-only">Previous</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`min-w-[40px] flex justify-center items-center text-sm rounded-full py-2.5 ${currentPage === index + 1
                          ? "bg-gray-200 dark:bg-neutral-600 text-gray-800 dark:text-white"
                          : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"} ${index + 1 === totalPages && "mr-2"}`}
                        onClick={() => handlePageChange(index + 1)}
                        aria-current={currentPage === index + 1 ? "page" : undefined}
                        disabled={loading}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      aria-label="Next"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                    >
                      <span className="sr-only">Next</span>
                      <span aria-hidden="true">»</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddAgent isOpen={modalVisible} onClose={handleCloseModal} playersData={playersData} />
    </>
  );
};

export default Agentes;

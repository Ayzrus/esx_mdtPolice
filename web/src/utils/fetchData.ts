type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export const fetchWithRetry = async (
  eventName: string,
  options: FetchOptions = {},
  data: Record<string, any> = {}, // Novo parâmetro para dados a serem enviados
  retries = 1
): Promise<any> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resourceName = (window as any).GetParentResourceName
        ? (window as any).GetParentResourceName()
        : "nui-frame-app";

      // Crie o corpo da requisição com os dados fornecidos
      const fetchOptions: FetchOptions = {
        ...defaultOptions, // Mescla as opções padrão
        ...options, // Sobrescreve com as opções fornecidas
        body: JSON.stringify(data), // Define o corpo da requisição com os dados
      };

      const response = await fetch(
        `https://${resourceName}/${eventName}`,
        fetchOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000)); // Espera 1 segundo antes da próxima tentativa
    }
  }
};

// Default options
export const defaultOptions: FetchOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
};

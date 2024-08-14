// fetchWithRetry.ts

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export const fetchWithRetry = async (
  eventName: string,
  options: FetchOptions,
  retries = 1
): Promise<any> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resourceName = (window as any).GetParentResourceName
        ? (window as any).GetParentResourceName()
        : "nui-frame-app";

      const response = await fetch(
        `https://${resourceName}/${eventName}`,
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed: ${error}`);
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

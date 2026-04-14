export function instrumentAxios(axiosInstance, tracker) {
  // Request interceptor
  axiosInstance.interceptors.request.use((config) => {
    config.metadata = {
      start: performance.now()
    };
    return config;
  });

  // Response interceptor (success)
  axiosInstance.interceptors.response.use(
    (response) => {
      const duration =
        performance.now() - response.config.metadata.start;

      if (tracker.currentPage) {
        tracker.currentPage.apis.push({
          url: response.config.url,
          method: response.config.method?.toUpperCase() || "GET",
          status: response.status,
          success: true,
          duration: Math.round(duration)
        });
      }

      return response;
    },

    // Response interceptor (error)
    (error) => {
      const duration =
        performance.now() -
        (error.config?.metadata?.start || performance.now());

      if (tracker.currentPage) {
        tracker.currentPage.apis.push({
          url: error.config?.url,
          method: error.config?.method?.toUpperCase() || "GET",
          status: error.response?.status || 0,
          success: false,
          duration: Math.round(duration),
          error: error.message
        });
      }

      return Promise.reject(error);
    }
  );
}
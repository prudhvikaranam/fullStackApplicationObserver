import axios from "axios";
import tracker from "../tracker/trackerInstance";

// Create a base instance (no baseURL lock)
const api = axios.create();

export async function apiRequest(config, meta = {}) {


    console.log("API Request:", config);
  const start = performance.now();

  try {
    const res = await api({
      baseURL: config.baseURL,   
      url: config.url,
      method: config.method || "GET",
      headers: config.headers || {},
      data: config.data,
      params: config.params
    });

    const duration = performance.now() - start;

    tracker.currentPage?.apis.push({
      name: meta.name || config.url,
      type: meta.type || "unknown",
      url: (config.baseURL || "") + config.url,
      method: config.method || "GET",
      status: res.status,
      success: true,
      duration: Math.round(duration)
    });

    return res;
  } catch (err) {
    const duration = performance.now() - start;

    tracker.currentPage?.apis.push({
      name: meta.name || config.url,
      type: meta.type || "unknown",
      url: (config.baseURL || "") + config.url,
      method: config.method || "GET",
      status: err.response?.status || 0,
      success: false,
      duration: Math.round(duration),
      error: err.message
    });

    throw err;
  }
}
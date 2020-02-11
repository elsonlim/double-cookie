import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 1000,
});

instance.interceptors.request.use(
  function(config) {
    const xsrfToken = localStorage.getItem("XSRF-TOKEN");

    console.log("xsrfToken from localstorage: ", xsrfToken);
    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = xsrfToken;
    }
    console.log("config", config);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.withCredentials = true;

export default instance;

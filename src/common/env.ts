const NODE_ENV = import.meta.env.MODE === "production" ? "production" : "development";
const PROD_API_ROOT = "https://dulyplan.com";
const UAT_API_ROOT = "https://api.dulyplan.com";
const LOCAL_API_ROOT = "http://local.dulyplan.com:8085";

const normalizeApiRoot = (url: string) => url.replace(/\/+$/, "");

const resolveApiRoot = () => {
  const explicitApiRoot = import.meta.env.VITE_API_ROOT?.trim();
  if (explicitApiRoot) return normalizeApiRoot(explicitApiRoot);

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "local.admin.dulyplan.com"
    ) {
      return LOCAL_API_ROOT;
    }

    if (
      hostname === "test.dulyplan.com" ||
      hostname === "test.admin.dulyplan.com" ||
      hostname.includes("uat")
    ) {
      return UAT_API_ROOT;
    }
  }

  return NODE_ENV === "production" ? PROD_API_ROOT : LOCAL_API_ROOT;
};

const API_ROOT = resolveApiRoot();

export {
  NODE_ENV,
  API_ROOT,
};

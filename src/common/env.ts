const NODE_ENV = import.meta.env.MODE === 'production' ? 'production' : 'development';
const DULYPLAN_PANEL_URL = "https://api.dulyplan.com";
const DULYPLAN_PANEL_URL_LOCAL = "http://local.dulyplan.com:8085";
const API_ROOT =
  NODE_ENV === "production" ? DULYPLAN_PANEL_URL : DULYPLAN_PANEL_URL_LOCAL;

export {
  NODE_ENV,
  API_ROOT,
};

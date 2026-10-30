const isLocal = typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)

/** @type {{ API_BASE_URL: string, APP_URL: string, WHATSAPP_URL: string, INSTAGRAM_URL: string, SITE_URL: string }} */
export const config = {
  // Local preview proxies /public/* via scripts/serve.mjs to avoid CORS.
  API_BASE_URL: isLocal ? '' : 'https://backend.freteq.com.br',
  APP_URL: 'https://app.freteq.com.br',
  WHATSAPP_URL: 'https://wa.me/5561991344563',
  INSTAGRAM_URL: 'https://www.instagram.com/freteq/',
  SITE_URL: 'https://freteq.com.br',
}

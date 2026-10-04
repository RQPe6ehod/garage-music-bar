export async function onRequest(context) {
  const url = new URL(context.request.url);
  const staff = url.searchParams.get('staff');
  const startUrl = staff ? `/bartender.html?staff=${encodeURIComponent(staff)}` : '/bartender.html';
  const manifest = {
    name: "Garage Music Bar — Бар",
    short_name: "Garage Бар",
    start_url: startUrl,
    scope: "/",
    display: "standalone",
    background_color: "#182D34",
    theme_color: "#3FC1E0",
    icons: [
      { src: "/icons/icon-bartender-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-bartender-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-bartender-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-bartender-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" }
  });
}

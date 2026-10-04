export async function onRequest(context) {
  const url = new URL(context.request.url);
  const staff = url.searchParams.get('staff');
  const startUrl = staff ? `/manager.html?staff=${encodeURIComponent(staff)}` : '/manager.html';
  const manifest = {
    name: "Garage Music Bar — Менеджер",
    short_name: "Garage Менеджер",
    start_url: startUrl,
    scope: "/",
    display: "standalone",
    background_color: "#182D34",
    theme_color: "#FDBB00",
    icons: [
      { src: "/icons/icon-manager-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-manager-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-manager-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-manager-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" }
  });
}

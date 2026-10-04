export async function onRequest(context) {
  const url = new URL(context.request.url);
  const staff = url.searchParams.get('staff');
  const startUrl = staff ? `/monitor.html?staff=${encodeURIComponent(staff)}` : '/monitor.html';
  const manifest = {
    name: "Garage Music Bar — Монитор",
    short_name: "Garage Монитор",
    start_url: startUrl,
    scope: "/",
    display: "standalone",
    background_color: "#182D34",
    theme_color: "#A08CFF",
    icons: [
      { src: "/icons/icon-monitor-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-monitor-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-monitor-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-monitor-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" }
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const staff = url.searchParams.get('staff');
  const startUrl = staff ? `/cook.html?staff=${encodeURIComponent(staff)}` : '/cook.html';
  const manifest = {
    name: "Garage Music Bar — Кухня",
    short_name: "Garage Кухня",
    start_url: startUrl,
    scope: "/",
    display: "standalone",
    background_color: "#182D34",
    theme_color: "#FF8A3D",
    icons: [
      { src: "/icons/icon-cook-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-cook-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-cook-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-cook-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" }
  });
}

export const runtime = "nodejs";
export async function GET() {
  return Response.json({ status: "ok", service: "yanhanzi-website", inquiries: "pending_configuration" }, { headers: { "Cache-Control": "no-store" } });
}

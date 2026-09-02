import { getDb } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(request: Request) {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id");

  try {
    await getDb().siteSetting.findFirst({ select: { key: true } });

    console.log(
      JSON.stringify({
        level: "info",
        message: "Health check passed",
        route: "/api/health",
        requestId,
        durationMs: Date.now() - startedAt,
      }),
    );

    return Response.json(
      { status: "ok", checks: { database: "ok" } },
      { status: 200, headers: noStoreHeaders },
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Health check failed",
        route: "/api/health",
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        durationMs: Date.now() - startedAt,
      }),
    );

    return Response.json(
      { status: "unavailable", checks: { database: "unavailable" } },
      { status: 503, headers: noStoreHeaders },
    );
  }
}

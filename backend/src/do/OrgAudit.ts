export class OrgAudit implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname.endsWith("/append")) {
      return new Response(JSON.stringify({ status: "appended", hash: "mock-sha256-hash" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true, name: "OrgAudit" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

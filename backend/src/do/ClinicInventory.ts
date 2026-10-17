export class ClinicInventory implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname.endsWith("/reserve")) {
      return new Response(JSON.stringify({ status: "reserved", timestamp: Date.now() }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST" && url.pathname.endsWith("/dispense")) {
      return new Response(JSON.stringify({ status: "dispensed", timestamp: Date.now() }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true, name: "ClinicInventory" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

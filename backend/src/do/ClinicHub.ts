export class ClinicHub implements DurableObject {
  private state: DurableObjectState;
  private sessions: Set<WebSocket> = new Set();

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader === "websocket") {
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];
      if (!server || !client) {
        return new Response("Failed to establish WebSocket pair", { status: 500 });
      }

      server.accept();
      this.sessions.add(server);

      server.addEventListener("close", () => {
        this.sessions.delete(server);
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response(JSON.stringify({ ok: true, activeConnections: this.sessions.size }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

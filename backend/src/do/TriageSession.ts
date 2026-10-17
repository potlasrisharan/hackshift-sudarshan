export class TriageSession implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname.endsWith("/answer")) {
      return new Response(JSON.stringify({ status: "recorded", nextQuestionId: null }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true, name: "TriageSession" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

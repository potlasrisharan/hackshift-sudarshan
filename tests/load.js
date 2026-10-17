import { check } from "k6";
import http from "k6/http";
export const options = {
  vus: 5,
  duration: "15s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};
export default function () {
  const response = http.get(
    `${__ENV.BASE_URL || "http://127.0.0.1:8787"}/healthz`,
  );
  check(response, { healthy: (r) => r.status === 200 });
}

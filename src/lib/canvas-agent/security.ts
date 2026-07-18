import { createHmac } from "node:crypto";

export function createSafetyIdentifier(request: Request, secret: string) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "unknown";
  const clientIp = forwardedFor.split(",", 1)[0]?.trim() || "unknown";
  const digest = createHmac("sha256", secret).update(clientIp).digest("hex").slice(0, 24);
  return `canvas_${digest}`;
}

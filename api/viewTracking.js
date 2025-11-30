import { Redis } from "@upstash/redis";

export const config = { runtime: "edge" };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req) {
  const pw = req.headers.get("x-admin-password");
  if (pw !== "reset69") return new Response("Unauthorized", { status: 401 });

  const tracking = (await redis.get("tracking")) || {};
  return new Response(JSON.stringify(tracking), { headers: { "Content-Type": "application/json" } });
}

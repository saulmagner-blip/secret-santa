import { Redis } from "@upstash/redis";
export const config = { runtime: "edge" };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req) {
  if (req.method !== "POST") return new Response(JSON.stringify({ ok: false, error: "POST only" }), { status: 405, headers: { "Content-Type": "application/json" } });

  await redis.del("assignments");
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}

import { Redis } from "@upstash/redis";

export const config = { runtime: "edge" };

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    await redis.del("assignments");
    await redis.del("tracking");
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

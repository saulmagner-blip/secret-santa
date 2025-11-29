import { Redis } from "@upstash/redis";
export const config = { runtime: "edge" };
const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req){
  if(req.method!=="POST") return new Response("Method Not Allowed",{status:405});
  await redis.del("assignments");
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json"}});
}

import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export default async function handler(req){
  if(req.method!=="POST") return new Response(JSON.stringify({ok:false,error:"POST required"}),{status:405,headers:{"Content-Type":"application/json"}});
  await redis.del("secret-santa-assignments");
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json"}});
}

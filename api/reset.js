import { Redis } from '@upstash/redis';
export const config = { runtime:'edge' };
const redis = new Redis({ url: process.env.REDIS_URL });

export default async function handler(req){
  if(req.method!=='POST') return new Response(JSON.stringify({ok:false,error:'Method not allowed'}),{status:405});
  try{ await redis.del('secret-santa-assignments'); return new Response(JSON.stringify({ok:true})); }
  catch(err){ return new Response(JSON.stringify({ok:false,error:err.message}),{status:500}); }
}

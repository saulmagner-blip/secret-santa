import { Redis } from '@upstash/redis';
export const config = { runtime: 'edge' };

const EXCLUSIONS = {
  saul: [], jonah: [], aaron: ['gabi'], gabi: ['aaron'],
  kate: ['jim'], jim: ['kate'], helen: ['john'], john: ['helen'], rachel: []
};

const redis = new Redis({ url: process.env.REDIS_URL });

function shuffle(arr){ return arr.map(a=>({sort:Math.random(),value:a})).sort((a,b)=>a.sort-b.sort).map(a=>a.value); }

function createAssignments(names){
  const remaining = new Set(names); const assignment = {};
  function attempt(i){
    if(i>=names.length) return true;
    const giver = names[i]; const blocked = new Set(EXCLUSIONS[giver]||[]); blocked.add(giver);
    const candidates = shuffle([...remaining].filter(r=>!blocked.has(r)));
    for(const c of candidates){ assignment[giver]=c; remaining.delete(c); if(attempt(i+1)) return true; remaining.add(c); delete assignment[giver]; }
    return false;
  }
  return attempt(0)?assignment:null;
}

export default async function handler(req){
  const { searchParams } = new URL(req.url); const name = searchParams.get('name');
  let assignments = await redis.get('secret-santa-assignments');
  if(!assignments){
    const names = Object.keys(EXCLUSIONS); let result = createAssignments(names);
    for(let i=0;i<20&&!result;i++) result=createAssignments(names);
    if(!result) return new Response(JSON.stringify({error:'Failed to generate assignments'}),{status:500});
    assignments=result; await redis.set('secret-santa-assignments',JSON.stringify(assignments));
  } else assignments=JSON.parse(assignments);
  if(!name || !assignments[name.toLowerCase()]) return new Response(JSON.stringify({error:'Invalid name'}),{status:400});
  return new Response(JSON.stringify({assignment:assignments[name.toLowerCase()]}),{headers:{'Content-Type':'application/json'}});
}

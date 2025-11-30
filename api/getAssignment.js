import { Redis } from "@upstash/redis";
export const config = { runtime: "edge" };

const EXCLUSIONS = {
  saul: [], jonah: [], aaron: ["gabi"], gabi: ["aaron"],
  kate: ["jim"], jim: ["kate"], helen: ["john"], john: ["helen"], rachel: []
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.toLowerCase();
  if (!name) return new Response(JSON.stringify({ error: "No name provided" }), { status: 400, headers: { "Content-Type": "application/json" } });

  let assignments = await redis.get("assignments");

  if (!assignments) {
    const names = Object.keys(EXCLUSIONS);
    assignments = generateAssignments(names);
    if (!assignments) return new Response(JSON.stringify({ error: "Could not generate assignments" }), { status: 500, headers: { "Content-Type": "application/json" } });

    await redis.set("assignments", assignments);
  }

  const picked = assignments[name];
  if (!picked) return new Response(JSON.stringify({ error: "No valid assignment" }), { status: 400, headers: { "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ assignment: picked }), { headers: { "Content-Type": "application/json" } });
}

function generateAssignments(names) {
  const remaining = new Set(names);
  const assignment = {};

  function attempt(i) {
    if (i >= names.length) return true;

    const giver = names[i];
    const blocked = new Set(EXCLUSIONS[giver] || []);
    blocked.add(giver);

    const candidates = shuffle([...remaining].filter(r => !blocked.has(r)));

    for (const c of candidates) {
      assignment[giver] = c;
      remaining.delete(c);

      if (attempt(i + 1)) return true;

      remaining.add(c);
      delete assignment[giver];
    }

    return false;
  }

  if (attempt(0)) return assignment;
  return null;
}

function shuffle(arr) {
  return arr.map(a => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map(a => a.value);
}

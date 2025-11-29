// api/draw.js
export default function handler(req, res) {
  const people = ["SAUL","JONAH","AARON","GABI","HELEN","JOHN","RACHEL","KATE","JIM"];
  const exclusions = {
    "SAUL": [], "JONAH": [], "AARON": ["GABI"], "GABI": ["AARON"],
    "HELEN": ["JOHN"], "JOHN": ["HELEN"], "RACHEL": [], "KATE": ["JIM"], "JIM": ["KATE"]
  };

  if (!global.assignments) global.assignments = {};
  const assignments = global.assignments;

  const { name } = req.query;
  if (!name || !people.includes(name)) {
    return res.status(400).json({ error: "Invalid name" });
  }

  if (!assignments[name]) {
    const assignedValues = Object.values(assignments);
    const pool = people.filter(p => 
      p !== name &&
      !exclusions[name].includes(p) &&
      !assignedValues.includes(p)
    );
    if (pool.length === 0) return res.status(400).json({ error: "No valid people left" });
    const picked = pool[Math.floor(Math.random() * pool.length)];
    assignments[name] = picked;
  }

  res.status(200).json({ assigned: assignments[name] });
}

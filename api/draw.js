import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  const { name } = req.query;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const rawData = fs.readFileSync(dataPath);
  const data = JSON.parse(rawData);

  if (data.assignments[name]) {
    res.status(200).json({ assignment: data.assignments[name] });
    return;
  }

  const assigned = Object.values(data.assignments);
  let pool = data.people.filter(
    p => p !== name && !assigned.includes(p) && !data.exclusions[name].includes(p)
  );

  if (pool.length === 0) {
    res.status(400).json({ error: 'No valid people left to assign!' });
    return;
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  data.assignments[name] = picked;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.status(200).json({ assignment: picked });
}

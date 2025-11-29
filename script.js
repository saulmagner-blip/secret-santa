document.addEventListener('DOMContentLoaded', () => {
  const nameSelect = document.getElementById('name');
  const resultDiv = document.getElementById('result');
  const presentImg = document.getElementById('present');
  const lid = document.querySelector('.lid');

  // Names and exclusions
  const people = ["SAUL","JONAH","AARON","GABI","HELEN","JOHN","RACHEL","KATE","JIM"];
  const exclusions = {
    "SAUL": [],
    "JONAH": [],
    "AARON": ["GABI"],
    "GABI": ["AARON"],
    "HELEN": ["JOHN"],
    "JOHN": ["HELEN"],
    "RACHEL": [],
    "KATE": ["JIM"],
    "JIM": ["KATE"]
  };

  let assignments = {};

  // Populate dropdown
  people.forEach(person => {
    const option = document.createElement('option');
    option.value = person;
    option.textContent = person;
    nameSelect.appendChild(option);
  });

  // Handle present click
  presentImg.addEventListener('click', () => {
    const selectedName = nameSelect.value;
    if (!selectedName) {
      alert('Please select your name first.');
      return;
    }

    if (assignments[selectedName]) {
      showResult(assignments[selectedName]);
      return;
    }

    const assignedValues = Object.values(assignments);
    const pool = people.filter(p =>
      p !== selectedName &&
      !exclusions[selectedName].includes(p) &&
      !assignedValues.includes(p)
    );

    if (pool.length === 0) {
      alert('No valid people left to assign!');
      return;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    assignments[selectedName] = picked;
    showResult(picked);
  });

  function showResult(name) {
    lid.classList.add('open-lid');
    setTimeout(() => {
      resultDiv.textContent = `You got: ${name}`;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  }
});

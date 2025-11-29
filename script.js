const nameSelect = document.getElementById('name');
const resultDiv = document.getElementById('result');
const presentImg = document.getElementById('present');
const lid = document.querySelector('.lid');

let peopleData = [];

async function loadNames() {
  const res = await fetch('/api/draw');
  const data = await res.json();
  peopleData = data.people;

  peopleData.forEach(person => {
    const option = document.createElement('option');
    option.value = person;
    option.textContent = person;
    nameSelect.appendChild(option);
  });
}

loadNames();

presentImg.addEventListener('click', async () => {
  const selectedName = nameSelect.value;
  if (!selectedName) {
    alert('Please select your name first.');
    return;
  }

  // call API to get your assigned person
  const res = await fetch(`/api/draw?name=${encodeURIComponent(selectedName)}`);
  const data = await res.json();

  if (data.error) {
    resultDiv.textContent = data.error;
  } else {
    // animate lid
    lid.classList.add('open-lid');

    // wait for lid animation then show result + confetti
    setTimeout(() => {
      resultDiv.textContent = `You got: ${data.assignment}`;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  }
});

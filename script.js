document.addEventListener('DOMContentLoaded', () => {
  const elf = document.getElementById('elf');
  const elfHappy = document.getElementById('elf-happy');
  const nameButtonsContainer = document.getElementById('name-buttons');
  const nameButtons = document.querySelectorAll('.name-button');
  const selectedNameDisplay = document.getElementById('selected-name');
  const speech = document.getElementById('speech');
  const yesBtn = document.getElementById('yes');
  const noBtn = document.getElementById('no');
  const yesNo = document.getElementById('yes-no');
  const resultContainer = document.getElementById('result');
  const resultText = document.getElementById('result-text');

  let selectedName = null;

  function vibrate() { if (navigator.vibrate) navigator.vibrate(50); }

  elf.addEventListener('click', () => {
    vibrate();
    nameButtonsContainer.classList.remove('hidden');
    speech.src = 'assets/speech_hello.png';
    speech.classList.remove('hidden');
    elf.src = 'assets/elf_greeting.png';
  });

  nameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      vibrate();
      selectedName = btn.dataset.name;
      selectedNameDisplay.src = `assets/button_${selectedName.toLowerCase()}.png`;
      selectedNameDisplay.classList.remove('hidden');
      speech.src = 'assets/speech_confirm.png';
      speech.classList.remove('hidden');
      yesNo.classList.remove('hidden');
      nameButtonsContainer.classList.add('hidden');
      resultContainer.classList.add('hidden');
      elfHappy.classList.add('hidden');
      elf.style.display = 'block';
    });
  });

  yesBtn.addEventListener('click', async () => {
    vibrate();
    try {
      const res = await fetch(`/api/getAssignment?name=${selectedName}`);
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      const picked = data.assignment;

      elf.style.display = 'none';
      elfHappy.classList.remove('hidden');
      resultText.src = `assets/result_${picked.toLowerCase()}.png`;
      resultContainer.classList.remove('hidden');

      selectedNameDisplay.classList.add('hidden');
      speech.classList.add('hidden');
      yesNo.classList.add('hidden');
      nameButtonsContainer.classList.add('hidden');
    } catch(err) { alert("Error fetching assignment"); console.error(err); }
  });

  noBtn.addEventListener('click', () => {
    vibrate();
    yesNo.classList.add('hidden');
    selectedNameDisplay.classList.add('hidden');
    speech.src = 'assets/speech_hello.png';
    speech.classList.remove('hidden');
    nameButtonsContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    elfHappy.classList.add('hidden');
    elf.style.display = 'block';
    selectedName = null;
  });

  // Shift+R reset
  document.addEventListener('keydown', async (e) => {
    if (e.shiftKey && e.key.toLowerCase() === 'r') {
      const pw = prompt("Enter admin password to reset assignments:");
      if (pw !== "reset69") { alert("Wrong password!"); return; }
      try {
        const res = await fetch("/api/reset", { method: "POST" });
        const data = await res.json();
        if (data.ok) { alert("Assignments reset!"); location.reload(); }
        else { alert("Reset failed"); }
      } catch(err){ alert("Error resetting assignments"); console.error(err);}
    }
  });
});

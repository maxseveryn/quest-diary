async function addQuest() {
  const input = document.getElementById("quest-input");
  const questText = input.value.trim();
  if (questText === "") return;

  const response = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: questText }),
  });

  if (!response.ok) {
    alert("Failed to add quest");
    return;
  }

  const newQuest = await response.json();
  addQuestToDOM(newQuest.text, newQuest.id);
  input.value = "";
}

function addQuestToDOM(questText, id) {
  const li = document.createElement("li");
  li.textContent = questText;
  li.dataset.id = id;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "quest-buttons";

  const completeBtn = document.createElement("button");
  const completeImg = document.createElement("img");
  completeImg.src = "./assets/icons/quill-pen.png";
  completeImg.alt = "Complete";
  completeImg.classList.add("icon-btn");
  completeBtn.appendChild(completeImg);
  completeBtn.onclick = async () => {
    li.classList.toggle("completed");
    if (li.classList.contains("completed")) {
      completedCount++;
      document.querySelector(".info-block p:last-child").textContent =
        completedCount;
      await saveProfile();

      const id = li.dataset.id;
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        li.remove();
      } else {
        alert("Failed to delete completed quest");
      }
    }
  };

  const deleteBtn = document.createElement("button");
  const deleteImg = document.createElement("img");
  deleteImg.src = "./assets/icons/delete.png";
  deleteImg.alt = "Delete";
  deleteImg.classList.add("icon-btn");
  deleteBtn.appendChild(deleteImg);
  deleteBtn.onclick = async () => {
    const id = li.dataset.id;
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) li.remove();
    else alert("Failed to delete quest");
  };

  buttonsDiv.appendChild(completeBtn);
  buttonsDiv.appendChild(deleteBtn);
  li.appendChild(buttonsDiv);

  document.getElementById("quest-list").appendChild(li);
}

function addCompletedQuestToDOM(questText, id) {
  const li = document.createElement("li");
  li.textContent = questText;
  li.dataset.id = id;
  li.classList.add("completed");

  document.getElementById("completed-quest-list").appendChild(li);
}

let completedCount = 0;

async function loadProfile() {
  const res = await fetch("http://localhost:3000/api/profile");
  const data = await res.json();

  document.querySelector("input[placeholder='Hero name...']").value =
    data.name || "";
  document.querySelector(".age-input").value = data.age || "";
  document.querySelector(".status-value").textContent =
    data.status || "Unknown";
  document.querySelector(".total-quests").textContent = data.completed || 0;

  completedCount = data.completed || 0;
}

async function saveProfile() {
  const name = document
    .querySelector("input[placeholder='Hero name...']")
    .value.trim();
  const age = parseInt(document.querySelector(".age-input").value);

  let status = "Newbie";
  if (completedCount >= 15) status = "King";
  else if (completedCount >= 10) status = "Hero";
  else if (completedCount >= 5) status = "Knight";

  document.querySelector(".status-value").textContent = status;

  const profile = { name, age, status, completed: completedCount };

  await fetch("http://localhost:3000/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}

window.onload = async () => {
  const res = await fetch("http://localhost:3000/api/tasks");
  const quests = await res.json();
  const completedRes = await fetch("http://localhost:3000/api/completed");
  const completedQuests = await completedRes.json();

  loadProfile();

  quests.forEach((q) => addQuestToDOM(q.text, q.id));
  completedQuests.forEach((q) => addCompletedQuestToDOM(q.text, q.id));
};

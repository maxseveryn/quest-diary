function addQuest() {
  const input = document.getElementById("quest-input");
  const questText = input.value.trim();
  if (questText === "") return;

  const li = document.createElement("li");
  li.textContent = questText;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "quest-buttons";

  const completeBtn = document.createElement("button");
  const completeImg = document.createElement("img");
  completeImg.src = "./assets/icons/quill-pen.png";
  completeImg.alt = "Complete";
  completeImg.classList.add("icon-btn");
  completeBtn.appendChild(completeImg);
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
  };

  const deleteBtn = document.createElement("button");
  const deleteImg = document.createElement("img");
  deleteImg.src = "./assets/icons/delete.png";
  deleteImg.alt = "Delete";
  deleteImg.classList.add("icon-btn");
  deleteBtn.appendChild(deleteImg);
  deleteBtn.onclick = () => {
    li.remove();
  };

  buttonsDiv.appendChild(completeBtn);
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(buttonsDiv);

  document.getElementById("quest-list").appendChild(li);
  input.value = "";
}

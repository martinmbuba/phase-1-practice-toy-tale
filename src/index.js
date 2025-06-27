let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");
  const toyFormContainer = document.querySelector(".container");
  const addBtn = document.querySelector("#new-toy-btn");
  let addToy = false;

  const API_URL = "http://localhost:3000/toys";

  // Toggle new toy form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and render all toys
  fetch(API_URL)
    .then(res => res.json())
    .then(toys => toys.forEach(renderToyCard));

  // Create toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add like event
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => handleLike(toy, card));

    toyCollection.appendChild(card);
  }

  // Handle like button
  function handleLike(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`${API_URL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(res => res.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Handle new toy form submit
  addToyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(createdToy => {
        renderToyCard(createdToy);
        e.target.reset();
      });
  });
});

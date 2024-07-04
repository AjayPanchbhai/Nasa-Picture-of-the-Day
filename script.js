const API_KEY = "R7sdb6u0DsrsoZPsnJnmxydINBNKo9SgzjtGaMDa"; // Replace with your actual API key
const API_URL = "https://api.nasa.gov/planetary/apod";

document.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  loadSearchHistory();

  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const date = document.getElementById("search-input").value;
      if (date) {
        getImageOfTheDay(date);
      }
    });
});

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  fetch(`${API_URL}?api_key=${API_KEY}&date=${currentDate}`)
    .then((response) => response.json())
    .then((data) => displayImage(data))
    .catch((error) => console.error("Error fetching current image:", error));
}

function getImageOfTheDay(date) {
  fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`)
    .then((response) => response.json())
    .then((data) => {
      displayImage(data);
      saveSearch(date);
      addSearchToHistory(date);
    })
    .catch((error) => console.error("Error fetching image for date:", error));
}

function displayImage(data) {
  const container = document.getElementById("current-image-container");
  container.innerHTML = `
        <h1>${
          data.date === new Date().toISOString().split("T")[0]
            ? "NASA Picture of the Day"
            : "Picture on " + data.date
        }
        <h1>
        <img src="${data.url}" alt="${data.title}" style="max-width:100%;">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function loadSearchHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach((date) => addSearchToHistory(date));
}

function addSearchToHistory(date) {
  const searchHistory = document.getElementById("search-history");

  // Check if the date already exists in the search history
  const existingItem = Array.from(searchHistory.children).find(
    (item) => item.textContent === date
  );
  if (existingItem) return;

  const listItem = document.createElement("li");
  listItem.textContent = date;
  listItem.addEventListener("click", () => getImageOfTheDay(date));
  searchHistory.appendChild(listItem);
}

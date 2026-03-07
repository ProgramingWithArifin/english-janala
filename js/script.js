const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class = "btn">${el}</span>`);
  return htmlElements.join(" ");
};
const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};
const loadLevels = () => {
manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((levelsJson) => levelsJson.json())
    .then((levels) => displayLevels(levels.data));
};
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
const displayWordDetails = (detail) => {
  const detailsBox = document.getElementById("details-box");
  detailsBox.innerHTML = `
    <div class="">
            <h2 class="text-2xl font-bold">${
              detail.word
            } (<i class="fa-solid fa-microphone-lines-slash"></i> ${
              detail.pronunciation
            })</h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p class="font-bangla">${detail.meaning}</p>
          </div>
          <div class="">
            <h2 class="text-2xl font-bold">Example</h2>
            <p class="font-bangla">${detail.sentence}</p>
          </div>
          <div class="">
            <h2>সমার্থক শব্দগুলো</h2>
           <div class="">
           ${createElements(detail.synonyms)}
           </div>
          </div>
          <div>
            <button class="btn bg-blue-800 text-white rounded-lg">Complete Learning</button>
          </div>
    `;
  document.getElementById("detail_modal").showModal();
  manageSpinner(false);
};
const displayLevels = (lessons) => {

  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="level-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="level-btn btn btn-primary btn-outline"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;
    levelContainer.append(btnDiv);
  }
  manageSpinner(false);
};
const loadLevelWord = (id) => {
  manageSpinner(true);  
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWords(data.data));

  // selected btn
  const allLevelBtn = document.querySelectorAll(".level-btn");
  allLevelBtn.forEach((btn) => {
    btn.classList.remove("btn-active");
  });
  const selectedBtn = document.getElementById(`level-${id}`);
  selectedBtn.classList.add("btn-active");
};
const displayLevelWords = (words) => {

  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="font-bangla text-center col-span-full p-10 space-y-6">
      <img class="mx-auto" src="./assets/alert-error.png" alt="">
      <p class="text-xl font-medium text-gray-600">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
    </div>    
        `;
    return;
  }
  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <div class="text-2xl font-medium font-bangla" >${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}/${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="hover:bg-blue-200 rounded p-2"><i class="fa-solid fa-circle-info"></i></button>
                <button class="hover:bg-blue-200 rounded p-2"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;

    wordContainer.appendChild(card);
    
  }
);
  manageSpinner(false);
};
loadLevels();

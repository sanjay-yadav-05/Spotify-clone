// (async function main() {
//   await loadPLayListCards();
//   await fetchSongList();

//   let currentSong = new Audio();

//   let loadList = document.querySelectorAll(".playListBody ul li");
//   let songName = document.querySelector("#currentSongName");
//   loadList.forEach((item) => {
//     item.addEventListener("click", (e) => {
//       if (e.target.tagName === "LI") {
//         const songPath = item.dataset.song; // Get the song path from the data attribute
//         currentSong.src = `/spotify/songs/${songPath}`; // Set the song path
//         currentSong.play(); // Play the song
//         songName.innerHTML = item.innerText || item.textContent;
//       }
//     });
//   });
// })();

// async function fetchSongList() {
//   try {
//     const response = await fetch("/spotify/songs/");
//     const text = await response.text();

//     // Create a DOM parser
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(text, "text/html");

//     const links = doc.querySelectorAll("table tr td a");

//     const songs = Array.from(links)
//       .map((link) => link.getAttribute("href"))
//       .filter((href) => href && href.endsWith(".mp3"))
//       .map((href) => href.split("\\").pop());
//     // songs.forEach(song => console.log(song));
//     songs.forEach((song) => addListItem(song));
//   } catch (error) {
//     console.error("Error fetching songs:", error);
//   }
// }

// function addListItem(text) {
//   const ulElement = document.querySelector(".playListBody ul");
//   const liElement = document.createElement("li");
//   let songPath = text;
//   liElement.setAttribute("data-song", songPath.replaceAll(" ", "%20"));
//   liElement.innerHTML =
//     `<img class="invert" src="img/musicIcon.svg" alt="">` + text.slice(0, -4);
//   ulElement.appendChild(liElement);
// }

// async function loadPLayListCards() {
//   let playlistDirectory = await fetch("songsPlayLists/songs.json").then(
//     (response) => response.json()
//   );

//   for (let playList of playlistDirectory) {
//     let playlistInfo = await fetch(`songsPlayLists/${playList}/info.json`).then(
//       (response) => response.json()
//     );
//     let card = document.createElement("div");
//     card.className = "card";
//     card.innerHTML = `
//       <img src="/spotify/songsPlayLists/${playList}/cover.jpg" alt="">
//         <div class="playList-playBtn">
//           <svg xmlns="http://www.w3.org/2000/svg" style="height: 110%;" viewBox="0 0 24 24" stroke-width="1.5" fill="#000" class="size-6">
//             <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
//           </svg>
//         </div>
//         <div class="playList-title">${playlistInfo["title"]}</div> <!-- Fixed closing tag -->
//         <p>${playlistInfo["description"]}</p>
//       `;
//     document.querySelector(".main-body").appendChild(card);
//   }
// }




(async function main() {
  await loadPLayListCards();
  await fetchSongList();

  let currentSong = new Audio();
  let songName = document.querySelector("#currentSongName");
  const seekBar = document.getElementById("seekBar");
  const volumeSeekBar = document.getElementById("volumeSeekBar");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");

  // Load songs and attach event listeners to list items
  let loadList = document.querySelectorAll(".playListBody ul li");
  loadList.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.tagName === "LI" || e.target.parentElement.tagName === "LI") {
        const songPath = item.dataset.song; // Get the song path from the data attribute
        currentSong.src = `/spotify/songs/${songPath}`; // Set the song path
        songName.innerHTML = item.innerText || item.textContent;
        // currentSong.play(); // Play the song
        // playPauseButton.src = "img/play.svg"; // Update to play icon
        if (currentSong.paused) {
          currentSong.play();
          playPauseButton.src = "img/pause.svg"; // Update to pause icon
        } else {
          currentSong.pause();
          playPauseButton.src = "img/play.svg"; // Update to play icon
        }
        // Reset seek bar and duration
        seekBar.value = 0;
        updateTimeDisplay(0, currentSong.duration || 0);
      }
    });
  });




  // Buttons
const playPauseButton = document.querySelector(".musicControls img:nth-child(2)"); // Play/Pause button
const muteUnmuteButton = document.querySelector("#timeVolume img"); // Mute/Unmute button

// Play/Pause functionality
playPauseButton.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    playPauseButton.src = "img/pause.svg"; // Update to pause icon
  } else {
    currentSong.pause();
    playPauseButton.src = "img/play.svg"; // Update to play icon
  }
});

// Mute/Unmute functionality
muteUnmuteButton.addEventListener("click", () => {
  if (currentSong.muted) {
    currentSong.muted = false;
    muteUnmuteButton.src = "img/volume.svg"; // Update to volume icon
  } else {
    currentSong.muted = true;
    muteUnmuteButton.src = "img/mute.svg"; // Update to mute icon
  }
});






  // Update seek bar and time display during playback
  currentSong.addEventListener("timeupdate", () => {
    const progress = (currentSong.currentTime / currentSong.duration) * 100 || 0;
    seekBar.value = progress;
    updateTimeDisplay(currentSong.currentTime, currentSong.duration || 0);
  });

  // Seek to a specific position in the song
  seekBar.addEventListener("input", () => {
    if (currentSong.duration) {
      currentSong.currentTime = (seekBar.value / 100) * currentSong.duration;
    }
  });

  // Update volume
  volumeSeekBar.addEventListener("input", () => {
    currentSong.volume = volumeSeekBar.value / 100;
  });

  // Display current time and duration
  function updateTimeDisplay(currentTime, duration) {
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
    };
    currentTimeDisplay.innerHTML = formatTime(currentTime);
    durationDisplay.innerHTML = formatTime(duration);
  }
})();

async function fetchSongList() {
  try {
    const response = await fetch("/spotify/songs/");
    const text = await response.text();

    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const links = doc.querySelectorAll("table tr td a");

    const songs = Array.from(links)
      .map((link) => link.getAttribute("href"))
      .filter((href) => href && href.endsWith(".mp3"))
      .map((href) => href.split("\\").pop());
    songs.forEach((song) => addListItem(song));
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

function addListItem(text) {
  const ulElement = document.querySelector(".playListBody ul");
  const liElement = document.createElement("li");
  let songPath = text;
  liElement.setAttribute("data-song", songPath.replaceAll(" ", "%20"));
  liElement.innerHTML =
    `<img class="invert" src="img/musicIcon.svg" alt="">` + text.slice(0, -4);
  ulElement.appendChild(liElement);
}

async function loadPLayListCards() {
  let playlistDirectory = await fetch("songsPlayLists/songs.json").then(
    (response) => response.json()
  );

  for (let playList of playlistDirectory) {
    let playlistInfo = await fetch(`songsPlayLists/${playList}/info.json`).then(
      (response) => response.json()
    );
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="/spotify/songsPlayLists/${playList}/cover.jpg" alt="">
        <div class="playList-playBtn">
          <svg xmlns="http://www.w3.org/2000/svg" style="height: 110%;" viewBox="0 0 24 24" stroke-width="1.5" fill="#000" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
        </div>
        <div class="playList-title">${playlistInfo["title"]}</div>
        <p>${playlistInfo["description"]}</p>
      `;
    document.querySelector(".main-body").appendChild(card);
  }
}

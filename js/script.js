console.log("hello");
let currentSong = new Audio();
let songs;
let currentFolder = "Arijit_Singh";

function convertSecondsToFormat(seconds) {
  if (isNaN(seconds)) {
    return "00:00";
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    return formattedTime.split(".")[0];
  }
}

async function getSong(folder) {
  try{
    let a = await fetch(`/${folder}/`);
  let response = await a.text();
  // console.log(response)

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as)
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // console.log(songs)

  let songUl = document
    .querySelector(".songPlaylist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `
        <li>
            <img class="invert" src="../svg/music.svg" alt="">
            <div class="info"> 
                <p>${decodeURI(song)}</p>
                <p>${decodeURI(currentFolder)}</p>
            </div>       
            <div class="playbtn">
                <p>playnow</p>
                <img class="invert" src="../svg/play.svg" alt="">
            </div>
        </li>
        `;
  }
  // console.log(songs)

  Array.from(
    document.querySelector(".songPlaylist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", function () {
      // console.log(e.querySelector('.info').firstElementChild.innerHTML)
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
  }

  catch{
    let audio = new Audio('songs/Arijit_singh/Kesariya.mp3')
    audio.play()
  }
}

function playmusic(track, pause = false) {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `songs/${currentFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "../svg/pause.svg";
  }
  document.querySelector(".songname").innerHTML = decodeURI(track);
}

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();

  let cardContainer = document.querySelector(".cardcontainer");
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);

  for (i of array) {
    if (i.href.includes("/songs/")) {
      let folder = i.href.split("/songs/")[1];
      // console.log(folder)

      let songInfo = await fetch(`/songs/${folder}/info.json`);
      let response = await songInfo.json();

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `

            <div class="card" data-folder="${folder}">
                        <div class="playhover">
                            <img class="invert" src="../svg/hover.svg" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>
            `;
    }
  }

  // Load the playlist whenever card is clicked

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log('hey')
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget.dataset.folder);
      currentFolder = item.currentTarget.dataset.folder;
      songs = await getSong(`songs/${currentFolder}`);

      playmusic(songs[0])
    });
  });
}

async function mainFunc() {
  songs = await getSong(`songs/${currentFolder}`);
  // console.log(songs)

  playmusic(songs[0], true);

  await displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "../svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "../svg/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${convertSecondsToFormat(
      currentSong.currentTime
    )}/${convertSecondsToFormat(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 - 0.6 + "%";

    
  });

  document
    .getElementsByClassName("seekbar")[0]
    .addEventListener("click", (e) => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      // console.log(e, percent)
      document.getElementsByClassName("circle")[0].style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100; 
    });

  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.transition = "left 0.9s ease-out";
    document.querySelector(".left").style.left = "0%";
  });

  document.querySelector(".cross").addEventListener("click", (e) => {
    document.querySelector(".left").style.transition = "left 0.9s ease-in";
    document.querySelector(".left").style.left = "-130%";
  });

  previous.addEventListener("click", () => {
    // console.log('prev')
    let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`)[1]);
    // console.log(index)
    if (index > 0) {
      playmusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    // console.log('next')
    let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`)[1]);
    // console.log(index)
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  loudness.addEventListener("change", (e) => {
    // console.log(e.target.value)
    currentSong.volume = e.target.value / 100;
  });
  mute.addEventListener("click", (e) => {
    // console.log('clicked')
    if (currentSong.muted) {
      currentSong.muted = false;
      mute.src = "../svg/volume.svg";
    } else {
      currentSong.muted = true;
      mute.src = "../svg/muted.svg";
    }
  });
}

mainFunc();

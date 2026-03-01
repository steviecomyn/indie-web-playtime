const API_KEY = "16afb36acff91798fdf91aea91948457";
const USERNAME = "kiirohoshi";

async function syncMinidisc() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const track = data.recenttracks.track[0];
    const isPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

    const discElement = document.getElementById("Disc");
    const coverArt = document.getElementById("md-cover-art");
    const titleText = document.getElementById("md-track-title");
    const artistText = document.getElementById("md-artist-name");

    if (track) {
      // 1. Update Cover Art
      // Last.fm #text in index 3 is 'extralarge'
      const artUrl = track.image[3]["#text"] || "fallback-image.jpg";
      coverArt.setAttribute("href", artUrl);

      // 2. Update Label Text (Truncated for the physical label space)
      const cleanTitle = track.name.substring(0, 25).toUpperCase();
      const cleanArtist = track.artist["#text"].substring(0, 28).toUpperCase();

      titleText.textContent = cleanTitle;
      artistText.textContent = cleanArtist;

      // 3. Control Animation
      if (isPlaying) {
        discElement.style.animationPlayState = "running";
        document.getElementById("status").innerText = "Now Playing";
      } else {
        discElement.style.animationPlayState = "paused";
        document.getElementById("status").innerText = "Recently Played";
      }
    }
  } catch (e) {
    console.error("Disc Read Error", e);
  }
}

// Start the loop
syncMinidisc();
setInterval(syncMinidisc, 30000);

let key;
let username;

let x = document.cookie.split("; ").find(row => row.startsWith("key="));
let y = document.cookie.split("; ").find(row => row.startsWith("username="));

if (!x) {
    key = prompt("Please input an API key");
    if (!key) {
        alert("No API key provided");
    } else {
        document.cookie = "key=" + key + "; path=/";
    }
} else {
    key = x.split("key=")[1];
}

if (!y) {
    username = prompt("Please enter username");
    if (!username) {
        alert("No username provided");
    } else {
        document.cookie = "username=" + username + "; path=/";
    }
} else {
    username = y.split("username=")[1];
}

async function stats() {
    const user = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${key}&format=json`);
    if(!user.ok){
        console.error(`user err: ${user.status}`);
    } else {
        var data = await user.json();

        let pfp = data.user.image[3]["#text"];
        document.getElementById("pfp").setAttribute("src", pfp);

        let scrobbles = data.user.playcount;
        document.getElementById("scrobblecount").innerHTML = scrobbles;

        let artists = data.user.artist_count;
        document.getElementById("artistcount").innerHTML = artists;
    }

    const curtrack = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${key}&format=json&limit=1`);
    if(!curtrack.ok) {
        console.error(`track err: ${curtrack.status}`);
    } else {
        var data = await curtrack.json();

        let track = data.recenttracks.track[0].name;
        let artist = data.recenttracks.track[0].artist["#text"];
        console.log(track + " - " + artist);
        document.getElementById("trackname").innerHTML = track;
        document.getElementById("trackartist").innerHTML = artist;

        let url = data.recenttracks.track[0].url;
        document.getElementById("trackname").setAttribute("href", url);
        document.getElementById("trackartist").setAttribute("href", `https://last.fm/music/${artist}`)
    }

    const songs = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${key}&format=json&limit=5&period=7day`);
    if(!songs.ok){
        console.error(`user err: ${songs.status}`);
    } else {
        var data = await songs.json();

        for(let i = 0; i < 5; i++) {
            let img = data.toptracks.track[i].image[3]["#text"];
            let titles = data.toptracks.track[i].name;
            let trackurl = data.toptracks.track[i].url;
            let artists = data.toptracks.track[i].artist.name;

            if(!img) {
                img = "nocover.jpg"
            }
            if(!document.getElementById(i)) {
                let s = document.createElement("a");
                let p = document.createElement("img");
                let t = document.createElement("span");
                s.setAttribute("id", `s${i}`);
                s.setAttribute("href", trackurl)
                p.setAttribute("src", img);
                document.getElementById("songs").appendChild(s);
                t.innerHTML = titles + " - " + artists;
                document.getElementById(`s${i}`).appendChild(t);
                document.getElementById(`s${i}`).appendChild(p);
            }
        }
    }

    const albums = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${key}&format=json&limit=5&period=7day`);
    if(!albums.ok){
        console.error(`user err: ${albums.status}`);
    } else {
        var data = await albums.json();

        for(let si = 0; si < 5; si++) {
            let img = data.topalbums.album[si].image[3]["#text"];
            let titles = data.topalbums.album[si].name;
            let trackurl = data.topalbums.album[si].url;
            let artists = data.topalbums.album[si].artist.name;

            if(!img) {
                img = "nocover.jpg"
            }
            if(!document.getElementById(si)) {
                let b = document.createElement("a");
                let a = document.createElement("img");
                let g = document.createElement("span");
                b.setAttribute("id", si);
                b.setAttribute("href", trackurl)
                a.setAttribute("src", img);
                document.getElementById("albums").appendChild(b);
                g.innerHTML = titles + " - " + artists;
                document.getElementById(si).appendChild(g);
                document.getElementById(si).appendChild(a);
            }
        }
    }
}

stats();
setInterval(() => {
    stats();
}, 30000);

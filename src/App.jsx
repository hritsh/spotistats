import React, { useState, useEffect } from "react";
import "./App.css";
import SpotifyLogo from "./assets/spotify.svg";
import Chart from 'chart.js/auto';

const App = () => {
  const [token, setToken] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  const handleLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const SCOPES = ["user-top-read", "user-read-recently-played"];
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
      "%20"
    )}`;
    window.location = AUTH_URL;
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleLogout = () => {
    setTimeRange("");
    setTopArtists(null);
    setTopTracks(null);
    setToken("");
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (token) {
      try {
        token = JSON.parse(token);
        if (token.expireTime < new Date().getTime()) {
          handleLogout();
        } else {
          token = token.value;
          setToken(token);
        }
      } catch (error) {
        handleLogout();
      }
    } else if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      // set token with time to live of 1 hour
      const now = new Date();
      const time = now.getTime();
      const expireTime = time + 3600 * 1000;
      now.setTime(expireTime);
      const item = {
        value: token,
        expireTime: expireTime,
      };
      window.localStorage.setItem("token", JSON.stringify(item));
    }

    setToken(token);
    setTimeRange("short_term");
  }, []);

  useEffect(() => {
    if (token) {
      fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=" +
          timeRange,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 401) {
            handleLogout();
          }
          return response.json();
        })
        .then((data) => {
          setTopArtists(data.items);
        });

      fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=" +
          timeRange,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 401) {
            handleLogout();
            return null;
          }
          return response.json();
        })
        .then((data) => {
          setTopTracks(data.items);
        });

      // fetch top genres of user
        fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=" +
            timeRange,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => {
            if (response.status === 401) {
              handleLogout();
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            const genres = data.items.map((artist) => artist.genres).flat();
            const genreCounts = {};
            genres.forEach((genre) => {
              if (genreCounts[genre]) {
                genreCounts[genre] += 1;
              } else {
                genreCounts[genre] = 1;
              }
            });
            const genreCountsArray = Object.entries(genreCounts);
            genreCountsArray.sort((a, b) => b[1] - a[1]);
            console.log(genreCountsArray);
            
            // limit to top 15 genres
            const topGenres = genreCountsArray.slice(0, 15);
            // replace values with percentages
            const total = topGenres.reduce((acc, genre) => acc + genre[1], 0);
            topGenres.forEach((genre) => {
              genre[1] = Math.round((genre[1] / total) * 100);
            });
            console.log(topGenres);

            // create chart
            const ctx = document.getElementById("myChart").getContext("2d");

            const labels = topGenres.map((genre) => genre[0]);
            const genreData = topGenres.map((genre) => genre[1]);
            const backgroundColor = labels.map((label) => {
              const color = Math.floor(Math.random() * 16777215).toString(16);
              return "#" + color;
            });

            const myChart = new Chart(ctx, {
              type: "pie",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "Percentage",
                    data: genreData,
                    backgroundColor: backgroundColor,
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      color: "white",
                    },
                  },
                },
              },
            });
          }
        )
    }
  }, [timeRange]);

  return (
    <div className="container">
      <div className="header">
        <h1>Spotistats</h1>
        <img className="logo" src={SpotifyLogo} alt="Spotify Logo" />
      </div>
      {token ? (
        <>
          <div className="options">
            <label className="label">Time Range: </label>
            <select
              className="select"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">All Time</option>
            </select>
          </div>
          <div className="content">
            <div className="column">
              <h2 className="title">Your most played artists were:</h2>
              {topArtists &&
                topArtists.map((artist, i) => (
                  <div className="artist card" key={artist.id}>
                    <div className="rank">{"#" + (i + 1)}</div>
                    <img
                      className="image"
                      src={artist.images[0].url}
                      alt={artist.name}
                    />
                    <h2 className="name">{artist.name}</h2>
                  </div>
                ))}
            </div>
            <div className="column">
              <h2 className="title">Your most played tracks were:</h2>
              {topTracks &&
                topTracks.map((track, i) => (
                  <div className="track card" key={track.id}>
                    <div className="rank">{"#" + (i + 1)}</div>
                    <img
                      className="image"
                      src={track.album.images[0].url}
                      alt={track.name}
                    />
                    <h2 className="name">{track.name}</h2>
                  </div>
                ))}
            </div>
          </div>
          <div className="content">
            <div className="column">
          <h2 className="title">Your top genres were:</h2>
            <canvas id="myChart"></canvas>
            </div>
          </div>
          <button className="login" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <button className="login" onClick={handleLogin}>
          Log in with Spotify
        </button>
      )}
    </div>
  );
};

export default App;

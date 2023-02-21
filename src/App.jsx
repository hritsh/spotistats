import React, { useState, useEffect } from "react";
import "./App.css";
import SpotifyLogo from "./assets/spotify.svg";

const App = () => {
	const [token, setToken] = useState("");
	const [timeRange, setTimeRange] = useState("");
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);

	const handleLogin = () => {
		const CLIENT_ID = "ac72cfd4144844788946cdf6ba488fa1";
		const REDIRECT_URI = "http://localhost:4000/";
		const SCOPES = ["user-top-read"];
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
			token = JSON.parse(token);
			if (token.expireTime < new Date().getTime()) {
				window.localStorage.removeItem("token");
				setToken("");
			} else {
				token = token.value;
			}
		}

		if (!token && hash) {
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
				.then((response) => response.json())
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
				.then((response) => response.json())
				.then((data) => {
					setTopTracks(data.items);
				});
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
							{topArtists.map((artist, i) => (
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
							{topTracks.map((track, i) => (
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

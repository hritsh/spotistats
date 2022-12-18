import React, { useState, useEffect } from "react";
import "./App.css";
import SpotifyLogo from "./assets/spotify.svg";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const App = () => {
	const [timeRange, setTimeRange] = useState("short_term");
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);

	const handleLogin = () => {
		const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
		const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
		const scopes = ["user-top-read"];
		const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes.join(
			"%20"
		)}`;
		window.location = AUTH_URL;
	};

	const handleTimeRangeChange = (event) => {
		setTimeRange(event.target.value);
	};

	const handleLogout = () => {
		setTimeRange("short_term");
		setTopArtists(null);
		setTopTracks(null);
		window.location.hash = "";
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		const access_token = params.get("access_token");
		if (access_token) {
			spotifyApi.setAccessToken(access_token);
			spotifyApi
				.getMyTopArtists({ time_range: timeRange, limit: 10 })
				.then((data) => {
					setTopArtists(data.items);
				})
				.catch((error) => {
					console.log(error);
				});
			spotifyApi
				.getMyTopTracks({ time_range: timeRange, limit: 10 })
				.then((data) => {
					setTopTracks(data.items);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [timeRange]);

	return (
		<div className="container">
			<div className="header">
				<h1>Spotistats</h1>
				<img className="logo" src={SpotifyLogo} alt="Spotify Logo" />
			</div>
			{topArtists && topTracks ? (
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
								<div className="artist card">
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
								<div className="track card">
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

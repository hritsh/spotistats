import React, { useState, useEffect } from "react";
import "./App.css";
import SpotifyLogo from "./assets/spotify.svg";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const App = () => {
	const [mostPlayedArtist, setMostPlayedArtist] = useState(null);

	const handleLogin = () => {
		const CLIENT_ID = "8763ee41b5c8418587a28c5c754d6916";
		const REDIRECT_URI = "http://localhost:4000";
		const scopes = ["user-top-read"];
		const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes.join(
			"%20"
		)}`;
		window.location = AUTH_URL;
	};

	const handleLogout = () => {
		setMostPlayedArtist(null);
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		const access_token = params.get("access_token");
		if (access_token) {
			spotifyApi.setAccessToken(access_token);
			spotifyApi
				.getMyTopArtists()
				.then((data) => {
					const artist = data.items[0];
					setMostPlayedArtist({
						name: artist.name,
						image: artist.images[0].url,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, []);

	return (
		<div className="app">
			<div className="header">
				<h1>Spotistats</h1>
				<img className="logo" src={SpotifyLogo} alt="Spotify Logo" />
			</div>
			{mostPlayedArtist ? (
				<>
					<div className="artist card">
						<h2>Your most played artist is {mostPlayedArtist.name}</h2>
						<img src={mostPlayedArtist.image} alt={mostPlayedArtist.name} />
					</div>
					<button onClick={handleLogout}>Logout</button>
				</>
			) : (
				<button onClick={handleLogin}>Log in with Spotify</button>
			)}
		</div>
	);
};

export default App;

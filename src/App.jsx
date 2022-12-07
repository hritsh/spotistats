import React, { useState, useEffect } from "react";
import "./App.css";
import SpotifyLogo from "./assets/spotify.svg";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const App = () => {
	const [mostPlayedArtist, setMostPlayedArtist] = useState(null);
	const [mostPlayedTrack, setMostPlayedTrack] = useState(null);

	const handleLogin = () => {
		const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
		const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
		const scopes = ["user-top-read"];
		const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes.join(
			"%20"
		)}`;
		window.location = AUTH_URL;
	};

	const handleLogout = () => {
		setMostPlayedArtist(null);
		setMostPlayedTrack(null);
		window.location.hash = "";
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
			spotifyApi.getMyTopTracks().then((data) => {
				const track = data.items[0];
				setMostPlayedTrack({
					name: track.name,
					image: track.album.images[0].url,
				});
			});
		}
	}, []);

	return (
		<div className="container">
			<div className="header">
				<h1>Spotistats</h1>
				<img className="logo" src={SpotifyLogo} alt="Spotify Logo" />
			</div>
			{mostPlayedArtist && mostPlayedTrack ? (
				<>
					<h2 className="title">Your most played artist is:</h2>
					<div className="artist card">
						<img
							className="image"
							src={mostPlayedArtist.image}
							alt={mostPlayedArtist.name}
						/>
						<h2 className="name">{mostPlayedArtist.name}</h2>
					</div>
					<h2 className="title">Your most played track is:</h2>
					<div className="track card">
						<img
							className="image"
							src={mostPlayedTrack.image}
							alt={mostPlayedTrack.name}
						/>
						<h2 className="name">{mostPlayedTrack.name}</h2>
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

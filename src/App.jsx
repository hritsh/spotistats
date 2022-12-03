import { useState } from "react";
import "./App.css";
import SpotifyLogo from "./assets/spotify.svg";

function App() {
	return (
		<div className="App">
			<h1>Spotistats</h1>
			<img className="logo" src={SpotifyLogo} alt="Spotify Logo" />
		</div>
	);
}

export default App;

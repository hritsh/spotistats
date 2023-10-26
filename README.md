# SpotiStats

A simple React app that displays your most played Spotify artists and tracks over different time ranges.

![image](https://user-images.githubusercontent.com/65954042/219965780-45872d3a-ab97-4af3-82ed-4477e0f01646.png)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)

## Features

- Login with Spotify Account
- Display User's Top 10 Most Played Artists with Images
- Display User's Top 10 Most Played Tracks with Cover Art
- Change Time Range of Stats between:
  - Last 4 Weeks
  - Last 6 Months
  - All Time

## Technologies Used

- Vite + React
- Fetch API for Requests
- Spotify Web API
- React Hooks
- GitHub Pages for Deployment

## Getting Started

To get started with this project, you can either directly visit the hosted website at https://hritsh.github.io/spotistats/ and login using your Spotify account, or clone the repository and run the app locally.

To run the app locally, follow these steps:

1. Clone the repository: `git clone https://github.com/hritsh/spotistats.git`
2. Install the dependencies: `npm install`
3. Rename the `.env.example` file to `.env` and replace the placeholder values with your own Spotify client ID and redirect URI.
4. Start the development server: `npm start`

## Usage

Once the development server is running, open your web browser and navigate to `http://localhost:3000` (or whatever port your app is running on) . Click the "Log in with Spotify" button and follow the prompts to authenticate your account.

After you've logged in, the app will display your most played artists and tracks over the last 4 weeks. You can change the time range by clicking on the "Last 4 Weeks" button and selecting a different time range from the dropdown menu.

## Deployment

To deploy this app, follow these steps:

1. Update the `homepage` field in the `package.json` file to match your deployment URL.
2. Build the app: `npm run build`
3. Deploy the contents of the `build` directory to your web server.

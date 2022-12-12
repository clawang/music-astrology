import React, { useState, useEffect } from "react";
import axios from 'axios';
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import SpotifyApi from './spotifyApi';
import SelectionScreen from './SelectionScreen';
import Results from './Results';
import Background from './Background';
import "./App.scss";

const AUTH_TOKEN = 'BQDhSnmlwD-FihJKox73CQ2WFeCsUpS3mTj_Aw7iCtoJ6cydal0cbtkXW-iJfdNO4HYeZSOC-EE5lrehRc93IpxcTMB9nirXuzDyw8uUuseTuyEQE--vzIIrh4cMfjIMVZ-q4ilTWpSHgOwsyI4cLwXHYHdmReZ8GxeyGoMPpKiRGZpy4IX_PybJzR3g';

export default function App() {
  const [state, setState] = useState(0); // 0 is not logged in, 1 is selection, 2 is results
  const [playlists, setPlaylists] = useState(new Array(3)); // 0 is sun, 1 is moon, 2 is rising
  const [ids, setIds] = useState([]);
  const [spotifyApi, setSpotify] = useState(null);

  useEffect(() => {
    var token = hash.access_token;
    //var token = AUTH_TOKEN;
    //console.log(token);
    if (token) {
      setState(1);
      setSpotify(new SpotifyApi(token, axios));
    }
  }, [setState]);

  useEffect(() => {
    if(spotifyApi) {
      getPlaylists();
    }
  }, [spotifyApi]);

  const getPlaylists = async () => {
    const response = await spotifyApi.getPlaylists();
    setPlaylists(response);
  };

  const setPlaylistId = (id, index) => {
    const tempIds = [...ids];
    tempIds[index] = id;
    setIds(tempIds);
  }

  const loadState = () => {
    if (state === 0) {
      return (
          <div className="login">
            <h1>Music Astrology Calculator</h1>
            <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=token&show_dialog=true`}
              >
                <button>Login to Spotify</button>
              </a>
          </div>
        );
    } else if (state === 1) {
      return (
        <SelectionScreen playlists={playlists} setId={setPlaylistId} setState={setState} />
      );
    } else {
      return (
        <Results ids={ids} spotifyApi={spotifyApi} />
      );
    }
  }

  return (
    <>
      <div className="background">
        <Background />
      </div>
      <div className="wrapper">
        <div className="container">
          {loadState()}
        </div>
      </div>
    </>
  );

}


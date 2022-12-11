import React, {useEffect, useState} from 'react';
import {sortGenres, updateObj, propToArr} from './analyzeData';

function Results(props) {

	const [genres, setGenres] = useState([]);
	const [percent, setPercent] = useState(-1);

	useEffect(async () => {
		addPercent(0);
		let results = new Array(3);
		props.ids.forEach(async (id, index) => {
			const genre = await getTracks(id);
			results[index] = genre;
		});
		setGenres(results);
	}, [props.ids]);

	const getTracks = async (id) => {
		const response = await props.spotifyApi.getPlaylistTracks(id);
        let ids = response.data.items.flatMap((song) => {
			if(song.track !== null) {
				return song.track.artists.map(artist => artist.id);
			} else {
				return null;
			}
		});
		ids = ids.filter(id => id !== null);
		return await getArtist([], ids, 0, ids.length);
	}

	const getArtist = async (artists, ids, index, n) => {
		if(index < n) {
			const response = await props.spotifyApi.getArtists(ids.slice(index, index + 50));
			let tempArtists = artists.concat(response.data.artists);
			tempArtists = tempArtists.filter((value, index, self) => self.findIndex((item) => value.id === item.id) === index);
			return await getArtist(tempArtists, ids, index+50, n);
		} else {
			return calcGenre(artists);
		}
	}

	const calcGenre = (artists) => {
		const genres = {};
		artists.forEach((artist) => {
			artist.genres.forEach(g => {
				updateObj(genres, g);
			});
		});
		let str = '';
        let newGenres = {};

		if(Object.keys(genres).length > 0) {
	        newGenres = sortGenres(genres);
	        str = newGenres[0][0];
		} else {
			str = "N/A";
		}
		return str;        
	}

	const addPercent = (current) => {
		setPercent(current+1);
		if(current < 110) {
			setTimeout(() => {
			    addPercent(current+1);
			}, 15);
		}
	}

	if (percent < 110 || !genres) {
		return (
			<div>
				<p>Loading... ({Math.min(percent, 100)}%)</p>
				<div className="loading-bar">
					<div className="loading-bar-inner"></div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="results">
				<div className="sun-sign">
					<h3>Your music sun sign is:</h3>
					<h1>{genres[0]}</h1>
				</div>
				<div className="moon-sign">
					<h3>Your music moon sign is:</h3>
					<h1>{genres[1]}</h1>
				</div>
				<div className="rising-sign">
					<h3>Your music rising sign is:</h3>
					<h1>{genres[2]}</h1>
				</div>
			</div>
		);
	}
}

export default Results;
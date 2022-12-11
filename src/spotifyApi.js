const ROOT_URL = "https://api.spotify.com/v1/";

export default class SpotifyApi {
	constructor(token, axios) {
		this.token = token;
		this.axios = axios;
		this.headers = {
			"Authorization": "Bearer " + token,
		};
	}

	async getCurrentlyPlaying() {
		return await this.axios.get(`${ROOT_URL}me/player/currently-playing`, { headers: this.headers });
	}

	async getPlaylists() {
		let items = [];
		return await this.getMorePlaylists(`${ROOT_URL}me/playlists`, items);
	}

	async getMorePlaylists(nextUrl, items) {
		let tempItems = [];
		const response = await this.axios.get(nextUrl, {headers: this.headers, params: {limit: 20}});
		if(response.data.items) {
			tempItems = items.concat(response.data.items);
		}
		if(response.data.next) {
			return await this.getMorePlaylists(response.data.next, tempItems);
		} else {
			return tempItems;
		}
	}

	async getPlaylist(id) {
		return await this.axios.get(`${ROOT_URL}playlists/${id}`, { headers: this.headers });
	}

	async getPlaylistTracks(id) {
		return await this.axios.get(`${ROOT_URL}playlists/${id}/tracks`, { headers: this.headers });
	}

	async getArtists(ids) {
		return await this.axios.get(`${ROOT_URL}artists`, { headers: this.headers, params: {ids: ids.toString()} });
	}
};
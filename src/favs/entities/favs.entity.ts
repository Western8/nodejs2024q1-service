export interface IFavs {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export class Favs {
  artist: string[]; // favorite artists ids
  album: string[]; // favorite albums ids
  track: string[]; // favorite tracks ids

  constructor(params) {
    this.artist = params.artists;
    this.album = params.albums;
    this.track = params.tracks;
  }
}

export interface IFavsRes {
  code: number;
  message?: string;
  favs?: Record<string, any>;
}

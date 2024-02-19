import { Album } from "src/album/entities/album.entity";
import { Artist } from "src/artist/entities/artist.entity";
import { IFavs } from "src/favs/entities/favs.entity";
import { Track } from "src/track/entities/track.entity";
import { User } from "src/user/entities/user.entity";

export interface IDb {
  users: User[],
  artists: Artist[],
  albums: Album[],
  tracks: Track[],
  favs: IFavs,
}

export const db = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favs: {
    artists: [],
    albums: [],
    tracks: [],
  },
}

export const favsDb = {
  artist: 'artists',
  album: 'albums',
  track: 'tracks',
}

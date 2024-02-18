import { Album } from "src/album/entities/album.entity";
import { Artist } from "src/artist/entities/artist.entity";
import { Track } from "src/track/entities/track.entity";
import { User } from "src/user/entities/user.entity";

export interface IDb {
  users: User[],
  artists: Artist[],
  albums: Album[],
  tracks: Track[],
}

export const db = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
}
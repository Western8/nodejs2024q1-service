export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null;

  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.year = params.year;
    this.artistId = params.artistId;
  }
}

export interface IAlbumRes {
  code: number,
  message?: string,
  album?: Record<string, any>,
}

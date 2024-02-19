export class Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.artistId = params.artistId;
    this.albumId = params.albumId;
    this.duration = params.duration;
  }
}

export interface ITrackRes {
  code: number;
  message?: string;
  track?: Record<string, any>;
}

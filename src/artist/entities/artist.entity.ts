export class Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;

  constructor(params) {
    this.id = params.id;
    this.name = params.name;
    this.grammy = params.grammy;
  }
}

export interface IArtistRes {
  code: number;
  message?: string;
  artist?: Record<string, any>;
}

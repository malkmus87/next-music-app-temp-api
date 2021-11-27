export interface DetailedArtistPayload {
    name:string;
    lifeSpan:any;
    beginArea:any;
    biography:ArtistBiography;
    lastFmStats:any;
    endingArea:any;
    area:any;
    type:string;
}
// The payload used in search
export interface ArtistPayload {
    musicBrainzID:string;
    name:string;
    country:any;
    beginArea:string;
    lifeSpan:any;
}

interface ArtistBiography {
    content:string;
    summary:string;
}


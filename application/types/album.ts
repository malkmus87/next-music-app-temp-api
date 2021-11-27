export interface AlbumResourceRelation{
    type:string;
    url:string;
    id?:string;
}
export interface PreparedMusicBrainzAlbum{
    musicbrainzID:string,
    title:string,
    disambiguation:string;
    relations:Array<AlbumResourceRelation>;
    releaseDate:string;
    primaryType:string;
}
export interface DiscogsMasterData{
    
}
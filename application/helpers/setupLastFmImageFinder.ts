function cleanString(string:string) : string  { 
    return string.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
}

function findLastFmAlbumsWithTitle( albumTitle:string, lastFmAlbums:Array<any> ): Array<any> {
    return lastFmAlbums.filter( ( lastFmAlbum:any ) => 
        cleanString(lastFmAlbum.name)
            .includes( cleanString(albumTitle)) 
    )
}

function pickImageFromFirstAlbum( albums:Array<any> ) : Array<any> {
    return albums.length > 0 ? albums[0].image:[];
}
    
export const findLastFmData : Function = ( lastFmAlbums:any ) : any => 
    (albumTitle:string) => 
        pickImageFromFirstAlbum( findLastFmAlbumsWithTitle(albumTitle,lastFmAlbums) )
;
export const setupLastFmDataAdder : Function = (lastFmAlbums:any) : any => 
    (album:any) : any => ({
        ...album,
        image:findLastFmData(lastFmAlbums)(album.title) 
    })
;


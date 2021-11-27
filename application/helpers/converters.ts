import {AlbumResourceRelation,PreparedMusicBrainzAlbum} from '../types/album';
export function convertArea({name, id,disambiguation,type, ...rest}:any){
    return ({
        name,
        musicbrainzID:id,
        disambiguation,
        musicbrainzType:type,
        musicbrainzTypeID:rest['type-id'],
    })
}
export function convertImage(image:any){
    return({
        source:image['#text'],
        size:image.size
    })
}
export function convertArtistMinimized({id,name,country,...rest}:any){ 
    return ({
        musicBrainzID:id,
        name,
        country,
        beginArea:rest['begin-area']!== undefined ? rest['begin-area'].name:null,
        lifeSpan:rest['life-span']
    });
}
export function convertAlbumListItem({id,disambiguation,title,image,...rest}:any){
    return ({
        musicBrainzID:id,
        title,
        disambiguation,
        images:image !== null ? image.map((image:any) => convertImage(image)):[],
        releaseDate:rest['first-release-date']
    });
}
const setTypeOnRelation:Function = (relation:any) => {
    if(relation.type==='other databases' && relation.url !== undefined){
        if(relation.url.resource.includes('rateyourmusic')) return ({...relation,type:'rateyourmusic'});
        if(relation.url.resource.includes('musik-sammler')) return ({...relation,type:'musik-sammler'});
        if(relation.url.resource.includes('musicmoz')) return ({...relation,type:'musicmoz'});
    }
    return relation;
}

function convertResourceRelation(relation:any):AlbumResourceRelation{
    
    if(relation.type==='discogs' || relation.type === 'allmusic' || relation.type === 'wikidata') return ({
        type:relation.type,
        id:relation.url.resource.split('/')[4],
        url:relation.url.resource
    });
    else return ({
        type:relation.type,
        url:relation.url.resource
    });
}

export function convertMusicBrainzAlbum({id,disambiguation,relations,title, ...rest}:any) : PreparedMusicBrainzAlbum {
    return({
        musicbrainzID:id,
        title,
        disambiguation,
        relations:relations
            .map((relation:any) => convertResourceRelation(setTypeOnRelation(relation)))
        ,
        releaseDate:rest['first-release-date'],
        primaryType:rest['primary-type']
    });
}
interface DiscogsMasterData{
    id:string;
    lowestPrice:number;
    numberForSale:number;
    year:number;
    videos:Array<any>;
    trackList:Array<any>;

}
export function convertDiscogsData({id,tracklist,year,videos,...rest}:any):DiscogsMasterData{
    return({
        id:id,
        lowestPrice:rest['lowest_price'],
        numberForSale:rest['number_for_sale'],
        year,
        videos,
        trackList:tracklist
    })
}



import {prepareResponseFiner as prepareResponse,prepareListResponseFiner as prepareListResponse} from '../helpers/prepareListResponse';
function setupMusicBrainzRequest(){
    let JsonRequestHandler:Function = require('../helpers/JsonRequestHandler.js');
    let request = JsonRequestHandler({
        mainPath:'https://musicbrainz.org/ws/2',
        params:{ fmt:'json' },
        mode:'no-cors'
    });
    return ({
        ...request,
        searchArtist: async ( artist : string ) => await request.get('artist',{ query:artist }),
        getArtistByID: async (id:string ) => await prepareResponse({
          response: await request.get(`artist/${id}`),
          transform:( data:any ) => data,
          defaultValue:{}
        }),
        getAlbumsForArtist: async (artistID : string) => prepareListResponse({
          response: await request.get('release-group',{ artist:artistID,limit:"200",type:'album' }),
          transform: (data:any) => data['release-groups']
        }),
        getAlbumByID: async (id : string) => await prepareResponse({
          response: await request.get(`release-group/${id}`,{inc:"url-rels"}),
          transform: (data:any) => data,
          defaultValue:{}
        }),
    });
};
const prepareMusicbrainzRequest = function(req:any,res:any,next:any){
    res.MusicbrainzResource = setupMusicBrainzRequest();
    next()
} 
export default prepareMusicbrainzRequest;

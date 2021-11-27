const JsonRequest = require('../helpers/JsonRequestHandler.js');
import {prepareListResponseFiner as prepareListResponse,prepareResponse} from '../helpers/prepareListResponse';

function setupLastFMrequest(lastFMrequest:any){
    return ({
        ...lastFMrequest,
        getInfo:async ( musicBrainzID:string ) => prepareResponse(await lastFMrequest.get('',{ method:'artist.getinfo', mbid:musicBrainzID }), (data:any) => data.artist, {}),
        searchArtist:async (artist:string) => {  
            return await prepareResponse( 
                await lastFMrequest.get('',{ method:'artist.search', artist:artist }),
                (responseBody:any) => responseBody.results.artistmatches.artist,
                []
            )
        },
        getTopAlbumsForMbArtist: async (musicbrainzID:string) => await prepareListResponse({
          response: await lastFMrequest.get('' ,{ 
            method:'artist.gettopalbums', 
            mbid:musicbrainzID,limit:300 
          }),
          transform: (data:any) => data.topalbums !== undefined ? data.topalbums.album:[]
        })
    });
}

const prepareLastFMrequest = function(req:any,res:any,next:any){
    res.LastFmResource = setupLastFMrequest(
        JsonRequest({
            mainPath:'https://ws.audioscrobbler.com/2.0',
            params:{
                api_key:'b67605f66477999b651bbcc6ec08c0e2',
                format:'json'     
            },
            mode:'no-cors'
        })
    );
    next()
} 
export default prepareLastFMrequest;

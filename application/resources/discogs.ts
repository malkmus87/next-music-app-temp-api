const JsonRequest = require('../helpers/JsonRequestHandler.js');
import {prepareListResponse,prepareResponse} from '../helpers/prepareListResponse';

function setupDiscogsrequest(discogsRequest:any){
    return ({
        ...discogsRequest,
        getMasterAlbumWithID: (id:string) => discogsRequest.get(`masters/${id}`)
    });
}
const prepareDiscogsrequest = function(req:any,res:any,next:any){
    res.DiscogsResource = setupDiscogsrequest(
        JsonRequest({
            mainPath:'https://api.discogs.com',
            headers:{
                key:'xTifnlmMizkFsxGVnjnR',
                secret:'eSRQerNflgoMdeFHajUpuzdOkguISFwt'    
            }
        })
    );
    next()
} 
export default prepareDiscogsrequest;
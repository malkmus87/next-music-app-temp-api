import express from 'express';
import {PreparedResponse,PreparedListResponse} from '../types/general';
import {DetailedArtistPayload,ArtistPayload} from '../types/artist';
import { convertArtistMinimized } from '../helpers/converters';
import {prepareListResponseFiner as prepareListResponse,prepareResponseFiner as prepareResponse} from '../helpers/prepareListResponse';
import combineLastFmAndMusicbrainzData from '../helpers/combineLastFmAndMusicbrainzData';
import setupMusicbrainzRequest from '../resources/musicbrainz';
import setupLastFmRequest from '../resources/lastfm';

const router = express.Router();

router.get('/search',setupMusicbrainzRequest,async (req:any,res:any) => {
    try {
        const queriedArtist:string = req.query.name ? req.query.name: "";
        const musicBrainzResponse:PreparedListResponse = await prepareListResponse({
            response:await res.MusicbrainzResource.searchArtist(queriedArtist),
            transform:(data:any) => data.artists    
        });
        const returnedPayload:Array<ArtistPayload> = musicBrainzResponse.data.map(convertArtistMinimized);   
        res.status(musicBrainzResponse.status).json(returnedPayload);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})



router.get('/:id',setupMusicbrainzRequest,setupLastFmRequest,async (req:any,res:any) => {

    const musicBrainzResult:PreparedResponse = await res.MusicbrainzResource.getArtistByID(req.params.id);
    const lastFmResult:PreparedResponse = await res.LastFmResource.getInfo(req.params.id);

    const returnedPayload:DetailedArtistPayload = combineLastFmAndMusicbrainzData({
        lastFmData:lastFmResult.data,
        musicbrainzData:musicBrainzResult.data
    });
    console.log(musicBrainzResult.data);
    res.status(musicBrainzResult.status)
        .json(returnedPayload)
    ;
})
module.exports = router;
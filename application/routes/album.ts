import express from 'express';
const router = express.Router();

import setupMusicbrainzRequest from '../resources/musicbrainz';
import setupLastFmRequest from '../resources/lastfm';
import setupDiscogsRequest from '../resources/discogs';
import {PreparedListResponse,PreparedResponse} from '../types/general';

import {setupLastFmDataAdder} from '../helpers/setupLastFmImageFinder';
import {prepareListResponseFiner as prepareListResponse, prepareResponseFiner as prepareResponse} from '../helpers/prepareListResponse';
import {convertAlbumListItem,convertMusicBrainzAlbum,convertDiscogsData} from '../helpers/converters';
/*
    
*/
router.get('/forArtist/:id',setupMusicbrainzRequest,setupLastFmRequest,async (req:any,res:any) => {
    
    const musicBrainzResult:PreparedListResponse =  await res.MusicbrainzResource.getAlbumsForArtist(req.params.id);
    const lastFmResult:PreparedListResponse = await res.LastFmResource.getTopAlbumsForMbArtist(req.params.id);
    
    const addDataFromLastFm:any = setupLastFmDataAdder(lastFmResult.data);

    function onlyLPs( album: any ) : boolean {
      return album['secondary-types'].length === 0;
    }

    const musicBrainzAlbums:Array<any> = musicBrainzResult.data
        .filter(onlyLPs)
        .map(addDataFromLastFm)
        .map(convertAlbumListItem)
    ;
    res.status(musicBrainzResult.status).json(
        musicBrainzAlbums
    );
})
router.get('/:id',setupMusicbrainzRequest,setupLastFmRequest, setupDiscogsRequest, async (req:any,res:any) => {
  try{
    const musicBrainzResult:PreparedResponse = await res.MusicbrainzResource.getAlbumByID(req.params.id);
    const preparedMusicBrainzResult = convertMusicBrainzAlbum(musicBrainzResult.data);
    const discogsID = preparedMusicBrainzResult.relations.filter((relation:any) => relation.type === 'discogs')[0]?.id;
    const discogsResult = discogsID ? 
        await prepareResponse({
            response: await res.DiscogsResource.getMasterAlbumWithID(discogsID),
            transform:(data:any) => data,
            defaultValue:null
        })
        :
        null
    ;
    res.status(200).json({
        ...preparedMusicBrainzResult,
        ...{ discogsData:convertDiscogsData(discogsResult.data) }
    });
  } catch(error) {
    res.status(500).json({
      message: 'Something went wrong'
    })
  }
})
module.exports = router;

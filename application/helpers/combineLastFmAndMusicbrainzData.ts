import {convertArea} from './converters';
interface FunctionProps{
    lastFmData:any;
    musicbrainzData:any;
}
export default function combineLastFmAndMusicbrainzData({lastFmData,musicbrainzData}:FunctionProps){
    return({
        name:musicbrainzData.name,
        lifeSpan:musicbrainzData['life-span'],
        beginArea:musicbrainzData['begin_area'] !== null ? convertArea(musicbrainzData['begin_area']):null,
        biography:{
            summary:lastFmData?.bio?.summary,
            content:lastFmData?.bio?.content
        },
        lastFmStats:lastFmData?.stats,
        endingArea:musicbrainzData['end_area'] !== null ? convertArea(musicbrainzData['end_area']):null,
        area:musicbrainzData['area'] !== null ? convertArea(musicbrainzData['area']):null,
        type:musicbrainzData.type,
        musicbrainzID: musicbrainzData.id,
    });
}
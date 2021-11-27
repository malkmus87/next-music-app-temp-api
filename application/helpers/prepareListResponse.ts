interface ResponseReturnProps{
    status:number,
    data:any
};
const prepareResponse:Function = async (response:any,getDataFromResponseBody:Function,defaultValue:any) => {
    if(response.status >= 200 && response.status < 300) return ({
            status:200,
            data:getDataFromResponseBody( await response.json() )
    });
    else return ({
        status:response.status,
        data:defaultValue
    });
}
const prepareListResponse:Function = async (response:any,getDataFromResponseBody:Function) => {
    let defaultValue:Array<any> = []; 
    return await prepareResponse(response,getDataFromResponseBody,defaultValue);

}
interface PrepareResponseProps{
    response:any;
    transform:Function;
    defaultValue:any;
}
const prepareResponseFiner:Function = async ({response,transform,defaultValue}:PrepareResponseProps) => {
    if(response.status >= 200 && response.status < 300) return ({
            status:200,
            data:transform( await response.json() )
    });
    else return ({
        status:response.status,
        data:defaultValue
    });
}
interface PrepareListResponseProps{
    response:any;
    transform:Function;
}
const prepareListResponseFiner: Function = ({response,transform}:PrepareListResponseProps) => 
    prepareResponseFiner({response,transform,defaultValue:[]})
;
export {prepareListResponse,prepareResponse,prepareResponseFiner,prepareListResponseFiner};
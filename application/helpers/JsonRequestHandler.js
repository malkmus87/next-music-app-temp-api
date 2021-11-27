const fetch = require('node-fetch');
const defaultObject = (object) => typeof object==='object' ? object:{};
const setResponseHandler = (handleResponse) =>
  handleResponse !== undefined ? handleResponse : (response) => response
;
const setUrl = (url, params) => url + new URLSearchParams(params);
const combineParams = (parametersForThisRequest,params) => ( 
  { ...defaultObject(parametersForThisRequest), ...defaultObject(params) } 
);

const JsonRequest = ({ mainPath, headers, handleResponse,params }) => {
  const options = {
    mainPath: mainPath,
    headers: {
      "Content-Type": "application/json",
      ...defaultObject(headers)
    }
  }

  return ({
    post: async (to, parametersForThisRequest) => 
      responseWrapper(`${mainPath}/${to}`,{ 
        ...options,body:JSON.stringify(parametersForThisRequest.body),method:"post"
    }),
    get: async (from,parametersForThisRequest) => 
      responseWrapper(
        setUrl( `${mainPath}/${from}?` , combineParams(parametersForThisRequest,params) ), 
          {...options,method:"get"}, 
        handleResponse
    ),
    getByID: async (from,parametersForThisRequest) => 
      responseWrapper(
        setUrl( 
          `${mainPath}/${from}?`, 
          combineParams(parametersForThisRequest,params) 
        ), 
        { ...options, method:"get" }, 
        handleResponse
    ),
    deleteByParameters: async (from,parametersForThisRequest) => 
      responseWrapper(
        setUrl( `${mainPath}/${from}?` , combineParams(parametersForThisRequest,params) ), 
        {...options,method:"delete"}, 
      handleResponse
    )
  })
};


async function responseWrapper(url,options, handleResponse) {
  try {
    return await setResponseHandler(handleResponse)( await fetch(url,options) );
  } catch (error) {
    return { status: 500, body: null };
  }
}

module.exports=JsonRequest;
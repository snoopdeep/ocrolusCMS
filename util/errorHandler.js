export const errorHandler=(statusCode,message)=>{
    const error=new Error();
    console.log('errorHandler.js',error);
    error.statusCode=statusCode||500;
    error.message=message||"Internal Server Error";
    return error;
}
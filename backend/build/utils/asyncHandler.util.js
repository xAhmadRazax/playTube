export const asyncHandler = (requestHandler) => (req, res, next) => {
    // // Promise.resolve ensures the handler always returns a Promise, even if it's not async
    Promise.resolve(requestHandler(req, res, next)).catch(next);
};
/*

export const asyncHandler = async(fn)=>{
try
{

await fn(req,res,next)
}catch(err){
res.status(err.code || 500).json({
success:false,message:err.message})
}


}

*/

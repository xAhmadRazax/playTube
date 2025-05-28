import { Request, Response, NextFunction } from "express";
export const asyncHandler =
  (
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
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

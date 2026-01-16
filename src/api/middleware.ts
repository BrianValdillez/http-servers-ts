import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";

export function middlewareLogResponses(req: Request, res:Response, next: NextFunction){
    res.on('finish', () => {
        let status = Math.floor(res.statusCode / 100);
        if (status != 2){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });

    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    next();
}

// 400
export class BadRequestError extends Error{
    constructor(message: string){
        super(message);
    }
}

// 401
export class UnauthorizedError extends Error{
    constructor(message: string){
        super(message);
    }
}

// 403
export class ForbiddenError extends Error{
    constructor(message: string){
        super(message);
    }
}

// 404
export class NotFoundError extends Error{
    constructor(message: string){
        super(message);
    }
}

export function middlewareErrorHandler(err: Error, req: Request, res: Response,next:NextFunction){
    console.log(`Error Handler: ${err.message}`);

    let code = 500;
    let message = err.message;

    if (err instanceof BadRequestError){
        code = 400;
    }
    else if (err instanceof UnauthorizedError){
        code = 401;
    }
    else if (err instanceof ForbiddenError){
        code =  403;
    }
    else if (err instanceof NotFoundError)
    {
        code = 404;
    }
    else{
        message = "Internal server error";
    }

    respondWithError(res, code, message);
}
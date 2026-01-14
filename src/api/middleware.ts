import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

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
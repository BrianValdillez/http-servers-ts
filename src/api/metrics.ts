import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerMetricsDisplay(req: Request, res: Response){
    res.set({
      'Content-Type': 'text/html',
      'charset': 'utf-8',
    });

    res.status(200).send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export function resetMetrics(): boolean{
    config.api.fileserverHits = 0;

    return true;
}
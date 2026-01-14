import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerChirpValidation(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

   // req.body is automatically parsed
  const params: parameters = req.body;
  const body:string = params?.body;
  if (!body || typeof body !== 'string'){
    respondWithError(res, 400, "Invalid JSON");
    return;
  }

  if(body.length > 140){
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  respondWithJSON(res, 200, { valid: true });    
}
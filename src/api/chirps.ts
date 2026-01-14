import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerChirpValidation(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

   // req.body is automatically parsed
  const params: parameters = req.body;
  let body:string = params?.body;
  if (!body || typeof body !== 'string'){
    respondWithError(res, 400, "Invalid JSON");
    return;
  }

  body = cleanMessage(body);

  if(body.length > 140){
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  respondWithJSON(res, 200, { cleanedBody: body });    
}

const PROFANE_REPLACEMENT = '****';
const PROFANE_WORDS = ['kerfuffle', 'sharbert', 'fornax'];
function cleanMessage(msg: string): string {
  const words = msg.split(/\s+/);

  for (const i in words){
    const word = words[i];
    console.log(`Word #${i}: ${word}`);
    if (PROFANE_WORDS.includes(word.toLowerCase()))
    {
      words[i] = PROFANE_REPLACEMENT;
    }
  }

  return words.join(' ');
}
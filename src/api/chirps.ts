import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError, NotFoundError } from "./middleware.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerGetChirps(req: Request, res: Response){
  const allChirps = await getAllChirps();

  respondWithJSON(res, 200, allChirps);
}

export async function handlerGetChirpByID(req: Request, res: Response){
  const chirpId = req.params['chirpID'] as string;

  try {
    const chirp = await getChirp(chirpId);
    respondWithJSON(res, 200, chirp);
  }
  catch {
    throw new NotFoundError(`Could not find Chirp with ID: ${chirpId}`);
  }
}

export async function handlerPostChirps(req: Request, res: Response){
  const token = getBearerToken(req);

  const userId = validateJWT(token, config.api.secret);
  type parameters = {
    body: string;
    //userId: string;
  };

  const params = req.body;

  params.body = validateChirp(params.body);
  //console.log(`--NEW CHIRP BY ${params.userId}--\n${params.body}`)
  const newChirp = await createChirp(params.body, userId);

  respondWithJSON(res, 201, newChirp); 
}

export function validateChirp(body: string): string {

  body = cleanMessage(body);

  if(body.length > 140){
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  return body;
   
}

const PROFANE_REPLACEMENT = '****';
const PROFANE_WORDS = ['kerfuffle', 'sharbert', 'fornax'];
function cleanMessage(msg: string): string {
  const words = msg.split(/\s+/);

  for (const i in words){
    const word = words[i];
    if (PROFANE_WORDS.includes(word.toLowerCase()))
    {
      words[i] = PROFANE_REPLACEMENT;
    }
  }

  return words.join(' ');
}
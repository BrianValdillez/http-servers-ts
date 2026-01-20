import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "./middleware.js";
import { createChirp, deleteChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { ChirpSelect } from "src/db/schema.js";

export async function handlerGetChirps(req: Request, res: Response){
  const allChirps = await getAllChirps();

  respondWithJSON(res, 200, allChirps);
}

export async function handlerGetChirpByID(req: Request, res: Response){
  const chirpId = req.params['chirpID'] as string;

  const chirp = await getChirp(chirpId);
  if (chirp === undefined){
    throw new NotFoundError(`Could not find Chirp with ID: ${chirpId}`);;
  }
  
  respondWithJSON(res, 200, chirp);
}

export async function handlerPostChirps(req: Request, res: Response){
  const token = getBearerToken(req);

  const userId = validateJWT(token, config.api.secret);
  type parameters = {
    body: string;
  };

  const params = req.body;

  params.body = validateChirp(params.body);
  const newChirp = await createChirp(params.body, userId);

  respondWithJSON(res, 201, newChirp); 
}

export async function handlerDeleteChirp(req: Request, res: Response){
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);

  const chirpId = req.params['chirpID'] as string;

  const chirp = await getChirp(chirpId);
  if (chirp === undefined){
    throw new NotFoundError(`Could not find Chirp with ID: ${chirpId}`);
  }

  if (chirp.userId != userId){
    throw new ForbiddenError("Cannot delete other people's Chirps!");
  }

  await deleteChirp(chirpId);
  res.status(204).send();
  
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
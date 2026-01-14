import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerChirpValidation(req: Request, res: Response) {
  let body = ""; // 1. Initialize

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  // 3. Listen for end events
  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body);
      // now you can use `parsedBody` as a JavaScript object
      
      console.log(`Message: ${parsedBody}`);
      const msg:string = parsedBody?.body;
      if (!msg || typeof msg !== 'string'){
        throw new Error("Invalid JSON");
      }

      if(msg.length > 140){
        throw new Error("Chirp is too long");
      }

      respondWithJSON(res, 200, { valid: true });    
    } catch (error) {
        if (error instanceof Error)
        {
          respondWithError(res, 400, error.message);
        }
    }
  });
}
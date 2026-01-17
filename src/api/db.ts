import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./middleware.js";
import { respondWithJSON } from "./json.js";
import { stringify } from "node:querystring";

export async function handlerCreateUser(req: Request, res: Response){
    type parameters = {
        email: string;
    };

    // req.body is automatically parsed
    const params: parameters = req.body;
    console.log(JSON.stringify(params));
    const email = params?.email;

    if (!email || typeof email != 'string'){
        throw new BadRequestError("Invalid JSON");
    }

    const newUser = await createUser({ email: email })
    res.set({
        'Content-Type': 'text/plain',
        'charset': 'utf-8',
    });

    respondWithJSON(res, 201, newUser);
}
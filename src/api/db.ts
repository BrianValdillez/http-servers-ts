import { Request, Response } from "express";
import { type UserInfo } from "../db/schema.js";
import { createUser, getUser } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./middleware.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { checkPasswordHash, hashPassword, makeJWT } from "../auth.js";
import { config } from "../config.js";

// This was originally a generic DB file, but is more of a users file now.

export async function handlerCreateUser(req: Request, res: Response){
    type parameters = {
        email: string;
        password: string;
    };

    // req.body is automatically parsed
    const params: parameters = req.body;
    const email = params?.email;
    const password = params.password;

    if (!email || typeof email != 'string' || 
        !password || typeof password != 'string'){
        throw new BadRequestError("Invalid JSON");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({ email: email, hashedPassword: hashedPassword });
    const userInfo: UserInfo = {
        id: newUser.id,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        email: newUser.email,
    };
    //res.set({
    //    'Content-Type': 'text/plain',
    //    'charset': 'utf-8',
    //});

    respondWithJSON(res, 201, newUser);
}

export async function handlerUserLogin(req: Request, res: Response){
    type parameters = {
        email: string;
        password: string;
        expiresInSeconds?: number;
    };

    const params: parameters = req.body;

    if (params.expiresInSeconds === undefined){
        params.expiresInSeconds = 60 * 60;
    }

    try{
        const userEntry = await getUser(params.email);
        const hashedPassword = userEntry.hashedPassword;
        if (!hashedPassword || hashedPassword === 'unset'){
            throw new Error();
        }

        const success = await checkPasswordHash(params.password, hashedPassword);
        
        if (!success){
            throw new Error();
        }

        const token = makeJWT(userEntry.id as string, params.expiresInSeconds, config.api.secret);

        const loginJson = {
            id: userEntry.id,
            createdAt: userEntry.createdAt,
            updatedAt: userEntry.createdAt,
            email: userEntry.email,
            token: token,
        };
        respondWithJSON(res, 200, loginJson);
    }catch{
        throw new UnauthorizedError('Incorrect email or password');
    }
}
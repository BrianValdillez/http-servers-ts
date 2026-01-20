import { Request, Response } from "express";
import { RefreshTokenSelect, type UserInfo } from "../db/schema.js";
import { createUser, getUser } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./middleware.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { getRefreshToken, registerRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";

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

const ACCESS_TOKEN_LIFETIME_SECONDS = 60 * 60;
const REFRESH_TOKEN_LIFETIME_DAYS = 60;
export async function handlerUserLogin(req: Request, res: Response){
    type parameters = {
        email: string;
        password: string;
    };

    const params: parameters = req.body;

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

        const authToken = makeJWT(userEntry.id as string, ACCESS_TOKEN_LIFETIME_SECONDS, config.api.secret);
        const refreshToken = makeRefreshToken();

        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        console.log(`Expires At: ${expiresAt.toString()}`);
        await registerRefreshToken({
            token: refreshToken,
            userId: userEntry.id as string,
            expiresAt: expiresAt,
        });
        
        const loginJson = {
            id: userEntry.id,
            createdAt: userEntry.createdAt,
            updatedAt: userEntry.createdAt,
            email: userEntry.email,
            token: authToken,
            refreshToken: refreshToken,
        };
        respondWithJSON(res, 200, loginJson);
    }catch{
        throw new UnauthorizedError('Incorrect email or password');
    }
}

export async function handlerRefreshAuthorizationToken(req: Request, res: Response){
    const refreshToken = getBearerToken(req);

    let tokenData: RefreshTokenSelect;
    try {
        tokenData = await getRefreshToken(refreshToken);
    } catch{
        throw new BadRequestError("Unrecognized Refresh Token");
    }

    if (tokenData.revokedAt != null || tokenData.expiresAt < new Date()){
        throw new UnauthorizedError('Token is no longer valid!');
    }

    const jwt = makeJWT(tokenData.userId, ACCESS_TOKEN_LIFETIME_SECONDS, config.api.secret);

    respondWithJSON(res, 200, { token: jwt });
}

export async function handlerRevokeRefreshToken(req: Request, res: Response){
    const refreshToken = getBearerToken(req);

    try {
        await revokeRefreshToken(refreshToken);
    }
    catch {
        throw new BadRequestError("Unrecognized Refresh Token");
    }

    res.status(204).send();
}
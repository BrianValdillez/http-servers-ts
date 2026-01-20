import * as argon2 from "argon2";
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { UnauthorizedError } from "./api/middleware.js";


export async function hashPassword(password: string): Promise<string>{
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean>{
    return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    type Payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;

    const iat = Math.floor(Date.now() / 1000);
    const payload:Payload = {
        iss: 'chirpy',
        sub: userID,
        iat: iat,
        exp: iat + expiresIn,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string{
    try {
        const decoded = jwt.verify(tokenString, secret);
        if (decoded.sub === undefined)
            throw new Error();

        return decoded.sub as string; 
    }
    catch{
        throw new UnauthorizedError('Could not validate JWT');
    }
}

export function getBearerToken(req: Request): string{
    const auth = req.get('Authorization');
    if (auth === undefined){
        throw new UnauthorizedError('Invalid Authorization Token');
    }

    return auth.replace(/^Bearer\s+/, '');
}

export function makeRefreshToken(){
    return crypto.randomBytes(32).toString('hex');
}
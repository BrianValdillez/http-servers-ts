import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from "./api/middleware";

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
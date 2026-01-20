import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT, getBearerToken } from "./auth.js";
import { Request } from "express";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result1 = await checkPasswordHash(password1, hash1);
    const result2 = await checkPasswordHash(password2, hash2)
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result1 = await checkPasswordHash(password1, hash2);
    const result2 = await checkPasswordHash(password2, hash1)
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});

describe("JWT Validation", () => {
    const userId1 = "Thing One";
    const userId2 = "Thing Two";
    const secret1 = "A big ol' secret";
    const secret2 = "A bigger, better secret";

    let jwt1:string;
    let jwt2:string;

  beforeAll(async () => {
    jwt1 = makeJWT(userId1, 5000, secret1);
    jwt2 = makeJWT(userId2, 5000, secret2);
  });

  it("should validate with the correct secret", async () => {
    try{
        const result1 = validateJWT(jwt1, secret1);
        const result2 = validateJWT(jwt2, secret2);
        //console.log(result1);
        
        expect(result1).toBe(userId1);
        expect(result2).toBe(userId2);
    }
    catch(error){
        if (error instanceof Error){
            console.log(error.message);
        }
        expect(false).toBe(true);
    }
  });

  it("should not validate with the wrong secret", async () => {
    try{
        const result1 = validateJWT(jwt1, secret2);
        const result2 = validateJWT(jwt2, secret1);

        expect(false).toBe(true);
    }
    catch(error){
        if (error instanceof Error){
            console.log(error.message);
        }
    }
  });
});

// describe("Bearer Token Validation", () => {

//     let req1:Request;
//     let req2:Request;

//   beforeAll(async () => {
//     jwt1 = makeJWT(userId1, 5000, secret1);
//     jwt2 = makeJWT(userId2, 5000, secret2);
//   });

//     it('should retrieve the bearer token when provided', async () => {
//         const bearer = getBearerToken(req1);
//   });
//});
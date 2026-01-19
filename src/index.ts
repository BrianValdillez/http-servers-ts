import express from "express";
import { Request, Response } from "express";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { config } from "./config.js";
import { ForbiddenError, middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetricsDisplay, resetMetrics } from "./api/metrics.js";
import { handlerGetChirpByID, handlerGetChirps, handlerPostChirps } from "./api/chirps.js";
import { resetUsers } from "./db/queries/users.js";
import { respondWithError } from "./api/json.js";
import { handlerCreateUser, handlerUserLogin } from "./api/db.js";

const migrationClient = postgres( config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

// Built-in JSON body parsing middleware
app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get('/api/chirps', handlerGetChirps);
app.get('/api/chirps/:chirpID', handlerGetChirpByID);
app.post('/api/users', handlerCreateUser);
app.post('/api/login', handlerUserLogin);
app.post('/api/chirps', handlerPostChirps);
app.get("/admin/metrics", handlerMetricsDisplay);
app.post("/admin/reset", handlerAPIReset);

// Errors must be defined after route handlers, but before the call to listen.
app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

async function handlerReadiness(req: Request, res: Response){
    res.set({
      'Content-Type': 'text/plain',
      'charset': 'utf-8',
    });

    res.status(200).send('OK');
}

async function handlerAPIReset(req: Request, res: Response)
{
  if (config.api.platform != 'dev'){
    throw new ForbiddenError('Admin API is forbidden on non-dev platforms');
  }

  await resetUsers();
  resetMetrics();

  res.sendStatus(200);
}

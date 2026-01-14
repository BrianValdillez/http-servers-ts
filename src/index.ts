import express from "express";
import { Request, Response } from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetricsDisplay, handlerMetricsReset } from "./api/metrics.js";
import { handlerChirpValidation } from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.post('/api/validate_chirp', handlerChirpValidation)
app.get("/admin/metrics", handlerMetricsDisplay);
app.post("/admin/reset", handlerMetricsReset);

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


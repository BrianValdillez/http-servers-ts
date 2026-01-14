import express from "express";
import { Request, Response } from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetricsDisplay);
app.get("/admin/reset", handlerMetricsReset);

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

async function handlerMetricsDisplay(req: Request, res: Response){
    res.set({
      'Content-Type': 'text/html',
      'charset': 'utf-8',
    });

    res.status(200).send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

async function handlerMetricsReset(req: Request, res: Response){
    config.fileserverHits = 0;

    res.sendStatus(200);
}
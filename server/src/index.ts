import express from "express";
import cors from "cors";
import { PORT, CORS_ORIGIN } from "./config/env";
import boardsRouter from "./routes/boards";
import postsRouter from "./routes/posts";

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use("/boards", boardsRouter);
app.use("/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

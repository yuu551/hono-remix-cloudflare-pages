import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => c.json("Hello"));

export default app;

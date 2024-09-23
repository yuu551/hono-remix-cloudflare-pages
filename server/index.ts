import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

// カスタムZodスキーマ for YYYY-MM-DD形式の日付
const dateSchema = z.string().refine(
  (val) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
  },
  {
    message: "Invalid date format. Use YYYY-MM-DD",
  }
);

// Todoのスキーマ
const TodoSchema = z.object({
  title: z.string().min(1).max(100),
  completed: z.boolean(),
  dueDate: dateSchema.optional(),
});

// すべてのルートにCORS設定を適用
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ダミーのTodo情報
const dummyTodos = [
  {
    id: 1,
    text: "買い物に行く",
    completed: false,
    dueDate: "2023-06-15",
    category: "日常",
  },
  {
    id: 2,
    text: "レポートを書く",
    completed: true,
    dueDate: "2023-06-10",
    category: "仕事",
  },
  {
    id: 3,
    text: "運動する",
    completed: false,
    dueDate: "2023-06-16",
    category: "健康",
  },
  {
    id: 4,
    text: "本を読む",
    completed: false,
    dueDate: "2023-06-20",
    category: "趣味",
  },
  {
    id: 5,
    text: "友達と電話する",
    completed: true,
    dueDate: "2023-06-12",
    category: "社交",
  },
];


const route = app
  .get("/api/todos", (c) => {
    return c.json(dummyTodos);
  })
  .put("/api/todos/:id", zValidator("json", TodoSchema), async (c) => {
    const id = c.req.param("id");
    const validatedData = c.req.valid("json");
    return c.json({ id: id, completed: !validatedData.completed });
  });

export default app;
export type AppType = typeof route;
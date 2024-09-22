import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => c.json("Hello"));

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

// 新しいエンドポイント: /api/todos
const route = app
  .get("/api", (c) => {
    return c.json({
      message: "Hello",
    });
  })
  .get("/api/todos", (c) => {
    return c.json(dummyTodos);
  })
  .put("/api/todos", (c) => {
    return c.json({ id: 4, completed: true });
  });

export default app;
export type AppType = typeof route;

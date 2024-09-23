import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { PlusCircle } from "lucide-react"; 
import { AppType } from "server/index";
import { hc } from "hono/client";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Todo My App" }];
};

// HonoのRPC機能でClient作成
const client = hc<AppType>(import.meta.env.VITE_API_URL);

// 初回データフェッチ
export const loader = async () => {
  const res = await client.api.todos.$get();
  return res.json();
};
// カテゴリーに応じた色を定義
const categoryColors: { [key: string]: string } = {
  日常: "bg-blue-100 text-blue-800",
  仕事: "bg-purple-100 text-purple-800",
  健康: "bg-green-100 text-green-800",
  趣味: "bg-yellow-100 text-yellow-800",
  社交: "bg-pink-100 text-pink-800",
};

// TodoのCard部分
const TodoItem = ({
  todo,
}: {
  todo: Awaited<ReturnType<typeof loader>>[number];
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const badgeColor =
    categoryColors[todo.category] || "bg-gray-100 text-gray-800";

  const handleCheckboxChange = async (checked: boolean) => {
    const result = await client.api.todos[":id"].$put({
      json: {
        title: todo.text,
        completed: isCompleted,
      },
      param: {
        id: todo.id.toString(),
      },
    });
    const updatedTodo = await result.json();
    setIsCompleted(updatedTodo.completed);
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center p-4">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          className="mr-4"
        />
        <div className="flex-grow">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`text-lg font-medium leading-none ${
              isCompleted ? "line-through text-gray-400" : "text-gray-700"
            }`}
          >
            {todo.text}
          </label>
          <div className="mt-2 flex items-center space-x-2">
            <Badge className={`${badgeColor} font-semibold`}>
              {todo.category}
            </Badge>
            <span className="text-sm text-gray-500">期日: {todo.dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Todos = () => {
  const todos = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white text-gray-800 p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">My TODO App</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-700">TODOリスト</h2>
            <Button className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 rounded-xl px-4 py-2">
              <PlusCircle className="mr-2 h-4 w-4" />
              新しいTODOを追加
            </Button>
          </div>
          <div className="space-y-4">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Todos;

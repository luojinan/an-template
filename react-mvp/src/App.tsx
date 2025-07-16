import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";
// Supabase 配置（请替换为你的项目配置）
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function App() {
  const [todos, setTodos] = useState<{ id: number; task: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState("");

  // 查询所有todo
  const fetchTodos = async () => {
    const { data } = await supabase.from("todos").select("id, task").order("id");
    setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 新增todo
  const addTodo = async () => {
    if (!newTask.trim()) return;
    await supabase.from("todos").insert({ task: newTask });
    setNewTask("");
    fetchTodos();
  };

  // 删除todo
  const deleteTodo = async (id: number) => {
    await supabase.from("todos").delete().eq("id", id);
    fetchTodos();
  };

  // 开始编辑
  const startEdit = (id: number, task: string) => {
    setEditingId(id);
    setEditingTask(task);
  };

  // 保存编辑
  const saveEdit = async () => {
    if (editingId === null) return;
    await supabase.from("todos").update({ task: editingTask }).eq("id", editingId);
    setEditingId(null);
    setEditingTask("");
    fetchTodos();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-200 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Supabase 最基础增删改查示例</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="新任务"
          className="flex-1 input input-bordered input-sm"
        />
        <button className="btn btn-primary btn-sm" onClick={addTodo}>添加</button>
      </div>
      <ul className="p-0 list-none">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2 mb-2">
            {editingId === todo.id ? (
              <>
                <input
                  value={editingTask}
                  onChange={e => setEditingTask(e.target.value)}
                  className="flex-1 input input-bordered input-sm"
                />
                <button className="btn btn-success btn-xs" onClick={saveEdit}>保存</button>
                <button className="btn btn-ghost btn-xs" onClick={() => setEditingId(null)}>取消</button>
              </>
            ) : (
              <>
                <span className="flex-1 truncate">{todo.task}</span>
                <button className="btn btn-info btn-xs" onClick={() => startEdit(todo.id, todo.task)}>编辑</button>
                <button className="btn btn-error btn-xs" onClick={() => deleteTodo(todo.id)}>删除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

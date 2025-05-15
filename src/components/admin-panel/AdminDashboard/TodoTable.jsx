import React, { useState } from "react";

const TodoTable = () => {
  const [tasks, setTasks] = useState([
    { id: 1, task: "Fix table export bug", done: false },
    { id: 2, task: "Add PDF download feature", done: false },
    { id: 3, task: "Test booking flow", done: true },
  ]);

  const toggleCheckbox = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div>
      <h2>To-Do List (Table Style)</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Done</th>
            <th>Task</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item) => (
            <tr key={item.id} style={{ background: item.done ? "#e0ffe0" : "white" }}>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheckbox(item.id)}
                />
              </td>
              <td style={{ textDecoration: item.done ? "line-through" : "none" }}>
                {item.task}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoTable;

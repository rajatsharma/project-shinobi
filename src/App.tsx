import React from "react";
import { bg } from "./styles/app.css";

function App() {
  return (
    <div
      className={bg}
      style={{
        height: "500px",
        background:
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAOklEQVQoU43MSwoAMAgD0eT+h7ZYaOlHo7N+DNHL2HAGgBWcyGcKbqTghTL4oQiG6IUpOqFEC5bI4QD8PAoKd9j4XwAAAABJRU5ErkJggg==",
      }}
    ></div>
  );
}

export default App;

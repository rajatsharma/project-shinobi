import React from "react";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import useObservable from "use-observable";
import { text, bg } from "./styles/app.css";

const App$ = new Subject<string>();

function App() {
  const value = useObservable(
    () => App$.pipe(map((value) => value.toUpperCase())),
    ""
  );

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    App$.next(e.currentTarget.value);

  return (
    <div
      className={bg}
      style={{
        background:
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAOklEQVQoU43MSwoAMAgD0eT+h7ZYaOlHo7N+DNHL2HAGgBWcyGcKbqTghTL4oQiG6IUpOqFEC5bI4QD8PAoKd9j4XwAAAABJRU5ErkJggg==",
      }}
    >
      <input className={text} autoFocus onChange={onChange} value={value} />
    </div>
  );
}

export default App;

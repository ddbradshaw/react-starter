import { types, getParent, destroy, flow, getSnapshot, onSnapshot, onPatch, applyPatch, IJsonPatch } from "mobx-state-tree"
import { createHistory } from './History'

export const TodoItem = types
  .model("Todo", {
    userId: types.optional(types.number, 1),
    id: types.number,
    title: types.string,
    completed: types.optional(types.boolean, false)
  })
  .actions(self => {
    const ax = {
      // Change title given a new title
      changeLabel(newLabel: string) {
        self.title = newLabel;
      },
      // Change the completed value given a new completed value
      changeComplete(newValue: boolean) {
        self.completed = newValue;
      },
      // Navigate up dependence tree two levels and remove self from tree
      remove() {
        getParent(self, 2).remove(self);
      },
      // Use mobx generator function to create synchronous async action
      // Similiar to async / await
      save: flow(function* save() {
        try {
          yield window.fetch(`https://jsonplaceholder.typicode.com/todos/1`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getSnapshot(self))
          })
        } catch (ex) {
          console.warn("Unable to save todo", ex)
        }
      }),
      // Using state lifecyle hooks to listen to snapshot changes on todo and auto-save to server
      // This is a contrived example.
      afterCreate() {
        onSnapshot(self, ax.save)
      }
    }
    return ax;
  })


// This model is composed of the typical stuff (models, actions, views)
// But also a generic history class that allows undo and redo actions
export const TodoStore = types.compose(types
  .model("TodoStore", {
    todos: types.optional(types.array(TodoItem), []),
    loading: types.optional(types.boolean, false)
  })
  .actions(self => ({
    // Add todo to todo array
    add(todo: ITodoItem) {
      self.todos.push(todo);
    },
    // Remove todo from todo array
    remove(todo: ITodoItem) {
      destroy(todo);
    },
    // Load contrived todo suggestions into todo array
    // Adding randomized id to avoid React 'key' errors
    getSuggestions: flow(function* getSuggestions(count: number) {
      self.loading = true;
      try {
        const response = yield window.fetch('https://jsonplaceholder.typicode.com/todos');
        const todos = yield response.json();
        const slice = todos.slice(0, count); // Grab top 5 (since service return 200)
        slice.map((item: ITodoItem) => { // Randomize the ID
          item.id = Math.floor(Math.random() * 100000000)
        })
        self.todos.push(...slice);
        self.loading = false;
      } catch (ex) {
        console.error(ex);
        self.loading = false;
      }
    })
  }))
  .views(self => {
    // View functions wrapped in literal to allow referencing 
    // internal properties from within other functions
    // Only works if accessed property is a getter using 'get'
    const vx = {
      get todoCount() {
        return self.todos.length;
      },
      get completedCount() {
        return self.todos.filter(todo => todo.completed == true).length;
      },
      get completedPct() {
        if (vx.todoCount == 0) return 0;
        return Math.floor((vx.completedCount / vx.todoCount) * 100);
      }
    }
    return vx;
  }),
  createHistory(["/loading"])
)

export type ITodoItem = typeof TodoItem.Type;
export type ITodoStore = typeof TodoStore.Type;
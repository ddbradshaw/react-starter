import { types, getParent, destroy, flow, getSnapshot, onSnapshot, onPatch, applyPatch } from "mobx-state-tree"

//TODO: Implement more modularized solution
// Patch based time travelling
// This is experimental
const patches:any[] = [];
const redoPatches:any[] = [];
let isTimeTravel:boolean = false

export const TodoItem = types
  .model("Todo", {
    userId: types.optional(types.number, 1),
    id: types.number,
    title: types.string,
    completed: types.optional(types.boolean, false)
  })
  .actions(self => {
    const ax = {
      changeLabel(newLabel: string) {
        self.title = newLabel;
      },
      changeComplete(newValue: boolean) {
        self.completed = newValue;
      },
      remove() {
        getParent(self, 2).remove(self);
      },
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
      // Using state lifecyle hooks to listen to changes to todo and auto saving to server
      // This is a contrived example.
      afterCreate() {
        onSnapshot(self, ax.save)
      }
    }
    return ax;
  })

export const TodoStore = types
  .model("TodoStore", {
    todos: types.optional(types.array(TodoItem), []),
    loading: types.optional(types.boolean, false)
  })
  .actions(self => ({
    add(todo: ITodoItem) {
      self.todos.push(todo);
    },
    remove(todo: ITodoItem) {
      destroy(todo);
    },
    undo() {
      if(patches.length == 0 ) return;
      isTimeTravel = true;
      const p = patches[patches.length - 1]; // Get the last patch in the heap
      redoPatches.push(p); // Save the patch to the redo heap
      applyPatch(self, p.inversePatch); // Apply the patch inverse
      patches.splice(patches.length - 2, 2); // Remove the reversed actions from heap
    },
    redo() {
      if(redoPatches.length == 0 ) return;
      isTimeTravel = true;
      const p = redoPatches[redoPatches.length - 1]; // Get the last patch in the heap
      applyPatch(self, p.patch); // Apply the patch inverse
      redoPatches.splice(redoPatches.length - 1, 1); // Remove the reversed actions from heap

    },
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
    }),
    // Listen for patches to the model.  Save the patches to the heap for undo/redo
    afterCreate() {
      onPatch(self, (patch, inversePatch) => {
        patches.push({patch, inversePatch});
        if(!isTimeTravel) redoPatches.splice(0, redoPatches.length);
        isTimeTravel = false;
      })
    }
  }))
  // view functions are extracted into functions so that 
  // we can use view functions within other view functions
  .views(self => {
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
  })

export type ITodoItem = typeof TodoItem.Type;
export type ITodoStore = typeof TodoStore.Type;
import { getSnapshot, onSnapshot, onPatch } from 'mobx-state-tree'
import { TodoItem, TodoStore, ITodoItem, ITodoStore } from '../src/models/TodoStore'

it("can create an instance of a model", () => {
  const todo = TodoItem.create({
    id: 1,
    label: "Test Todo",
    complete: false
  });

  expect(todo.label).toBe("Test Todo");
  expect(todo.complete).toBe(false);
  todo.changeLabel("New Label")
  expect(todo.label).toBe("New Label");
})

it("can create a new todo store", () => {
  const store = TodoStore.create({
    todos: [{
      id: 1,
      label: "Test Todo",
      complete: false
    }]
  })

  expect(store.todos.length).toBe(1);
  expect(store.todos[0].label).toBe("Test Todo");
})

it("can add new todos - track snapshots", () => {
  const store = TodoStore.create();
  const states: Array<any> = [];

  onSnapshot(store, snapshot => {
    states.push(snapshot)
  })

  store.add({
    id: 1,
    label: "Test Todo",
    complete: false
  } as ITodoItem)

  expect(store.todos.length).toBe(1);
  expect(store.todos[0].label).toBe("Test Todo");
  expect(getSnapshot(store)).toEqual({
    todos: [{
      id: 1,
      label: "Test Todo",
      complete: false
    }]
  })
  expect(getSnapshot(store)).toMatchSnapshot();
  expect(states).toMatchSnapshot();
})

it("can add new items - track patches", () => {
  const store = TodoStore.create();
  const patches: Array<any> = [];

  onPatch(store, patch => {
    patches.push(patch)
  })

  store.add({
    id: 1,
    label: "Test Todo",
    complete: false
  } as ITodoItem)

  store.todos[0].changeLabel("New Label");
  expect(patches).toMatchSnapshot();
})

it("can calculate the total length", () => {
  const store = TodoStore.create({
    todos: [{
      id: 1,
      label: "Test Todo",
      complete: false
    }]
  })
  expect(store.todoCount).toBe(1);
})
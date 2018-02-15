// src/index.tsx
import './../css/style.scss';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { onSnapshot, getSnapshot, onPatch} from 'mobx-state-tree';

import Routes from './Routes';
import { TodoStore, ITodoStore } from './models/TodoStore';

// create default initial state
let initialState = {
  todos: [
    {
      userId: 1,
      id: 1,
      title: "Create React Application",
      completed: true
    },
    {
      userId: 1,
      id: 2,
      title: "Wash the Car",
      completed: false
    }
  ]
}

// If local storage contains state, load from storage
if(localStorage.getItem("todolistapp")) {
  const json = JSON.parse(localStorage.getItem("todolistapp")) as ITodoStore;

  // Check to make sure stored model still matches model definition
  if(TodoStore.is(json)) initialState = json;
}

// Create store from initial state
let todoStore = TodoStore.create(initialState);

// Listen for changes to the store and write to storage each time tree changes
// Snapshots are "free" to obtain
onSnapshot(todoStore, snapshot => {
  localStorage.setItem("todolistapp", JSON.stringify(snapshot))
})

// Render application
function renderApp() {
  ReactDOM.render(
    <Routes todoStore={todoStore} />, document.getElementById('root')
  );
}

// Listen for hot module changes
if (module.hot) {
  module.hot.accept(() => {
    renderApp();
  });
}

renderApp();
import * as React from "react";
import { observer, inject } from "mobx-react";
import {ITodoStore} from '../models/TodoStore'
import TodoListItem from './TodoListItem';
import { Progress } from 'antd';

interface ITodoListProps {
  todoStore?: ITodoStore
}

@inject("todoStore")
@observer
export default class TodoList extends React.Component<ITodoListProps, undefined>{
  render() {
    const { todoStore } = this.props;
    return (
      <React.Fragment>
        <ul className="todo-list">
          {todoStore.todos.map((todo, idx) => <TodoListItem key={todo.id} todo={todo}/>)}
        </ul>
        <Progress percent={todoStore.completedPct} />
        <br/>
        <div>{todoStore.completedCount} of {todoStore.todoCount} completed</div>
      </React.Fragment>
    );
  }
}
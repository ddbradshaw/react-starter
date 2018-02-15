import * as React from "react";
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import { onPatch, applyPatch } from "mobx-state-tree";
import { Input, Button, message, InputNumber, Icon } from 'antd';
import { ITodoStore, TodoItem } from '../models/TodoStore'
import TodoList from '../components/TodoList'

const NewItem = Input.Search;
const ButtonGroup = Button.Group;

interface ITodoPageProps {
  todoStore: ITodoStore
}

interface ITodoPageState {
  todoValue: string,
  suggestionCount: number
}

@inject("todoStore")
@observer
export default class TodoPage extends React.Component<ITodoPageProps, ITodoPageState>{
  constructor(props: ITodoPageProps) {
    super(props);
    this.state = {
      todoValue: "",
      suggestionCount: 5
    };
  }

  onAddItem = (value: any) => {
    if (value == "") { message.info("Yo! Todos must have a title"); return; }
    const id = Math.floor(Math.random() * 100000);
    this.props.todoStore.add(TodoItem.create({ id: id, title: value }))
    this.setState({ todoValue: "" });
  }

  onTitleChange = (e: any) => {
    this.setState({ todoValue: e.target.value });
  }

  onCountChange = (value: number) => {
    this.setState({ suggestionCount: value });
  }

  getSuggestions = (e: any) => {
    this.props.todoStore.getSuggestions(this.state.suggestionCount);
  }

  render() {
    const { todoStore } = this.props;
    return (
      <div className="main-wrapper">
        <img src="assets/todo.png" height="60px" />
        <h1>Doing... Doing... Done!</h1>
        <NewItem
          placeholder="create new todo"
          enterButton="Add Todo"
          onSearch={this.onAddItem}
          value={this.state.todoValue}
          onChange={this.onTitleChange}
          size="large" />
        <TodoList></TodoList>
        <div className="mt20">
          <Button onClick={this.getSuggestions} loading={todoStore.loading}>Suggest Todos</Button>
          <InputNumber min={1} max={10} defaultValue={this.state.suggestionCount} onChange={this.onCountChange} style={{ marginLeft: '5px' }} />
        </div>
        <ButtonGroup className="mt20">
          <Button onClick={todoStore.undo}>
            <Icon type="left" />
          </Button>
          <Button onClick={todoStore.redo}>
            <Icon type="right" />
          </Button>
        </ButtonGroup>
        <div className="mt20"><Link to="/about">about application</Link></div>
      </div>
    );
  }
}
export interface Todo {
  title: string;
}

export const myTodoList = [{ title: 'Todo 1' }, { title: 'Todo 2' }, { title: 'Todo 2' }, { title: 'Todo 2' }];


export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


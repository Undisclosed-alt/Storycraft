export interface Story {
  id: string;
  title: string;
}

export interface Node {
  id: string;
  storyId: string;
  text: string;
}

export interface Action {
  label: string;
  targetId: string;
}

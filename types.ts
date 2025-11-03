export interface Folder {
  id: string;
  name: string;
}

export interface TextData {
  id: string;
  folderId: string;
  lesson: string;
  content: string;
  translation: string;
}

export interface TestConfig {
  gapInterval: number;
  showTranslation: boolean;
  mode: 'reveal' | 'input';
}
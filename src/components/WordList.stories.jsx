import WordList from './WordList';

export default {
  title: 'COMPONENTS/WordList',
  component: WordList,
};

export const NotStarted = {
  args: {
    words: ['ЯБЛУКО', 'ГРУША', 'БАНАН'],
    foundWords: [],
  },
};

export const InProgress = {
  args: {
    words: ['ЯБЛУКО', 'ГРУША', 'БАНАН'],
    foundWords: ['ЯБЛУКО'],
  },
};

export const AllFound = {
  args: {
    words: ['ЯБЛУКО', 'ГРУША', 'БАНАН'],
    foundWords: ['ЯБЛУКО', 'ГРУША', 'БАНАН'],
  },
};
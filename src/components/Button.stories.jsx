import Button from './Button';

export default {
  title: 'COMPONENTS/Button', // Назва, яку ви бачите в синьому меню
  component: Button,
  argTypes: {
    label: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

// Варіація 1: Звичайна кнопка
export const Primary = {
  args: {
    label: 'Грати як Player 1',
  },
};

// Варіація 2: Кнопка гостя
export const Guest = {
  args: {
    label: 'Грати як Гість',
  },
};
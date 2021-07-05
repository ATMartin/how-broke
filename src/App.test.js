import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders input box for organization name', () => {
  render(<App />);
  const inputField = screen.getByRole('textbox');
  expect(inputField).toBeInTheDocument();
});

test('renders repos when org is given', async () => {
  render(<App />);
  const inputField = screen.getByRole('textbox');
  userEvent.type(inputField, "test");

  screen.getByRole('button').click();

  const repo = await waitFor(() => screen.getByText(/cool_js/i));
  expect(repo).toBeInTheDocument();
});

test('renders commits when repo is selected', async () => {
  render(<App />);
  const inputField = screen.getByRole('textbox');
  userEvent.type(inputField, "test");

  screen.getByRole('button').click();

  const repo = await waitFor(() => screen.getByText(/cool_js/i));
  repo.click();

  const commit = await waitFor(() => screen.getByText(/Slightly older commit/i));
  expect(commit).toBeInTheDocument();
});

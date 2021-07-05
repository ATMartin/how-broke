import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from "redux-thunk";

import storeReducer from './reducers.js'
import App from './App';

const store = createStore(storeReducer, applyMiddleware(reduxThunk));

test('renders input box for organization name', () => {
  render(<Provider store={store}><App /></Provider>);
  const inputField = screen.getByRole('textbox');
  expect(inputField).toBeInTheDocument();
});

test('renders repos when org is given', async () => {
  render(<Provider store={store}><App /></Provider>);
  const inputField = screen.getByRole('textbox');
  userEvent.type(inputField, "test");

  screen.getByRole('button').click();

  const repo = await waitFor(() => screen.getByText(/cool_js/i));
  expect(repo).toBeInTheDocument();
});

test('renders error when repos fail to load', async () => {
  render(<Provider store={store}><App /></Provider>);
  const inputField = screen.getByRole('textbox');
  userEvent.type(inputField, "rate_limit");

  screen.getByRole('button').click();

  const repo = await waitFor(() => screen.getByText(/API rate limit exceeded/i));
  expect(repo).toBeInTheDocument();
});

test('renders commits when repo is selected', async () => {
  render(<Provider store={store}><App /></Provider>);
  const inputField = screen.getByRole('textbox');
  userEvent.type(inputField, "test");

  screen.getByRole('button').click();

  const repo = await waitFor(() => screen.getByText(/cool_js/i));
  repo.click();

  const commit = await waitFor(() => screen.getByText(/Slightly older commit/i));
  expect(commit).toBeInTheDocument();
});

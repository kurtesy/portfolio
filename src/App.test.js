import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-ga', () => ({
  initialize: jest.fn(),
  pageview: jest.fn(),
}));

it('renders without crashing', () => {
  render(<App />);
});

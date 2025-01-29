import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders Product Management heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Product Management/i);
    expect(headingElement).toBeInTheDocument();
  });
});
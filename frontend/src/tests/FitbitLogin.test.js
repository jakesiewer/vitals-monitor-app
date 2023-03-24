import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FitbitLogin from '../components/tracker/FitbitLogin';

// Set up a custom render function to mock the window.location.search
const customRender = (ui, { locationSearch = '', ...options } = {}) => {
  delete window.location;
  window.location = { search: locationSearch };
  return render(ui, options);
};

describe('FitbitLogin component', () => {
  test('renders login button when not logged in', () => {
    customRender(<FitbitLogin />);
    const loginButton = screen.getByText('Log In');
    expect(loginButton).toBeInTheDocument();
  });

  test('handles login and sets access token', () => {
    const fakeToken = 'fake_access_token';
    customRender(<FitbitLogin />, { locationSearch: `?access_token=${fakeToken}` });

    expect(localStorage.getItem('fitbit_access_token')).toBe(fakeToken);
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toBeInTheDocument();
  });

  test('handles logout and removes access token', () => {
    const fakeToken = 'fake_access_token';
    customRender(<FitbitLogin />, { locationSearch: `?access_token=${fakeToken}` });

    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('fitbit_access_token')).toBe(null);
    const loginButton = screen.getByText('Log In');
    expect(loginButton).toBeInTheDocument();
  });
});

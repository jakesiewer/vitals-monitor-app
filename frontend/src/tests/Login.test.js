// Login.test.js

import { render, fireEvent, screen, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext';
import Login from '../components/accounts/Login';

const customRender = (ui, options) =>
    render(ui, { wrapper: (props) => <Router><AuthProvider>{props.children}</AuthProvider></Router>, ...options });

describe('Login Component', () => {
    beforeEach(() => {
        customRender(<Login />, {});
    });

    test('matches snapshot', async () => {
        await waitFor(() => {
            const { container } = customRender(<Login />, {});
            expect(prettyDOM(container)).toMatchSnapshot();
        })
    });

    test('renders login form with email and password inputs', async () => {
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        })
    });

    test('renders login button', async () => {
        await waitFor(() => {
            const loginButton = screen.getByText('Login');
            expect(loginButton).toBeInTheDocument();
        })
    });

    test('renders register link', async () => {
        await waitFor(() => {
            const registerLink = screen.getByText("Don't have an account? Register");
            expect(registerLink).toBeInTheDocument();
            expect(registerLink).toHaveAttribute('href', '/register');
        })
    });

    test('allows user to enter email and password', async () => {
        await waitFor(() => {

            const emailInput = screen.getByPlaceholderText('Email address');
            const passwordInput = screen.getByPlaceholderText('Password');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('testPassword');
        })
    });
});

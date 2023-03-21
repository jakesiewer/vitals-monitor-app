// Register.test.js

import { render, fireEvent, screen, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Register from '../components/accounts//Register';

const customRender = (ui, options) =>
    render(ui, { wrapper: (props) => <Router><AuthProvider>{props.children}</AuthProvider></Router>, ...options });

describe('Register Component', () => {
    beforeEach(() => {
        customRender(<Register />, {});
    });

    test('matches snapshot', async () => {
        await waitFor(() => {
            const { container } = customRender(<Register />, {});
            expect(prettyDOM(container)).toMatchSnapshot();
        })
    });

    test('renders registration form with email, password, and confirm password inputs', async () => {
        await waitFor(() => {
            const emailInput = screen.getByPlaceholderText('Email address');
            const passwordInput = screen.getByPlaceholderText('Password');
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
        })
    });

    test('renders register button', async () => {
        await waitFor(() => {
            const registerButton = screen.getByRole('button', { name: /register/i });
            expect(registerButton).toBeInTheDocument();
        })
    });

    test('renders login link', async () => {
        await waitFor(() => {
            const loginLink = screen.getByText('Already have an account? Login');
            expect(loginLink).toBeInTheDocument();
            expect(loginLink).toHaveAttribute('href', '/login');
        })
    });

    test('allows user to enter email, password, and confirm password', async () => {
        await waitFor(() => {
            const emailInput = screen.getByPlaceholderText('Email address');
            const passwordInput = screen.getByPlaceholderText('Password');
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });

            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('testPassword');
            expect(confirmPasswordInput.value).toBe('testPassword');
        })
    });
});

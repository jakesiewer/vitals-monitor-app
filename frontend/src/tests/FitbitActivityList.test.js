import React from 'react';
import { render, fireEvent, screen, waitFor, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from "axios";
import FitbitActivityList from '../components/tracker/FitbitActivityList';

jest.mock('axios');

describe('FitbitActivityList', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const activitiesMock = [
        {
            logId: 1,
            originalStartTime: '2023-03-22T10:00:00',
            tcxLink: 'https://www.example.com/activity/1'
        },
        {
            logId: 2,
            originalStartTime: '2023-03-22T12:00:00',
            tcxLink: 'https://www.example.com/activity/2'
        }
    ];

    it('renders component without crashing', () => {
        render(<FitbitActivityList />);
    });

    it('closes the calendar when a date is selected', async () => {
        render(<FitbitActivityList />);
        const calendarIcon = screen.getByRole('img', { hidden: true });
        fireEvent.click(calendarIcon);

        const calendarDate = screen.getByText('22');
        fireEvent.click(calendarDate);

        await waitFor(() => {
            expect(screen.queryByRole('grid')).not.toBeInTheDocument();
        });
    });

    it('fetches activities and displays them when the "Fetch Activities" button is clicked', async () => {
        // Set a dummy fitbit_access_token in localStorage
        localStorage.setItem('fitbit_access_token', 'dummy-token');

        axios.get.mockResolvedValueOnce({ data: activitiesMock });

        render(<FitbitActivityList />);
        const fetchActivitiesButton = screen.getByText('Fetch Activities');
        fireEvent.click(fetchActivitiesButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/fitbit-activities', expect.any(Object));
            expect(screen.getByText(activitiesMock[0].originalStartTime)).toBeInTheDocument();
            expect(screen.getByText(activitiesMock[1].originalStartTime)).toBeInTheDocument();
        });

        // Clean up the localStorage after the test
        localStorage.removeItem('fitbit_access_token');
    });
});
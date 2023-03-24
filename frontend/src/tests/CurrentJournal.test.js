import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CurrentJournal } from '../components/journal/CurrentJournal';
import { journalEventBus } from '../components/chart/ScrubberChart';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('CurrentJournal', () => {
  beforeEach(() => {
    render(<CurrentJournal />);
  });

  test('renders the component without journal data', () => {
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('No Journal')).toBeInTheDocument();
  });

  test('renders the component with journal data', () => {
    const journalData = {
      mood: ['Happy'],
      positive: ['Excited'],
      negative: ['Anxious'],
      activities: ['Running'],
      journal: ['I had a great day today!'],
      comments: ['Keep up the good work!'],
    };

    journalEventBus.emit('journalDataUpdated', journalData);

    expect(screen.getByText('Overall Mood:')).toBeInTheDocument();
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Positive Emotion(s):')).toBeInTheDocument();
    expect(screen.getByText('Excited')).toBeInTheDocument();
    expect(screen.getByText('Negative Emotion(s):')).toBeInTheDocument();
    expect(screen.getByText('Anxious')).toBeInTheDocument();
    expect(screen.getByText('Activities:')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('I had a great day today!')).toBeInTheDocument();
    expect(screen.getByText('Further Comments:')).toBeInTheDocument();
    expect(screen.getByText('Keep up the good work!')).toBeInTheDocument();
  });
});

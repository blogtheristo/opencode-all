import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AlertsScreen from './AlertsScreen';

describe('AlertsScreen', () => {
  it('renders the seeded alerts with an open count', () => {
    const { getByText } = render(<AlertsScreen />);
    expect(getByText('4 open alerts')).toBeTruthy();
    expect(getByText('Critical path slip 5d')).toBeTruthy();
  });

  it('acknowledges a single alert and decrements the open count', () => {
    const { getAllByText, getByText } = render(<AlertsScreen />);
    fireEvent.press(getAllByText('Ack')[0]);
    expect(getByText('3 open alerts')).toBeTruthy();
  });

  it('acknowledges all alerts via the bulk action', () => {
    const { getByText, queryByText } = render(<AlertsScreen />);
    fireEvent.press(getByText('Acknowledge all'));
    expect(getByText('0 open alerts')).toBeTruthy();
    expect(queryByText('Acknowledge all')).toBeNull();
  });
});

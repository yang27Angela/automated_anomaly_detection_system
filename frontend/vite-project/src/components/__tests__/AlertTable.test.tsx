import { render, screen, fireEvent } from '@testing-library/react';
import AlertTable from '../AlertTable';

describe('AlertTable', () => {
  const alerts = [
    {
      id: '1',
      timestamp: '2025-05-01T12:00:00Z',
      alertType: 'object',
      message: 'Test 1',
      frame_url: 'data:image/png;base64,...',
      created_at: '2025-05-01T12:01:00Z'
    },
    {
      id: '2',
      timestamp: '2025-05-01T12:05:00Z',
      alertType: 'object',
      message: 'Test 2',
      frame_url: 'data:image/png;base64,...',
      created_at: '2025-05-01T12:06:00Z'
    }
  ];

  it('renders alert table with alerts', () => {
    render(<AlertTable alerts={alerts} onRowClick={() => {}} />);
    expect(screen.getByText('2025-05-01T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2025-05-01T12:05:00Z')).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'frame' })).toHaveLength(2);
  });

  it('calls onRowClick when a row is clicked', () => {
    const handleClick = vi.fn();
    render(<AlertTable alerts={alerts} onRowClick={handleClick} />);
    fireEvent.click(screen.getByText('2025-05-01T12:00:00Z'));
    expect(handleClick).toHaveBeenCalled();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import AlertDetailDialog from '../AlertDetailDialog';

describe('AlertDetailDialog', () => {
  const alert = {
    id: '1',
    timestamp: '2025-05-01T12:00:00Z',
    alertType: 'object',
    message: 'Test alert',
    frame_url: 'data:image/png;base64,...',
    details: [{ class: 'person', confidence: 0.95 }]
  };

  it('renders alert dialog when open', () => {
    render(
      <AlertDetailDialog
        open={true}
        alert={alert}
        onClose={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    );
    expect(screen.getByText(/alert detail/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Test alert/i)).toBeInTheDocument();
  });

  it('calls onDelete and onUpdate when buttons clicked', () => {
    const handleDelete = vi.fn();
    const handleUpdate = vi.fn();

    render(
      <AlertDetailDialog
        open={true}
        alert={alert}
        onClose={() => {}}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(handleDelete).toHaveBeenCalled();
    expect(handleUpdate).toHaveBeenCalled();
  });
});

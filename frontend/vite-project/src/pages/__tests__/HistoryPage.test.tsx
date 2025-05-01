import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HistoryPage from '../HistoryPage';

// 使用类型断言避免 any
const mockFetch = fetch as unknown as ReturnType<typeof vi.fn>;

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders title and empty alert table when no data', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ alerts: [] }),
    } as Response);

    render(<HistoryPage />);
    expect(screen.getByText(/alert history/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/no alerts/i)).toBeInTheDocument();
    });
  });

  it('shows loading spinner while fetching alerts', async () => {
    let resolve: (value: Response) => void;
    const promise = new Promise<Response>((r) => (resolve = r));

    mockFetch.mockReturnValueOnce(promise as unknown as Response);

    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    resolve!({
      json: async () => ({ alerts: [] }),
    } as Response);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('shows error snackbar when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network fail'));

    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText(/❌ failed to load alerts/i)).toBeInTheDocument();
    });
  });
});

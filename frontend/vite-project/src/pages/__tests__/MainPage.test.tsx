import React from 'react';
import { render, screen } from '@testing-library/react';
import MainPage from '../MainPage';
import { vi } from 'vitest';

// Stub createObjectURL since it's not implemented in jsdom
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(),
});

describe('MainPage', () => {
  it('renders upload input and filter options', () => {
    render(<MainPage />);

    // 上传标题文本
    expect(screen.getByText(/upload video/i)).toBeInTheDocument();

    // 检查 upload input 存在
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();

    // 检查两个复选框存在
    expect(screen.getByText(/require person/i)).toBeInTheDocument();
    expect(screen.getByText(/require car/i)).toBeInTheDocument();

    // 检查按钮存在
    expect(screen.getByText(/view history/i)).toBeInTheDocument();
  });
});

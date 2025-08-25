import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnnouncementBoard from '../../components/AnnouncementBoard';
import * as UserContext from '../../context/UserContext';
import axios from 'axios';

// Mock the modules
vi.mock('axios');
vi.mock('../../context/UserContext');

describe('AnnouncementBoard', () => {

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the useUser hook
    const useUserMock = vi.spyOn(UserContext, 'useUser');
    useUserMock.mockReturnValue({
      token: 'fake-token',
      user: { role: 'user' },
      logout: vi.fn(),
    });

    // Mock axios get request
    axios.get.mockResolvedValue({ data: { data: { data: [] } }, status: 200 });
  });

  it('should display "You are all caught up!." when there are no announcements', async () => {
    render(<AnnouncementBoard />);

    // Use findByText to wait for the component to settle after useEffect
    const message = await screen.findByText('You are all caught up!.');
    expect(message).toBeInTheDocument();
  });
});

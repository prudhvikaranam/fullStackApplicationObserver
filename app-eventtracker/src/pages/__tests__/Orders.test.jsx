import { render, screen, fireEvent } from '@testing-library/react';
import Orders from '../Orders';
import { trackEvent } from '../../services/analytics';
import { useNavigate } from 'react-router-dom';

jest.mock('../../services/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Orders Component', () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  const mockOrders = [
    {
      id: 'ORD-1',
      date: new Date().toISOString(),
      amount: 200,
      customer: {
        name: 'John',
        email: 'john@test.com',
        address: 'Address 1',
      },
      items: [
        { id: 1, name: 'Item 1', category: 'A', qty: 2 },
      ],
    },
    {
      id: 'ORD-2',
      date: new Date().toISOString(),
      amount: 100,
      customer: {
        name: 'Jane',
        email: 'jane@test.com',
        address: 'Address 2',
      },
      items: [],
    },
  ];

  test('renders empty state', () => {
    localStorage.setItem('orders', JSON.stringify([]));

    render(<Orders />);

    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();

    expect(trackEvent).toHaveBeenCalledWith('view_orders');
  });

  test('handles non-array orders safely', () => {
    localStorage.setItem('orders', JSON.stringify({}));

    render(<Orders />);

    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  test('renders orders list', () => {
    localStorage.setItem('orders', JSON.stringify(mockOrders));

    render(<Orders />);

    // latest order first (reverse)
    expect(screen.getByText('ORD-2')).toBeInTheDocument();
    expect(screen.getByText('ORD-1')).toBeInTheDocument();

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    expect(screen.getByText(/₹200/)).toBeInTheDocument();
    expect(screen.getByText(/₹100/)).toBeInTheDocument();
  });

  test('renders items and fallback "No items"', () => {
    localStorage.setItem('orders', JSON.stringify(mockOrders));

    render(<Orders />);

    // item exists
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    // fallback branch
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  test('renders qty conditionally', () => {
    localStorage.setItem('orders', JSON.stringify(mockOrders));

    render(<Orders />);

    expect(screen.getByText(/qty: 2/i)).toBeInTheDocument();
  });

  test('clear orders button works (non-empty state)', () => {
    localStorage.setItem('orders', JSON.stringify(mockOrders));

    render(<Orders />);

    fireEvent.click(screen.getByRole('button', { name: /^clear orders$/i }));

    expect(localStorage.getItem('orders')).toBeNull();
    expect(trackEvent).toHaveBeenCalledWith('clear_orders');
  });

  test('clear orders button disabled in empty state', () => {
    localStorage.setItem('orders', JSON.stringify([]));

    render(<Orders />);

    const btn = screen.getByRole('button', { name: /^clear orders$/i });
    expect(btn).toBeDisabled();
  });

  test('navigate back to dashboard (empty state)', () => {
    localStorage.setItem('orders', JSON.stringify([]));

    render(<Orders />);

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });

  test('navigate back to dashboard (non-empty state)', () => {
    localStorage.setItem('orders', JSON.stringify(mockOrders));

    render(<Orders />);

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });
});
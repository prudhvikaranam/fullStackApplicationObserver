import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { trackEvent } from '../../services/analytics';
import { useNavigate } from 'react-router-dom';

jest.mock('../../data/products', () => ([
  { id: 1, name: 'Prod 1', category: 'A', price: 50, description: 'Desc 1' },
  { id: 2, name: 'Prod 2', category: 'B', description: 'Desc 2' },
]));

jest.mock('../../services/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Dashboard Component', () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  test('renders dashboard and tracks page_view + impressions', () => {
    render(<Dashboard />);

    expect(screen.getByText(/eventcart dashboard/i)).toBeInTheDocument();

    expect(trackEvent).toHaveBeenCalledWith('page_view', { page: 'dashboard' });

    expect(trackEvent).toHaveBeenCalledWith('product_impression', {
      productId: 1,
      category: 'A',
    });

    expect(trackEvent).toHaveBeenCalledWith('product_impression', {
      productId: 2,
      category: 'B',
    });
  });

  test('filters products by category', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByText('A'));

    expect(trackEvent).toHaveBeenCalledWith('filter_applied', {
      category: 'A',
    });

    expect(screen.getByText('Prod 1')).toBeInTheDocument();
    expect(screen.queryByText('Prod 2')).not.toBeInTheDocument();
  });

  test('resets filter to all', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('all'));

    expect(screen.getByText('Prod 1')).toBeInTheDocument();
    expect(screen.getByText('Prod 2')).toBeInTheDocument();
  });

  test('addToCart - adds new product', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getAllByText('Add')[0]);

    const cart = JSON.parse(localStorage.getItem('cart'));

    expect(cart.length).toBe(1);
    expect(cart[0].qty).toBe(1);

    expect(trackEvent).toHaveBeenCalledWith('add_to_cart', {
      productId: 1,
      name: 'Prod 1',
      category: 'A',
      price: 50,
    });
  });

  test('addToCart - increments existing product', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 1, name: 'Prod 1', qty: 1 }]));

    render(<Dashboard />);

    fireEvent.click(screen.getAllByText('Add')[0]);

    const cart = JSON.parse(localStorage.getItem('cart'));
    expect(cart[0].qty).toBe(2);
  });

  test('view product navigates correctly', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getAllByText('View')[0]);

    expect(trackEvent).toHaveBeenCalledWith('view_product', {
      productId: 1,
      name: 'Prod 1',
      category: 'A',
      price: 50,
    });

    expect(navigateMock).toHaveBeenCalledWith('/product/1');
  });

  test('navigate to cart', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: /^cart$/i }));

    expect(trackEvent).toHaveBeenCalledWith('navigate_cart');
    expect(navigateMock).toHaveBeenCalledWith('/cart');
  });

  test('navigate to checkout', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

    expect(trackEvent).toHaveBeenCalledWith('checkout_started');
    expect(navigateMock).toHaveBeenCalledWith('/checkout');
  });

  test('navigate to orders', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: /my orders/i }));

    expect(trackEvent).toHaveBeenCalledWith('view_orders');
    expect(navigateMock).toHaveBeenCalledWith('/orders');
  });

  test('logout clears user and navigates', () => {
    localStorage.setItem('user', 'test-user');

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('user')).toBeNull();
    expect(trackEvent).toHaveBeenCalledWith('logout');
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('default price fallback (price || 100)', () => {
    render(<Dashboard />);

    fireEvent.click(screen.getAllByText('Add')[1]);

    expect(trackEvent).toHaveBeenCalledWith('add_to_cart', {
      productId: 2,
      name: 'Prod 2',
      category: 'B',
      price: 100,
    });
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { trackEvent } from '../../services/analytics';
import { useNavigate } from 'react-router-dom';
import Cart from '../Cart';

jest.mock('../../services/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Cart Component', () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  const mockCart = [
    { id: 1, name: 'Item 1', description: 'Desc 1', qty: 2 },
    { id: 2, name: 'Item 2', description: 'Desc 2', qty: 1 },
  ];

  test('renders empty cart', () => {
    render(<Cart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('loads cart from localStorage and tracks view_cart', () => {
    localStorage.setItem('cart', JSON.stringify(mockCart));

    render(<Cart />);

    expect(screen.getByText(/cart \(3 items\)/i)).toBeInTheDocument();

    expect(trackEvent).toHaveBeenCalledWith('view_cart', { items: 3 });
  });

  test('increments item quantity', () => {
    localStorage.setItem('cart', JSON.stringify(mockCart));

    render(<Cart />);

    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);

    const updated = JSON.parse(localStorage.getItem('cart'));
    expect(updated[0].qty).toBe(3);

    expect(trackEvent).toHaveBeenCalledWith('increment_cart_item', {
      productId: 1,
    });
  });

  test('decrements item quantity', () => {
    localStorage.setItem('cart', JSON.stringify(mockCart));

    render(<Cart />);

    const minusButtons = screen.getAllByText('−');
    fireEvent.click(minusButtons[0]);

    const updated = JSON.parse(localStorage.getItem('cart'));
    expect(updated[0].qty).toBe(1);

    expect(trackEvent).toHaveBeenCalledWith('decrement_cart_item', {
      productId: 1,
    });
  });

  test('removes item when qty becomes 0', () => {
    const cart = [{ id: 1, name: 'Item', description: 'Desc', qty: 1 }];
    localStorage.setItem('cart', JSON.stringify(cart));

    render(<Cart />);

    fireEvent.click(screen.getByText('−'));

    const updated = JSON.parse(localStorage.getItem('cart'));
    expect(updated.length).toBe(0);
  });

  test('removes item using remove button', () => {
    localStorage.setItem('cart', JSON.stringify(mockCart));

    render(<Cart />);

    const removeButtons = screen.getAllByText(/remove/i);
    fireEvent.click(removeButtons[0]);

    const updated = JSON.parse(localStorage.getItem('cart'));
    expect(updated.length).toBe(1);

    expect(trackEvent).toHaveBeenCalledWith('remove_from_cart', {
      productId: 1,
    });
  });

  test('clears cart', () => {
    localStorage.setItem('cart', JSON.stringify(mockCart));

    render(<Cart />);

    fireEvent.click(screen.getByText(/clear cart/i));

    const updated = JSON.parse(localStorage.getItem('cart'));
    expect(updated).toEqual([]);

    expect(trackEvent).toHaveBeenCalledWith('clear_cart');
  });

  test('navigates to checkout', () => {
    localStorage.setItem('cart', JSON.stringify(mockCart));

    render(<Cart />);

    fireEvent.click(screen.getByText(/check out/i));

    expect(trackEvent).toHaveBeenCalledWith('navigate_checkout');
    expect(navigateMock).toHaveBeenCalledWith('/checkout');
  });
});
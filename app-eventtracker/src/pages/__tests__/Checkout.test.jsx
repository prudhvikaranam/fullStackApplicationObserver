import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from '../Checkout';
import { trackEvent } from '../../services/analytics';
import { useNavigate } from 'react-router-dom';

jest.mock('../../services/analytics', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Checkout Component', () => {
  let navigateMock;

  const mockCart = [
    { id: 1, name: 'Item 1', qty: 2, price: 50, category: 'A' },
    { id: 2, name: 'Item 2', qty: 1, category: 'B' },
  ];

  // ✅ Helpers to remove duplication
  const setupCart = (cart = mockCart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const fillForm = ({ name = 'John', email = 'john@test.com', address = 'Address' } = {}) => {
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: name, name: 'name' },
    });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: email, name: 'email' },
    });

    fireEvent.change(screen.getByPlaceholderText(/address/i), {
      target: { value: address, name: 'address' },
    });
  };

  const submitForm = () => {
    fireEvent.click(screen.getByRole('button', { name: /pay/i }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders checkout and tracks view_checkout', () => {
    setupCart();

    render(<Checkout />);

    expect(screen.getByText(/checkout/i)).toBeInTheDocument();

    expect(trackEvent).toHaveBeenCalledWith('view_checkout', {
      items: 3,
    });
  });

  test('calculates total with default price fallback', () => {
    setupCart();

    render(<Checkout />);

    expect(screen.getByText(/total: ₹\s*200/i)).toBeInTheDocument();
  });

  test('updates input fields (handleChange)', () => {
    render(<Checkout />);

    const nameInput = screen.getByPlaceholderText(/name/i);

    fireEvent.change(nameInput, {
      target: { value: 'John', name: 'name' },
    });

    expect(nameInput.value).toBe('John');
  });

  test('validation fails for empty fields', () => {
    window.alert = jest.fn();

    setupCart([{ id: 1 }]);

    render(<Checkout />);

    submitForm();

    expect(window.alert).toHaveBeenCalledWith(
      'Please fill name, email and address.'
    );
  });

  test('validation fails for empty cart', () => {
    window.alert = jest.fn();

    setupCart([]);

    render(<Checkout />);

    fillForm();

    const form = document.querySelector('form');
    fireEvent.submit(form);

    expect(window.alert).toHaveBeenCalledWith('Your cart is empty.');
  });

  test('successful purchase flow', async () => {
    setupCart();
    window.alert = jest.fn();

    render(<Checkout />);

    fillForm();
    submitForm();

    expect(trackEvent).toHaveBeenCalledWith('purchase_started', {
      amount: 200,
      items: 3,
    });

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText(/order placed/i)).toBeInTheDocument();
    });

    const orders = JSON.parse(localStorage.getItem('orders'));
    expect(orders.length).toBe(1);

    expect(trackEvent).toHaveBeenCalledWith(
      'purchase_completed',
      expect.objectContaining({
        amount: 200,
        items: 3,
      })
    );
  });

  test('clears cart after purchase', async () => {
    setupCart();

    render(<Checkout />);

    fillForm();
    submitForm();

    jest.runAllTimers();

    await waitFor(() => {
      expect(localStorage.getItem('cart')).toBeNull();
    });
  });

  test('navigate after order placed', async () => {
    setupCart();

    render(<Checkout />);

    fillForm();
    submitForm();

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText(/order placed/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/dashboard/i));
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');

    fireEvent.click(screen.getByText(/orders/i));
    expect(navigateMock).toHaveBeenCalledWith('/orders');
  });

  test('button disabled when cart empty', () => {
    setupCart([]);

    render(<Checkout />);

    const btn = screen.getByRole('button', { name: /pay/i });
    expect(btn).toBeDisabled();
  });

  test('processing state shows loading text', () => {
    setupCart();

    render(<Checkout />);

    fillForm();
    submitForm();

    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });
});
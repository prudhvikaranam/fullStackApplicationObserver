import { render, screen } from '@testing-library/react';
import ProductDetail from '../ProductDetail';
import { useParams } from 'react-router-dom';

// 🔥 mock products data
jest.mock('../../data/products', () => ([
  { id: '1', name: 'Prod 1', description: 'Desc 1' },
  { id: '2', name: 'Prod 2', description: 'Desc 2' },
]));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

describe('ProductDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product details when product exists', () => {
    useParams.mockReturnValue({ id: '1' });

    render(<ProductDetail />);

    expect(screen.getByText(/product details/i)).toBeInTheDocument();
    expect(screen.getByText('Prod 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
  });

  test('renders "product not found" when product does not exist', () => {
    useParams.mockReturnValue({ id: '999' });

    render(<ProductDetail />);

    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  test('handles undefined id safely', () => {
    useParams.mockReturnValue({});

    render(<ProductDetail />);

    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });
});
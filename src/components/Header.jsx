import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartDropdown from './CartDropdown';

const Header = () => {
  const { items: products } = useSelector((state) => state.products);
  const { items: cartItems, totalQuantity } = useSelector((state) => state.cart);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-gray-800 hover:text-blue-600">
              FakeStore
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
                <li><Link to="/cart" className="text-gray-600 hover:text-blue-600">Cart</Link></li>
                <li><Link to="/checkout" className="text-gray-600 hover:text-blue-600">Checkout</Link></li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-gray-600">
              {products.length} Products
            </span>
            
            {/* Cart Icon */}
            <div className="relative">
              <Link to="/cart" className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 cursor-pointer">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-blue-600 font-semibold">{totalQuantity}</span>
              </Link>
              
              {/* Cart Dropdown */}
              <CartDropdown cartItems={cartItems} totalQuantity={totalQuantity} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
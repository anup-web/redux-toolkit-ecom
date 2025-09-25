import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, fetchRelatedProducts, clearProduct } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, loading, error, relatedLoading } = useSelector((state) => state.product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProduct(productId));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchRelatedProducts(product.category));
    }
  }, [dispatch, product]);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 600);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
            <p className="mb-4">{error}</p>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>→</li>
            <li><Link to="/" className="hover:text-blue-600">Products</Link></li>
            <li>→</li>
            <li><span className="text-gray-900 font-medium">{product.category}</span></li>
            <li>→</li>
            <li><span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span></li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center p-8">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-80 object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="ml-1 text-gray-700 font-medium">
                      {product.rating.rate} ({product.rating.count} reviews)
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    In Stock
                  </span>
                </div>
                <p className="text-gray-600 capitalize mb-2">
                  Category: <span className="font-medium">{product.category}</span>
                </p>
              </div>

              <div className="text-4xl font-bold text-blue-600">
                ${product.price}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={decreaseQuantity}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-l border-r border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                    isAddingToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding {quantity} to Cart
                    </>
                  ) : (
                    `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`
                  )}
                </button>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            {relatedLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
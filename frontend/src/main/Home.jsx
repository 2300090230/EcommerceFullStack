import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingCart, 
         FaMobile, FaLaptop, FaTshirt, FaHeadphones, 
         FaHome } from 'react-icons/fa'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [productsVisible, setProductsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const navigate = useNavigate();

  // Categories for quick navigation
  const categories = [
    { id: 1, name: "Mobiles", icon: <FaMobile size={24} /> },
    { id: 2, name: "Electronics", icon: <FaLaptop size={24} /> },
    { id: 3, name: "Fashion", icon: <FaTshirt size={24} /> },
    { id: 4, name: "Appliances", icon: <FaHome size={24} /> },
    { id: 5, name: "Audio", icon: <FaHeadphones size={24} /> },
  ];

  // Flash deals data
  const deals = [
    { id: 1, title: "Limited Time Offer", discount: "50% OFF", color: "bg-red-500" },
    { id: 2, title: "Weekend Special", discount: "BUY 1 GET 1", color: "bg-yellow-500" },
    { id: 3, title: "Flash Sale", discount: "FLAT ₹1000 OFF", color: "bg-green-500" },
  ];

  // Generate placeholders for the skeleton loader
  const skeletonCount = 8;
  const skeletonArray = Array(skeletonCount).fill(0);

  useEffect(() => {
    fetchProducts();
    
    // Reset any filter options that might be in sessionStorage
    sessionStorage.removeItem('selectedCategory');
    sessionStorage.removeItem('priceRange');
    sessionStorage.removeItem('sortBy');
  }, []);

  // Function to shuffle array randomly
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setProductsVisible(false);
      setImagesLoaded(false);
      
      // Get the products data
      const response = await axios.get(`${config.url}/product/viewallproducts`);
      
      // Shuffle the products to randomize their order
      const shuffledProducts = shuffleArray(response.data);
      
      // Set aside first 4 products for featured section
      const featured = shuffledProducts.slice(0, 4);
      const remaining = shuffledProducts.slice(4);
      
      setFeaturedProducts(featured);
      setProducts(remaining);
      setError("");
      
      // First phase: Show product cards without images (text content only)
      setTimeout(() => {
        setLoading(false);
        setProductsVisible(true);
        
        // Second phase: After more seconds, start loading images
        setTimeout(() => {
          setImagesLoaded(true);
        }, 1000);
      }, 1500);
      
    } catch (err) {
      setError("Failed to fetch products: " + (err.response?.data || err.message));
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  // Redirect to login for all interactions
  const redirectToLogin = (action) => {
    toast.info(`Please login to ${action}`);
    setTimeout(() => {
      navigate('/buyerlogin');
    }, 1000);
  };

  const handleAddToCart = () => {
    redirectToLogin('add items to cart');
  };

  const handleBuyNow = () => {
    redirectToLogin('buy products');
  };

  // Redirect all category navigation to login as well
  const navigateToCategory = () => {
    redirectToLogin('browse categories');
  };
  
  // Product Card Component for reusability
  const ProductCard = ({ product, index, delay }) => (
    <div 
      key={product.id}
      className={`bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 ${
        productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      onClick={() => redirectToLogin('view product details')}
    >
      {/* Product image */}
      <div className="relative h-48 bg-gray-100" style={{ cursor: 'pointer' }}>
        {imagesLoaded ? (
          <img 
            src={`${config.url}/product/displayproductimage?id=${product.id}`} 
            alt={product.name} 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=Product";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Price tag */}
        <div className="absolute bottom-2 left-2 bg-gray-900 text-white text-sm font-bold px-2 py-1 rounded-md">
          ₹{product.cost}
        </div>
      </div>
      
      {/* Product content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-800 text-lg truncate" title={product.name}>
          {product.name}
        </h3>
        <div className="flex items-center mt-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-1">(42)</span>
        </div>
        
        <div className="mt-4 space-y-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow();
            }}
            className="w-full bg-gray-900 text-white py-2 rounded font-medium hover:bg-black transition-colors"
          >
            Buy Now
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full bg-white text-gray-900 py-2 rounded font-medium border border-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  // Skeleton Card Component for loading state
  const SkeletonCard = ({ index }) => (
    <div 
      key={index} 
      className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 animate-pulse"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 skeleton-loading"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded skeleton-loading mb-3"></div>
        <div className="h-4 bg-gray-200 rounded skeleton-loading mb-4 w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded skeleton-loading mb-2"></div>
        <div className="h-8 bg-gray-200 rounded skeleton-loading"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Featured Products Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Products</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-md">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={index} index={index} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  delay={index * 100}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* All Products Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">All Products</h2>
            <button 
              onClick={() => redirectToLogin('view all products')}
              className="text-gray-900 text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skeletonArray.map((_, index) => (
                <SkeletonCard key={index} index={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  delay={index * 50}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .skeleton-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
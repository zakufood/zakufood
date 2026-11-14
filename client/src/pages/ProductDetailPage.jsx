import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);

        // Fetch related products from same category
        const relRes = await fetch(`/api/products?category=${data.data.category}`);
        const relData = await relRes.json();
        if (relData.success) {
          setRelatedProducts(relData.data.filter((p) => p.id !== data.data.id).slice(0, 4));
        }
      }
    } catch (err) {
      console.error('Failed to load product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-8 h-8 border-3 border-[#7A1F1F] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-stone-600 font-bold text-sm">Loading spice details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-stone-500 text-sm">The spice item you are looking for is unavailable.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1F1F] text-white rounded-xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link to="/" className="hover:text-[#7A1F1F]">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#7A1F1F]">Products</Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Box */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 p-6 sm:p-10">
          
          {/* Left: Product Jar Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-100 p-8">
            <div className="w-full max-w-md h-80 sm:h-96 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A1F1F] bg-[#7A1F1F]/10 px-3 py-1 rounded-md">
                {product.categoryName || 'ZAKU'}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-black mt-3 tracking-tight">
                {product.name}
              </h1>

              {/* Price and Weight */}
              <div className="flex items-baseline gap-4 mt-4 pb-4 border-b border-stone-100">
                <span className="text-3xl font-black text-[#7A1F1F]">
                  ৳ {product.price}
                </span>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                  Weight: {product.weight}
                </span>
              </div>

              {/* Description */}
              <div className="mt-4 space-y-3">
                <p className="text-sm text-stone-700 leading-relaxed">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-5 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                    Ingredients:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector, Add to Cart, Buy Now */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  Total: <strong className="text-stone-900 font-bold text-sm">৳{product.price * quantity}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#7A1F1F] hover:bg-[#631717] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl font-bold text-sm bg-stone-900 hover:bg-black text-white flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Delivery Note */}
              <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <Truck className="w-4 h-4 text-[#7A1F1F] shrink-0" />
                <span>Cash on Delivery available nationwide in Bangladesh</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Related Spices */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              Related Spices
            </h3>
            <Link to="/products" className="text-xs font-bold text-[#7A1F1F] hover:underline">
              View All Spices →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

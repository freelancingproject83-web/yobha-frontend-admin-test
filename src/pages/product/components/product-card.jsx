import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { addToWishlist } from "../../../service/wishlist";

/**
 * ProductCard Component - Luxury Gucci-inspired design
 * 
 * Props:
 * @param {Object} product - Product data object
 * 
 * Expected product structure (from API):
 * {
 *   id: string,
 *   productId: string,
 *   name: string,
 *   price: number,
 *   category: string,
 *   images: string[],
 *   available: boolean,
 *   productMainCategory: string,
 *   availableColors: string[],
 *   availableSizes: string[]
 * }
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Safe data extraction with null checks
  const productId = product?.id || '';
  const productName = product?.name || 'Untitled Product';
  const productPrice = product?.price || 0;
  const productImages = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/400x400?text=No+Image'];
  const hasMultipleImages = productImages.length > 1;
  const availableColors = Array.isArray(product?.availableColors) ? product.availableColors : [];
  const availableSizes = Array.isArray(product?.availableSizes) ? product.availableSizes : [];

  // Format price
  const formattedPrice = typeof productPrice === 'number'
    ? `₹${productPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : productPrice;

  const handleCardClick = () => {
    if (productId) {
      navigate(`/productDetail/${productId}`);
    }
  };
  const handleAddToWishlist = async (productId) => {
    const payload={
  "productId": "PID10001",
  "variantSku": "PID10001-NAV-S",
  "desiredQuantity": 1,
  "desiredSize": "S",
  "desiredColor": "Navy Blue",
  "notifyWhenBackInStock": true,
  "note": "Buy during Diwali sale"
}

    try {
      const result = await addToWishlist(productId,payload);
      console.log("Added to wishlist:", result);
      alert("Product added to wishlist!");
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      alert("Failed to add to wishlist");
    }
  };
  const handleWishlist = (e) => {
    // e.stopPropagation();
    // setIsWishlisted(!isWishlisted);
    handleAddToWishlist(e)
    // TODO: Add to wishlist API call
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white border border-text-light/20 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-premium-beige">
        {/* Carousel Images */}
        <div className="relative w-full h-full">
          {productImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${productName} - ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                index === currentImageIndex 
                  ? 'opacity-100' 
                  : 'opacity-0'
              } group-hover:scale-105`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
              }}
            />
          ))}
        </div>

        {/* Navigation Arrows - Show on hover if multiple images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all z-20"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} className="text-black" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all z-20"
              aria-label="Next image"
            >
              <ChevronRight size={16} className="text-black" />
            </button>
          </>
        )}

        {/* Wishlist Icon */}
        <button 
          onClick={()=>handleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 p-2 backdrop-blur-sm transition-all duration-300 ${
            isWishlisted 
              ? 'bg-black' 
              : 'bg-white/90 hover:bg-white'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={16} 
            className={`transition-all ${
              isWishlisted 
                ? 'text-white fill-white' 
                : 'text-black'
            }`} 
          />
        </button>

        {/* Image Indicator Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(index, e)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'w-6 bg-black' 
                    : 'w-1 bg-black/30 hover:bg-black/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        {/* Product Name */}
        <h3 className="text-text-dark font-semibold text-base mb-2 line-clamp-2 group-hover:text-black transition-colors uppercase tracking-tight">
          {productName}
        </h3>

        {/* Available Options */}
        <div className="mb-3 space-y-1">
          {availableColors.length > 0 && (
            <p className="text-text-light text-xs uppercase tracking-wider">
              {availableColors.length} Color{availableColors.length !== 1 ? 's' : ''}
            </p>
          )}
          {availableSizes.length > 0 && (
            <p className="text-text-light text-xs uppercase tracking-wider">
              Sizes: {availableSizes.join(', ')}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-text-light/20">
          <span className="text-black font-bold text-xl">
            {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

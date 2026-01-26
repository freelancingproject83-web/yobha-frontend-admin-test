import React, { useState, useEffect, useCallback } from "react";
import ImageUploader from "../comman/Image-Uploader/ImageUploader";

// Helper utilities
const parseFloatValue = (val) => parseFloat(val) || 0;

const ProductForm = ({ 
  initialData = null, 
  onSubmit, 
  isEditMode = false,
  submitButtonText = "Submit Product"
}) => {
  const [dropdownOptions] = useState({
    categories: ["Sleepwear", "Loungewear", "Homewear", "Accessories", "PetAccessories"],
    subCategories: ["Nightshirts", "Pajamas", "Robes", "Shorts"],
    mainCategories: ["Men", "Women", "Kids", "Pets", "Couple", "Family", "Scrunchies", "Socks", "Eyemasks", "Headband", "Cushions"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Rose", "Blush", "Black", "White", "Grey"],
    fabricTypes: ["Cotton", "Silk", "Linen", "Satin", "Polyester"],
    countries: [
      { code: "IN", name: "India" },
      { code: "AE", name: "United Arab Emirates (UAE)" },
      { code: "SA", name: "Saudi Arabia" },
      { code: "QA", name: "Qatar" },
      { code: "KW", name: "Kuwait" },
      { code: "OM", name: "Oman" },
      { code: "BH", name: "Bahrain" },
      { code: "JO", name: "Jordan" },
      { code: "LB", name: "Lebanon" },
      { code: "EG", name: "Egypt" },
      { code: "IQ", name: "Iraq" },
      { code: "US", name: "United States" },
      { code: "UK", name: "United Kingdom" },
      { code: "CA", name: "Canada" },
      { code: "AU", name: "Australia" }
    ],
    currencies: ["INR", "USD", "GBP", "CAD", "AUD"],
  });

  // Country to Currency mapping
  const countryCurrencyMap = {
    "IN": "INR",
    "AE": "AED", 
    "SA": "SAR",
    "QA": "QAR",
    "KW": "KWD",
    "OM": "OMR",
    "BH": "BHD",
    "JO": "JOD",
    "LB": "LBP",
    "EG": "EGP",
    "IQ": "IQD",
    "US": "USD",
    "UK": "GBP",
    "CA": "CAD",
    "AU": "AUD"
  };

  // Initialize form data
  const getInitialData = useCallback(() => {
    console.log("=== ProductForm getInitialData ===");
    console.log("initialData:", initialData);
    console.log("isEditMode:", isEditMode);
    
    if (initialData && isEditMode) {
      console.log("Processing initialData for edit mode");
      
      // Map API response fields to form expected fields
      const processedData = {
        // Basic product info
        ProductId: initialData.productId || initialData.ProductId || "",
        Name: initialData.name || initialData.Name || "",
        Slug: initialData.slug || initialData.Slug || "",
        Description: initialData.description || initialData.Description || "",
        
        // Pricing
        Price: typeof initialData.price === 'object' && initialData.price !== null ? parseFloatValue(initialData.price.$numberDecimal || "0") : parseFloatValue(initialData.price || initialData.Price || "0"),
        CompareAtPrice: typeof initialData.compareAtPrice === 'object' && initialData.compareAtPrice !== null ? parseFloatValue(initialData.compareAtPrice.$numberDecimal || "0") : parseFloatValue(initialData.compareAtPrice || initialData.CompareAtPrice || "0"),
        
        // Categories
        ProductCategory: initialData.productCategory || initialData.Category || "",
        ProductMainCategory: initialData.productMainCategory || initialData.MainCategory || "",
        ProductSubCategory: initialData.productSubCategory || initialData.SubCategory || "",
        
        // Inventory
        Stock: initialData.stock || initialData.Stock || 0,
        
        // Arrays and complex objects
        PriceList: initialData.priceList || initialData.PriceList || [],
        CountryPrices: initialData.countryPrices || initialData.CountryPrices || [],
        Specifications: {
          fabric: (initialData.specifications && initialData.specifications.fabric) || (initialData.Specifications && initialData.Specifications.fabric) || "",
          length: (initialData.specifications && initialData.specifications.length) || (initialData.Specifications && initialData.Specifications.length) || "",
          origin: (initialData.specifications && initialData.specifications.origin) || (initialData.Specifications && initialData.Specifications.origin) || "",
          fit: (initialData.specifications && initialData.specifications.fit) || (initialData.Specifications && initialData.Specifications.fit) || "",
          care: (initialData.specifications && initialData.specifications.care) || (initialData.Specifications && initialData.Specifications.care) || "",
          extra: (initialData.specifications && initialData.specifications.extra) || (initialData.Specifications && initialData.Specifications.extra) || []
        },
        KeyFeatures: initialData.keyFeatures || initialData.KeyFeatures || [],
        CareInstructions: initialData.careInstructions || initialData.CareInstructions || [],
        Inventory: initialData.inventory || initialData.Inventory || [],
        Variants: initialData.variants || initialData.Variants || [],
        Images: initialData.images || initialData.Images || [],
        SizeOfProduct: initialData.sizeOfProduct || initialData.SizeOfProduct || [],
        AvailableColors: initialData.availableColors || initialData.AvailableColors || [],
        FabricType: initialData.fabricType || initialData.FabricType || [],
        
        // Shipping and policies
        ShippingInfo: {
          freeShipping: (initialData.shippingInfo && initialData.shippingInfo.freeShipping !== undefined) ? initialData.shippingInfo.freeShipping : 
                       (initialData.ShippingInfo && initialData.ShippingInfo.freeShipping !== undefined) ? initialData.ShippingInfo.freeShipping : true,
          estimatedDelivery: (initialData.shippingInfo && initialData.shippingInfo.estimatedDelivery) || 
                            (initialData.ShippingInfo && initialData.ShippingInfo.estimatedDelivery) || "",
          cashOnDelivery: (initialData.shippingInfo && initialData.shippingInfo.cashOnDelivery !== undefined) ? initialData.shippingInfo.cashOnDelivery : 
                         (initialData.ShippingInfo && initialData.ShippingInfo.cashOnDelivery !== undefined) ? initialData.ShippingInfo.cashOnDelivery : true,
          shippingPrice: (initialData.shippingInfo && initialData.shippingInfo.shippingPrice) || 
                        (initialData.ShippingInfo && initialData.ShippingInfo.shippingPrice) || 0
        },
        ReturnPolicy: initialData.returnPolicy || initialData.ReturnPolicy || "",
        
        // SEO
        MetaTitle: initialData.metaTitle || initialData.MetaTitle || "",
        MetaDescription: initialData.metaDescription || initialData.MetaDescription || "",
        
        // Status flags
        IsActive: initialData.isActive !== undefined ? initialData.isActive : (initialData.IsActive !== undefined ? initialData.IsActive : true),
        IsFeatured: initialData.isFeatured !== undefined ? initialData.isFeatured : (initialData.IsFeatured !== undefined ? initialData.IsFeatured : false),
        FreeDelivery: initialData.freeDelivery !== undefined ? initialData.freeDelivery : (initialData.FreeDelivery !== undefined ? initialData.FreeDelivery : false),
        
        // Additional fields that might be in the API response
        AverageRating: initialData.averageRating || initialData.AverageRating || 0,
        ReviewCount: initialData.reviewCount || initialData.ReviewCount || 0,
        SalesCount: initialData.salesCount || initialData.SalesCount || 0,
        Views: initialData.views || initialData.Views || 0,
        UnitsSold: initialData.unitsSold || initialData.UnitsSold || 0,
        
        // Timestamps
        CreatedAt: initialData.createdAt || initialData.CreatedAt || "",
        UpdatedAt: initialData.updatedAt || initialData.UpdatedAt || ""
              };
              
              console.log("=== PRODUCT FORM DEBUG ===");
              console.log("Initial data received:", initialData);
              console.log("Category values from API:", {
                productCategory: initialData.productCategory,
                Category: initialData.Category,
                productMainCategory: initialData.productMainCategory,
                MainCategory: initialData.MainCategory,
                productSubCategory: initialData.productSubCategory,
                SubCategory: initialData.SubCategory
              });
              console.log("Processed category values:", {
                ProductCategory: processedData.ProductCategory,
                ProductMainCategory: processedData.ProductMainCategory,
                ProductSubCategory: processedData.ProductSubCategory
              });
              console.log("==========================");
              console.log("Processed data:", processedData);
              return processedData;
    }

    return {
      ProductId: "",
      Name: "",
      Slug: "",
      Description: "",
      Price: 0,
      CompareAtPrice: 0,
      DiscountPercent: 0,
      ProductMainCategory: "",
      ProductCategory: "",
      ProductSubCategory: "",
      SizeOfProduct: [],
      AvailableColors: [],
      FabricType: [],
      PriceList: [],
      CountryPrices: [],
      Specifications: { Fabric: "", Length: "", Origin: "", Fit: "", Care: "", Extra: [] },
      KeyFeatures: [],
      CareInstructions: [],
      Inventory: [],
      Variants: [],
      Images: [],
      FreeDelivery: true,
      ReturnPolicy: "",
      ShippingInfo: { FreeShipping: true, EstimatedDelivery: "", CashOnDelivery: true }
    };
  }, [initialData, isEditMode]);

  const [data, setData] = useState(() => {
    const initial = getInitialData();
    console.log("Initial data state:", initial);
    return initial;
  });


  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form data
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!data.ProductId?.trim()) newErrors.ProductId = 'Product ID is required';
    if (!data.Name?.trim()) newErrors.Name = 'Product name is required';
    if (!data.Slug?.trim()) newErrors.Slug = 'Product slug is required';
    if (!data.Description?.trim()) newErrors.Description = 'Product description is required';
    if (!data.Price || data.Price <= 0) newErrors.Price = 'Valid price is required';
    if (!data.ProductMainCategory?.trim()) newErrors.ProductMainCategory = 'Main category is required';
    if (!data.ProductCategory?.trim()) newErrors.ProductCategory = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  // Update data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEditMode) {
      console.log("=== ProductForm useEffect - Updating data ===");
      const newData = getInitialData();
      console.log("Setting new data:", newData);
      setData(newData);
    }
  }, [initialData, isEditMode, getInitialData]);

  // Initialize local input states when data changes
  useEffect(() => {
    setSizesInput(data.SizeOfProduct.join(", "));
    setColorsInput(data.AvailableColors.join(", "));
    setFabricInput(data.FabricType.join(", "));
  }, [data.SizeOfProduct, data.AvailableColors, data.FabricType]);

  // Helper function to update nested data
  const update = (path, value) => {
    setData((d) => {
      const nd = JSON.parse(JSON.stringify(d));
      let cur = nd;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return nd;
    });
  };

  // Helper function to get currency based on country
  const getCurrencyByCountry = (countryCode) => {
    return countryCurrencyMap[countryCode];
  };

  // Handle country selection for price list
  const handlePriceListCountryChange = (countryCode) => {
    const currency = getCurrencyByCountry(countryCode);
    setPriceListLocal(prev => ({ 
      ...prev, 
      Country: countryCode, 
      Currency: currency 
    }));
  };

  // Handle country selection for country prices
  const handleCountryPriceCountryChange = (countryCode) => {
    const currency = getCurrencyByCountry(countryCode);
    setCountryPriceLocal(prev => ({ 
      ...prev, 
      Country: countryCode, 
      Currency: currency 
    }));
  };

  // Local state for dynamic form sections
  const [priceListLocal, setPriceListLocal] = useState({ 
    Size: dropdownOptions.sizes[0], 
    PriceAmount: "0", 
    Currency: countryCurrencyMap["IN"], 
    Quantity: 0, 
    Country: "IN" 
  });

  const [countryPriceLocal, setCountryPriceLocal] = useState({ 
    Country: "IN", 
    PriceAmount: "0", 
    Currency: countryCurrencyMap["IN"] 
  });

  const [inventoryLocal, setInventoryLocal] = useState({ 
    Sku: "", 
    Size: dropdownOptions.sizes[0], 
    Color: dropdownOptions.colors[0], 
    Quantity: 0 
  });

  const [variantLocal, setVariantLocal] = useState({ 
    Sku: "", 
    Color: dropdownOptions.colors[0], 
    Size: dropdownOptions.sizes[0], 
    Quantity: 0 
  });

  const [specExtraLocal, setSpecExtraLocal] = useState({ Key: "", Value: "" });
  const [keyFeatureLocal, setKeyFeatureLocal] = useState("");
  const [careInstructionLocal, setCareInstructionLocal] = useState("");
  
  // Local state for comma-separated inputs
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  
  // State for tracking which items are being edited
  const [editingItems, setEditingItems] = useState({
    priceList: {},
    countryPrices: {},
    specifications: {},
    keyFeatures: {},
    careInstructions: {},
    inventory: {},
    variants: {}
  });
  const [fabricInput, setFabricInput] = useState("");

  // Editing state management functions
  const startEditing = (section, index) => {
    setEditingItems(prev => ({
      ...prev,
      [section]: { ...prev[section], [index]: true }
    }));
  };

  const stopEditing = (section, index) => {
    setEditingItems(prev => ({
      ...prev,
      [section]: { ...prev[section], [index]: false }
    }));
  };

  const isEditing = (section, index) => {
    return editingItems[section] && editingItems[section][index];
  };

  const updateArrayItem = (path, index, updatedItem) => {
    setData((d) => {
      const nd = { ...d };
      let cur = nd;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      const array = [...(cur[parts[parts.length - 1]] || [])];
      array[index] = updatedItem;
      cur[parts[parts.length - 1]] = array;
      return nd;
    });
  };

  // Helper function to find existing price for a country
  const findExistingPrice = (countryCode, excludeIndex = null) => {
    // Check CountryPrices first
    const countryPrice = data.CountryPrices?.find((item, index) => 
      index !== excludeIndex && (item.Country === countryCode || item.country === countryCode)
    );
    if (countryPrice) {
      return countryPrice.PriceAmount || countryPrice.priceAmount || 0;
    }

    // Check PriceList as fallback
    const priceListItem = data.PriceList?.find((item, index) => 
      index !== excludeIndex && (item.Country === countryCode || item.country === countryCode)
    );
    if (priceListItem) {
      return priceListItem.PriceAmount || priceListItem.priceAmount || 0;
    }

    return 0;
  };

  // Helper function to find existing currency for a country
  const findExistingCurrency = (countryCode, excludeIndex = null) => {
    // Check CountryPrices first
    const countryPrice = data.CountryPrices?.find((item, index) => 
      index !== excludeIndex && (item.Country === countryCode || item.country === countryCode)
    );
    if (countryPrice) {
      return countryPrice.Currency || countryPrice.currency || 'INR';
    }

    // Check PriceList as fallback
    const priceListItem = data.PriceList?.find((item, index) => 
      index !== excludeIndex && (item.Country === countryCode || item.country === countryCode)
    );
    if (priceListItem) {
      return priceListItem.Currency || priceListItem.currency || 'INR';
    }

    // Default currency based on country
    const countryCurrencyMap = {
      "IN": "INR",
      "AE": "AED", 
      "SA": "SAR",
      "QA": "QAR",
      "KW": "KWD",
      "OM": "OMR",
      "BH": "BHD",
      "JO": "JOD",
      "LB": "LBP",
      "EG": "EGP",
      "IQ": "IQD",
      "US": "USD",
      "UK": "GBP",
      "CA": "CAD",
      "AU": "AUD"
    };
    return countryCurrencyMap[countryCode] || 'INR';
  };

  // Array management functions
  const addToArray = (path, item) => {
    setData((d) => {
      const nd = JSON.parse(JSON.stringify(d));
      let cur = nd;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = [...(cur[parts[parts.length - 1]] || []), item];
      return nd;
    });
  };

  const removeFromArray = (path, index) => {
    setData((d) => {
      const nd = JSON.parse(JSON.stringify(d));
      let cur = nd;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = cur[parts[parts.length - 1]].filter((_, i) => i !== index);
      return nd;
    });
  };

  // Specific add functions
  const addPriceListItem = () => {
    if (priceListLocal.Size && priceListLocal.PriceAmount && priceListLocal.Quantity) {
      const item = {
        Size: priceListLocal.Size,
        PriceAmount: parseFloat(priceListLocal.PriceAmount),
        Currency: priceListLocal.Currency,
        Quantity: parseInt(priceListLocal.Quantity),
        Country: priceListLocal.Country
      };
      addToArray("PriceList", item);
      console.log(item,"item")
      setPriceListLocal({ 
        Size: dropdownOptions.sizes[0], 
        PriceAmount: "0", 
        Currency: "INR", 
        Quantity: 0, 
        Country: "IN" 
      });
    }
  };

  const addCountryPrice = () => {
    if (countryPriceLocal.Country && countryPriceLocal.PriceAmount) {
      const item = {
        Country: countryPriceLocal.Country,
        PriceAmount: parseFloat(countryPriceLocal.PriceAmount),
        Currency: countryPriceLocal.Currency
      };
      addToArray("CountryPrices", item);
      setCountryPriceLocal({ Country: "IN", PriceAmount: "0", Currency: "INR" });
    }
  };

  const addInventory = () => {
    if (inventoryLocal.Sku && inventoryLocal.Size && inventoryLocal.Color && inventoryLocal.Quantity) {
      const item = {
        Sku: inventoryLocal.Sku,
        Size: inventoryLocal.Size,
        Color: inventoryLocal.Color,
        Quantity: parseInt(inventoryLocal.Quantity)
      };
      addToArray("Inventory", item);
      setInventoryLocal({ 
        Sku: "", 
        Size: dropdownOptions.sizes[0], 
        Color: dropdownOptions.colors[0], 
        Quantity: 0 
      });
    }
  };

  const addVariant = () => {
    if (variantLocal.Sku && variantLocal.Size && variantLocal.Color && variantLocal.Quantity) {
      const item = {
        Sku: variantLocal.Sku,
        Size: variantLocal.Size,
        Color: variantLocal.Color,
        Quantity: parseInt(variantLocal.Quantity)
      };
      addToArray("Variants", item);
      setVariantLocal({ 
        Sku: "", 
        Size: dropdownOptions.sizes[0], 
        Color: dropdownOptions.colors[0], 
        Quantity: 0 
      });
    }
  };

  const addSpecExtra = () => {
    if (specExtraLocal.Key && specExtraLocal.Value) {
      const item = { Key: specExtraLocal.Key, Value: specExtraLocal.Value };
      addToArray("Specifications.Extra", item);
      setSpecExtraLocal({ Key: "", Value: "" });
    }
  };

  const addKeyFeature = () => {
    if (keyFeatureLocal.trim()) {
      addToArray("KeyFeatures", keyFeatureLocal.trim());
      setKeyFeatureLocal("");
    }
  };

  const addCareInstruction = () => {
    if (careInstructionLocal.trim()) {
      addToArray("CareInstructions", careInstructionLocal.trim());
      setCareInstructionLocal("");
    }
  };

  // Image upload handlers
  const handleProductImageUpload = async (uploadResults) => {
    if (!uploadResults || uploadResults.length === 0) return;
    
    // Process each uploaded image result
    uploadResults.forEach(result => {
      const imageObj = {
        Url: result.url,
        ThumbnailUrl: result.url, // Using same URL for thumbnail
        Alt: result.name || `${data.ProductId || "product"} image`
      };
      addToArray("Images", imageObj);
    });
  };

  // Handle comma-separated arrays
  const handleCommaArray = (path, value) => {
    // Allow empty string and handle comma separation properly
    if (!value || value.trim() === "") {
      update(path, []);
      return;
    }
    const array = value.split(",").map(item => item.trim()).filter(Boolean);
    update(path, array);
  };

  // Handle sizes input
  const handleSizesChange = (value) => {
    setSizesInput(value);
  };

  const handleSizesBlur = () => {
    handleCommaArray("SizeOfProduct", sizesInput);
  };

  // Handle colors input
  const handleColorsChange = (value) => {
    setColorsInput(value);
  };

  const handleColorsBlur = () => {
    handleCommaArray("AvailableColors", colorsInput);
  };

  // Handle fabric input
  const handleFabricChange = (value) => {
    setFabricInput(value);
  };

  const handleFabricBlur = () => {
    handleCommaArray("FabricType", fabricInput);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Process any pending comma-separated inputs before submission
    handleCommaArray("SizeOfProduct", sizesInput);
    handleCommaArray("AvailableColors", colorsInput);
    handleCommaArray("FabricType", fabricInput);
    
    // Small delay to ensure state updates are processed
    setTimeout(async () => {
      const payload = JSON.parse(JSON.stringify(data));

      console.log("Final payload:", payload);
      if (onSubmit) {
        await onSubmit(payload);
      }
    }, 100);
    
    setIsSubmitting(false);
  };

  // Safety check to ensure data is always defined
  if (!data) {
    console.log("Data is undefined, using fallback");
    return <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading form...</p>
      </div>
    </div>;
  }

  return (
    <div 
      className="w-full max-w-none"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <form onSubmit={handleSubmit} className="w-full space-y-16 bg-white">
        
        {/* Basic Product Information */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Basic Information</h3>
            <p className="text-gray-500 text-sm font-light">Essential product details</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Product ID</label>
              <input
                type="text"
                value={data.ProductId}
                onChange={(e) => update("ProductId", e.target.value)}
                className={`w-full border px-4 py-3 focus:outline-none transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light ${
                  errors.ProductId ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                }`}
                placeholder="Enter Product ID"
                required
              />
              {errors.ProductId && (
                <p className="text-xs text-red-500 font-light">{errors.ProductId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Product Name</label>
              <input
                type="text"
                value={data.Name}
                onChange={(e) => update("Name", e.target.value)}
                className={`w-full border px-4 py-3 focus:outline-none transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light ${
                  errors.Name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                }`}
                placeholder="Enter Product Name"
                required
              />
              {errors.Name && (
                <p className="text-xs text-red-500 font-light">{errors.Name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Slug</label>
              <input
                type="text"
                value={data.Slug}
                onChange={(e) => update("Slug", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Enter Product Slug"
                required
              />
            </div>
            
            <div className="md:col-span-2 xl:col-span-3 space-y-2">
              <label className="block text-sm font-light text-gray-700">Description</label>
              <textarea
                value={data.Description}
                onChange={(e) => update("Description", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Enter Product Description"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Pricing</h3>
            <p className="text-gray-500 text-sm font-light">Set product pricing details</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                value={data.Price || ""}
                onChange={(e) => update("Price", parseFloatValue(e.target.value))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Compare At Price</label>
              <input
                type="number"
                step="0.01"
                value={data.CompareAtPrice || ""}
                onChange={(e) => update("CompareAtPrice", parseFloatValue(e.target.value))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Discount Percent</label>
              <input
                type="number"
                value={data.DiscountPercent || ""}
                onChange={(e) => update("DiscountPercent", e.target.value === "" ? "" : parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Categories</h3>
            <p className="text-gray-500 text-sm font-light">Organize your product</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Main Category</label>
              <select
                value={data.ProductMainCategory}
                onChange={(e) => update("ProductMainCategory", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
                required
              >
                <option value="">Select Main Category</option>
                {dropdownOptions.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Category</label>
              <select
                value={data.ProductCategory}
                onChange={(e) => update("ProductCategory", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
                required
              >
                <option value="">Select Category</option>
                {dropdownOptions.mainCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Sub Category</label>
              <input
                type="text"
                value={data.ProductSubCategory}
                onChange={(e) => update("ProductSubCategory", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Enter Sub Category"
                
              />
            </div>
          </div>
        </div>

        {/* Product Attributes */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Product Attributes</h3>
            <p className="text-gray-500 text-sm font-light">Define product characteristics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Sizes</label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => handleSizesChange(e.target.value)}
                onBlur={handleSizesBlur}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="S, M, L, XL"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Available Colors</label>
              <input
                type="text"
                value={colorsInput}
                onChange={(e) => handleColorsChange(e.target.value)}
                onBlur={handleColorsBlur}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Navy, Rose, Blush"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Fabric Types</label>
              <input
                type="text"
                value={fabricInput}
                onChange={(e) => handleFabricChange(e.target.value)}
                onBlur={handleFabricBlur}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Cotton, Silk"
              />
            </div>
          </div>
        </div>

        {/* Price List */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Price List</h3>
            <p className="text-gray-500 text-sm font-light">Configure pricing for different sizes and countries</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Size</label>
              <select
                value={priceListLocal.Size}
                onChange={(e) => setPriceListLocal(prev => ({ ...prev, Size: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                {dropdownOptions.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Price Amount</label>
              <input
                type="number"
                step="0.01"
                value={priceListLocal.PriceAmount}
                onChange={(e) => setPriceListLocal(prev => ({ ...prev, PriceAmount: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Currency</label>
              <input
                type="text"
                value={priceListLocal.Currency}
                readOnly
                className="w-full border border-gray-200 px-4 py-3 bg-gray-50 text-gray-600 text-sm font-light cursor-not-allowed"
                placeholder="Auto-set based on country"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Quantity</label>
              <input
                type="number"
                value={priceListLocal.Quantity}
                onChange={(e) => setPriceListLocal(prev => ({ ...prev, Quantity: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Country</label>
              <select
                value={priceListLocal.Country}
                onChange={(e) => handlePriceListCountryChange(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
                required
              >
                <option value="">Select Country</option>
                {dropdownOptions.countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="button"
            onClick={addPriceListItem}
            className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Add Price List Item
          </button>
          
          {/* Display added price list items */}
          {data.PriceList && data.PriceList.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-light text-black mb-4">Added Price List Items</h4>
                      <div className="space-y-4">
                {data.PriceList.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-4 border border-gray-200">
                    {isEditing('priceList', index) ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-light text-gray-700">Size</label>
                            <input
                              type="text"
                              value={item.Size || ''}
                              onChange={(e) => updateArrayItem("PriceList", index, { ...item, Size: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm bg-white focus:border-black focus:outline-none font-light"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-light text-gray-700">Price Amount</label>
                            <input
                              type="number"
                              value={item.PriceAmount || ''}
                              onChange={(e) => updateArrayItem("PriceList", index, { ...item, PriceAmount: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm bg-white focus:border-black focus:outline-none font-light"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-light text-gray-700">Currency</label>
                            <select
                              value={item.Currency || 'INR'}
                              onChange={(e) => updateArrayItem("PriceList", index, { ...item, Currency: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm bg-white focus:border-black focus:outline-none font-light"
                            >
                              <option value="INR">INR</option>
                              <option value="USD">USD</option>
                              <option value="GBP">GBP</option>
                              <option value="CAD">CAD</option>
                              <option value="AUD">AUD</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Quantity</label>
                            <input
                              type="number"
                              value={item.Quantity || ''}
                              onChange={(e) => updateArrayItem("PriceList", index, { ...item, Quantity: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Country</label>
                            <select
                              value={item.Country || 'IN'}
                              onChange={(e) => {
                                const countryCode = e.target.value;
                                const existingPrice = findExistingPrice(countryCode, index);
                                const existingCurrency = findExistingCurrency(countryCode, index);
                                updateArrayItem("PriceList", index, { 
                                  ...item, 
                                  Country: countryCode,
                                  PriceAmount: existingPrice || item.PriceAmount || 0,
                                  Currency: existingCurrency
                                });
                              }}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            >
                              {dropdownOptions.countries.map(country => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => stopEditing('priceList', index)}
                                    className="bg-luxury-gold text-white px-3 py-1 rounded-lg text-sm hover:bg-luxury-warm transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => stopEditing('priceList', index)}
                                    className="bg-text-medium text-white px-3 py-1 rounded-lg text-sm hover:bg-text-dark transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-dark">
                      {item.Size || item.size || 'N/A'}, {item.PriceAmount || item.priceAmount || 0} {item.Currency || item.currency || 'INR'}, Qty: {item.Quantity || item.quantity || 0}, {dropdownOptions.countries.find(c => c.code === (item.Country || item.country))?.name || (item.Country || item.country) || 'N/A'}
                    </span>
                        <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditing('priceList', index)}
                                    className="text-luxury-gold hover:text-luxury-warm text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                    <button
                      type="button"
                      onClick={() => removeFromArray("PriceList", index)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Country Prices */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Country Prices</h3>
            <p className="text-gray-500 text-sm font-light">Set pricing for different countries</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Country</label>
              <select
                value={countryPriceLocal.Country}
                onChange={(e) => handleCountryPriceCountryChange(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
                required
              >
                <option value="">Select Country</option>
                {dropdownOptions.countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Price Amount</label>
              <input
                type="number"
                step="0.01"
                value={countryPriceLocal.PriceAmount}
                onChange={(e) => setCountryPriceLocal(prev => ({ ...prev, PriceAmount: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Currency</label>
              <input
                type="text"
                value={countryPriceLocal.Currency}
                readOnly
                className="w-full border border-gray-200 px-4 py-3 bg-gray-50 text-gray-600 text-sm font-light cursor-not-allowed"
                placeholder="Auto-set based on country"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addCountryPrice}
            className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Add Country Price
          </button>
          
          {/* Display added country prices */}
          {data.CountryPrices && data.CountryPrices.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-light text-black mb-4">Added Country Prices</h4>
              <div className="space-y-2">
                {data.CountryPrices.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-4 border border-gray-200">
                    {isEditing('countryPrices', index) ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Country</label>
                            <select
                              value={item.Country || 'IN'}
                              onChange={(e) => {
                                const countryCode = e.target.value;
                                const existingPrice = findExistingPrice(countryCode, index);
                                const existingCurrency = findExistingCurrency(countryCode, index);
                                updateArrayItem("CountryPrices", index, { 
                                  ...item, 
                                  Country: countryCode,
                                  PriceAmount: existingPrice || item.PriceAmount || 0,
                                  Currency: existingCurrency
                                });
                              }}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            >
                              {dropdownOptions.countries.map(country => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Price Amount</label>
                            <input
                              type="number"
                              value={item.PriceAmount || ''}
                              onChange={(e) => updateArrayItem("CountryPrices", index, { ...item, PriceAmount: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Currency</label>
                            <select
                              value={item.Currency || 'INR'}
                              onChange={(e) => updateArrayItem("CountryPrices", index, { ...item, Currency: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            >
                              <option value="INR">INR</option>
                              <option value="USD">USD</option>
                              <option value="AED">AED</option>
                              <option value="SAR">SAR</option>
                              <option value="QAR">QAR</option>
                              <option value="KWD">KWD</option>
                              <option value="OMR">OMR</option>
                              <option value="BHD">BHD</option>
                              <option value="JOD">JOD</option>
                              <option value="LBP">LBP</option>
                              <option value="GBP">GBP</option>
                              <option value="CAD">CAD</option>
                              <option value="AUD">AUD</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => stopEditing('countryPrices', index)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => stopEditing('countryPrices', index)}
                            className="bg-text-medium text-white px-3 py-1 rounded-lg text-sm hover:bg-text-dark transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-text-dark">
                      {dropdownOptions.countries.find(c => c.code === (item.Country || item.country))?.name || (item.Country || item.country) || 'N/A'}, {item.PriceAmount || item.priceAmount || 0} {item.Currency || item.currency || 'INR'}
                    </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditing('countryPrices', index)}
                            className="text-luxury-gold hover:text-luxury-warm text-sm font-medium"
                          >
                            Edit
                          </button>
                    <button
                      type="button"
                      onClick={() => removeFromArray("CountryPrices", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Specifications</h3>
            <p className="text-gray-500 text-sm font-light">Define product specifications and details</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Fabric</label>
              <input
                type="text"
                value={data.Specifications.Fabric}
                onChange={(e) => update("Specifications.Fabric", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., 100% Cotton"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Length</label>
              <input
                type="text"
                value={data.Specifications.Length}
                onChange={(e) => update("Specifications.Length", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., Hip length"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Origin</label>
              <input
                type="text"
                value={data.Specifications.Origin}
                onChange={(e) => update("Specifications.Origin", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., Made in India"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Fit</label>
              <input
                type="text"
                value={data.Specifications.Fit}
                onChange={(e) => update("Specifications.Fit", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., Relaxed"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Care</label>
              <input
                type="text"
                value={data.Specifications.Care}
                onChange={(e) => update("Specifications.Care", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., Machine wash cold"
              />
            </div>
          </div>
          
          {/* Extra Specifications */}
          <div className="space-y-6">
            <h4 className="text-lg font-light text-black">Extra Specifications</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={specExtraLocal.Key}
                onChange={(e) => setSpecExtraLocal(prev => ({ ...prev, Key: e.target.value }))}
                className="flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Key (e.g., Weight)"
              />
              <input
                type="text"
                value={specExtraLocal.Value}
                onChange={(e) => setSpecExtraLocal(prev => ({ ...prev, Value: e.target.value }))}
                className="flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="Value (e.g., 220g)"
              />
              <button
                type="button"
                onClick={addSpecExtra}
                className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                Add
              </button>
            </div>
            
            {/* Display extra specifications */}
            {data.Specifications && data.Specifications.Extra && data.Specifications.Extra.length > 0 && (
              <div className="mt-6 space-y-2">
                {data.Specifications.Extra.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-3 border border-gray-200">
                    {isEditing('specifications', index) ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Key</label>
                            <input
                              type="text"
                              value={item.Key || item.key || ''}
                              onChange={(e) => updateArrayItem("Specifications.Extra", index, { ...item, Key: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Value</label>
                            <input
                              type="text"
                              value={item.Value || item.value || ''}
                              onChange={(e) => updateArrayItem("Specifications.Extra", index, { ...item, Value: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => stopEditing('specifications', index)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => stopEditing('specifications', index)}
                            className="bg-text-medium text-white px-3 py-1 rounded-lg text-sm hover:bg-text-dark transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.Key || item.key || 'N/A'}, {item.Value || item.value || 'N/A'}</span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditing('specifications', index)}
                            className="text-luxury-gold hover:text-luxury-warm text-sm font-medium"
                          >
                            Edit
                          </button>
                    <button
                      type="button"
                      onClick={() => removeFromArray("Specifications.Extra", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Key Features</h3>
            <p className="text-gray-500 text-sm font-light">Add product key features</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={keyFeatureLocal}
              onChange={(e) => setKeyFeatureLocal(e.target.value)}
              className="flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
              placeholder="Enter a key feature"
            />
            <button
              type="button"
              onClick={addKeyFeature}
              className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              Add Feature
            </button>
          </div>
          
          {/* Display key features */}
          {data.KeyFeatures && data.KeyFeatures.length > 0 && (
            <div className="mt-6 space-y-2">
              {data.KeyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200">
                  <span className="text-sm font-light">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray("KeyFeatures", index)}
                    className="text-gray-600 hover:text-black text-sm font-light"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Care Instructions */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Care Instructions</h3>
            <p className="text-gray-500 text-sm font-light">Add product care instructions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={careInstructionLocal}
              onChange={(e) => setCareInstructionLocal(e.target.value)}
              className="flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
              placeholder="Enter a care instruction"
            />
            <button
              type="button"
              onClick={addCareInstruction}
              className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              Add Instruction
            </button>
          </div>
          
          {/* Display care instructions */}
          {data.CareInstructions && data.CareInstructions.length > 0 && (
            <div className="mt-6 space-y-2">
              {data.CareInstructions.map((instruction, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200">
                  <span className="text-sm font-light">{instruction}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray("CareInstructions", index)}
                    className="text-gray-600 hover:text-black text-sm font-light"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Inventory</h3>
            <p className="text-gray-500 text-sm font-light">Manage product inventory by SKU</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">SKU</label>
              <input
                type="text"
                value={inventoryLocal.Sku}
                onChange={(e) => setInventoryLocal(prev => ({ ...prev, Sku: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., PID10001-NAV-S"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Size</label>
              <select
                value={inventoryLocal.Size}
                onChange={(e) => setInventoryLocal(prev => ({ ...prev, Size: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                {dropdownOptions.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Color</label>
              <select
                value={inventoryLocal.Color}
                onChange={(e) => setInventoryLocal(prev => ({ ...prev, Color: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                {dropdownOptions.colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Quantity</label>
              <input
                type="number"
                value={inventoryLocal.Quantity}
                onChange={(e) => setInventoryLocal(prev => ({ ...prev, Quantity: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addInventory}
            className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Add Inventory Item
          </button>
          
          {/* Display inventory items */}
          {data.Inventory && data.Inventory.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-light text-black mb-4">Added Inventory Items</h4>
              <div className="space-y-2">
                {data.Inventory.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 border border-gray-200">
                    {isEditing('inventory', index) ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">SKU</label>
                            <input
                              type="text"
                              value={item.Sku || item.sku || ''}
                              onChange={(e) => updateArrayItem("Inventory", index, { ...item, Sku: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Size</label>
                            <select
                              value={item.Size || item.size || 'S'}
                              onChange={(e) => updateArrayItem("Inventory", index, { ...item, Size: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            >
                              {dropdownOptions.sizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Color</label>
                            <input
                              type="text"
                              value={item.Color || item.color || ''}
                              onChange={(e) => updateArrayItem("Inventory", index, { ...item, Color: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Quantity</label>
                            <input
                              type="number"
                              value={item.Quantity || item.quantity || ''}
                              onChange={(e) => updateArrayItem("Inventory", index, { ...item, Quantity: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Reserved</label>
                            <input
                              type="number"
                              value={item.Reserved || item.reserved || ''}
                              onChange={(e) => updateArrayItem("Inventory", index, { ...item, Reserved: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Warehouse ID</label>
                            <input
                              type="text"
                              value={item.WarehouseId || item.warehouseId || ''}
                              onChange={(e) => updateArrayItem("Inventory", index, { ...item, WarehouseId: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => stopEditing('inventory', index)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => stopEditing('inventory', index)}
                            className="bg-text-medium text-white px-3 py-1 rounded-lg text-sm hover:bg-text-dark transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-center justify-between">
                    <span className="text-sm">
                          {item.Sku || item.sku || 'N/A'}, {item.Size || item.size || 'N/A'}, {item.Color || item.color || 'N/A'}, Qty: {item.Quantity || item.quantity || 0}
                          {(item.Reserved || item.reserved) && (item.Reserved || item.reserved) > 0 && (
                            <span className="text-orange-600 ml-2">, Reserved: {item.Reserved || item.reserved}</span>
                          )}
                          {(item.WarehouseId || item.warehouseId) && (
                            <span className="text-gray-500 ml-2">, WH: {item.WarehouseId || item.warehouseId}</span>
                          )}
                    </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditing('inventory', index)}
                            className="text-luxury-gold hover:text-luxury-warm text-sm font-medium"
                          >
                            Edit
                          </button>
                    <button
                      type="button"
                      onClick={() => removeFromArray("Inventory", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Variants</h3>
            <p className="text-gray-500 text-sm font-light">Manage product variants and options</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">SKU</label>
              <input
                type="text"
                value={variantLocal.Sku}
                onChange={(e) => setVariantLocal(prev => ({ ...prev, Sku: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., PID10001-NAV-S"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Color</label>
              <select
                value={variantLocal.Color}
                onChange={(e) => setVariantLocal(prev => ({ ...prev, Color: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                {dropdownOptions.colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Size</label>
              <select
                value={variantLocal.Size}
                onChange={(e) => setVariantLocal(prev => ({ ...prev, Size: e.target.value }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                {dropdownOptions.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Quantity</label>
              <input
                type="number"
                value={variantLocal.Quantity}
                onChange={(e) => setVariantLocal(prev => ({ ...prev, Quantity: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="0"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addVariant}
            className="bg-black text-white px-6 py-3 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Add Variant
          </button>
          
          {/* Display variants */}
          {data.Variants && data.Variants.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-light text-black mb-4">Added Variants</h4>
              <div className="space-y-2">
                {data.Variants.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 border border-gray-200">
                    {isEditing('variants', index) ? (
                      // Edit mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">SKU</label>
                            <input
                              type="text"
                              value={item.Sku || item.sku || ''}
                              onChange={(e) => updateArrayItem("Variants", index, { ...item, Sku: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Color</label>
                            <input
                              type="text"
                              value={item.Color || item.color || ''}
                              onChange={(e) => updateArrayItem("Variants", index, { ...item, Color: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Size</label>
                            <select
                              value={item.Size || item.size || 'S'}
                              onChange={(e) => updateArrayItem("Variants", index, { ...item, Size: e.target.value })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            >
                              {dropdownOptions.sizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Quantity</label>
                            <input
                              type="number"
                              value={item.Quantity || item.quantity || ''}
                              onChange={(e) => updateArrayItem("Variants", index, { ...item, Quantity: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-text-dark mb-2 uppercase tracking-wider">Price Override</label>
                            <input
                              type="number"
                              value={item.PriceOverride || item.priceOverride || ''}
                              onChange={(e) => updateArrayItem("Variants", index, { ...item, PriceOverride: parseFloat(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-luxury-light-gold rounded-lg text-sm bg-premium-white focus:border-luxury-gold focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`variant-active-${index}`}
                              checked={item.IsActive !== undefined ? item.IsActive : (item.isActive !== undefined ? item.isActive : true)}
                              onChange={(e) => updateArrayItem("Variants", index, { ...item, IsActive: e.target.checked })}
                              className="mr-2"
                            />
                            <label htmlFor={`variant-active-${index}`} className="text-xs font-medium text-gray-700">Active</label>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => stopEditing('variants', index)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => stopEditing('variants', index)}
                            className="bg-text-medium text-white px-3 py-1 rounded-lg text-sm hover:bg-text-dark transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-center justify-between">
                    <span className="text-sm">
                          {item.Sku || item.sku || 'N/A'}, {item.Color || item.color || 'N/A'}, {item.Size || item.size || 'N/A'}, Qty: {item.Quantity || item.quantity || 0}
                          {(item.PriceOverride || item.priceOverride) && (item.PriceOverride || item.priceOverride) > 0 && (
                            <span className="text-luxury-gold ml-2 font-medium">, Override: {item.PriceOverride || item.priceOverride}</span>
                          )}
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${(item.IsActive !== undefined ? item.IsActive : (item.isActive !== undefined ? item.isActive : true)) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {(item.IsActive !== undefined ? item.IsActive : (item.isActive !== undefined ? item.isActive : true)) ? 'Active' : 'Inactive'}
                    </span>
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditing('variants', index)}
                            className="text-luxury-gold hover:text-luxury-warm text-sm font-medium"
                          >
                            Edit
                          </button>
                    <button
                      type="button"
                      onClick={() => removeFromArray("Variants", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Images */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Product Images</h3>
            <p className="text-gray-500 text-sm font-light">Upload product images</p>
          </div>
          
          <div className="flex gap-2 items-center">
            <ImageUploader 
              productId={data.ProductId} 
              onUploadComplete={handleProductImageUpload}
            />
          </div>
          
          {/* Display uploaded images */}
          {data.Images && data.Images.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-light text-black mb-4">Uploaded Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.Images.map((img, index) => (
                  <div key={index} className="border border-gray-200 p-3">
                    <img 
                      src={img.ThumbnailUrl} 
                      alt={img.Alt} 
                      className="h-24 w-full object-cover" 
                    />
                    <div className="text-xs text-gray-500 mt-2 font-light">{img.Alt}</div>
                    <button
                      type="button"
                      onClick={() => removeFromArray("Images", index)}
                      className="text-gray-600 hover:text-black text-xs mt-2 font-light"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shipping Information */}
        <div className="space-y-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-light text-black mb-2">Shipping Information</h3>
            <p className="text-gray-500 text-sm font-light">Configure shipping and delivery options</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Free Delivery</label>
              <select
                value={data.FreeDelivery}
                onChange={(e) => update("FreeDelivery", e.target.value === "true")}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Return Policy</label>
              <input
                type="text"
                value={data.ReturnPolicy}
                onChange={(e) => update("ReturnPolicy", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., 7 Days"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Free Shipping</label>
              <select
                value={data.ShippingInfo.FreeShipping}
                onChange={(e) => update("ShippingInfo.FreeShipping", e.target.value === "true")}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Estimated Delivery</label>
              <input
                type="text"
                value={data.ShippingInfo.EstimatedDelivery}
                onChange={(e) => update("ShippingInfo.EstimatedDelivery", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light"
                placeholder="e.g., 2-4 Days"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-light text-gray-700">Cash on Delivery</label>
              <select
                value={data.ShippingInfo.CashOnDelivery}
                onChange={(e) => update("ShippingInfo.CashOnDelivery", e.target.value === "true")}
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors text-gray-900 bg-white text-sm font-light"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 text-sm font-light transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? 'Processing...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

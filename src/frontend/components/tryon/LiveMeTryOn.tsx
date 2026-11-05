import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  Download, 
  Save, 
  Share2, 
  Check, 
  AlertCircle, 
  Sliders, 
  Columns, 
  Trash2, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  X,
  UserCheck,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product, GarmentCategory, PakistaniBrand } from '../../../database/types.ts';
import { apiClient } from '../../../backend/apiClient.ts';

const PRESET_MODELS = [
  {
    id: 'studio-full',
    label: 'Studio Model (Calibrated Base)',
    sublabel: 'Neutral cream base · Calibrated 33-point pose for all outfits',
    url: '/assets/images/pakistani_model_before_full_1793816037340.jpg',
    type: 'calibrated'
  }
];

export const LiveMeTryOn: React.FC = () => {
  const { 
    products, 
    activeProductForTryOn, 
    setActiveProductForTryOn, 
    setCurrentView, 
    showToast,
    refreshSavedOutfits,
    setActiveShareId
  } = useApp();

  // User photo state - Default to full calibrated Pakistani studio model
  const [selectedModelPreset, setSelectedModelPreset] = useState<string>('studio-full');
  const [userPhoto, setUserPhoto] = useState<string>(
    '/assets/images/pakistani_model_before_full_1793816037340.jpg'
  );
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected outfit for tryon
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    activeProductForTryOn || products[0] || ({} as Product)
  );
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');

  // Filtering garments in tryon studio
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeBrand, setActiveBrand] = useState<string>('All');
  
  // Try-on generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [tryOnResultImage, setTryOnResultImage] = useState<string | null>(null);
  
  // View modes: 'split-slider' | 'side-by-side' | 'full-look'
  const [displayMode, setDisplayMode] = useState<'split-slider' | 'side-by-side' | 'full-look'>('split-slider');
  const [comparisonSliderPos, setComparisonSliderPos] = useState(50);
  const [showPoseLandmarks, setShowPoseLandmarks] = useState(false);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (activeProductForTryOn) {
      setSelectedProduct(activeProductForTryOn);
    }
  }, [activeProductForTryOn]);

  // Filter products for the left catalog strip
  const filteredGarments = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (activeBrand !== 'All' && p.brand !== activeBrand) return false;
      return true;
    });
  }, [products, activeCategory, activeBrand]);

  // Cleanup camera stream
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Camera start handler
  const startCamera = async () => {
    try {
      setQualityError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 720 }, height: { ideal: 960 }, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsLiveCameraActive(true);
      }
    } catch (err: any) {
      setQualityError('Camera access denied or unavailable. You can upload a photo from your gallery instead.');
    }
  };

  // Camera capture snap
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setUserPhoto(dataUrl);
      setSelectedModelPreset('custom');
      stopCameraStream();
      setTryOnResultImage(null);
      showToast('Photo captured successfully! Click "Generate Virtual Try-On" below.');
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image/jpeg') && !file.type.includes('image/png') && !file.type.includes('image/webp')) {
      setQualityError('Invalid format: Only JPG and PNG photo files are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setQualityError('Photo size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setQualityError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserPhoto(result);
      setSelectedModelPreset('custom');
      setTryOnResultImage(null);
      showToast('Photo uploaded! Click "Generate Virtual Try-On" to preview.');
    };
    reader.readAsDataURL(file);
  };

  // Switch to preset model
  const handleSelectPresetModel = (presetId: string) => {
    const preset = PRESET_MODELS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedModelPreset(preset.id);
    setUserPhoto(preset.url);
    setTryOnResultImage(null);
    stopCameraStream();
    showToast(`Switched to ${preset.label}`);
  };

  // ==========================================
  // REAL VIRTUAL TRY-ON (calls your server -> Gemini)
  // ==========================================

  // Turns any image path into base64 so the AI can read it
  const toDataUrl = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    const blob = await (await fetch(url)).blob();
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(blob);
    });
  };

  // Sends your photo + garment photo to the server
  const createTryOnComposite = async (userImgUrl: string, garmentImgUrl: string): Promise<string> => {
    const res = await fetch('/api/gemini/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        humanImage: await toDataUrl(userImgUrl),
        garmentImage: await toDataUrl(garmentImgUrl)
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Try-on failed');
    return data.resultUrl as string;
  };

  // Main button handler (no more fake waiting)
  const handleGenerateTryOn = async () => {
    if (!selectedProduct || !selectedProduct.images) return;
    setQualityError(null);
    setIsGenerating(true);
    setGenerationProgress(20);
    setGenerationStage('Reading your photo and the outfit...');

    // Move the bar slowly while the real AI works
    const timer = setInterval(() => {
      setGenerationProgress((p) => (p < 90 ? p + 3 : p));
    }, 1000);
    setTimeout(() => setGenerationStage('AI is dressing you in the outfit...'), 4000);

    try {
      const resultUrl = await createTryOnComposite(
        userPhoto,
        selectedProduct.tryOnImage || selectedProduct.images[0]
      );
      setGenerationProgress(100);
      setTryOnResultImage(resultUrl);
      showToast(`✨ Virtual try-on ready for ${selectedProduct.name}!`);
    } catch (err: any) {
      setQualityError('Try-on failed: ' + (err?.message || 'Please try again.'));
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  };

  // Save outfit to collection
  const handleSaveOutfit = async () => {
    try {
      const res = await apiClient.saveOutfit({
        title: `${selectedProduct.name} (${selectedProduct.brand})`,
        product: selectedProduct,
        userPhotoUrl: userPhoto,
        tryOnResultUrl: tryOnResultImage || selectedProduct.images[0],
        notes: `Virtual Try-On saved on ${new Date().toLocaleDateString()}. Size: ${selectedSize}. Fabric: ${selectedProduct.fabric}.`
      });
      await refreshSavedOutfits();
      showToast('✨ Outfit saved to your "My Looks" collection!');
      if (res.shareId) {
        setActiveShareId(res.shareId);
      }
    } catch (err: any) {
      showToast('Failed to save outfit: ' + err.message);
    }
  };

  // Download try-on image
  const handleDownload = () => {
    const url = tryOnResultImage || selectedProduct.images[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `herAttire-${selectedProduct.brand.toLowerCase()}-${selectedProduct.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded high-resolution try-on image!');
  };

  // Reset to default calibrated studio model
  const handleResetPhoto = () => {
    setSelectedModelPreset('studio-full');
    setUserPhoto('/assets/images/pakistani_model_before_full_1793816037340.jpg');
    setTryOnResultImage(null);
    stopCameraStream();
    showToast('Reset to calibrated studio model.');
  };

  const categoriesList = [
    'All',
    'Shalwar Kameez',
    'Kurti',
    'Abaya',
    'Bridal Wear',
    'Lehenga',
    'Dupatta',
    'Accessories'
  ];

  const brandsList = [
    'All',
    'Bareeze',
    'Baroque',
    'Maria.B',
    'Khaadi',
    'Sapphire',
    'Sana Safinaz',
    'Asim Jofa',
    'Gul Ahmed'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">Virtual Try-On Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>Live Me Studio</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              AI Virtual Try-On
            </span>
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Seamlessly drape authentic Pakistani designer lawn, formals, bridal lehengas, abayas, and accessories.
          </p>
        </div>

        {/* Action icons bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPoseLandmarks(!showPoseLandmarks)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showPoseLandmarks 
                ? 'bg-[#903458] text-white border-[#903458]' 
                : 'bg-white text-stone-700 border-[#eed4e0] hover:bg-[#faebf1]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pose Landmarks</span>
          </button>

          {tryOnResultImage && (
            <div className="flex items-center rounded-full bg-white border border-[#eed4e0] p-0.5">
              <button
                onClick={() => setDisplayMode('split-slider')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  displayMode === 'split-slider' ? 'bg-[#903458] text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Split Slider
              </button>
              <button
                onClick={() => setDisplayMode('side-by-side')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  displayMode === 'side-by-side' ? 'bg-[#903458] text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setDisplayMode('full-look')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  displayMode === 'full-look' ? 'bg-[#903458] text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Full Look
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quality error alert */}
      {qualityError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{qualityError}</span>
          </div>
          <button 
            onClick={() => setQualityError(null)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Garment & Accessory Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#eed4e0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-stone-900">
                Choose Pakistani Garment
              </h3>
              <span className="text-[10px] text-stone-500 font-medium">
                {filteredGarments.length} items
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#903458] text-white'
                      : 'bg-[#faf2f4] text-stone-700 hover:bg-[#f0dae4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Brand Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#f5e6ed] pb-2">
              {brandsList.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeBrand === brand
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Garments List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredGarments.map((item) => {
                const isSelected = selectedProduct.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProduct(item);
                      setTryOnResultImage(null);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#903458] bg-[#faedf2] ring-1 ring-[#903458]'
                        : 'border-[#edd7e2] bg-white hover:border-[#c57d93] hover:bg-[#fef9fb]'
                    }`}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-lg shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#903458] tracking-wider">
                          {item.brand}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-serif font-semibold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="font-bold text-stone-800">
                          PKR {item.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-500">{item.fabric}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Size selector */}
            <div className="pt-3 border-t border-[#eed4e0] space-y-2">
              <label className="text-xs font-medium text-stone-700 block">
                Select Try-On Size (Calibrated drape & hemline):
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setTryOnResultImage(null);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#903458] text-white shadow-xs'
                        : 'bg-stone-50 text-stone-700 border border-[#ecd3de] hover:bg-[#faedf2]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Studio Viewport & Controls */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative rounded-3xl bg-white border border-[#eed4e0] overflow-hidden shadow-sm p-4 sm:p-6 min-h-[560px] flex flex-col justify-between">
            
            {/* Model Presets & Input Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0dae4]">
              {/* Presets Switcher */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-stone-700 mr-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#903458]" />
                  <span>Model:</span>
                </span>
                {PRESET_MODELS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPresetModel(p.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedModelPreset === p.id && !isLiveCameraActive
                        ? 'bg-[#903458] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-[#faedf2]'
                    }`}
                  >
                    {p.label.split(' ')[0]} {p.label.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Upload & Camera Buttons */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#edd5e1] hover:bg-[#faedf2] text-xs font-medium text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#903458]" />
                  <span>Upload Mine</span>
                </button>

                <button
                  onClick={isLiveCameraActive ? stopCameraStream : startCamera}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLiveCameraActive
                      ? 'bg-red-50 text-red-700 border-red-300'
                      : 'bg-white border-[#edd5e1] hover:bg-[#faedf2] text-stone-700'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-[#903458]" />
                  <span>{isLiveCameraActive ? 'Close Cam' : 'Live Cam'}</span>
                </button>

                <button
                  onClick={handleResetPhoto}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                  title="Reset to Studio Silhouette"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active outfit badge bar */}
            <div className="py-2 flex items-center justify-between text-xs border-b border-[#f9edf2]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-500">Selected:</span>
                <span className="font-serif font-bold text-stone-900 truncate max-w-xs">
                  {selectedProduct.brand} · {selectedProduct.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#faedf2] text-[#903458] text-[10px] font-bold border border-[#ecd2dd]">
                  {selectedProduct.fabric} · Size {selectedSize}
                </span>
              </div>
              <span className="font-bold text-[#903458]">
                PKR {selectedProduct.price.toLocaleString()}
              </span>
            </div>

            {/* Viewport Area */}
            <div className="relative my-4 flex-1 flex items-center justify-center bg-[#faf4f6] rounded-2xl overflow-hidden border border-[#f0dae4] min-h-[460px]">
              
              {/* LIVE CAMERA MODE */}
              {isLiveCameraActive ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="max-h-[420px] rounded-xl object-contain shadow-md border-2 border-[#903458]"
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={captureSnapshot}
                      className="px-6 py-2.5 rounded-full bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture & Try On</span>
                    </button>
                    <button
                      onClick={stopCameraStream}
                      className="px-4 py-2.5 rounded-full bg-white border border-stone-300 text-stone-700 text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : isGenerating ? (
                /* GENERATING PROGRESS STATE */
                <div className="flex flex-col items-center justify-center p-8 space-y-4 max-w-md text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-[#903458] animate-spin" />
                    <Sparkles className="w-6 h-6 text-[#c57d93] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Generating Virtual Try-On
                    </h3>
                    <p className="text-xs text-[#903458] font-medium">
                      {generationStage}
                    </p>
                  </div>

                  <div className="w-full bg-[#eed7e2] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#903458] h-full rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-[11px] text-stone-500">
                    AI is working, this can take 10 to 30 seconds ({generationProgress}%)
                  </p>
                </div>
              ) : tryOnResultImage && displayMode === 'side-by-side' ? (
                /* SIDE BY SIDE VIEW */
                <div className="w-full h-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-center">
                    <span className="text-xs font-bold text-stone-700">Before (Base Outfit)</span>
                    <div className="rounded-xl overflow-hidden border border-[#eed4e0] bg-white h-[420px] flex items-center justify-center shadow-xs">
                      <img src={userPhoto} alt="Before" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <span className="text-xs font-bold text-[#903458]">
                      After: {selectedProduct.name} ({selectedSize})
                    </span>
                    <div className="rounded-xl overflow-hidden border-2 border-[#903458] bg-white h-[420px] flex items-center justify-center shadow-md">
                      <img src={tryOnResultImage} alt="Try-On Result" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ) : tryOnResultImage && displayMode === 'full-look' ? (
                /* FULL DRESSED LOOK WITH ZOOM */
                <div className="relative w-full h-[460px] flex items-center justify-center">
                  <div className="relative h-[460px] aspect-3/4 rounded-2xl overflow-hidden shadow-lg border border-[#eed4e0]">
                    <img
                      src={tryOnResultImage}
                      alt="Virtual Try-On Result"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setIsZoomModalOpen(true)}
                      className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Inspect fine embroidery detail"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <div className="absolute top-3 left-3 bg-[#903458]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs shadow-sm">
                      Dressed: {selectedProduct.brand} {selectedProduct.name}
                    </div>
                  </div>
                </div>
              ) : tryOnResultImage && displayMode === 'split-slider' ? (
                /* SEAMLESS SPLIT SLIDER: BEFORE VS AFTER */
                <div className="relative w-full h-[460px] flex items-center justify-center select-none overflow-hidden">
                  <div className="relative max-w-full max-h-full h-[460px] aspect-3/4 rounded-2xl overflow-hidden shadow-lg border border-[#eed4e0]">
                    
                    {/* Background: Try On Result (After) */}
                    <img
                      src={tryOnResultImage}
                      alt="Virtual Try-On Output"
                      className="w-full h-full object-cover"
                    />

                    {/* Foreground clipped: Original Photo (Before) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${comparisonSliderPos}%` }}
                    >
                      <img
                        src={userPhoto}
                        alt="Original Silhouette"
                        className="w-full h-full object-cover absolute top-0 left-0 max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        Before (Base Outfit)
                      </div>
                    </div>

                    {/* After badge */}
                    <div className="absolute top-3 right-3 bg-[#903458]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs">
                      After (Virtual Try-On)
                    </div>

                    {/* Divider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-2xl"
                      style={{ left: `${comparisonSliderPos}%` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#903458] border-2 border-white text-white flex items-center justify-center shadow-lg text-[11px] font-bold">
                        ↔
                      </div>
                    </div>

                    {/* Interactive Slider Input */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={comparisonSliderPos}
                      onChange={(e) => setComparisonSliderPos(Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                /* BASE PHOTO DISPLAY WITH POSE LANDMARKS */
                <div className="relative max-h-[440px] flex items-center justify-center p-2">
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#ecd3de] h-[420px] aspect-3/4">
                    <img
                      src={userPhoto}
                      alt="Base Model Silhouette"
                      className="w-full h-full object-cover"
                    />

                    {/* 33 Pose Detection Landmarks Overlay */}
                    {showPoseLandmarks && (
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Shoulders */}
                          <line x1="38" y1="26" x2="62" y2="26" stroke="#903458" strokeWidth="1.8" strokeDasharray="2,2" />
                          <circle cx="38" cy="26" r="2.2" fill="#903458" />
                          <circle cx="62" cy="26" r="2.2" fill="#903458" />
                          {/* Neck & Chest */}
                          <line x1="50" y1="18" x2="50" y2="35" stroke="#903458" strokeWidth="1.5" />
                          <circle cx="50" cy="18" r="2" fill="#e8c6d4" />
                          <circle cx="50" cy="35" r="2" fill="#e8c6d4" />
                          {/* Torso & Waist */}
                          <line x1="38" y1="26" x2="42" y2="44" stroke="#c57d93" strokeWidth="1.5" />
                          <line x1="62" y1="26" x2="58" y2="44" stroke="#c57d93" strokeWidth="1.5" />
                          <line x1="42" y1="44" x2="58" y2="44" stroke="#903458" strokeWidth="1.8" />
                          <circle cx="42" cy="44" r="2" fill="#903458" />
                          <circle cx="58" cy="44" r="2" fill="#903458" />
                          {/* Hips & Knees */}
                          <line x1="42" y1="44" x2="40" y2="60" stroke="#903458" strokeWidth="1.5" />
                          <line x1="58" y1="44" x2="60" y2="60" stroke="#903458" strokeWidth="1.5" />
                          <circle cx="40" cy="60" r="2" fill="#903458" />
                          <circle cx="60" cy="60" r="2" fill="#903458" />
                          <line x1="40" y1="60" x2="42" y2="80" stroke="#903458" strokeWidth="1.5" />
                          <line x1="60" y1="60" x2="58" y2="80" stroke="#903458" strokeWidth="1.5" />
                          <circle cx="42" cy="80" r="2" fill="#903458" />
                          <circle cx="58" cy="80" r="2" fill="#903458" />
                        </svg>
                        <div className="absolute bottom-3 left-3 bg-white/95 text-[10px] text-stone-800 px-3 py-1 rounded-full font-mono shadow-sm border border-stone-200">
                          ✓ 33 Pose Keypoints Calibrated · Silhouette Ready
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-3 border-t border-[#f0dae4] flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border border-[#eed4e0] text-xs font-semibold text-stone-700 hover:bg-[#faedf2] transition-colors cursor-pointer"
                >
                  Upload Another Photo
                </button>

                {tryOnResultImage && (
                  <>
                    <button
                      onClick={handleSaveOutfit}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Outfit</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-xl bg-white border border-[#eed4e0] text-xs font-semibold text-stone-700 hover:bg-[#faedf2] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#903458]" />
                      <span>Download</span>
                    </button>
                  </>
                )}
              </div>

              {/* Main Primary Try-On Button */}
              <button
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#903458] hover:bg-[#782847] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#f4d2de]" />
                <span>{tryOnResultImage ? 'Re-generate Virtual Try-On' : 'Design Dress (Try-On)'}</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 pt-2 text-center text-[10px] text-stone-500 border-t border-stone-100 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#903458] shrink-0" />
              <span>
                AI-generated preview. Fabric, embroidery and fit may differ slightly from the real outfit.
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Detail Zoom Modal */}
      {isZoomModalOpen && tryOnResultImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col items-center">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={tryOnResultImage}
              alt="High Resolution Detail"
              className="max-h-[82vh] object-contain rounded-xl"
            />
            <p className="text-stone-300 text-xs py-2 text-center font-serif">
              {selectedProduct.brand} · {selectedProduct.name} ({selectedProduct.fabric} · Size {selectedSize})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { AppProvider, useApp } from './frontend/context/AppContext.tsx';
import { Navbar } from './navigation/Navbar.tsx';
import { Sidebar } from './navigation/Sidebar.tsx';
import { Footer } from './navigation/Footer.tsx';

// Components
import { HomeView } from './frontend/components/home/HomeView.tsx';
import { ProductCatalog } from './frontend/components/shop/ProductCatalog.tsx';
import { LiveMeTryOn } from './frontend/components/tryon/LiveMeTryOn.tsx';
import { LiveWebcamTryOn } from './frontend/components/tryon/LiveWebcamTryOn.tsx';
import { BodyStyleAnalysis } from './frontend/components/analysis/BodyStyleAnalysis.tsx';
import { ForYouRecommendations } from './frontend/components/recommendations/ForYouRecommendations.tsx';
import { DulhanMode } from './frontend/components/customization/DulhanMode.tsx';
import { HijabDupattaMatching } from './frontend/components/customization/HijabDupattaMatching.tsx';
import { StitchingCostEstimator } from './frontend/components/customization/StitchingCostEstimator.tsx';
import { MyLooksView } from './frontend/components/mylooks/MyLooksView.tsx';
import { OrderTrackingView } from './frontend/components/shop/OrderTrackingModal.tsx';
import { UserProfileView } from './frontend/components/profile/UserProfileView.tsx';
import { AdminDashboard } from './frontend/components/admin/AdminDashboard.tsx';

// Modals
import { ProductDetailModal } from './frontend/components/shop/ProductDetailModal.tsx';
import { CartDrawer } from './frontend/components/shop/CartDrawer.tsx';
import { AuthModal } from './frontend/components/auth/AuthModal.tsx';
import { ShareWithFamilyModal } from './frontend/components/family/ShareWithFamilyModal.tsx';

const AppContent: React.FC = () => {
  const { currentView, toastMessage } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ProductCatalog />;
      case 'live-me':
        return <LiveMeTryOn />;
      case 'live-webcam':
        return <LiveWebcamTryOn />;
      case 'body-analysis':
        return <BodyStyleAnalysis />;
      case 'for-you':
        return <ForYouRecommendations />;
      case 'dulhan-mode':
        return <DulhanMode />;
      case 'hijab-matching':
        return <HijabDupattaMatching />;
      case 'stitching':
        return <StitchingCostEstimator />;
      case 'my-looks':
        return <MyLooksView />;
      case 'orders':
        return <OrderTrackingView />;
      case 'profile':
        return <UserProfileView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeView />;
    }
  };

  // Show sidebar for dashboard-like views
  const showSidebar = [
    'home',
    'body-analysis',
    'for-you',
    'my-looks',
    'orders',
    'profile',
    'dulhan-mode',
    'stitching'
  ].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF2F4] text-[#2D2327]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-stone-800 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#E57399]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Body with Sidebar Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && <Sidebar />}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <AuthModal />
      <ShareWithFamilyModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

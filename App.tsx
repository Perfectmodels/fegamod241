
import React from 'react';
import { Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MembersPage from './pages/MembersPage';
import MemberDetailPage from './pages/MemberDetailPage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import PartnersPage from './pages/PartnersPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import FirebasePage from './pages/FirebasePage';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminMemberDetailPage from './pages/admin/AdminMemberDetailPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
// FIX: Replaced incorrect import from './pages/admin/AdminPlaceholders' with correct individual imports. The AdminPlaceholders.tsx file was empty and not a module.
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminBureauPage from './pages/admin/AdminBureauPage';
import { isAuthenticated } from './services/authService';

// Public Layout
const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-off-white">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Route for Admin
const ProtectedRoute: React.FC = () => {
    return isAuthenticated() ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
};


const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/membres" element={<MembersPage />} />
        <Route path="/membres/:id" element={<MemberDetailPage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/galerie" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/members" element={<AdminMembersPage />} />
        <Route path="/admin/members/:id" element={<AdminMemberDetailPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/news" element={<AdminNewsPage />} />
        <Route path="/admin/media" element={<AdminMediaPage />} />
        <Route path="/admin/partners" element={<AdminPartnersPage />} />
        <Route path="/admin/bureau" element={<AdminBureauPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/integration-data" element={<FirebasePage />} />
      </Route>
    </Routes>
  );
};

export default App;
import React from 'react';
import { Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MembersPage from './pages/MembersPage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import PartnersPage from './pages/PartnersPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import { AdminMediaPage, AdminPartnersPage, AdminUsersPage, AdminSettingsPage } from './pages/admin/AdminPlaceholders';

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


const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Scroll to top on route change, except for admin routes for a better UX
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
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/galerie" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="members" element={<AdminMembersPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="news" element={<AdminNewsPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;

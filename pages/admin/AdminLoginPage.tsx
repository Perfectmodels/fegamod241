import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have authentication logic here.
    // For this prototype, we'll just navigate to the dashboard.
    navigate('/admin');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-deep-black">FEGAMOD Admin</h1>
            <p className="mt-2 text-gray-600">Connectez-vous à votre tableau de bord</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-emerald focus:border-emerald sm:text-sm"
                placeholder="Adresse email"
                defaultValue="admin@fegamod.ga"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-emerald focus:border-emerald sm:text-sm"
                placeholder="Mot de passe"
                defaultValue="password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald transition-colors duration-300"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

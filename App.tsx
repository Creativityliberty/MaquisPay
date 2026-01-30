import React, { useState } from 'react';
import { LoginView } from './views/LoginView';
import { SellerView } from './views/SellerView';
import { ManagerView } from './views/ManagerView';
import { User, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Render Logic based on Auth State
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return user.role === UserRole.MANAGER 
    ? <ManagerView user={user} onLogout={handleLogout} />
    : <SellerView user={user} onLogout={handleLogout} />;
}

export default App;
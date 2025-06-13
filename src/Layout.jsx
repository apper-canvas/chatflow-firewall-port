import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <main className="h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
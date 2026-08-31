/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import OrderPage from './pages/OrderPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AboutPage />} />
          <Route path="order" element={<OrderPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

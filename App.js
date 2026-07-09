import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import AdminWebScreen from './src/screens/AdminWebScreen';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [adminPin, setAdminPin] = useState('');

  const handleLogin = useCallback((pin) => {
    setAdminPin(pin);
    setScreen('admin');
  }, []);

  const handleLogout = useCallback(() => {
    setAdminPin('');
    setScreen('login');
  }, []);

  if (screen === 'admin') {
    return (
      <>
        <StatusBar style="light" />
        <AdminWebScreen adminPin={adminPin} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <LoginScreen onLogin={handleLogin} />
    </>
  );
}

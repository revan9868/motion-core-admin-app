import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Platform, Vibration,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { savePin, getPin, getBiometricPreference } from '../services/SecureStore';
import { BRAND_COLOR, APP_NAME } from '../config';

export default function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkingBio, setCheckingBio] = useState(true);

  // On mount: check if biometric is available
  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    try {
      const storedPin = await getPin();
      const bioPref = await getBiometricPreference();

      if (storedPin && bioPref) {
        // Try biometric first
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (compatible && enrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Buka Motion Core Admin',
            fallbackLabel: 'Gunakan PIN',
            disableDeviceFallback: false,
          });

          if (result.success) {
            onLogin(storedPin);
            return;
          }
          // fallback: user will type PIN manually
        }
      }

      if (storedPin) {
        // PIN already stored, just show login
        setCheckingBio(false);
      } else {
        // First time: show PIN setup
        setCheckingBio(false);
      }
    } catch (e) {
      console.log('Auth init error:', e);
      setCheckingBio(false);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = useCallback(async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN minimal 4 digit');
      return;
    }

    const storedPin = await getPin();

    if (!storedPin) {
      // First time setup: save PIN
      await savePin(pin);
      Vibration.vibrate(50);

      // Ask if they want biometric
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        Alert.alert(
          'Aktifkan Biometric?',
          'Gunakan sidik jari/wajah untuk masuk lebih cepat?',
          [
            {
              text: 'Lewati',
              onPress: () => onLogin(pin),
            },
            {
              text: 'Aktifkan',
              onPress: async () => {
                const { success } = await LocalAuthentication.authenticateAsync({
                  promptMessage: 'Verifikasi untuk mengaktifkan biometric',
                });
                if (success) {
                  const { saveBiometricPreference } = await import('../services/SecureStore');
                  await saveBiometricPreference(true);
                }
                onLogin(pin);
              },
            },
          ]
        );
      } else {
        onLogin(pin);
      }
      return;
    }

    // Verify PIN
    if (pin === storedPin) {
      Vibration.vibrate(50);
      onLogin(pin);
    } else {
      Vibration.vibrate(200);
      Alert.alert('PIN Salah', 'Coba lagi');
      setPin('');
    }
  }, [pin, onLogin]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo / Brand */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>MC</Text>
        </View>
        <Text style={styles.brandName}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>SYSTEM CONTROL CENTER</Text>
      </View>

      {/* PIN Input */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>
          {checkingBio ? 'Memeriksa keamanan...' : 'MASUKKAN PIN ADMIN'}
        </Text>

        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          placeholder="••••••"
          placeholderTextColor="#333"
          secureTextEntry
          keyboardType="number-pad"
          maxLength={10}
          autoFocus
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.submitText}>BUKA</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          PIN disimpan aman di Android Keystore
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: BRAND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontFamily: Platform.OS === 'android' ? 'monospace' : undefined,
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: '#a1a1aa',
    letterSpacing: 3,
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#a1a1aa',
    letterSpacing: 2,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  pinInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#121216',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 20,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    backgroundColor: BRAND_COLOR,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 4,
  },
  hint: {
    marginTop: 20,
    fontSize: 10,
    color: '#52525b',
    textAlign: 'center',
  },
  loadingText: {
    color: '#52525b',
    marginTop: 12,
    fontSize: 12,
  },
});

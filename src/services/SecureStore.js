import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ADMIN_PIN: 'motion_core_admin_pin',
  BIOMETRIC_ENABLED: 'motion_core_biometric',
};

export async function savePin(pin) {
  await SecureStore.setItemAsync(KEYS.ADMIN_PIN, pin);
}

export async function getPin() {
  return await SecureStore.getItemAsync(KEYS.ADMIN_PIN);
}

export async function deletePin() {
  await SecureStore.deleteItemAsync(KEYS.ADMIN_PIN);
}

export async function saveBiometricPreference(enabled) {
  await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
}

export async function getBiometricPreference() {
  const val = await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED);
  return val === 'true';
}

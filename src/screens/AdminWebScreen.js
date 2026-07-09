import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, StatusBar, BackHandler, Alert, Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ADMIN_PANEL_URL, BRAND_COLOR } from '../config';

export default function AdminWebScreen({ adminPin, onLogout }) {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState(null);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [canGoBack]);

  // Inject the admin PIN into the page automatically
  const injectedJS = `
    (function() {
      // Auto-fill PIN when login panel is visible
      function tryAutoLogin() {
        const passInput = document.getElementById('passInput');
        const btnLogin = document.getElementById('btnLogin');
        if (passInput && btnLogin) {
          passInput.value = '${adminPin}';
          btnLogin.click();
          return true;
        }
        return false;
      }

      // Try immediately and also watch for dynamic content
      if (!tryAutoLogin()) {
        const observer = new MutationObserver(function() {
          if (tryAutoLogin()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
      }

      true;
    })();
  `;

  const handleNavigationStateChange = useCallback((navState) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  const handleError = useCallback((syntheticEvent) => {
    const { description } = syntheticEvent.nativeEvent;
    setError(description);
    setLoading(false);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={retry}>
          <Text style={styles.retryText}>RETRY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtnBar}>
          <Text style={styles.logoutIcon}>⏏</Text>
        </TouchableOpacity>
        <Text style={styles.barTitle}>MOTION CORE ADMIN</Text>
        <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {loading && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: ADMIN_PANEL_URL }}
        style={styles.webview}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        injectedJavaScript={injectedJS}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color={BRAND_COLOR} />
            <Text style={styles.loadingText}>Loading Admin Panel...</Text>
          </View>
        )}
        // Android-specific: allow mixed content for Discord webhooks
        allowMixedContent={Platform.OS === 'android'}
        // Allow file uploads
        allowFileAccess={true}
        // Allow camera for potential future use
        allowMedia={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121216',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  barTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND_COLOR,
    letterSpacing: 2,
  },
  logoutBtnBar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1a1a1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 16,
    color: '#ef4444',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1a1a1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 18,
    color: BRAND_COLOR,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#1a1a1e',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRAND_COLOR,
  },
  webview: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090b',
  },
  loadingText: {
    color: '#52525b',
    fontSize: 12,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorText: {
    color: '#a1a1aa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
  },
  retryBtn: {
    width: '100%',
    maxWidth: 280,
    height: 48,
    backgroundColor: BRAND_COLOR,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  retryText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  logoutBtn: {
    width: '100%',
    maxWidth: 280,
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
});

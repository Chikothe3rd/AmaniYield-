import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, NetInfo } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

// Mock Offline Storage Utility
const mockStorage = {
  pendingScans: [] as any[],
  save: async (scan: any) => {
    mockStorage.pendingScans.push(scan);
    console.log(`[Offline Storage] Saved scan. Total pending: ${mockStorage.pendingScans.length}`);
  },
  getAll: async () => mockStorage.pendingScans,
  clear: async () => { mockStorage.pendingScans = []; }
};

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && locationStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        const location = await Location.getCurrentPositionAsync({});
        analyzeCrop(photo.uri, location.coords.latitude, location.coords.longitude);
      } catch (e) {
        Alert.alert("Error", "Failed to capture image or location.");
      }
    }
  };

  const analyzeCrop = async (imageUri: string, lat: number, lng: number) => {
    setIsProcessing(true);
    setResult(null);

    const scanData = {
      imageUrl: imageUri,
      userId: 'youth-officer-001',
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanData),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log("Network error, saving scan offline...");
      await mockStorage.save(scanData);
      setPendingCount(mockStorage.pendingScans.length);
      Alert.alert("Offline", "Connection failed. Scan saved locally and will sync when you are back online.");
    } finally {
      setIsProcessing(false);
    }
  };

  const syncData = async () => {
    const pending = await mockStorage.getAll();
    if (pending.length === 0) {
      Alert.alert("Sync", "No pending scans to sync.");
      return;
    }

    setIsProcessing(true);
    let successCount = 0;

    for (const scan of pending) {
      try {
        const response = await fetch('http://localhost:3000/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scan),
        });
        if (response.ok) successCount++;
      } catch (e) {
        console.error("Sync failed for a record", e);
      }
    }

    if (successCount > 0) {
      await mockStorage.clear();
      setPendingCount(0);
      Alert.alert("Sync Complete", `Successfully uploaded ${successCount} scans.`);
    } else {
      Alert.alert("Sync Failed", "Could not connect to the server. Please try again later.");
    }
    setIsProcessing(false);
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      {pendingCount > 0 && !result && (
        <TouchableOpacity style={styles.syncBadge} onPress={syncData}>
          <Text style={styles.syncText}>📦 {pendingCount} PENDING SCANS - TAP TO SYNC</Text>
        </TouchableOpacity>
      )}

      {!result ? (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="#fff" /> : <View style={styles.innerCircle} />}
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>AI Analysis Result</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Health: <Text style={styles.value}>{result.healthPercentage}%</Text></Text>
            <Text style={styles.label}>Pest Detected: <Text style={styles.value}>{result.detectedPest}</Text></Text>
            <Text style={styles.advice}>{result.recommendedAction}</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={() => setResult(null)}>
            <Text style={styles.resetText}>New Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  syncBadge: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10, backgroundColor: '#047857', padding: 12, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  syncText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  buttonContainer: { marginBottom: 40 },
  captureButton: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
  resultContainer: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '900', color: '#064e3b', marginBottom: 30, textAlign: 'center', letterSpacing: -0.5 },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  label: { fontSize: 14, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 },
  value: { fontSize: 20, fontWeight: '900', color: '#047857' },
  advice: { marginTop: 24, fontSize: 16, fontStyle: 'italic', color: '#334155', lineHeight: 24 },
  resetButton: { marginTop: 40, backgroundColor: '#047857', paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#047857', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  resetText: { color: '#fff', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }
});


import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function RegistrationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('FARMER');
  const [region, setRegion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!phoneNumber || !region) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Manual registration for farmers/herders doesn't require a password
      const response = await fetch('http://localhost:3000/api/auth/register-farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, role, region }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", `${role} registered successfully!`);
        setPhoneNumber('');
        setRegion('');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <Text style={styles.title}>Assisted Onboarding</Text>
      <Text style={styles.subtitle}>Register a community member for USSD services.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number (MSISDN)</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+260..."
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Member Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'FARMER' && styles.activeRole]} 
            onPress={() => setRole('FARMER')}
          >
            <Text style={[styles.roleText, role === 'FARMER' && styles.activeRoleText]}>Farmer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'HERDER' && styles.activeRole]} 
            onPress={() => setRole('HERDER')}
          >
            <Text style={[styles.roleText, role === 'HERDER' && styles.activeRoleText]}>Herder</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Region</Text>
        <TextInput
          style={styles.input}
          value={region}
          onChangeText={setRegion}
          placeholder="e.g. Eastern Province"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Complete Registration</Text>}
        </TouchableOpacity>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#064e3b', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 40, fontWeight: '500' },
  form: { backgroundColor: '#fff', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 10, fontWeight: '900', color: '#888', uppercase: true, tracking: 1, marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', border: '1px solid #eee', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 16 },
  roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleButton: { flex: 1, padding: 16, borderRadius: 12, border: '1px solid #eee', alignItems: 'center' },
  activeRole: { backgroundColor: '#064e3b', borderColor: '#064e3b' },
  roleText: { fontSize: 14, fontWeight: '700', color: '#666' },
  activeRoleText: { color: '#fff' },
  submitButton: { backgroundColor: '#047857', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }
});

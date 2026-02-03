import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { COLORS } from '../constants';

interface SubscribeScreenProps {
  onNavigate: (route: string) => void;
}

const SubscribeScreen: React.FC<SubscribeScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = () => {
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <View style={styles.screen}>
      <Header onHome={() => onNavigate('Home')} onBrowse={() => onNavigate('Search')} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        <Text style={styles.title}>Never Miss a <Text style={{ color: COLORS.primary }}>Vibe</Text>.</Text>
        <Text style={styles.subtitle}>Get weekly alerts about new Afro films, cheapest streaming deals, and low-data releases in Nigeria.</Text>

        {status === 'success' ? (
          <View style={styles.successCard}>
            <Text style={styles.successText}>Oshey! You're on the list.</Text>
            <TouchableOpacity onPress={() => setStatus('idle')}>
              <Text style={styles.successLink}>Subscribe another email</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email o..."
              placeholderTextColor="#6b7280"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.submit} disabled={status === 'loading'}>
              <Text style={styles.submitText}>{status === 'loading' ? 'Joining the tribe...' : 'Alert Me!'}</Text>
            </TouchableOpacity>
            <Text style={styles.tiny}>No spam, only the best Nollywood & Global content.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  content: {
    padding: 24,
    alignItems: 'center'
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  icon: {
    fontSize: 32
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  form: {
    width: '100%'
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 14,
    color: '#fff',
    textAlign: 'center'
  },
  submit: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16
  },
  submitText: {
    color: '#000',
    fontWeight: '900',
    textAlign: 'center'
  },
  tiny: {
    color: '#6b7280',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 10
  },
  successCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    alignItems: 'center'
  },
  successText: {
    color: COLORS.primary,
    fontWeight: '800',
    marginBottom: 10
  },
  successLink: {
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1
  }
});

export default SubscribeScreen;

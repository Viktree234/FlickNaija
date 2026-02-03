import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

interface HeaderProps {
  onHome?: () => void;
  onBrowse?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onBrowse }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>FN</Text>
        </View>
        <Text style={styles.title}>
          Flick<Text style={styles.titleAccent}>Naija</Text>
        </Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity onPress={onHome}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBrowse}>
          <Text style={styles.navText}>Browse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0b0b0b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary
  },
  logoText: {
    fontWeight: '800',
    color: '#000'
  },
  title: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 18
  },
  titleAccent: {
    color: COLORS.primary
  },
  nav: {
    flexDirection: 'row',
    gap: 16
  },
  navText: {
    color: '#d1d5db',
    fontWeight: '600'
  }
});

export default Header;

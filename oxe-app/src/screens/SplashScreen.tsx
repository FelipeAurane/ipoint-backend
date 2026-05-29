import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<NavProp>();
  const { isAuthenticated, isLoading } = useAuth();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: false }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Main' : 'Auth');
    }, 1800);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Text style={styles.logo}>Oxe!</Text>
        <Text style={styles.tagline}>O marketplace do Nordeste</Text>
      </Animated.View>
      <Animated.View style={[styles.bottomTag, { opacity }]}>
        <Text style={styles.bottomText}>Feito com ♥ no Brasil</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  bottomTag: {
    position: 'absolute',
    bottom: 48,
  },
  bottomText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
});

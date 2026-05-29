import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'OrderSuccess'>;

export default function OrderSuccessScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { orders } = useAuth();

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const order = orders.find((o) => o.id === route.params.orderId);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: false }),
      ]),
    ]).start();
  }, []);

  function goHome() {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] })
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale }], opacity }]}>
          <Ionicons name="checkmark-circle" size={96} color={colors.success} />
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity }]}>
          <Text style={styles.title}>Oxe! Pedido feito! 🎉</Text>
          <Text style={styles.subtitle}>
            Seu pedido foi confirmado com sucesso e será enviado em breve.
          </Text>
        </Animated.View>

        {order && (
          <Animated.View style={[styles.orderCard, { opacity }]}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Número do pedido</Text>
              <Text style={styles.orderValue}>#{order.id.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total</Text>
              <Text style={[styles.orderValue, { color: colors.primary }]}>
                {formatPrice(order.total)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Pagamento</Text>
              <Text style={styles.orderValue}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Entrega</Text>
              <Text style={styles.orderValue}>
                {order.address.city}, {order.address.state}
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.ordersBtn} onPress={goHome}>
            <Ionicons name="receipt-outline" size={18} color={colors.primary} />
            <Text style={styles.ordersBtnText}>Ver meus pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
            <Text style={styles.homeBtnText}>Continuar comprando</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: 24,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.success}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: { alignItems: 'center', gap: 8 },
  title: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  orderCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderLabel: { fontSize: 13, color: colors.textSecondary },
  orderValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border },
  actions: { width: '100%', gap: 12 },
  ordersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
  },
  ordersBtnText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  homeBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBtnText: { color: colors.textLight, fontSize: 16, fontWeight: '700' },
});

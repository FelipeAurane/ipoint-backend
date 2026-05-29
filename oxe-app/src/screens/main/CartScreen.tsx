import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import CartItemRow from '../../components/CartItemRow';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SHIPPING_THRESHOLD = 99;

export default function CartScreen() {
  const navigation = useNavigation<NavProp>();
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  const freeShipping = total >= SHIPPING_THRESHOLD;
  const shippingCost = freeShipping ? 0 : 12.9;
  const orderTotal = total + shippingCost;

  function handleClear() {
    Alert.alert('Limpar carrinho', 'Deseja remover todos os itens?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearCart },
    ]);
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.emptyHeader}>
          <Text style={styles.title}>Carrinho</Text>
        </View>
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={80} color={colors.border} />
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptyText}>Adicione produtos para continuar</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Explore' as never)}
          >
            <Text style={styles.shopBtnText}>Explorar produtos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho ({itemCount})</Text>
        <TouchableOpacity onPress={handleClear} hitSlop={8}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Shipping progress */}
      {!freeShipping && (
        <View style={styles.shippingBanner}>
          <Ionicons name="bicycle-outline" size={16} color={colors.primary} />
          <Text style={styles.shippingBannerText}>
            Falta <Text style={{ fontWeight: '700' }}>{formatPrice(SHIPPING_THRESHOLD - total)}</Text> para frete grátis!
          </Text>
        </View>
      )}
      {freeShipping && (
        <View style={[styles.shippingBanner, { backgroundColor: `${colors.success}15` }]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={[styles.shippingBannerText, { color: colors.success }]}>
            Parabéns! Você ganhou frete grátis 🎉
          </Text>
        </View>
      )}

      {/* Items list */}
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Order summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</Text>
          <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Frete</Text>
          <Text style={freeShipping ? styles.freeText : styles.summaryValue}>
            {freeShipping ? 'Grátis' : formatPrice(shippingCost)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(orderTotal)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutBtnText}>Finalizar pedido</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  emptyHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.textSecondary },
  shopBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  shopBtnText: { color: colors.textLight, fontWeight: '700', fontSize: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  clearText: { fontSize: 14, color: colors.error, fontWeight: '600' },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: 4,
  },
  shippingBannerText: { fontSize: 13, color: colors.primary, flex: 1 },
  list: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexGrow: 1,
  },
  summary: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    gap: 10,
    ...shadows.md,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  freeText: { fontSize: 14, fontWeight: '700', color: colors.success },
  divider: { height: 1, backgroundColor: colors.border },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontSize: 20, fontWeight: '900', color: colors.primary },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  checkoutBtnText: { color: colors.textLight, fontSize: 16, fontWeight: '700' },
});

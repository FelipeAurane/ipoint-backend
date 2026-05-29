import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import { Order } from '../../types';

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string; icon: string }> = {
  pending: { label: 'Aguardando', color: '#F59E0B', icon: 'time-outline' },
  confirmed: { label: 'Confirmado', color: '#3B82F6', icon: 'checkmark-circle-outline' },
  shipped: { label: 'Em trânsito', color: '#8B5CF6', icon: 'bicycle-outline' },
  delivered: { label: 'Entregue', color: colors.success, icon: 'bag-check-outline' },
  cancelled: { label: 'Cancelado', color: colors.error, icon: 'close-circle-outline' },
};

function OrderCard({ order }: { order: Order }) {
  const status = STATUS_CONFIG[order.status];
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
          <Ionicons name={status.icon as keyof typeof Ionicons.glyphMap} size={13} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.itemsPreview}>
        {order.items.slice(0, 2).map((item) => (
          <Text key={item.product.id} style={styles.itemPreviewText} numberOfLines={1}>
            {item.quantity}x {item.product.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>+{order.items.length - 2} outros itens</Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.itemCount}>
          {itemCount} {itemCount === 1 ? 'item' : 'itens'} • {order.paymentMethod}
        </Text>
        <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const { orders } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pedidos</Text>
        <Text style={styles.subtitle}>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={72} color={colors.border} />
            <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
            <Text style={styles.emptyText}>Seus pedidos aparecerão aqui</Text>
          </View>
        }
        renderItem={({ item }) => <OrderCard order={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 16,
    ...shadows.sm,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  orderDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  itemsPreview: { gap: 3 },
  itemPreviewText: { fontSize: 13, color: colors.textSecondary },
  moreItems: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  itemCount: { fontSize: 12, color: colors.textSecondary },
  orderTotal: { fontSize: 16, fontWeight: '800', color: colors.primary },
  empty: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.textSecondary },
});

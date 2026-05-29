import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../types';
import { colors, borderRadius, shadows } from '../theme';
import { formatPrice } from '../utils/currency';

interface Props {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <View style={styles.container}>
      {imgError ? (
        <View style={styles.imgPlaceholder}>
          <Ionicons name="image-outline" size={24} color={colors.border} />
        </View>
      ) : (
        <Image
          source={{ uri: item.product.image }}
          style={styles.image}
          onError={() => setImgError(true)}
        />
      )}

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.seller}>{item.product.seller}</Text>
        <Text style={styles.price}>{formatPrice(item.product.price)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onRemove(item.product.id)}
          hitSlop={4}
        >
          <Ionicons name="trash-outline" size={14} color={colors.error} />
        </TouchableOpacity>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            hitSlop={4}
          >
            <Ionicons name="remove" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            hitSlop={4}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtotal}>
          {formatPrice(item.product.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 12,
    ...shadows.sm,
    gap: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.sm,
    resizeMode: 'cover',
  },
  imgPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  seller: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  controls: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 72,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qty: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

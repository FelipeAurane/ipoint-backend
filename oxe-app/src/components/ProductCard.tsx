import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { colors, borderRadius, shadows } from '../theme';
import { formatPrice, discountPercent } from '../utils/currency';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

interface Props {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, onPress, onAddToCart }: Props) {
  const [imgError, setImgError] = useState(false);
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imageContainer}>
        {imgError ? (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="image-outline" size={40} color={colors.border} />
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            onError={() => setImgError(true)}
          />
        )}
        {hasDiscount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              -{discountPercent(product.originalPrice!, product.price)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.star} />
          <Text style={styles.ratingText}>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            {hasDiscount && (
              <Text style={styles.originalPrice}>{formatPrice(product.originalPrice!)}</Text>
            )}
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>
          {onAddToCart && (
            <TouchableOpacity style={styles.addBtn} onPress={onAddToCart} hitSlop={8}>
              <Ionicons name="add" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.seller} numberOfLines={1}>
          {product.seller}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seller: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

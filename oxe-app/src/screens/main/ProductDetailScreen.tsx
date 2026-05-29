import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/mockData';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import RatingStars from '../../components/RatingStars';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'ProductDetail'>;

const { width: W } = Dimensions.get('window');

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Maria S.', rating: 5, text: 'Produto excelente! Chegou rápido e bem embalado. Recomendo!', date: '10/05/2026' },
  { id: 'r2', author: 'João P.', rating: 4, text: 'Muito bom, qualidade ótima. Só demorou um pouco a entrega.', date: '08/05/2026' },
  { id: 'r3', author: 'Ana C.', rating: 5, text: 'Superou minhas expectativas! Adorei, já comprei 2 vezes.', date: '05/05/2026' },
];

export default function ProductDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { addItem, items } = useCart();

  const product = products.find((p) => p.id === route.params.productId);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Produto não encontrado</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.primary }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const inCart = items.find((i) => i.product.id === product.id);
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) addItem(product);
    Alert.alert('✓ Adicionado!', `${product.name} foi adicionado ao carrinho`, [
      { text: 'Continuar comprando', style: 'cancel' },
      { text: 'Ver carrinho', onPress: () => navigation.goBack() },
    ]);
  }

  function handleBuyNow() {
    for (let i = 0; i < quantity; i++) addItem(product);
    navigation.navigate('Checkout');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Back button overlay */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Product image */}
        {imgError ? (
          <View style={styles.imgPlaceholder}>
            <Ionicons name="image-outline" size={64} color={colors.border} />
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            onError={() => setImgError(true)}
          />
        )}

        <View style={styles.body}>
          {/* Category tag */}
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <Text style={styles.soldByText}>
              Vendido por <Text style={styles.seller}>{product.seller}</Text>
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceBlock}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>{formatPrice(product.originalPrice!)}</Text>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.installment}>
              Em até 12x de {formatPrice(product.price / 12)} sem juros
            </Text>
          </View>

          {/* Quantity selector */}
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantidade</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qty}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.stockText}>{product.stock} em estoque</Text>
            </View>
          </View>

          {/* Shipping info */}
          <View style={styles.shipping}>
            <Ionicons name="bicycle-outline" size={18} color={colors.success} />
            <Text style={styles.shippingText}>Frete grátis para compras acima de R$99</Text>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Descrição do produto</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Seller info */}
          <View style={styles.sellerCard}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="storefront-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.sellerName}>{product.seller}</Text>
                <View style={styles.sellerRatingRow}>
                  <Ionicons name="star" size={12} color={colors.star} />
                  <Text style={styles.sellerRatingText}>{product.sellerRating.toFixed(1)} de avaliação</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Avaliações dos compradores</Text>
            {MOCK_REVIEWS.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <RatingStars rating={r.rating} size={12} showCount={false} />
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color={colors.primary} />
          <Text style={styles.cartBtnText}>
            {inCart ? `No carrinho (${inCart.quantity})` : 'Adicionar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyBtnText}>Comprar agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: colors.textSecondary },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  scroll: { paddingBottom: 120 },
  image: { width: W, height: W * 0.85, resizeMode: 'cover' },
  imgPlaceholder: {
    width: W,
    height: W * 0.85,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: { padding: spacing.md, gap: 12 },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  name: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, lineHeight: 28 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  soldByText: { fontSize: 12, color: colors.textSecondary },
  seller: { color: colors.primary, fontWeight: '600' },
  priceBlock: { gap: 4 },
  originalPrice: {
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  price: { fontSize: 28, fontWeight: '900', color: colors.primary },
  discountBadge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: { color: colors.textLight, fontSize: 12, fontWeight: '800' },
  installment: { fontSize: 12, color: colors.textSecondary },
  qtySection: { gap: 8 },
  qtyLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qty: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
  stockText: { fontSize: 12, color: colors.textSecondary, marginLeft: 4 },
  shipping: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.success}15`,
    borderRadius: borderRadius.md,
    padding: 12,
  },
  shippingText: { fontSize: 13, color: colors.success, fontWeight: '600' },
  descSection: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}15`,
  },
  tagText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  sellerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sellerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  sellerRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  sellerRatingText: { fontSize: 12, color: colors.textSecondary },
  reviewsSection: { gap: 12 },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  reviewDate: { fontSize: 11, color: colors.textSecondary },
  reviewText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
  },
  cartBtnText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  buyBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: { color: colors.textLight, fontSize: 16, fontWeight: '700' },
});

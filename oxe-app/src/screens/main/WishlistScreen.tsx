import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { colors, spacing, borderRadius } from '../../theme';
import ProductCard from '../../components/ProductCard';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function WishlistScreen() {
  const navigation = useNavigation<NavProp>();
  const { items, count } = useWishlist();
  const { addItem } = useCart();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Desejos</Text>
        <Text style={styles.subtitle}>
          {count} produto{count !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={72} color={colors.border} />
            <Text style={styles.emptyTitle}>Nenhum produto salvo</Text>
            <Text style={styles.emptyText}>Toque no coração nos produtos para salvar</Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Main' as never)}
            >
              <Text style={styles.exploreBtnText}>Explorar produtos</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            onAddToCart={() => addItem(item)}
          />
        )}
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
  row: { gap: 16, paddingHorizontal: spacing.md, marginBottom: 16 },
  list: { paddingBottom: 24 },
  empty: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  exploreBtnText: { color: colors.textLight, fontWeight: '700', fontSize: 15 },
});

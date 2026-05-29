import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList, RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';
import { products, categories } from '../../data/mockData';
import { colors, spacing, borderRadius } from '../../theme';

import SearchBar from '../../components/SearchBar';
import CategoryBadge from '../../components/CategoryBadge';
import ProductCard from '../../components/ProductCard';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<MainTabParamList, 'Explore'>;

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'rating';

const SORT_LABELS: Record<SortKey, string> = {
  default: 'Relevância',
  price_asc: 'Menor preço',
  price_desc: 'Maior preço',
  rating: 'Melhor avaliação',
};

export default function ProductListScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { addItem } = useCart();

  const initCategory = route.params?.categoryId ?? null;

  const [search, setSearch] = useState(route.params?.searchQuery ?? '');
  const [activeCategory, setActiveCategory] = useState<string | null>(initCategory);
  const [sort, setSort] = useState<SortKey>('default');
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory) list = list.filter((p) => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, activeCategory, sort]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={() => {}}
          autoFocus={!!route.params?.searchQuery}
        />
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
          <Ionicons name="filter-outline" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortPanel}>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.sortOption, sort === key && styles.sortOptionActive]}
              onPress={() => { setSort(key); setShowSort(false); }}
            >
              <Text style={[styles.sortText, sort === key && styles.sortTextActive]}>
                {SORT_LABELS[key]}
              </Text>
              {sort === key && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Categories */}
      <FlatList
        data={[null, ...categories]}
        keyExtractor={(item) => item?.id ?? 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        style={styles.catScroll}
        renderItem={({ item }) => {
          if (!item) {
            return (
              <TouchableOpacity
                style={[styles.allChip, !activeCategory && styles.allChipActive]}
                onPress={() => setActiveCategory(null)}
              >
                <Text style={[styles.allChipText, !activeCategory && styles.allChipTextActive]}>
                  Todos
                </Text>
              </TouchableOpacity>
            );
          }
          return (
            <View style={{ marginRight: 8 }}>
              <CategoryBadge
                category={item}
                isActive={activeCategory === item.slug}
                onPress={() => setActiveCategory(activeCategory === item.slug ? null : item.slug)}
              />
            </View>
          );
        }}
      />

      {/* Results info */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
          {activeCategory ? ` em ${categories.find((c) => c.slug === activeCategory)?.name}` : ''}
        </Text>
      </View>

      {/* Products grid */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 10,
  },
  sortBtn: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortPanel: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOptionActive: {
    backgroundColor: `${colors.primary}10`,
  },
  sortText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  sortTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  catScroll: { maxHeight: 52 },
  catList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: 0,
  },
  allChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    justifyContent: 'center',
  },
  allChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  allChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  allChipTextActive: {
    color: colors.textLight,
  },
  resultRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  row: {
    gap: 16,
    paddingHorizontal: spacing.md,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});

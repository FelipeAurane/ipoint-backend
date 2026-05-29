import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { products, categories, banners } from '../../data/mockData';
import { colors, spacing, borderRadius } from '../../theme';

import SearchBar from '../../components/SearchBar';
import BannerCarousel from '../../components/BannerCarousel';
import CategoryBadge from '../../components/CategoryBadge';
import ProductCard from '../../components/ProductCard';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [search, setSearch] = useState('');

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const onSale = products.filter((p) => p.originalPrice).slice(0, 6);

  function goToProduct(id: string) {
    navigation.navigate('ProductDetail', { productId: id });
  }

  function goToExplore(categoryId?: string) {
    navigation.navigate('Main' as never, {
      screen: 'Explore',
      params: categoryId ? { categoryId } : undefined,
    } as never);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting()}, {user?.name?.split(' ')[0] ?? 'visitante'}! 👋
            </Text>
            <Text style={styles.headerSub}>O que você precisa hoje?</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search (tappable, navigates to Explore) */}
        <View style={styles.searchWrap}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onPress={() => goToExplore()}
            editable={false}
          />
        </View>

        {/* Banners */}
        <BannerCarousel banners={banners} />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity onPress={() => goToExplore()}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map((cat) => (
              <View key={cat.id} style={styles.catItem}>
                <CategoryBadge
                  category={cat}
                  onPress={() => goToExplore(cat.slug)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Featured */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Em Alta</Text>
            <TouchableOpacity onPress={() => goToExplore()}>
              <Text style={styles.seeAll}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featured}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <View style={styles.hCard}>
                <ProductCard
                  product={item}
                  onPress={() => goToProduct(item.id)}
                  onAddToCart={() => addItem(item)}
                />
              </View>
            )}
          />
        </View>

        {/* On Sale */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏷️ Promoções</Text>
            <TouchableOpacity onPress={() => goToExplore()}>
              <Text style={styles.seeAll}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {onSale.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => goToProduct(item.id)}
                onAddToCart={() => addItem(item)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  catScroll: {
    paddingLeft: spacing.md,
  },
  catItem: {
    marginRight: 10,
  },
  hList: {
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  hCard: {
    marginRight: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: 16,
    justifyContent: 'space-between',
  },
});

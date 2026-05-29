import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  badge?: string;
}

function MenuItem({ icon, label, onPress, destructive = false, badge }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, destructive && { backgroundColor: `${colors.error}15` }]}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={destructive ? colors.error : colors.primary}
        />
      </View>
      <Text style={[styles.menuLabel, destructive && { color: colors.error }]}>{label}</Text>
      {badge ? (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{badge}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const { user, logout, orders } = useAuth();

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const activeCount = orders.filter((o) => ['confirmed', 'shipped', 'pending'].includes(o.status)).length;

  async function handleLogout() {
    Alert.alert('Sair da conta', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] })
          );
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.avatar ?? `https://ui-avatars.com/api/?name=Usuario&background=FF6B00&color=fff` }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name ?? 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          {[
            { label: 'Pedidos', value: orders.length, icon: 'receipt-outline' },
            { label: 'Entregues', value: deliveredCount, icon: 'bag-check-outline' },
            { label: 'Em andamento', value: activeCount, icon: 'time-outline' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Conta</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              label="Dados pessoais"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="location-outline"
              label="Endereços salvos"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="card-outline"
              label="Formas de pagamento"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Compras</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="receipt-outline"
              label="Meus pedidos"
              onPress={() => navigation.navigate('Orders' as never)}
              badge={activeCount > 0 ? String(activeCount) : undefined}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="heart-outline"
              label="Lista de desejos"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="star-outline"
              label="Avaliações"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Suporte</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              label="Central de ajuda"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="chatbubble-outline"
              label="Fale conosco"
              onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="information-circle-outline"
              label="Sobre o Oxe"
              onPress={() => Alert.alert('Oxe!', 'O marketplace do Nordeste 🌵\nVersão 1.0.0')}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            <MenuItem icon="log-out-outline" label="Sair da conta" onPress={handleLogout} destructive />
          </View>
        </View>

        <Text style={styles.version}>Oxe v1.0.0 • Feito com ♥ no Nordeste</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 32 },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textSecondary },
  menuSection: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  menuTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  menuBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: { color: colors.textLight, fontSize: 11, fontWeight: '800' },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 66 },
  version: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xl,
  },
});

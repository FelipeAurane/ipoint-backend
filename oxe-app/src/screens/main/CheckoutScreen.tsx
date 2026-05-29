import React, { useReducer, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import { Order } from '../../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

type PaymentMethod = 'pix' | 'credit' | 'boleto';

interface AddressState {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

type AddressAction = { field: keyof AddressState; value: string };

const initialAddress: AddressState = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
};

function addressReducer(state: AddressState, action: AddressAction): AddressState {
  return { ...state, [action.field]: action.value };
}

function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

const PAYMENT_OPTIONS: { key: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { key: 'pix', label: 'PIX', icon: 'flash-outline', desc: 'Aprovação imediata • 5% de desconto' },
  { key: 'credit', label: 'Cartão de Crédito', icon: 'card-outline', desc: 'Até 12x sem juros' },
  { key: 'boleto', label: 'Boleto Bancário', desc: 'Vence em 3 dias úteis', icon: 'document-text-outline' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<NavProp>();
  const { items, total, clearCart } = useCart();
  const { addOrder } = useAuth();

  const [address, dispatchAddress] = useReducer(addressReducer, initialAddress);
  const [payment, setPayment] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);

  function setField(field: keyof AddressState) {
    return (value: string) => dispatchAddress({ field, value });
  }

  const { street, number, complement, neighborhood, city, state, zipCode } = address;
  const shippingCost = total >= 99 ? 0 : 12.9;
  const pixDiscount = payment === 'pix' ? total * 0.05 : 0;
  const orderTotal = total + shippingCost - pixDiscount;

  function validate(): boolean {
    if (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos de endereço');
      return false;
    }
    return true;
  }

  async function handleConfirm() {
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const orderId = `ord${Date.now()}`;
    const order: Order = {
      id: orderId,
      items: [...items],
      total: orderTotal,
      status: 'confirmed',
      date: new Date().toISOString().split('T')[0],
      address: { street, number, complement: complement || undefined, neighborhood, city, state, zipCode },
      paymentMethod: PAYMENT_OPTIONS.find((p) => p.key === payment)?.label ?? payment,
    };

    addOrder(order);
    clearCart();
    setLoading(false);
    navigation.replace('OrderSuccess', { orderId });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Finalizar Pedido</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Address */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Endereço de entrega</Text>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 2 }]}>
                <Text style={styles.label}>Rua / Avenida</Text>
                <TextInput style={styles.input} value={street} onChangeText={setField('street')} placeholder="Ex: Rua das Flores" placeholderTextColor={colors.textSecondary} />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Número</Text>
                <TextInput style={styles.input} value={number} onChangeText={setField('number')} placeholder="42" placeholderTextColor={colors.textSecondary} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Complemento (opcional)</Text>
              <TextInput style={styles.input} value={complement} onChangeText={setField('complement')} placeholder="Apto, bloco..." placeholderTextColor={colors.textSecondary} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput style={styles.input} value={neighborhood} onChangeText={setField('neighborhood')} placeholder="Ex: Centro" placeholderTextColor={colors.textSecondary} />
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, { flex: 2 }]}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={styles.input} value={city} onChangeText={setField('city')} placeholder="Ex: Recife" placeholderTextColor={colors.textSecondary} />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Estado</Text>
                <TextInput style={styles.input} value={state} onChangeText={(v) => setField('state')(v.toUpperCase())} placeholder="PE" placeholderTextColor={colors.textSecondary} maxLength={2} autoCapitalize="characters" />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={(v) => setField('zipCode')(maskCEP(v))}
                placeholder="00000-000"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={9}
              />
            </View>
          </View>

          {/* Payment */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="wallet-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Forma de pagamento</Text>
            </View>

            {PAYMENT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.paymentOption, payment === opt.key && styles.paymentOptionActive]}
                onPress={() => setPayment(opt.key)}
              >
                <View style={styles.paymentLeft}>
                  <View style={[styles.paymentIcon, payment === opt.key && styles.paymentIconActive]}>
                    <Ionicons
                      name={opt.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={payment === opt.key ? colors.textLight : colors.textSecondary}
                    />
                  </View>
                  <View>
                    <Text style={[styles.paymentLabel, payment === opt.key && styles.paymentLabelActive]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.paymentDesc}>{opt.desc}</Text>
                  </View>
                </View>
                <View style={[styles.radio, payment === opt.key && styles.radioActive]}>
                  {payment === opt.key && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Order summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Resumo do pedido</Text>
            </View>

            {items.map((item) => (
              <View key={item.product.id} style={styles.orderItem}>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.quantity}x {item.product.name}
                </Text>
                <Text style={styles.orderItemPrice}>{formatPrice(item.product.price * item.quantity)}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            <View style={styles.orderItem}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.orderItemPrice}>{formatPrice(total)}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.label}>Frete</Text>
              <Text style={shippingCost === 0 ? styles.freeText : styles.orderItemPrice}>
                {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
              </Text>
            </View>
            {pixDiscount > 0 && (
              <View style={styles.orderItem}>
                <Text style={[styles.label, { color: colors.success }]}>Desconto PIX (5%)</Text>
                <Text style={{ color: colors.success, fontWeight: '700' }}>-{formatPrice(pixDiscount)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.orderItem}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(orderTotal)}</Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Confirm button */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.totalSmall}>Total do pedido</Text>
            <Text style={styles.totalLarge}>{formatPrice(orderTotal)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirmar pedido</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  section: {
    margin: spacing.md,
    marginBottom: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldGroup: { gap: 4 },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  paymentOptionActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}08` },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconActive: { backgroundColor: colors.primary },
  paymentLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  paymentLabelActive: { color: colors.primary },
  paymentDesc: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderItemName: { fontSize: 13, color: colors.textSecondary, flex: 1, marginRight: 8 },
  orderItemPrice: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border },
  freeText: { fontSize: 13, fontWeight: '700', color: colors.success },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '900', color: colors.primary },
  totalSmall: { fontSize: 12, color: colors.textSecondary },
  totalLarge: { fontSize: 20, fontWeight: '900', color: colors.primary },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 28,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { colors, borderRadius } from '../theme';

interface Props {
  category: Category;
  isActive?: boolean;
  onPress: () => void;
}

export default function CategoryBadge({ category, isActive = false, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && { backgroundColor: category.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : `${category.color}20` },
        ]}
      >
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={isActive ? colors.textLight : category.color}
        />
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  labelActive: {
    color: colors.textLight,
  },
});

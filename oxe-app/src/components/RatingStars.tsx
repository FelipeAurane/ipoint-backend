import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export default function RatingStars({ rating, reviewCount, size = 14, showCount = true }: Props) {
  const stars = [1, 2, 3, 4, 5];

  function getStarIcon(index: number): keyof typeof Ionicons.glyphMap {
    const diff = rating - index + 1;
    if (diff >= 1) return 'star';
    if (diff >= 0.5) return 'star-half';
    return 'star-outline';
  }

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <Ionicons key={star} name={getStarIcon(star)} size={size} color={colors.star} />
      ))}
      {showCount && reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>({reviewCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  count: {
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

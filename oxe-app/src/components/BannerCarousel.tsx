import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Banner } from '../types';
import { borderRadius, spacing } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - spacing.md * 2;
const BANNER_HEIGHT = 160;

interface Props {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveIndex(index);
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + spacing.sm}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingRight: spacing.sm }}
      >
        {banners.map((banner) => (
          <View
            key={banner.id}
            style={[styles.banner, { backgroundColor: banner.color, width: BANNER_WIDTH }]}
          >
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{banner.discount}</Text>
            </View>
            <Text style={[styles.title, { color: banner.textColor }]} numberOfLines={2}>
              {banner.title}
            </Text>
            <Text style={[styles.subtitle, { color: banner.textColor, opacity: 0.85 }]} numberOfLines={2}>
              {banner.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: BANNER_HEIGHT,
    borderRadius: borderRadius.lg,
    padding: 20,
    justifyContent: 'flex-end',
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#FF6B00',
    width: 18,
  },
});

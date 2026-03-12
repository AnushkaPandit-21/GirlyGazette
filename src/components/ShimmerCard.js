import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import COLORS from '../theme/colors';

export default function ShimmerCard() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgColor = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [COLORS.shimmer1, COLORS.shimmer3, COLORS.shimmer1],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.imagePlaceholder, { backgroundColor: bgColor }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.titleLine, { backgroundColor: bgColor }]} />
        <Animated.View style={[styles.titleLineShort, { backgroundColor: bgColor }]} />
        <Animated.View style={[styles.subtitleLine, { backgroundColor: bgColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleLine: {
    height: 14,
    borderRadius: 7,
    marginBottom: 8,
    width: '100%',
  },
  titleLineShort: {
    height: 14,
    borderRadius: 7,
    marginBottom: 8,
    width: '60%',
  },
  subtitleLine: {
    height: 10,
    borderRadius: 5,
    width: '40%',
  },
});

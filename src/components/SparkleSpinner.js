import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Platform } from 'react-native';
import COLORS from '../theme/colors';

export default function SparkleSpinner({ message = 'Getting the tea...' }) {
  const sparkles = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    sparkles.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sparkleRow}>
        {sparkles.map((anim, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.sparkle,
              {
                opacity: anim,
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.3],
                    }),
                  },
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            ✨
          </Animated.Text>
        ))}
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  sparkleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sparkle: {
    fontSize: 28,
  },
  message: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: COLORS.primary,
  },
});

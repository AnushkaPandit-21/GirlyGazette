import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import COLORS from '../theme/colors';

function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ArticleCard({ article, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.row}>
        {article.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderEmoji}>📰</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>
          <Text style={styles.meta}>
            {timeAgo(article.pubDate)}
          </Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.teaButton} onPress={onPress}>
          <Text style={styles.teaButtonText}>Get the tea ☕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#FFE6F0',
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: COLORS.shimmer1,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 30,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 21,
    marginBottom: 6,
  },
  meta: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  buttonRow: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  teaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  teaButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: COLORS.white,
  },
});

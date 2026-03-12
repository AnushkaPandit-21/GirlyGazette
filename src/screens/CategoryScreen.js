import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import COLORS from '../theme/colors';
import FEEDS from '../config/feeds';
import { fetchFeedsByCategory } from '../services/rssService';
import ArticleCard from '../components/ArticleCard';
import ArticleSheet from '../components/ArticleSheet';
import ShimmerCard from '../components/ShimmerCard';

const CATEGORY_META = {
  finance: { name: 'Money Moves', tagline: 'Because rich girls understand money 💰' },
  geopolitics: { name: 'World Drama', tagline: 'Main character energy, global edition 🌍' },
  gossip: { name: 'The Tea', tagline: 'Sip sip, bestie 💅' },
  tech: { name: 'Robot News', tagline: 'The future is girly & techy 🤖' },
  dev: { name: 'Dev Diary', tagline: 'Code like the queen you are 👩‍💻' },
};

export default function CategoryScreen({ route }) {
  const { categoryKey } = route.params;
  const feed = FEEDS[categoryKey];
  const meta = CATEGORY_META[categoryKey];
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadArticles();
  }, [categoryKey]);

  async function loadArticles() {
    setLoading(true);
    try {
      const result = await fetchFeedsByCategory(categoryKey);
      setArticles(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  }

  function renderHeader() {
    return (
      <View style={[styles.header, { backgroundColor: feed?.color || COLORS.primary }]}>
        <Text style={styles.emoji}>{feed?.emoji}</Text>
        <Text style={styles.title}>{meta?.name || categoryKey}</Text>
        <Text style={styles.tagline}>{meta?.tagline}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item, index) => `${item.link || index}`}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={() => setSelectedArticle(item)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🫣</Text>
              <Text style={styles.emptyText}>No articles right now, bestie!</Text>
              <Text style={styles.emptySubtext}>Pull down to refresh</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <ArticleSheet
        visible={!!selectedArticle}
        article={selectedArticle}
        category={categoryKey}
        onClose={() => setSelectedArticle(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 28,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  tagline: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
  },
});

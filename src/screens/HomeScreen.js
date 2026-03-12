import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
} from 'react-native';
import COLORS from '../theme/colors';
import FEEDS from '../config/feeds';
import { fetchAllFeeds } from '../services/rssService';
import { clearOldCache } from '../services/geminiService';
import { useSettings } from '../context/SettingsContext';
import ArticleCard from '../components/ArticleCard';
import ArticleSheet from '../components/ArticleSheet';
import ShimmerCard from '../components/ShimmerCard';

const { width } = Dimensions.get('window');

const CATEGORY_META = {
  finance: { name: 'Money Moves', tagline: 'Because rich girls understand money 💰' },
  geopolitics: { name: 'World Drama', tagline: 'Main character energy, global edition 🌍' },
  gossip: { name: 'The Tea', tagline: 'Sip sip, bestie 💅' },
  tech: { name: 'Robot News', tagline: 'The future is girly & techy 🤖' },
  dev: { name: 'Dev Diary', tagline: 'Code like the queen you are 👩‍💻' },
};

export default function HomeScreen({ navigation }) {
  const [allArticles, setAllArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { settings } = useSettings();

  useEffect(() => {
    loadFeeds();
    clearOldCache();
    startShimmer();
  }, []);

  function startShimmer() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }

  async function loadFeeds() {
    setLoading(true);
    try {
      const feeds = await fetchAllFeeds();
      setAllArticles(feeds);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeeds();
    setRefreshing(false);
  }, []);

  const titleColor = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [COLORS.primary, COLORS.accent, COLORS.primary],
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const enabledCategories = Object.keys(FEEDS).filter(
    (k) => settings.enabledCategories[k]
  );

  const featuredArticle = (() => {
    for (const cat of enabledCategories) {
      if (allArticles[cat]?.length > 0) return { article: allArticles[cat][0], category: cat };
    }
    return null;
  })();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Animated.Text style={[styles.title, { color: titleColor }]}>
            ✨ The Girly Gazette ✨
          </Animated.Text>
          <Text style={styles.subtitle}>Today's tea, served hot 🍵</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        {/* Category Book Spines */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksRow}
        >
          {enabledCategories.map((key) => (
            <CategoryBook
              key={key}
              categoryKey={key}
              meta={CATEGORY_META[key]}
              feed={FEEDS[key]}
              onPress={() => navigation.navigate('Category', { categoryKey: key })}
            />
          ))}
        </ScrollView>

        {/* Featured Story */}
        {loading ? (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Today's Top Story ⭐</Text>
            <ShimmerCard />
            <ShimmerCard />
          </View>
        ) : featuredArticle ? (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Today's Top Story ⭐</Text>
            <ArticleCard
              article={featuredArticle.article}
              onPress={() => {
                setSelectedArticle(featuredArticle.article);
                setSelectedCategory(featuredArticle.category);
              }}
            />
          </View>
        ) : null}

        {/* Recent by category */}
        {!loading &&
          enabledCategories.map((key) => {
            const articles = allArticles[key];
            if (!articles || articles.length === 0) return null;
            return (
              <View key={key} style={styles.categorySection}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Category', { categoryKey: key })}
                >
                  <Text style={styles.sectionTitle}>
                    {FEEDS[key].emoji} {CATEGORY_META[key].name}
                  </Text>
                </TouchableOpacity>
                {articles.slice(0, 2).map((article, i) => (
                  <ArticleCard
                    key={`${key}-${i}`}
                    article={article}
                    onPress={() => {
                      setSelectedArticle(article);
                      setSelectedCategory(key);
                    }}
                  />
                ))}
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => navigation.navigate('Category', { categoryKey: key })}
                >
                  <Text style={styles.seeAllText}>See all {CATEGORY_META[key].name} →</Text>
                </TouchableOpacity>
              </View>
            );
          })}

        {loading && (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <ArticleSheet
        visible={!!selectedArticle}
        article={selectedArticle}
        category={selectedCategory}
        onClose={() => setSelectedArticle(null)}
      />
    </View>
  );
}

function CategoryBook({ categoryKey, meta, feed, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  }
  function onPressOut() {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          bookStyles.book,
          { backgroundColor: feed.color, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={bookStyles.emoji}>{feed.emoji}</Text>
        <Text style={bookStyles.name}>{meta.name}</Text>
        <View style={bookStyles.spine} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const bookStyles = StyleSheet.create({
  book: {
    width: 100,
    height: 130,
    borderRadius: 12,
    marginRight: 14,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  date: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  booksRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  featuredSection: {
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 20,
    color: COLORS.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  seeAllButton: {
    alignSelf: 'center',
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  seeAllText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
});

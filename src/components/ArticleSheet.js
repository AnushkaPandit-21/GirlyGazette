import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Linking,
  Share,
} from 'react-native';
import COLORS from '../theme/colors';
import SparkleSpinner from './SparkleSpinner';
import { getAISummary } from '../services/geminiService';
import { useSettings } from '../context/SettingsContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ArticleSheet({ visible, article, category, onClose }) {
  const [summary, setSummary] = useState(null);
  const [isAI, setIsAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { settings } = useSettings();

  useEffect(() => {
    if (visible) {
      setSummary(null);
      setIsAI(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      fetchSummary();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, article]);

  async function fetchSummary() {
    if (!article) return;
    setLoading(true);
    try {
      const language = settings.language || 'English';
      const result = await getAISummary(article, category, language);
      setSummary(result.summary);
      setIsAI(result.isAI);
    } catch (e) {
      setSummary(article.description || 'No description available.');
      setIsAI(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!article) return;
    try {
      await Share.share({
        message: `${article.title}\n\nRead more: ${article.link}\n\nShared via The Girly Gazette ✨`,
      });
    } catch (e) {}
  }

  function renderWhySection() {
    if (!summary || !isAI) return null;
    const whyMatch = summary.match(
      /Why this matters to YOU 💅([\s\S]*?)$/i
    );
    if (!whyMatch) return null;
    return (
      <View style={styles.whyBox}>
        <Text style={styles.whyTitle}>Why this matters to YOU 💅</Text>
        <Text style={styles.whyText}>{whyMatch[1].trim()}</Text>
      </View>
    );
  }

  function renderMainSummary() {
    if (!summary) return null;
    const mainText = isAI
      ? summary.replace(/Why this matters to YOU 💅[\s\S]*$/i, '')
      : summary;
    return <Text style={styles.summaryText}>{mainText.trim()}</Text>;
  }

  if (!article) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.articleTitle}>{article.title}</Text>

            {loading && (
              <SparkleSpinner message="Getting the tea from AI bestie... ✨" />
            )}

            {!loading && !isAI && summary && (
              <View style={styles.fallbackBanner}>
                <Text style={styles.fallbackText}>
                  ✨ AI bestie is on a break, here's the original tea
                </Text>
              </View>
            )}

            {!loading && summary && (
              <>
                {renderMainSummary()}
                {renderWhySection()}
              </>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.readButton}
                onPress={() => Linking.openURL(article.link)}
              >
                <Text style={styles.readButtonText}>Read Full Article 🔗</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
              >
                <Text style={styles.shareButtonText}>Share 💌</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.82,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  articleTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 28,
  },
  fallbackBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  fallbackText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#8B6914',
  },
  summaryText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: 16,
  },
  whyBox: {
    backgroundColor: '#FFF0F7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  whyTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 6,
  },
  whyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 23,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  readButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  readButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: COLORS.white,
    fontSize: 15,
  },
  shareButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  shareButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: COLORS.text,
    fontSize: 15,
  },
});

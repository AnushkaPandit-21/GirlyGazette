import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../theme/colors';
import FEEDS from '../config/feeds';
import { useSettings } from '../context/SettingsContext';

const CATEGORY_META = {
  finance: { name: 'Money Moves 💰' },
  geopolitics: { name: 'World Drama 🌍' },
  gossip: { name: 'The Tea 💅' },
  tech: { name: 'Robot News 🤖' },
  dev: { name: 'Dev Diary 👩‍💻' },
};

const LANGUAGES = ['English', 'Hindi', 'Hinglish'];

export default function SettingsScreen() {
  const { settings, updateSettings, toggleCategory } = useSettings();
  const [apiKey, setApiKey] = useState(settings.geminiKey || '');

  function handleLanguageChange(lang) {
    updateSettings({ language: lang });
  }

  function handleSaveApiKey() {
    updateSettings({ geminiKey: apiKey.trim() });
    Alert.alert('Saved! 💖', 'Your API key has been saved.');
  }

  async function handleRefresh() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith('gemini_cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
      Alert.alert('Refreshed! ✨', 'All cached summaries have been cleared. Pull down on the home screen to reload news.');
    } catch (e) {
      Alert.alert('Oops 😅', 'Something went wrong clearing the cache.');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>My Vibe Settings 💖</Text>
        <Text style={styles.subtitle}>Customize your gazette, bestie</Text>
      </View>

      {/* Category Toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Categories</Text>
        <Text style={styles.sectionSubtitle}>Toggle what news you wanna see</Text>
        {Object.keys(FEEDS).map((key) => (
          <View key={key} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {CATEGORY_META[key]?.name || key}
            </Text>
            <Switch
              value={settings.enabledCategories[key]}
              onValueChange={() => toggleCategory(key)}
              trackColor={{ false: '#E8D0DC', true: COLORS.secondary }}
              thumbColor={settings.enabledCategories[key] ? COLORS.primary : '#ccc'}
            />
          </View>
        ))}
      </View>

      {/* Language Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Vibe 🗣️</Text>
        <Text style={styles.sectionSubtitle}>How should your AI bestie talk?</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.langButton,
                settings.language === lang && styles.langButtonActive,
              ]}
              onPress={() => handleLanguageChange(lang)}
            >
              <Text
                style={[
                  styles.langButtonText,
                  settings.language === lang && styles.langButtonTextActive,
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* API Key */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gemini API Key 🔑</Text>
        <Text style={styles.sectionSubtitle}>
          Paste your key from Google AI Studio
        </Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="AIzaSy..."
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
          <Text style={styles.saveButtonText}>Save Key 💾</Text>
        </TouchableOpacity>
      </View>

      {/* Refresh */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh News & Clear Cache 🔄</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Made with 💖 by a girly who loves the news{'\n'}
        Powered by Google Gemini AI ✨
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 28,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF0F5',
  },
  toggleLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: COLORS.text,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: COLORS.primary,
  },
  langButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: COLORS.text,
  },
  langButtonTextActive: {
    color: COLORS.white,
  },
  input: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: COLORS.text,
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  footer: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
});

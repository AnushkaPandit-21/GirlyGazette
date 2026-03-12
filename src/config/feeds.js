const FEEDS = {
  finance: {
    label: 'Finance 💰',
    emoji: '💰',
    color: '#FF6B9D',
    feeds: [
      'https://www.livemint.com/rss/markets',
      'https://economictimes.indiatimes.com/markets/rss.cms',
    ],
  },
  geopolitics: {
    label: 'Geopolitics 🌍',
    emoji: '🌍',
    color: '#C084FC',
    feeds: [
      'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    ],
  },
  tech: {
    label: 'Tech & AI 🤖',
    emoji: '🤖',
    color: '#60A5FA',
    feeds: [
      'https://feeds.feedburner.com/TechCrunch',
      'https://www.theverge.com/rss/index.xml',
    ],
  },
  gossip: {
    label: 'Gossip & Lifestyle 💅',
    emoji: '💅',
    color: '#F472B6',
    feeds: [
      'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
    ],
  },
  dev: {
    label: 'Software Dev 👩‍💻',
    emoji: '👩‍💻',
    color: '#34D399',
    feeds: [
      'https://dev.to/feed',
      'https://feeds.feedburner.com/hacker-news-frontpage-blog',
    ],
  },
};

export default FEEDS;

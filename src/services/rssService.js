import FEEDS from '../config/feeds';

const CORS_PROXY = '';

function extractImageUrl(item) {
  if (item['media:content']?.$.url) return item['media:content'].$.url;
  if (item.enclosure?.url) return item.enclosure.url;

  const desc = item.description || item['content:encoded'] || '';
  const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

async function parseFeed(url) {
  try {
    const response = await fetch(`${CORS_PROXY}${url}`, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    return parseXml(text);
  } catch (error) {
    console.warn(`Failed to fetch feed: ${url}`, error.message);
    return [];
  }
}

function parseXml(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = getTagContent(itemXml, 'title');
    const description = stripHtml(getTagContent(itemXml, 'description'));
    const link = getTagContent(itemXml, 'link');
    const pubDate = getTagContent(itemXml, 'pubDate');

    let imageUrl =
      getAttr(itemXml, 'media:content', 'url') ||
      getAttr(itemXml, 'media:thumbnail', 'url') ||
      getAttr(itemXml, 'enclosure', 'url') ||
      null;

    if (!imageUrl) {
      const contentEncoded = getTagContent(itemXml, 'content:encoded') || '';
      const imgMatch = (contentEncoded + (getTagContent(itemXml, 'description') || '')).match(
        /<img[^>]+src=["']([^"']+)["']/
      );
      if (imgMatch) imageUrl = imgMatch[1];
    }

    if (title) {
      items.push({
        title: stripHtml(title),
        description: description.slice(0, 500),
        link,
        pubDate,
        imageUrl,
      });
    }
  }

  return items;
}

function getTagContent(xml, tag) {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1];

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function getAttr(xml, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]+${attr}=["']([^"']+)["']`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : null;
}

export async function fetchFeedsByCategory(categoryKey) {
  const category = FEEDS[categoryKey];
  if (!category) return [];

  const allItems = [];

  const results = await Promise.allSettled(
    category.feeds.map((url) => parseFeed(url))
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  allItems.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
    const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
    return dateB - dateA;
  });

  return allItems.slice(0, 8);
}

export async function fetchAllFeeds() {
  const categories = Object.keys(FEEDS);
  const result = {};

  const promises = categories.map(async (key) => {
    result[key] = await fetchFeedsByCategory(key);
  });

  await Promise.allSettled(promises);
  return result;
}

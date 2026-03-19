const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'dashboard', 'dashboard_dataset.csv');
const outputPath = path.join(__dirname, 'public', 'data', 'secondary_aggregated.json');

const csv = fs.readFileSync(inputPath, 'utf8');
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true, dynamicTyping: true });

const data = parsed.data;

const stats = {
  totalReviews: data.length,
  totalAdMentions: 0,
  categoryStats: {}, // category -> metrics
  continentStats: {}, // continent -> metrics
  appStats: {},       // app_name -> metrics
  sentimentOverall: { positive: 0, neutral: 0, negative: 0 },
  adSentiment: { positive: 0, neutral: 0, negative: 0 },
};

function initGroup(groupObj, key) {
  if (!groupObj[key]) {
    groupObj[key] = {
      total: 0,
      adMentions: 0,
      sumRating: 0,
      sumRatingAd: 0,
      countAd: 0,
      sumRatingNoAd: 0,
      countNoAd: 0,
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      adSentiment: { positive: 0, neutral: 0, negative: 0 }
    };
  }
  return groupObj[key];
}

function processGroup(obj, rating, isAd, sentiment) {
  obj.total++;
  obj.sumRating += (rating || 0);
  if (sentiment && obj.sentiment[sentiment] !== undefined) {
    obj.sentiment[sentiment]++;
  }
  if (isAd) {
    obj.adMentions++;
    obj.sumRatingAd += (rating || 0);
    obj.countAd++;
    if (sentiment && obj.adSentiment[sentiment] !== undefined) {
      obj.adSentiment[sentiment]++;
    }
  } else {
    obj.sumRatingNoAd += (rating || 0);
    obj.countNoAd++;
  }
}

data.forEach((row) => {
  const { category, app_name, continent, rating, sentiment, ad_mentioned } = row;
  const isAd = ad_mentioned === 1;

  if (isAd) stats.totalAdMentions++;

  // Sentiments
  if (stats.sentimentOverall[sentiment] !== undefined) stats.sentimentOverall[sentiment]++;
  if (isAd && stats.adSentiment[sentiment] !== undefined) stats.adSentiment[sentiment]++;

  // Categories
  if (category && category !== 'Unknown') {
    const cat = initGroup(stats.categoryStats, category);
    processGroup(cat, rating, isAd, sentiment);
  }

  // Continents
  if (continent && continent !== 'Unknown') {
    const cont = initGroup(stats.continentStats, continent);
    processGroup(cont, rating, isAd, sentiment);
  }

  // Apps
  if (app_name && app_name !== 'Unknown') {
    const app = initGroup(stats.appStats, app_name);
    processGroup(app, rating, isAd, sentiment);
  }
});

function formatMetrics(groups) {
  return Object.entries(groups)
    .map(([name, metrics]) => {
      const avgRatingAll = Number((metrics.sumRating / metrics.total).toFixed(2));
      const avgRatingWithAds = metrics.countAd > 0 ? Number((metrics.sumRatingAd / metrics.countAd).toFixed(2)) : null;
      const avgRatingWithoutAds = metrics.countNoAd > 0 ? Number((metrics.sumRatingNoAd / metrics.countNoAd).toFixed(2)) : null;
      return {
        name,
        totalReviews: metrics.total,
        adMentions: metrics.adMentions,
        adMentionRate: Number(((metrics.adMentions / metrics.total) * 100).toFixed(1)),
        avgRatingAll,
        avgRatingWithAds,
        avgRatingWithoutAds,
        ratingDrop: avgRatingWithoutAds && avgRatingWithAds ? Number((avgRatingWithoutAds - avgRatingWithAds).toFixed(2)) : 0,
        sentimentDistribution: [
          { name: 'Positive', value: metrics.sentiment.positive, fill: '#10b981' },
          { name: 'Neutral', value: metrics.sentiment.neutral, fill: '#64748b' },
          { name: 'Negative', value: metrics.sentiment.negative, fill: '#ef4444' },
        ],
        adSentimentDistribution: [
          { name: 'Positive', value: metrics.adSentiment.positive, fill: '#10b981' },
          { name: 'Neutral', value: metrics.adSentiment.neutral, fill: '#64748b' },
          { name: 'Negative', value: metrics.adSentiment.negative, fill: '#ef4444' },
        ]
      };
    })
    .sort((a, b) => b.adMentionRate - a.adMentionRate);
}

const result = {
  overview: {
    totalReviews: stats.totalReviews,
    totalAdMentions: stats.totalAdMentions,
    adMentionRate: ((stats.totalAdMentions / stats.totalReviews) * 100).toFixed(1),
  },
  sentimentDistribution: [
    { name: 'Positive', value: stats.sentimentOverall.positive, fill: '#10b981' },
    { name: 'Neutral', value: stats.sentimentOverall.neutral, fill: '#64748b' },
    { name: 'Negative', value: stats.sentimentOverall.negative, fill: '#ef4444' },
  ],
  adSentimentDistribution: [
    { name: 'Positive', value: stats.adSentiment.positive, fill: '#10b981' },
    { name: 'Neutral', value: stats.adSentiment.neutral, fill: '#64748b' },
    { name: 'Negative', value: stats.adSentiment.negative, fill: '#ef4444' },
  ],
  categoryMetrics: formatMetrics(stats.categoryStats),
  continentMetrics: formatMetrics(stats.continentStats),
  appMetrics: formatMetrics(stats.appStats),
};

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log('Successfully aggregated secondary dataset logic.');

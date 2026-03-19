const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const inputPath = path.join(__dirname, 'dashboard', 'dashboard_dataset.csv');
const outputPath = path.join(__dirname, 'Dashboard_Platform', 'public', 'data', 'secondary_aggregated.json');

const csv = fs.readFileSync(inputPath, 'utf8');
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true, dynamicTyping: true });

const data = parsed.data;

const stats = {
  totalReviews: data.length,
  totalAdMentions: 0,
  categoryStats: {}, // category -> { total, adMentions, sumRating: 0, sumRatingAd: 0, countAd: 0 }
  sentimentOverall: { positive: 0, neutral: 0, negative: 0 },
  adSentiment: { positive: 0, neutral: 0, negative: 0 },
};

data.forEach((row) => {
  const { category, rating, sentiment, ad_mentioned } = row;
  const isAd = ad_mentioned === 1;

  if (isAd) stats.totalAdMentions++;

  // Overall sentiment
  if (stats.sentimentOverall[sentiment] !== undefined) {
    stats.sentimentOverall[sentiment]++;
  }

  // Ad sentiment
  if (isAd && stats.adSentiment[sentiment] !== undefined) {
    stats.adSentiment[sentiment]++;
  }

  // Category stats
  if (category && category !== 'Unknown') {
    if (!stats.categoryStats[category]) {
      stats.categoryStats[category] = { total: 0, adMentions: 0, sumRating: 0, sumRatingAd: 0, countAd: 0, sumRatingNoAd: 0, countNoAd: 0 };
    }
    const cat = stats.categoryStats[category];
    cat.total++;
    cat.sumRating += (rating || 0);

    if (isAd) {
      cat.adMentions++;
      cat.sumRatingAd += (rating || 0);
      cat.countAd++;
    } else {
      cat.sumRatingNoAd += (rating || 0);
      cat.countNoAd++;
    }
  }
});

// Format for charts
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
  categoryMetrics: Object.entries(stats.categoryStats)
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
        ratingDrop: avgRatingWithoutAds && avgRatingWithAds ? Number((avgRatingWithoutAds - avgRatingWithAds).toFixed(2)) : 0
      };
    })
    .sort((a, b) => b.adMentionRate - a.adMentionRate)
};

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log('Successfully aggregated secondary dataset logic.');

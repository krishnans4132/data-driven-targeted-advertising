import pandas as pd
from pathlib import Path

reviews = pd.read_csv('data/processed/reviews_cleaned.csv')

# Sentiment distribution
print('Sentiment Distribution:')
print(reviews['sentiment'].value_counts())
print(f'\nSentiment Percentages:')
print((reviews['sentiment'].value_counts() / len(reviews) * 100).round(2))

# Ad mentions
if 'mention_ads' in reviews.columns:
    print(f'\nAd Mentions in Reviews:')
    print(reviews['mention_ads'].value_counts())

# By category
print(f'\nSentiment by Category:')
sentiment_by_cat = pd.crosstab(reviews['category'], reviews['sentiment'])
print(sentiment_by_cat)

# Get ratings distribution
print(f'\nRating Distribution:')
print(reviews['rating'].value_counts().sort_index())

# Top negative apps
print(f'\nTop Apps with Most Reviews:')
print(reviews['app_name'].value_counts().head(10))

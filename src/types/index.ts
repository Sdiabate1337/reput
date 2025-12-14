export type Platform = 'google' | 'booking' | 'tripadvisor' | 'facebook' | 'instagram' | 'trustpilot' | 'yelp';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed';
export type ReviewStatus = 'pending' | 'published' | 'archived'; // Frontend status
export type DBReviewStatus = 'PENDING_ANALYSIS' | 'PENDING_VALIDATION' | 'PUBLISHED_AUTO' | 'PUBLISHED_MANUAL' | 'REJECTED' | 'ERROR_AI' | 'ERROR_PUBLISH';

export interface Review {
    id: string;
    source: Platform;
    author: string;
    avatarUrl?: string;
    rating: number;
    date: string;
    content: string;
    sentiment: Sentiment;
    status: ReviewStatus;
    tags: string[];
    likes?: number;
    draftResponse?: string;
    publishedResponse?: string;
}

export interface ReviewStats {
    total: number;
    averageRating: number;
    sentimentBreakdown: Record<Sentiment, number>;
}


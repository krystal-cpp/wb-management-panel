import axios from 'axios';
import type { FeedbacksResponse, FeedbacksAnswerPayload, FeedbacksArchiveResponse } from '@/entities/feedback';
import { mockFeedbacksResponse, mockFeedbacksArchiveResponse } from '@/mocks/feedbacks';

const USE_MOCK = true;

const feedbacksClient = axios.create({
    baseURL: 'https://feedbacks-api.wildberries.ru',
    headers: {
        Authorization: process.env.WB_API_TOKEN ?? '',
        'Content-Type': 'application/json',
    },
});

export interface GetFeedbacksParams {
    isAnswered: boolean,
    take: number,
    skip: number,
    order?: 'dateAsc' | 'dateDesc',
    nmId?: number,
    dateFrom?: number,
    dateTo?: number,
};

export async function getFeedbacks(
    params: GetFeedbacksParams
): Promise<FeedbacksResponse> {
    if(USE_MOCK) return mockFeedbacksResponse(params.isAnswered);

    const { data } = await feedbacksClient.get<FeedbacksResponse>(
        '/api/v1/feedbacks',
        { params }
    );

    return data;
};

export async function getFeedbacksArchive(
    params: {
        take: number,
        skip: number,
        order?: 'dateAsc' | 'dateDesc',
        nmId?: number
    }): Promise<FeedbacksArchiveResponse> {
        if(USE_MOCK) return mockFeedbacksArchiveResponse;

        const { data } = await feedbacksClient.get<FeedbacksArchiveResponse>(
            '/api/v1/feedbacks/archive',
            { params }
        );

        return data;
    };

export async function answerFeedback(payload: FeedbacksAnswerPayload): Promise<void> {
    if(USE_MOCK) return

    await feedbacksClient.post('/api/v1/feedbacks/answer', payload);
};

export async function editFeedbackAnswer(payload: FeedbacksAnswerPayload): Promise<void> {
    if(USE_MOCK) return;

    await feedbacksClient.patch('/api/v1/feedback/answer', payload);
};
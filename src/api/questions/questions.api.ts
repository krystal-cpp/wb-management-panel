import axios from 'axios';
import type { QuestionsResponse, QuestionAnswerPayload } from '@/entities/question';
import { mockQuestionsResponse } from '@/mocks/questions';

const USE_MOCK = true;

const questionsClient = axios.create({
    baseURL: 'https://feedbacks-api.wildberries.ru',
    headers: {
        Authorization: process.env.WB_API_TOKEN ?? '',
        'Content-Type': 'application/json',
    },
});

export interface GetQuestionsParams {
    isAnswered: boolean,
    take: number,
    skip: number,
    order?: 'dateAsc' | 'dateDesc',
    nmId?: number,
    dateFrom?: number,
    dateTo?: number,
};

export async function getQuestions(
    params: GetQuestionsParams
): Promise<QuestionsResponse> {
    if(USE_MOCK) return mockQuestionsResponse(params.isAnswered);

    const { data } = await questionsClient.get<QuestionsResponse>(
        '/api/v1/questions',
        { params } 
    );

    return data;
};

export async function answerQuestion(payload: QuestionAnswerPayload): Promise<void> {
    if(USE_MOCK) return;

    await questionsClient.patch('/api/v1/questions', payload);
};
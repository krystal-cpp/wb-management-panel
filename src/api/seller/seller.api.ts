import axios from 'axios';
import type { SellerInfo, SellerRating } from '@/entities/seller';
import { mockSellerInfo, mockSellerRating } from '@/mocks/seller';

const USE_MOCK = true;

const sellerClient = axios.create({
    baseURL: 'https://common-api.wildberries.ru',
    headers: {
        Authorization: process.env.WB_API_TOKEN ?? '',
        'Content-Type': 'application/json',
    },
});

export async function getSellerInfo(): Promise<SellerInfo> {
    if(USE_MOCK) return mockSellerInfo;

    const { data } = await sellerClient.get<SellerInfo>('/api/v1/seller-info');
    return data;
};

export async function getSellerRating(): Promise<SellerRating> {
    if(USE_MOCK) return mockSellerRating;

    const { data } = await sellerClient.get<SellerRating>('/api/v1/rating');
    return data;
};
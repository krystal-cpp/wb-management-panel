import type { SellerInfo, SellerRating } from '@/entities/seller/seller.types';

export const mockSellerInfo: SellerInfo = {
    name: 'ИП Иванов А. В.',
    sid: 'e8923014-e233-47a8-898e-3cc86d67ea61',
    tradeMark: 'IvanovStore',
}

export const mockSellerRating: SellerRating = {
    rating: 4.7,
    feedbacksCount: 1284,
}
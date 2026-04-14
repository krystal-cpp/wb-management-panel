const CURRENCY_SYMBOLS: Record<string, string> = {
    RUB: '₽',
    BYN: 'ƃ',
    KZT: '₸',
    KGS: 'сом',
    AMD: '֏',
    UZS: 'сум',
    TJS: 'SM',
};

export function formatPrice(amount: number, currency: string): string {
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

    return `${amount.toLocaleString('ru-RU')} ${symbol}`
};
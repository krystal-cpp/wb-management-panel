import type { QuestionsResponse } from "@/entities/question";

const mockUnansweredQuestions: QuestionsResponse['data']['questions'] = [
    {
        id: 'quest-001',
        text: 'Подскажите, есть ли этот товар в размере 44?',
        createdDate: '2026-03-13T10:00:00Z',
        state: 'wbRu',
        answer: null,
        productDetails: {
            imtId: 111222333,
            nmId: 987654321,
            productName: 'Кроссовки мужские летние',
            supplierArticle: 'KR-001/белый',
            supplierName: 'IvanovStore',
            brandName: 'IvanovStore',
        },
        wasViewed: false,
        isWarned: false
    },
    {
        id: 'quest-002',
        text: 'Из какого материала сделан товар? Есть ли в составе синтетика?',
        createdDate: '2026-03-14T14:20:00Z',
        state: 'wbRu',
        answer: null,
        productDetails: {
            imtId: 111222334,
            nmId: 987654322,
            productName: 'Футболка мужская хлопок',
            supplierArticle: 'FT-003/серый',
            supplierName: 'IvanovStore',
            brandName: 'IvanovStore',
        },
        wasViewed: true,
        isWarned: false,
    },
    {
        id: 'quest-003',
        text: 'Сколько времени занимает доставка в Новосибирск?',
        createdDate: '2026-03-15T09:45:00Z',
        state: 'wbRu',
        answer: null,
        productDetails: {
            imtId: 111222335,
            nmId: 987654323,
            productName: 'Кепка летняя',
            supplierArticle: 'KP-004/синий',
            supplierName: 'IvanovStore',
            brandName: 'IvanovStore',
        },
        wasViewed: false,
        isWarned: true,
    },
];

const mockAnsweredQuestions: QuestionsResponse['data']['questions'] = [
    {
        id: 'quest-ans-001',
        text: 'Можно ли стирать в машинке?',
        createdDate: '2024-03-01T11:00:00Z',
        state: 'wbRu',
        answer: {
            text: 'Да, можно стирать при температуре до 40°C в деликатном режиме.',
            editable: true,
            createdDate: '2024-03-01T15:00:00Z',
        },
        productDetails: {
            imtId: 111222336,
            nmId: 987654324,
            productName: 'Носки мужские набор 5 пар',
            supplierArticle: 'NS-005/белый',
            supplierName: 'IvanovStore',
            brandName: 'IvanovStore',
        },
        wasViewed: true,
        isWarned: false,
    },
    {
        id: 'quest-ans-002',
        text: 'Есть ли гарантия на товар?',
        createdDate: '2024-03-05T16:30:00Z',
        state: 'wbRu',
        answer: {
            text: 'Да, на все наши товары действует гарантия 30 дней с момента получения.',
            editable: false,
            createdDate: '2024-03-05T18:00:00Z',
        },
        productDetails: {
            imtId: 111222337,
            nmId: 987654325,
            productName: 'Балетки женские',
            supplierArticle: 'BL-002/чёрный',
            supplierName: 'IvanovStore',
            brandName: 'IvanovStore',
        },
        wasViewed: true,
        isWarned: false,
    },
];

export const mockQuestionsResponse = (isAnswered: boolean): QuestionsResponse => ({
    data: {
        countUnanswered: isAnswered ? 0 : 3,
        countArchive: 18,
        questions: isAnswered ? mockAnsweredQuestions : mockUnansweredQuestions,
    },
    error: false,
    errorText: '',
    additionalErrors: null,
});
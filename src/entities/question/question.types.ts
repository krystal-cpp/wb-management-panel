export interface QuestionAnswer {
    text: string,
    editable: boolean,
    createdDate: string,
};

export interface QuestionProductDetails {
    imtId: number,
    nmId: number,
    productName: string,
    supplierArticle: string,
    supplierName: string,
    brandName: string,
};

export interface Question {
    id: string,
    text: string,
    createdDate: string,
    state: string,
    answer: QuestionAnswer | null,
    productDetails: QuestionProductDetails,
    wasViewed: boolean,
    isWarned: boolean,
};

export interface QuestionsResponse {
    data: {
        countUnanswered: number,
        countArchive: number,
        questions: Question[],
    },
    error: boolean,
    errorText: string,
    additionalErrors: null,
};

export interface QuestionAnswerPayload {
    id: string,
    text: string,
    wasViewed: boolean,
};
export interface FeedbackAnswer {
    text: string,
    state: string,
    editable: boolean,
};

export interface FeedbackProductDetails {
    imtId: number,
    nmId: number,
    productName: string,
    supplierArticle: string,
    supplierName: string,
    brandName: string,
    size: string,
};

export interface FeedbackPhotoLink {
    fullSize: string,
    miniSize: string,
};

export interface FeedbackVideo {
    previewImage: string,
    link: string,
    durationSec: number
};

export interface Feedback {
    id: string,
    text: string,
    pros: string,
    cons: string,
    productValuation: number,
    createdDate: string,
    answer: FeedbackAnswer | null,
    state: string,
    productDetails: FeedbackProductDetails,
    video: FeedbackVideo | null,
    wasViewed: boolean,
    photoLinks: FeedbackPhotoLink[],
    userName: string,
    orderStatus: string,
    matchingSize: string,
    isAbleSupplierFeedbackValuation: boolean,
    supplierFeedbackValuation: number,
    isAbleSupplierProductValuation: boolean,
    supplierProductValuation: number,
    isAbleReturnProductOrders: boolean,
    returnProductOrdersDate: string,
    bables: string[],
    lastOrderShkId: number,
    lastOrderCreatedAt: string,
    color: string,
    subjectId: number,
    subjectName: string,
    parentFeedbackId: string | null,
    childFeedbackId: string | null,
};

export interface FeedbacksResponse {
    data: {
        countUnanswered: number,
        countArchive: number,
        feedbacks: Feedback[],
    },
    error: boolean,
    errorText: string,
    additionalErrors: null,
};

export interface FeedbacksArchiveResponse {
    data: {
        feedbacks: Feedback[],
    },
    error: boolean,
    errorText: string,
    additionalErrors: null,
};

export interface FeedbacksAnswerPayload {
    id: string,
    text: string,
};
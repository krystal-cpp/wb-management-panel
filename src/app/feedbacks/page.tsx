'use client';

import { useState, useEffect } from 'react';
import { Tabs, List, Card, Rate, Tag, Button, Modal, Input, Typography, Space, Badge, Empty, Spin, message } from 'antd';
import { MessageOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Feedback } from '@/entities/feedback';
import { getFeedbacks, getFeedbacksArchive, answerFeedback, editFeedbackAnswer } from '@/api/feedbacks';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function FeedbacksPage() {
    const [activeTab, setActiveTab] = useState<'unanswered' | 'answered' | 'archive'>('unanswered')
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [archiveFeedbacks, setArchiveFeedbacks] = useState<Feedback[]>([])
    const [countUnanswered, setCountUnanswered] = useState(0);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = !!selectedFeedback?.answer?.editable;

    async function loadFeedbacks(isAnswered: boolean) {
        setLoading(true);

        try {
            const res = await getFeedbacks({ isAnswered, take: 50, skip: 0, order: 'dateDesc' });
            setFeedbacks(res.data.feedbacks);
            setCountUnanswered(res.data.countUnanswered);
        } finally {
            setLoading(false);
        }
    };

    async function loadArchive() {
        setLoading(true);

        try {
            const res = await getFeedbacksArchive({ take: 50, skip: 0, order: 'dateDesc' });
            setArchiveFeedbacks(res.data.feedbacks);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (activeTab === 'unanswered') loadFeedbacks(false);
        else if (activeTab === 'answered') loadFeedbacks(true);
        else loadArchive();
    }, [activeTab]);

    function openAnswerModal(feedback: Feedback) {
        setSelectedFeedback(feedback)
        setAnswerText(feedback.answer?.text ?? '')
        setModalOpen(true)
    };

    async function handleSubmitAnswer() {
        if (!selectedFeedback || !answerText.trim()) return;
        setSubmitting(true);

        try {
            if (isEditMode) {
                await editFeedbackAnswer({ id: selectedFeedback.id, text: answerText });
                message.success('Ответ отредактирован');
            }
            else {
                await answerFeedback({ id: selectedFeedback.id, text: answerText });
                message.success('Ответ отправлен');
            }

            setFeedbacks(prev =>
                prev.map(f =>
                    f.id === selectedFeedback.id
                        ? { ...f, answer: { text: answerText, state: 'wbRu', editable: true } }
                        : f
                )
            );
            setModalOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    const currentList = activeTab === 'archive' ? archiveFeedbacks : feedbacks;

    const tabItems = [
        {
            key: 'unanswered',
            label: (
                <Badge count={countUnanswered} offset={[10, 0]}>Без ответа</Badge>
            ),
        },
        { key: 'answered', label: 'Отвеченные' },
        { key: 'archive', label: 'Архив' },
    ];

    return (
        <>
            <Tabs
                activeKey={activeTab}
                onChange={key => setActiveTab(key as typeof activeTab)}
                items={tabItems}
                style={{ marginBottom: 16 }} />

            {loading ? (
                <div style={{ textAlign: 'center', padding: 48 }}>
                    <Spin size='large' />
                </div>
            ) : currentList.length === 0 ? (
                <Empty description='Отзывов нет' />
            ) : (
                <List
                    dataSource={currentList}
                    rowKey='id'
                    itemLayout='vertical'
                    renderItem={feedbacks => (
                        <List.Item style={{ padding: 0, marginBottom: 12 }}>
                            <Card
                                size='small'
                                style={{ borderRadius: 8 }}
                                styles={{ body: { padding: 16 } }}>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
                                    <Space size='small' wrap>
                                        <Text strong>{feedbacks.userName}</Text>
                                        <Rate disabled value={feedbacks.productValuation} style={{ fontSize: 13 }} />
                                        <Text type='secondary' style={{ fontSize: 12 }}>
                                            {dayjs(feedbacks.createdDate).format('DD.MM.YYYY HH:mm')}
                                        </Text>
                                        {!feedbacks.wasViewed && <Tag color='blue'>Новый</Tag>}
                                        {feedbacks.orderStatus === 'returned' && <Tag color='red'>Возврат</Tag>}
                                    </Space>
                                    <Text type='secondary' style={{ fontSize: 12 }}>
                                        {feedbacks.productDetails.productName} · арт. {feedbacks.productDetails.supplierArticle}
                                        {feedbacks.productDetails.size !== '0' && ` · ${feedbacks.productDetails.size}`}
                                    </Text>
                                </Space>

                                {feedbacks.text && (
                                    <Paragraph style={{ marginBottom: 6 }}>{feedbacks.text}</Paragraph>
                                )}

                                {(feedbacks.pros && feedbacks.pros !== 'Нет') || (feedbacks.cons && feedbacks.cons !== 'Нет') ? (
                                    <Space style={{ marginBottom: 8 }} wrap>
                                        {feedbacks.pros && feedbacks.pros !== 'Нет' && (
                                            <Text style={{ fontSize: 12, marginRight: 5 }}>
                                                <Text type='success' strong>+ </Text>{feedbacks.pros}
                                            </Text>
                                        )}
                                        {feedbacks.cons && feedbacks.cons !== 'Нет' && (
                                            <Text style={{ fontSize: 12, marginRight: 5 }}>
                                                <Text type='danger' strong>- </Text>{feedbacks.cons}
                                            </Text>
                                        )}
                                    </Space>
                                ) : null}

                                {feedbacks.bables.length > 0 && (
                                    <Space size={4} style={{ marginBottom: 8 }} wrap>
                                        {feedbacks.bables.map(tag => (
                                            <Tag key={tag} style={{ fontSize: 11 }}>{tag}</Tag>
                                        ))}
                                    </Space>
                                )}

                                {feedbacks.answer && (
                                    <div
                                        style={{
                                            background: '#fafafa',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: 6,
                                            padding: '8px 12px',
                                            marginBottom: 8,
                                        }}>
                                        <Text type='secondary' style={{ fontSize: 12 }}>
                                            Ответ продавца:
                                        </Text>
                                        <Paragraph style={{ marginBottom: 0, marginTop: 2 }}>
                                            {feedbacks.answer.text}
                                        </Paragraph>
                                    </div>
                                )}

                                {activeTab !== 'archive' && (
                                    <Space>
                                        {!feedbacks.answer ? (
                                            <Button
                                                size='small'
                                                type='primary'
                                                icon={<MessageOutlined />}
                                                onClick={() => openAnswerModal(feedbacks)}
                                                style={{ margin: 5 }}>
                                                Ответить
                                            </Button>
                                        ) : feedbacks.answer.editable ? (
                                            <Button
                                                size='small'
                                                icon={<EditOutlined />}
                                                onClick={() => openAnswerModal(feedbacks)}
                                                style={{ margin: 5 }}>
                                                Редактировать ответ
                                            </Button>
                                        ) : null}
                                    </Space>
                                )}
                            </Card>
                        </List.Item>
                    )}
                />
            )}

            <Modal
                title={isEditMode ? 'Редактировать ответ' : 'Ответить на отзыв'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSubmitAnswer}
                okText={isEditMode ? 'Сохранить' : 'Отправить'}
                confirmLoading={submitting}
                okButtonProps={{ disabled: !answerText.trim() }}>
                {selectedFeedback && (
                    <div style={{ marginBottom: 12 }}>
                        <Text type='secondary' style={{ fontSize: 12 }}>
                            Отзыв от {selectedFeedback.userName} · {selectedFeedback.productDetails.productName}
                        </Text>
                        <Paragraph
                            style={{
                                background: '#fafafa',
                                padding: '8px 12px',
                                borderRadius: 6,
                                marginTop: 6,
                                marginBottom: 0
                            }}>
                            {selectedFeedback.text}
                        </Paragraph>
                    </div>
                )}
                <TextArea
                    rows={4}
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    placeholder='Введите ответ (от 2 до 5000 символов)'
                    maxLength={5000}
                    showCount 
                    style={{ marginBottom: 10 }}/>
            </Modal>
        </>
    )
};
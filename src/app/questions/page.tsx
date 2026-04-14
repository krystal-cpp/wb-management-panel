'use client';

import { useState, useEffect } from "react";
import { Tabs, List, Card, Tag, Button, Modal, Input, Typography, Space, Badge, Empty, Spin, message } from 'antd';
import { MessageOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import type { Question } from "@/entities/question";
import { getQuestions, answerQuestion } from "@/api/questions";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function QuestionsPage() {
    const [activeTab, setActiveTab] = useState<'unanswered' | 'answered'>('unanswered');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [countUnanswered, setCountUnanswered] = useState(0);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = !!selectedQuestion?.answer;

    async function loadQuestions(isAnswered: boolean) {
        setLoading(true);

        try {
            const res = await getQuestions({ isAnswered, take: 50, skip: 0, order: 'dateDesc' });
            setQuestions(res.data.questions);
            setCountUnanswered(res.data.countUnanswered);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions(activeTab === 'answered')
    }, [activeTab]);

    function openAnswerModal(question: Question) {
        setSelectedQuestion(question);
        setAnswerText(question.answer?.text ?? '');
        setModalOpen(true);
    };

    async function handleSubmitAnswer() {
        if (!selectedQuestion || !answerText.trim()) return;

        setSubmitting(true);
        try {
            await answerQuestion({
                id: selectedQuestion.id,
                text: answerText,
                wasViewed: true,
            });

            message.success(isEditMode ? 'Ответ отредактирован' : 'Ответ отправлен');

            setQuestions(prev =>
                prev.map(q =>
                    q.id === selectedQuestion.id
                        ? {
                            ...q,
                            answer: {
                                text: answerText,
                                editable: true,
                                createdDate: new Date().toISOString(),
                            },
                        }
                        : q
                )
            );
            setModalOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    const tabItems = [
        {
            key: 'unanswered',
            label: (
                <Badge count={countUnanswered} offset={[10, 0]}>Без ответа</Badge>
            ),
        },
        { key: 'answered', label: 'Отвеченные' }
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
            ) : questions.length === 0 ? (
                <Empty description='Вопросов нет' />
            ) : (
                <List
                    dataSource={questions}
                    rowKey='id'
                    itemLayout='vertical'
                    renderItem={questions => (
                        <List.Item style={{ padding: 0, marginBottom: 12 }}>
                            <Card
                                size='small'
                                style={{ borderRadius: 8 }}
                                styles={{ body: { padding: 16 } }}>
                                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }} wrap>
                                    <Space size='small' wrap>
                                        <Text type='secondary' style={{ fontSize: 12 }}>
                                            {dayjs(questions.createdDate).format('DD.MM.YYYY HH:mm')}
                                        </Text>
                                        {!questions.wasViewed && <Tag color='blue'>Новый</Tag>}
                                        {questions.isWarned && (
                                            <Tag color='orange' icon={<WarningOutlined />}>Предупреждение</Tag>
                                        )}
                                    </Space>
                                    <Text type='secondary' style={{ fontSize: 12 }}>
                                        {questions.productDetails.productName} · арт.{' '}
                                        {questions.productDetails.supplierArticle}
                                    </Text>
                                </Space>

                                <Paragraph style={{ marginBottom: 8, fontWeight: 500 }}>{questions.text}</Paragraph>

                                {questions.answer && (
                                    <div
                                        style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6, padding: '8px 12px', marginBottom: 8 }}>
                                        <Text type='secondary' style={{ fontSize: 12 }}>Ответ продавца · {dayjs(questions.answer.createdDate).format('DD.MM.YYYY')}</Text>
                                        <Paragraph style={{ marginBottom: 0, marginTop: 2 }}>
                                            {questions.answer.text}
                                        </Paragraph>
                                    </div>
                                )}

                                <Space>
                                    {!questions.answer ? (
                                        <Button size='small'
                                            type='primary'
                                            icon={<MessageOutlined />}
                                            onClick={() => openAnswerModal(questions)}>Ответить</Button>
                                    ) : questions.answer.editable ? (
                                        <Button size='small' icon={<EditOutlined />} onClick={() => openAnswerModal(questions)}>Редактировать ответ</Button>
                                    ) : null}
                                </Space>
                            </Card>
                        </List.Item>
                    )} />
            )}

            <Modal
                title={isEditMode ? 'Редактировать ответ' : 'Ответить на вопрос'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSubmitAnswer}
                okText={isEditMode ? 'Сохранить' : 'Отправить'}
                cancelText='Отменить'
                confirmLoading={submitting}
                okButtonProps={{ disabled: !answerText.trim() }}>
                {selectedQuestion && (
                    <div style={{ marginBottom: 12 }}>
                        <Text type='secondary' style={{ fontSize: 12 }}>
                            {selectedQuestion.productDetails.productName}
                        </Text>
                        <Paragraph
                            style={{
                                background: '#fafafa',
                                padding: '8px 12px',
                                borderRadius: 6,
                                marginTop: 6,
                                marginBottom: 0,
                                fontWeight: 500
                            }}>
                            {selectedQuestion.text}
                        </Paragraph>
                    </div>
                )}
                <TextArea
                    rows={4}
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    placeholder='Введите ответ'
                    maxLength={5000}
                    showCount
                    style={{ marginBottom: 10 }} />
            </Modal>
        </>
    );
};
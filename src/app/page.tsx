'use client';

import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Button, Typography, Space, Spin } from 'antd';
import { MessageOutlined, QuestionCircleOutlined, CommentOutlined, ArrowRightOutlined, QuestionOutlined, BgColorsOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { getFeedbacks } from "@/api/feedbacks";
import { getQuestions } from "@/api/questions";
import { getChats } from "@/api/chats";

const { Title, Text } = Typography;

interface Summary {
    feedbacksUnanswered: number,
    questionsUnanswered: number,
    chatsTotal: number,
};

export default function HomePage() {
    const [ summary, setSummary ] = useState<Summary | null>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function loadSummary() {
            try{
                const [ feedbacksRes, questionsRes, chatsRes ] = await Promise.all([
                    getFeedbacks({ isAnswered: false, take: 1, skip: 0 }),
                    getQuestions({ isAnswered: false, take: 1, skip: 0 }),
                    getChats(),
                ]);

                setSummary({
                    feedbacksUnanswered: feedbacksRes.data.countUnanswered,
                    questionsUnanswered: questionsRes.data.countUnanswered,
                    chatsTotal: chatsRes.result.length,
                });
            }
            finally {
                setLoading(false);
            }
        };

        loadSummary();
    }, []);

    const cards = [
        {
            title: 'Отзывы без ответа',
            icon: <MessageOutlined style={{ fontSize: 28, color: '#722ed1' }}/>,
            value: summary?.feedbacksUnanswered ?? 0,
            href: '/feedbacks',
            accent: '#722ed1',
            bg: '#f9f0ff',
            description: 'Покупатели ждут вашего ответа',
        },
        {
            title: 'Вопросы без ответа',
            icon: <QuestionOutlined style={{ fontSize: 28, color: '#1677ff' }}/>,
            value: summary?.questionsUnanswered ?? 0,
            href: '/questions',
            accent: '#1677ff',
            bg: '#e6f4ff',
            description: 'Вопросы по вашим товарам',
        },
        {
            title: 'Активные чаты',
            icon: <CommentOutlined style={{ fontSize: 28, color: '#13c2c2' }}/>,
            value: summary?.chatsTotal ?? 0,
            href: '/chats',
            accent: '#13c2c2',
            bg: '#e6fffb',
            description: 'Открытые диалоги с покупателями',
        },
    ];

    return(
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Space orientation="vertical" size={4} style={{ marginBottom: 32 }}>
                <Title level={4} style={{ margin: 0 }}>Обзор магазина</Title>
                <Text type='secondary'>Актуальное состояние на сегодня</Text>
            </Space>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 64 }}>
                    <Spin size='large'/>
                </div>
            ): (
                <Row gutter={[20, 20]}>
                    {cards.map(card => (
                        <Col xs={24} sm={8} key={card.href}>
                            <Card style={{ borderRadius: 12, border: `1px solid ${card.accent}22` }}
                            styles={{ body: { padding: 24 } }}>
                                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ width: 52, height: 52, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {card.icon}
                                        </div>
                                        <Statistic value={card.value}
                                        styles={{ content: { fontSize: 36, fontWeight: 700, color: card.accent } }}/>
                                    </div>

                                    <div>
                                        <Text strong style={{ fontSize: 15, display: 'block' }}>
                                            {card.title}
                                        </Text>
                                        <Text type='secondary' style={{ fontSize: 13 }}>
                                            {card.description}
                                        </Text>
                                    </div>

                                    <Link href={card.href}>
                                        <Button type='text'
                                        icon={<ArrowRightOutlined/>}
                                        iconPlacement="end"
                                        style={{ padding: 0, color: card.accent, fontWeight: 500 }}>
                                            Перейти
                                        </Button>
                                    </Link>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};
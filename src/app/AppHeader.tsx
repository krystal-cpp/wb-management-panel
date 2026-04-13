'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Layout, Menu, Typography, Space, Rate, Tag } from "antd";
import { ShopOutlined } from "@ant-design/icons"; 
import type { SellerInfo, SellerRating } from "@/entities/seller";

const { Header } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
    { key: '/feedbacks', label: <Link href='/feedbacks'>Отзывы</Link> },
    { key: '/questions', label: <Link href='/questions'>Вопросы</Link> },
    { key: '/chats', label: <Link href='/chats'>Чаты</Link> },
];

interface AppHeaderProps {
    info: SellerInfo,
    rating: SellerRating,
};

export default function AppHeader ({ info, rating }: AppHeaderProps) {
    const pathname = usePathname();
    const activeKey = NAV_ITEMS.find(item => pathname.startsWith(item.key))?.key ?? '';

    return(
        <Layout>
            <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                height: 64
            }}>
                <Space size='middle' align='center'>
                    <ShopOutlined style={{ fontSize: 24, color: '#cb11ab' }}/>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, lineHeight: 1.2 }}>
                        <Space size='small' align='center'>
                            <Text strong style={{ fontSize: 15 }}>
                                {info.tradeMark}
                            </Text>
                            <Tag color='purple' style={{ margin: 0 }}>WB</Tag>
                        </Space>
                        <Text type='secondary' style={{ fontSize: 12 }}>
                            {info.name}
                        </Text>
                    </div>

                    <Space size={4} align='center' style={{ marginLeft: 16 }}>
                        <Rate
                        disabled
                        allowHalf
                        value={rating.rating}
                        style={{ fontSize: 14 }}/>
                        <Text type='secondary' style={{ fontSize: 13 }}>
                            {rating.rating.toFixed(1)} · {rating.feedbacksCount.toLocaleString('ru-RU')} отзывов
                        </Text>
                    </Space>
                </Space>

                <Menu
                mode='horizontal'
                selectedKeys={[activeKey]}
                items={NAV_ITEMS}
                style={{ border: 'none', minWidth: 300 }}/>
            </Header>
        </Layout>
    );
};
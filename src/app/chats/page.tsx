'use client';

import { useState, useEffect, useRef } from 'react';
import { List, Typography, Input, Button, Space, Avatar, Empty, Spin, message as antMessage, Tag, message } from 'antd';
import { SendOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons'; 
import dayjs from 'dayjs';
import type { Chat, ChatEvent } from '@/entities/chat';
import { getChats, getChatEvents, sendMessage } from '@/api/chats';
import { formatPrice } from '@/utils/formatPrice';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ChatsPage() {
    const [ chats, setChats ] = useState<Chat[]>([]);
    const [ loadingChats, setLoadingChats ] = useState(false);

    const [ selectedChat, setSelectedChat ] = useState<Chat | null>(null);
    const [ events, setEvents ] = useState<ChatEvent[]>([]);
    const [ loadingEvents, setLoadingEvents ] = useState(false);

    const [ messageText, setMessageText ] = useState('');
    const [ sending, setSending ] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoadingChats(true);
        getChats()
            .then(res => setChats(res.result))
            .finally(() => setLoadingChats(false));
    }, []);

    useEffect(() => {
        if(!selectedChat) return;
        setLoadingEvents(true);
        getChatEvents(selectedChat.chatID)
            .then(res => setEvents(res.result.events))
            .finally(() => setLoadingEvents(false));
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    async function handleSend() {
        if(!selectedChat || !messageText.trim()) return;

        setSending(true);
        try {
            await sendMessage({ replySign: selectedChat.replySign, message: messageText });

            const newEvent: ChatEvent = {
                chatID: selectedChat.chatID,
                eventID: `local-${Date.now()}`,
                eventType: 'message',
                message: { text: messageText },
                addTimestamp: Date.now(),
                addTime: new Date().toISOString(),
                sender: 'seller',
            };

            setEvents(prev => [...prev, newEvent]);

            setChats(prev =>
                prev.map(c => 
                    c.chatID === selectedChat.chatID
                    ? { ...c, lastMessage: { text: messageText, addTimestamp: Date.now() } }
                    : c
                )
            );

            setMessageText('');
        }
        catch {
            antMessage.error('Не удалось отправить сообщение');
        }
        finally {
            setSending(false);
        }
    };

    return(
        <div style={{ display: 'flex', height: 'calc(100vh - 112px)', gap: 0, border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ width: 300, minWidth: 300, borderRight: '1px solid #f0f0f0', overflowY: 'auto', background: '#fff' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Чаты с покупателями</Text>
                </div>

                {loadingChats ? (
                    <div style={{ textAlign: 'center', padding: 32 }}>
                        <Spin/>
                    </div>
                ): chats.length === 0 ? (
                    <Empty description='Чатов нет' style={{ marginTop: 32 }}/>
                ): (
                    <List
                    dataSource={chats}
                    rowKey='chatID'
                    renderItem={chat => {
                        const isActive = selectedChat?.chatID === chat.chatID
                        return(
                            <List.Item
                            onClick={() => setSelectedChat(chat)}
                            style={{ padding: '12px 16px',
                                cursor: 'pointer',
                                background: isActive ? '#f5f0ff' : '#fff',
                                borderLeft: isActive ? '3px solid #722ed1' : '3px solid transparent',
                                transition: 'background 0.15s',
                            }}>
                                <List.Item.Meta
                                avatar={
                                    <Avatar
                                    icon={<UserOutlined/>}
                                    style={{ background: isActive ? '#722ed1' : '#d9d9d9' }}/>
                                }
                                title={
                                    <Space size={4}>
                                        <Text strong style={{ fontSize: 13 }}>
                                            {chat.clientName}
                                        </Text>
                                        {chat.goodCard && (
                                            <Tag style={{ fontSize: 11 }}>{formatPrice(chat.goodCard.price, chat.goodCard.priceCurrency)}</Tag>
                                            // <Badge
                                            // count={`${chat.goodCard.price.toLocaleString('ru-RU')}`}
                                            // style={{ background: '#f0f0f0', color: '#595959', fontSize: 11, boxShadow: 'none' }}/>
                                        )}
                                    </Space>
                                }
                                description={
                                    <>
                                        <Text
                                        type='secondary'
                                        style={{ fontSize: 12, display: 'block' }}
                                        ellipsis>
                                            {chat.lastMessage?.text ?? '-'}
                                        </Text>
                                        {chat.lastMessage && (
                                            <Text type='secondary' style={{ fontSize: 11 }}>
                                                {dayjs(chat.lastMessage.addTimestamp).format('DD.MM HH:mm')}
                                            </Text>
                                        )}
                                    </>
                                }/>
                            </List.Item>
                        )
                    }}/>
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
                {!selectedChat ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Empty description='Выберите чат'/>
                    </div>
                ): (
                    <>
                        <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                            <Space>
                                <Avatar icon={<UserOutlined/>} style={{ background: '#722ed1' }}/>
                                <div>
                                    <Text strong>{selectedChat.clientName}</Text>
                                    {selectedChat.goodCard && (
                                        <Text type='secondary' style={{ fontSize: 12, display: 'block' }}>
                                            Артикул {selectedChat.goodCard.nmID} · {selectedChat.goodCard.size} · {formatPrice(selectedChat.goodCard.price, selectedChat.goodCard.priceCurrency)}
                                        </Text>
                                    )}
                                </div>
                            </Space>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                            {loadingEvents ? (
                                <div style={{ textAlign: 'center', padding: 32 }}>
                                    <Spin/>
                                </div>
                            ): events.length === 0 ? (
                                <Empty description='Нет сообщений'/>
                            ): (
                                events.map(event => {
                                    const isSeller = event.sender === 'seller'
                                    return(
                                        <div
                                        key={event.eventID}
                                        style={{ display: 'flex', justifyContent: isSeller ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                                            {!isSeller && (
                                                <Avatar icon={<UserOutlined/>}
                                                size='small'
                                                style={{ marginRight: 8, marginTop: 4, flexShrink: 0, background: '#d9d9d9' }}/>
                                            )}
                                            <div style={{
                                                maxWidth: '65%',
                                                background: isSeller ? '#722ed1' : '#fff',
                                                color: isSeller ? '#fff' : 'inherit',
                                                padding: '8px 12px',
                                                borderRadius: isSeller ? '12px 12px 4px 12px': '12px 12px 12px 4px',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                            }}>
                                                <Paragraph style={{ marginBottom: 4, color: isSeller ? '#fff' : 'inherit', fontSize: 14, whiteSpace: 'pre-wrap' }}>
                                                    {event.message.text}
                                                </Paragraph>
                                                <Text style={{
                                                    fontSize: 11,
                                                    color: isSeller ? 'rgba(255, 255, 255, 0.7)': '#bfbfbf',
                                                    display: 'block',
                                                    textAlign: 'right',
                                                }}>
                                                    {dayjs(event.addTime).format('DD.MM HH:mm')}
                                                </Text>
                                            </div>
                                            {isSeller && (
                                                <Avatar
                                                icon={<ShopOutlined/>}
                                                size='small'
                                                style={{ marginLeft: 8, marginTop: 4, flexShrink: 0, background: '#722ed1' }}/>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef}/>
                        </div>

                        <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                            <Space.Compact style={{ width: '100%' }}>
                                <TextArea
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                placeholder='Введите сообщение...'
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                maxLength={1000}
                                onKeyDown={e => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                style={{ borderRadius: '6px 0 0 6px' }}/>
                                <Button
                                type='primary'
                                icon={<SendOutlined/>}
                                onClick={handleSend}
                                loading={sending}
                                disabled={!messageText.trim()}
                                style={{ height: 'auto', borderRadius: '0 6px 6px 0', background: '#722ed1', borderColor: '#722ed1', color: '#fff' }}>Отправить</Button>
                            </Space.Compact>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
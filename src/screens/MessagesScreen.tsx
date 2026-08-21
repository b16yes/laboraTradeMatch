import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Header } from '../components/common/Header';
import { ChatBubble } from '../components/messages/ChatBubble';
import { ChatInput } from '../components/messages/ChatInput';
import { useChat } from '../state/ChatContext';
import { useAuth } from '../state/AuthContext';
import { Badge } from '../components/common/Badge';

export default function MessagesScreen() {
  const { user } = useAuth();
  const {
    conversations,
    activeConversationId,
    activeMessages,
    setActiveConversationId,
    sendMessage,
  } = useChat();

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tradesman Messages" subtitle="Peer-to-peer live chat & job referrals" />

      {/* Conversation Thread Selector Bar */}
      <View style={styles.threadBar}>
        {conversations.map((conv) => {
          const isActive = conv.id === activeConversationId;
          return (
            <TouchableOpacity
              key={conv.id}
              style={[styles.threadChip, isActive && styles.threadChipActive]}
              onPress={() => setActiveConversationId(conv.id)}
            >
              <Image source={{ uri: conv.peerAvatar }} style={styles.chipAvatar} />
              <View style={styles.chipTextWrapper}>
                <Text style={[styles.chipName, isActive && styles.chipNameActive]}>{conv.peerName}</Text>
                <Text style={styles.chipTrade}>{conv.peerTrade}</Text>
              </View>
              {conv.unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Active Peer Tradesman Header Banner */}
        {activeConv ? (
          <View style={styles.activePeerHeader}>
            <Image source={{ uri: activeConv.peerAvatar }} style={styles.activeAvatar} />
            <View style={styles.activePeerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.activePeerName}>{activeConv.peerName}</Text>
                <Badge label={activeConv.peerTrade} variant="primary" isSmall />
              </View>
              {activeConv.jobTitle ? (
                <Text style={styles.jobRefBanner}>📌 Subcontract Job: {activeConv.jobTitle}</Text>
              ) : null}
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>ONLINE</Text>
            </View>
          </View>
        ) : null}

        {/* Message History List */}
        <FlatList
          data={activeMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} isCurrentUser={item.senderId === user?.uid} />
          )}
          contentContainerStyle={styles.messagesList}
        />

        {/* Live Chat Input Bar */}
        <ChatInput onSend={sendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  threadBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  threadChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  threadChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  chipTextWrapper: {
    justifyContent: 'center',
  },
  chipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  chipNameActive: {
    color: '#F8FAFC',
  },
  chipTrade: {
    fontSize: 9,
    color: '#38BDF8',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  chatContainer: {
    flex: 1,
  },
  activePeerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  activeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  activePeerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activePeerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  jobRefBanner: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 2,
    fontWeight: '600',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  onlineText: {
    color: '#4ADE80',
    fontSize: 9,
    fontWeight: '800',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
});

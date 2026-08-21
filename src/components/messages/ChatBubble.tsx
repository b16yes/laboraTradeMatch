import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '../../types/models';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <View style={[styles.wrapper, isCurrentUser ? styles.wrapperRight : styles.wrapperLeft]}>
      {message.jobTitle ? (
        <View style={styles.jobRefTag}>
          <Text style={styles.jobRefText}>📌 Job Ref: {message.jobTitle}</Text>
        </View>
      ) : null}

      <View style={[styles.bubble, isCurrentUser ? styles.bubbleUser : styles.bubblePeer]}>
        <Text style={[styles.text, isCurrentUser ? styles.textUser : styles.textPeer]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isCurrentUser ? styles.timeUser : styles.timePeer]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  wrapperRight: {
    alignSelf: 'flex-end',
  },
  wrapperLeft: {
    alignSelf: 'flex-start',
  },
  jobRefTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  jobRefText: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '700',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: '#0284C7',
    borderBottomRightRadius: 2,
  },
  bubblePeer: {
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: '#FFFFFF',
  },
  textPeer: {
    color: '#F8FAFC',
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timePeer: {
    color: '#94A3B8',
  },
});

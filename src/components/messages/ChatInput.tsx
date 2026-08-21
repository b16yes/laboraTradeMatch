import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.attachBtn}>
        <Text style={styles.attachIcon}>📷</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Message tradesman..."
        placeholderTextColor="#64748B"
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity
        style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!text.trim()}
      >
        <Text style={styles.sendIcon}>➔</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 8,
  },
  attachBtn: {
    padding: 6,
  },
  attachIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

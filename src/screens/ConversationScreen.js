import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContextSimple';

const ConversationScreen = ({ route, navigation }) => {
  const { storeId, storeName, userId } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Mock messages - replace with real data from your backend
  const mockMessages = [
    {
      id: '1',
      text: 'Hello! Welcome to our store. How can I help you today?',
      sender: 'store',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      senderName: storeName,
    },
    {
      id: '2',
      text: 'Hi! I\'m interested in your electronics section. Do you have any new arrivals?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
      senderName: 'You',
    },
    {
      id: '3',
      text: 'Yes! We just got some new smartphones and laptops. Would you like me to show you our latest collection?',
      sender: 'store',
      timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
      senderName: storeName,
    },
    {
      id: '4',
      text: 'That sounds great! What are your store hours?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      senderName: 'You',
    },
    {
      id: '5',
      text: 'We\'re open Monday to Saturday, 8:00 AM to 6:00 PM. Sunday we\'re closed. Feel free to visit us anytime!',
      sender: 'store',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      senderName: storeName,
    },
  ];

  useEffect(() => {
    // Load messages from your backend
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      senderName: 'You',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate store response (remove this in production)
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! We\'ll get back to you soon.',
        sender: 'store',
        timestamp: new Date(),
        senderName: storeName,
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = ({ item, index }) => {
    const isUserMessage = item.sender === 'user';
    const showTimestamp = index === 0 || 
      (messages[index - 1] && 
       Math.abs(item.timestamp - messages[index - 1].timestamp) > 300000); // 5 minutes

    return (
      <View style={styles.messageContainer}>
        {showTimestamp && (
          <Text style={styles.timestampText}>
            {formatTime(item.timestamp)}
          </Text>
        )}
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessage : styles.storeMessage
        ]}>
          <Text style={[
            styles.messageText,
            isUserMessage ? styles.userMessageText : styles.storeMessageText
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.headerImage} 
          />
          <View>
            <Text style={styles.headerTitle}>{storeName}</Text>
            <Text style={styles.headerSubtitle}>Usually responds quickly</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? '#ffffff' : '#9ca3af'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  messagesList: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  timestampText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  storeMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  storeMessageText: {
    color: '#111827',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#2563eb',
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
});

export default ConversationScreen;

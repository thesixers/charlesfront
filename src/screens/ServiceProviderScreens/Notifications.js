// src/screens/ServiceProviderScreens/Notifications.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from the backend
  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('providerToken');
      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3009/provider/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { sN } = response.data; // sN contains the notification data
        setNotifications(sN); // Update the state with fetched notifications
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();
  }, []);

  // Render each notification in the list
  const renderNotification = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id} // Using _id from the backend schema
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    padding: 15,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default Notifications;

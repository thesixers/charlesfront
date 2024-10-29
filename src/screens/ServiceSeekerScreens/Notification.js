import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Notification = () => {
  // Default notification data
  const [notifications, setnotification] = useState([]);


  const makeAuthenticatedRequest = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');

      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3009/seeker/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { Us, Pro, sN} = response.data;


        if (sN) {
          let notify = sN.map(o => {
             const { message, type, id, createdAt, ownerID} = o;
 
             return not = {
              id,
              message: message,
              time: '1 min ago',
            };
 
             
           });
 
           setnotification(notify);


          }

      } else {
        navigation.navigate('MainDrawer', { screen: 'Login' });
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error with authenticated request:', error);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();
  }, []);

  // Function to render each notification as a card
  const renderNotificationItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
});

export default Notification;

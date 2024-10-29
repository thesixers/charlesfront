import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Orders = () => {
  // State for storing order data
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  const makeAuthenticatedRequest = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        const response = await axios.get('http://192.168.0.167:3009/seeker/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { Us, Pro, order } = response.data;

        console.log(order);

        // Check if the order exists
        if (order) {
         let orderData = order.map(o => {
            const { providerID, services, status, price } = o;

            const provider = Pro.find(e => e._id === providerID);

            return orderInfo = {
              id: providerID,
              serviceProvider: provider.businessName,
              serviceRequested: services.join(', '),
              price,
              status,
            };

            
          });

          setOrders(orderData);

        } else {
          console.error('No order found');
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

  // Function to render each order as a card
  const renderOrderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>Order #{item.id}</Card.Title>
      <Card.Divider />
      <Text style={styles.orderInfo}>Service Provider: {item.serviceProvider}</Text>
      <Text style={styles.orderInfo}>Service Requested: {item.serviceRequested}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.status}>Price: #{item.price}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
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
  orderInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#3f51b5',
  },
});

export default Orders;

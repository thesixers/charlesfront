import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  // Function to handle order status change
  const changeOrderStatus = async (id, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('providerToken');
      if (token !== null) {
        await axios.put(`http://192.168.0.167:3009/provider/orders/${id}`, { status: newStatus }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Update the local state to reflect the status change
        const updatedOrders = orders.map(order =>
          order._id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Fetch the provider's orders from the backend
  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('providerToken');
      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3009/provider/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { orders } = response.data;
        setOrders(orders);
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Error with authenticated request:', error);
    }
  };

  useEffect(() => {
    makeAuthenticatedRequest();
  }, []);

  // Render each order in the list
  const renderOrder = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order #{item._id}</Text>
        <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text>Status: {item.status}</Text>
      <Text>Service(s): {item.services.join(', ')}</Text>
      <Text>Price: #{item.price}</Text>
      <Text>Pickup Location: {item.pickupLocation}</Text>
      <View style={styles.actions}>
        {item.status === 'pending' && (
          <Button
            title="Accept"
            onPress={() => changeOrderStatus(item._id, 'accepted')}
            buttonStyle={styles.acceptButton}
          />
        )}
        {item.status === 'accepted' && (
          <Button
            title="Mark as Completed"
            onPress={() => changeOrderStatus(item._id, 'completed')}
            buttonStyle={styles.button}
          />
        )}
        {item.status !== 'rejected' && item.status !== 'completed' && (
          <Button
            title="Reject"
            onPress={() => changeOrderStatus(item._id, 'rejected')}
            buttonStyle={styles.cancelButton}
          />
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Management</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#777',
  },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  cancelButton: {
    backgroundColor: '#FF5722',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  acceptButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
});

export default OrderManagement;

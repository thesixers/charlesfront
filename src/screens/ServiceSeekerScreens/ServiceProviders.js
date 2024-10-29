import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking, Alert, TextInput, ScrollView } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceProviders = () => {
  const [selectedServices, setSelectedServices] = useState([]); // State for selected services
  const [clothesCount, setClothesCount] = useState(''); // State for clothes count
  const [providers, setProviders] = useState([]); // State for providers from backend
  const [seekerId, setSeekerId] = useState(''); // State for storing seeker ID
  const [selectedProviderId, setSelectedProviderId] = useState(''); // State for selected provider ID

  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3009/seeker/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { Us, Pro } = response.data;

        // Store seeker ID from Us object
        setSeekerId(Us._id);

        // Transform services object into array format
        const transformedProviders = Pro.map((provider) => ({
          id: provider._id,
          businessName: provider.businessName,
          location: provider.location,
          phoneNumber: provider.telnumber,
          services: [
            { name: 'Washing', rate: `₦${provider.services.washing}/piece` },
            { name: 'Ironing', rate: `₦${provider.services.ironing}/piece` },
            { name: 'Starching', rate: `₦${provider.services.starching}/piece` },
          ],
        }));

        setProviders(transformedProviders); // Set providers from backend
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

  const handleCallPress = async (phoneNumber) => {
    if (!selectedServices.length || !clothesCount || !selectedProviderId) {
      Alert.alert("Error", "Please select services, specify the number of clothes, and choose a provider.");
      return;
    } 

    const orderData = {
      providerId: selectedProviderId, // Use the selected provider's ID
      serviceSeekerId: seekerId, // Use the seeker's ID from state
      selectedServices,
      numberOfClothes: clothesCount,
    };

    console.log(orderData);

    try {
      const response = await axios.post('http://192.168.0.167:3001/seeker/order', orderData);
      if (response.status === 201) {
        Alert.alert("Success", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while placing the order");
      console.error('Error placing order:', error);
    }

    Linking.openURL(`tel:${phoneNumber}`).catch((err) => 
      Alert.alert("Failed to make a call", err.message)
    );
  };

  const toggleServiceSelection = (service) => {
    setSelectedServices((prevServices) => {
      if (prevServices.includes(service)) {
        return prevServices.filter((s) => s !== service);
      } else {
        return [...prevServices, service];
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {providers.map((provider) => (
        <Card key={provider.id} containerStyle={styles.card}>
          <Card.Title>{provider.businessName}</Card.Title>
          <Card.Divider />
          <Text>Location: {provider.location}</Text>

          {provider.services.map((service, index) => (
            <View key={index} style={styles.serviceContainer}>
              <CheckBox
                title={`${service.name} (${service.rate})`}
                checked={selectedServices.includes(service.name)}
                onPress={() => toggleServiceSelection(service.name)}
              />
            </View>
          ))}

          <TextInput
            style={styles.input}
            placeholder="Number of clothes"
            keyboardType="numeric"
            onChangeText={(text) => setClothesCount(text)}
            value={clothesCount}
          />

          <Button
            title="Select Provider and Call to Order"
            onPress={() => {
              setSelectedProviderId(provider.id); // Set the selected provider's ID
              handleCallPress(provider.phoneNumber);
            }}
          />
        </Card>
      ))}
    </ScrollView>
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
    elevation: 3,
    padding: 10,
    marginBottom: 10,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default ServiceProviders;

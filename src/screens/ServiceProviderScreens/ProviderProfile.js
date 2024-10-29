import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProviderProfile = ({ navigation, route = {} }) => {
  const { 
    businessName = 'Provider Business Name', 
    location = '123 Business St, Provider City', 
    phone = '123-456-7890', 
    availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 
  } = route.params || {};

  const [editing, setEditing] = useState(false);
  const [updatedBusinessName, setUpdatedBusinessName] = useState();
  const [updatedLocation, setUpdatedLocation] = useState();
  const [updatedPhone, setUpdatedPhone] = useState();
  const [updatedAvailableDays, setUpdatedAvailableDays] = useState(availableDays);
  const [updatedServices, setUpdatedServices] = useState({
    washing: '',
    ironing: '',
    starching: ''
  });

  const toggleEdit = () => setEditing(!editing);

  const handleLogout = () => {
    navigation.navigate('Home');
  };

  const makeAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('providerToken');

      if (token !== null) {
        const response = await axios.get('http://192.168.0.167:3009/provider/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { Us } = response.data;
        const { businessName, telnumber, location, services } = Us;

        setUpdatedBusinessName(businessName);
        setUpdatedLocation(location);
        setUpdatedPhone(telnumber);
        setUpdatedServices(services);

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

  const handleServiceChange = (serviceName, rate) => {
    setUpdatedServices({
      ...updatedServices,
      [serviceName]: rate,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{updatedBusinessName}</Text>
        <Text style={styles.role}>Service Provider</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleEdit}>
            <Icon name={editing ? 'check' : 'edit'} size={24} color="#3f51b5" />
          </TouchableOpacity>
        </View>
      </View>

      <Card containerStyle={styles.card}>
        <Card.Title>Profile Information</Card.Title>
        <Card.Divider />
        {editing ? (
          <>
            <Input
              label="Business Name"
              value={updatedBusinessName}
              onChangeText={setUpdatedBusinessName}
              containerStyle={styles.input}
            />
            <Input
              label="Location"
              value={updatedLocation}
              onChangeText={setUpdatedLocation}
              containerStyle={styles.input}
            />
            <Input
              label="Phone"
              value={updatedPhone}
              onChangeText={setUpdatedPhone}
              containerStyle={styles.input}
            />

            <Text style={styles.label}>Services Offered</Text>
            <Input
              label="Washing"
              value={updatedServices.washing}
              onChangeText={(text) => handleServiceChange('washing', text)}
              containerStyle={styles.inputSmall}
            />
            <Input
              label="Ironing"
              value={updatedServices.ironing}
              onChangeText={(text) => handleServiceChange('ironing', text)}
              containerStyle={styles.inputSmall}
            />
            <Input
              label="Starching"
              value={updatedServices.starching}
              onChangeText={(text) => handleServiceChange('starching', text)}
              containerStyle={styles.inputSmall}
            />

          </>
        ) : (
          <>
            <Text style={styles.info}>Location: {updatedLocation}</Text>
            <Text style={styles.info}>Phone: {updatedPhone}</Text>

            <Text style={styles.label}>Available Days:</Text>
            {/* <Text style={styles.info}>{updatedAvailableDays.join(', ')}</Text> */}

            <Text style={styles.label}>Services Offered:</Text>
            <Text style={styles.info}>Washing: {updatedServices.washing}</Text>
            <Text style={styles.info}>Ironing: {updatedServices.ironing}</Text>
            <Text style={styles.info}>Starching: {updatedServices.starching}</Text>
          </>
        )}

        <Button
          title={editing ? 'Save Changes' : 'Edit Profile'}
          onPress={toggleEdit}
        />
      </Card>

      <Button
        title="Logout"
        buttonStyle={styles.logoutButton}
        onPress={handleLogout}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  inputSmall: {
    marginBottom: 10,
    width: '90%',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 10,
  },
});

export default ProviderProfile;

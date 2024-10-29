import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import RadioButton from '../../components/RadioButton';
import axios from 'axios';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Common password field for both roles
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('seeker');
  const [serviceRates, setServiceRates] = useState({ washing: '', ironing: '', starching: '' });

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState(''); // Error for password field
  const [addressError, setAddressError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (role === 'seeker') {
      if (!name) {
        setNameError('Name is required');
        isValid = false;
      } else {
        setNameError('');
      }

      if (!email) {
        setEmailError('Email is required');
        isValid = false;
      } else {
        setEmailError('');
      }

      if (!password) {
        setPasswordError('Password is required');
        isValid = false;
      } else {
        setPasswordError('');
      }

      if (!address) {
        setAddressError('Address is required');
        isValid = false;
      } else {
        setAddressError('');
      }

      if (!phone) {
        setPhoneError('Phone number is required');
        isValid = false;
      } else {
        setPhoneError('');
      }
    } else if (role === 'provider') {
      if (!businessName) {
        setBusinessNameError('Business name is required');
        isValid = false;
      } else {
        setBusinessNameError('');
      }

      if (!email) {
        setEmailError('Email is required');
        isValid = false;
      } else {
        setEmailError('');
      }

      if (!password) {
        setPasswordError('Password is required');
        isValid = false;
      } else {
        setPasswordError('');
      }

      if (!location) {
        setLocationError('Location is required');
        isValid = false;
      } else {
        setLocationError('');
      }

      if (!phone) {
        setPhoneError('Phone number is required');
        isValid = false;
      } else {
        setPhoneError('');
      }
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return;
    }

    // Payload for provider or seeker
    let payload;
    if (role === 'provider') {
      payload = {
        businessName,
        email,
        password, // Include password for provider
        location,
        phone,
        role,
        serviceRates, // Optional
      };
    } else {
      payload = {
        name,
        email,
        password,
        address,
        phone,
        role,
      };
    }

    try {
      const response = await axios.post('http://192.168.0.167:3009/auth/register', payload);

      if (response.status === 200) {
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.response) {
        console.log('Server responded with:', error.response.data);
        setMessage('Signup failed. Please try again.');

        let {email, password, user} = err.response.data.error;
        if (user) {
          Alert.alert('Error',user, [{ text: 'OK' }]);
        }
        if (password) {
          Alert.alert('Error',password, [{ text: 'OK' }]);
        }
        if (email) {
          Alert.alert('Error',email, [{ text: 'OK' }]);
        }
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          {role === 'seeker' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
              {addressError ? <Text style={styles.error}>{addressError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
              />
              {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}
            </>
          )}

          {role === 'provider' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
              />
              {businessNameError ? <Text style={styles.error}>{businessNameError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
              />
              {locationError ? <Text style={styles.error}>{locationError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
              />
              {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

              <Text style={styles.serviceTitle}>Services Offered (Optional)</Text>
              {['washing', 'ironing', 'starching'].map((service) => (
                <View key={service} style={styles.serviceContainer}>
                  <Text>{service.charAt(0).toUpperCase() + service.slice(1)}</Text>
                  <TextInput
                    style={styles.rateInput}
                    placeholder="Rate/kg (₦)"
                    value={serviceRates[service]}
                    onChangeText={(value) => setServiceRates({ ...serviceRates, [service]: value })}
                  />
                </View>
              ))}
            </>
          )}

          <View style={styles.radioContainer}>
            <RadioButton
              label="Service Provider"
              value="provider"
              selectedValue={role}
              onValueChange={setRole}
            />
            <RadioButton
              label="Service Seeker"
              value="seeker"
              selectedValue={role}
              onValueChange={setRole}
            />
          </View>

          <Button title="Sign Up" onPress={handleSignUp} style={styles.signUpButton} />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  rateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    flex: 1,
    paddingHorizontal: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  signUpButton: {
    marginTop: 20,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});

export default SignUp;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios'; // Import Axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import RadioButton from '../../components/RadioButton'; // Import the custom RadioButton component

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker');
  
  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');
  
  // API Response States
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email.');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    validateEmail(email);
    validatePassword(password);

    if (!emailError && !passwordError && role) {
      try {
        setLoading(true); // Set loading state
        setApiError('');

        // Send POST request to the backend
        const response = await axios.post('http://192.168.0.167:3009/auth/login', {
          email,
          password,
          role,
        });

        const { token } = response.data; // Assuming token is in the response data

        // Handle successful login based on role
        if (role === 'provider') {
          // Store the token in AsyncStorage
          await AsyncStorage.setItem('providerToken', token);
          navigation.navigate('ProviderDrawer'); // Redirect to Provider Dashboard
        } else {
          // Store the token in AsyncStorage
          await AsyncStorage.setItem('authToken', token);
          navigation.navigate('SeekerDrawer'); // Redirect to Seeker Dashboard
        }
      } catch (error) {
        if (error.response) {
          console.log('Server responded with:', error.response.data);
          // setMessage('Signup failed. Please try again.');

          let {email, password, user} = err.response.data.error;
          if (user) {
            alert('Error',user, [{ text: 'OK' }]);
          }
          if (password) {
            alert('Error',password, [{ text: 'OK' }]);
          }
          if (email) {
            alert('Error',email, [{ text: 'OK' }]);
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!role) setRoleError('Please select a role.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text); // Real-time email validation
        }}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text); // Real-time password validation
        }}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* Role selection */}
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
      {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

      {/* API error */}
      {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} style={styles.loginButton} disabled={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  radioContainer: {
    marginVertical: 20,
  },
  loginButton: {
    marginTop: 20,
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default Login;

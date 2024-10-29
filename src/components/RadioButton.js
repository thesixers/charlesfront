import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ label, value, selectedValue, onValueChange }) => {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onValueChange(value)}>
      <View style={[styles.circle, isSelected && styles.selectedCircle]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#007bff',
  },
  label: {
    fontSize: 16,
  },
});

export default RadioButton;

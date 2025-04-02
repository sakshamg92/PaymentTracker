import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateCustomer} from '../services/customerService';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You'll need to install this package

const EditCustomerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {customer} = route.params;

  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email || '');
  const [address, setAddress] = useState(customer.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateCustomer = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {name, phone, email, address};
      await updateCustomer(customer._id, updatedData);

      // Short delay to give visual feedback
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Customer details updated successfully!');
        navigation.goBack();
      }, 500);
    } catch (error) {
      console.error('Error updating customer:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to update customer. Please try again.');
    }
  };

  const renderInputField = (
    label,
    value,
    setter,
    placeholder,
    keyboardType = 'default',
    error,
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {label === 'Name' || label === 'Phone' ? (
          <Text style={styles.requiredStar}>*</Text>
        ) : null}
      </View>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Customer</Text>
          <View style={{width: 24}} />
        </View>

        <View style={styles.card}>
          {renderInputField(
            'Name',
            name,
            setName,
            'Enter customer name',
            'default',
            errors.name,
          )}
          {renderInputField(
            'Phone',
            phone,
            setPhone,
            'Enter phone number',
            'phone-pad',
            errors.phone,
          )}
          {renderInputField(
            'Email',
            email,
            setEmail,
            'Enter email address (optional)',
            'email-address',
            errors.email,
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.textArea}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              isLoading ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleUpdateCustomer}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon
                  name="check"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.requiredNote}>* Required fields</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  requiredStar: {
    color: '#e53935',
    fontSize: 16,
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#333',
  },
  inputError: {
    borderColor: '#e53935',
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonIcon: {
    marginRight: 6,
  },
  requiredNote: {
    fontSize: 12,
    color: '#777',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default EditCustomerScreen;

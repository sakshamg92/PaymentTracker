// screens/SignupScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {signup} from '../services/authService';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You'll need to install this package

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup({name, email, password, role});
      setIsLoading(false);
      Alert.alert('Signup Success', response.message, [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#007bff" />
              </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
              {/* You can replace this with your app logo */}
              <View style={styles.logoPlaceholder}>
                <Icon name="payments" size={40} color="#007bff" />
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Payment Tracker today</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.name ? styles.inputWrapperError : null,
                  ]}>
                  <Icon
                    name="person"
                    size={18}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    onChangeText={setName}
                    value={name}
                  />
                </View>
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email ? styles.inputWrapperError : null,
                  ]}>
                  <Icon
                    name="email"
                    size={18}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password ? styles.inputWrapperError : null,
                  ]}>
                  <Icon
                    name="lock"
                    size={18}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}>
                    <Icon
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={18}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.confirmPassword ? styles.inputWrapperError : null,
                  ]}>
                  <Icon
                    name="lock"
                    size={18}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.passwordToggle}>
                    <Icon
                      name={
                        showConfirmPassword ? 'visibility' : 'visibility-off'
                      }
                      size={18}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  isLoading ? styles.signupButtonDisabled : null,
                ]}
                onPress={handleSignup}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#e6f2ff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: '#e53935',
    backgroundColor: '#ffebee',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  passwordToggle: {
    padding: 12,
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signupButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#007bff',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SignupScreen;

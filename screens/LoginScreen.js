// //screens/loginScreen.js
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import {login} from '../services/authService';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const LoginScreen = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'All fields are required');
//       return;
//     }
//     try {
//       const response = await login({email, password});

//       if (response.token) {
//         await AsyncStorage.setItem('authToken', response.token); // Store token
//         Alert.alert('Login Success', 'Welcome back!');
//         navigation.replace('DashboardScreen');
//       } else {
//         Alert.alert('Login Failed', 'Invalid credentials');
//       }
//     } catch (error) {
//       Alert.alert('Login Failed', 'An error occurred during login');
//       console.error(error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         onChangeText={setEmail}
//         value={email}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         onChangeText={setPassword}
//         value={password}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//         <Text style={styles.link}>Don't have an account? Sign Up</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, justifyContent: 'center', padding: 20},
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
//   link: {color: 'blue', textAlign: 'center', marginTop: 10},
// });

// export default LoginScreen;

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {login} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You'll need to install this package

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({email, password});

      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token); // Store token
        setIsLoading(false);
        navigation.replace('DashboardScreen');
      } else {
        setIsLoading(false);
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Login Failed', 'An error occurred during login');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              {/* You can replace this with your app logo */}
              <View style={styles.logoPlaceholder}>
                <Icon name="payments" size={40} color="#007bff" />
              </View>
              <Text style={styles.appName}>Payment Tracker</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>

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
                    placeholder="Enter your password"
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading ? styles.loginButtonDisabled : null,
                ]}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#e6f2ff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    marginBottom: 24,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#90caf9',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default LoginScreen;

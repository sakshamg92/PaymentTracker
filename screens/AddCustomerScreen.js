// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Modal,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {addCustomer} from '../services/customerService';
// import {useNavigation} from '@react-navigation/native';

// const AddCustomerScreen = () => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [amountDue, setAmountDue] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigation = useNavigation();

//   const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Check', 'Credit Card'];

//   const handleAddCustomer = async () => {
//     if (!name || !phone || !amountDue || !dueDate || !paymentMode) {
//       Alert.alert(
//         'Missing Information',
//         'Please fill in all required fields (Name, Phone, Amount Due, Due Date, and Payment Mode).',
//       );
//       return;
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phone)) {
//       Alert.alert(
//         'Invalid Phone',
//         'Please enter a valid 10-digit phone number.',
//       );
//       return;
//     }

//     if (email && !/^\S+@\S+\.\S+$/.test(email)) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }

//     try {
//       setLoading(true);
//       await addCustomer({
//         name,
//         phone,
//         email,
//         address,
//         amountDue: parseFloat(amountDue),
//         dueDate,
//         paymentMode,
//         paymentStatus: 'Pending',
//         createdAt: new Date().toISOString(),
//       });

//       setLoading(false);
//       Alert.alert('Customer Added', `${name} has been added successfully.`, [
//         {text: 'OK', onPress: () => navigation.goBack()},
//       ]);
//     } catch (error) {
//       setLoading(false);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const renderPaymentModeModal = () => (
//     <Modal
//       visible={showPaymentModeModal}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowPaymentModeModal(false)}>
//       <TouchableWithoutFeedback onPress={() => setShowPaymentModeModal(false)}>
//         <View style={styles.modalOverlay}>
//           <TouchableWithoutFeedback>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Select Payment Mode</Text>
//               {paymentModes.map(mode => (
//                 <TouchableOpacity
//                   key={mode}
//                   style={styles.modalItem}
//                   onPress={() => {
//                     setPaymentMode(mode);
//                     setShowPaymentModeModal(false);
//                   }}>
//                   <Text
//                     style={[
//                       styles.modalItemText,
//                       paymentMode === mode && styles.selectedModalItem,
//                     ]}>
//                     {mode}
//                   </Text>
//                   {paymentMode === mode && (
//                     <Text style={styles.checkIcon}>✓</Text>
//                   )}
//                 </TouchableOpacity>
//               ))}
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowPaymentModeModal(false)}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoidingView}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={styles.container}>
//             <Text style={styles.title}>Add New Customer</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Customer Information</Text>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputIcon}>👤</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Full Name *"
//                   placeholderTextColor="#888"
//                   onChangeText={setName}
//                   value={name}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputIcon}>📱</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Phone Number (10 digits) *"
//                   placeholderTextColor="#888"
//                   onChangeText={setPhone}
//                   value={phone}
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputIcon}>✉️</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Email Address"
//                   placeholderTextColor="#888"
//                   onChangeText={setEmail}
//                   value={email}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputIcon}>📍</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Address"
//                   placeholderTextColor="#888"
//                   onChangeText={setAddress}
//                   value={address}
//                   multiline={true}
//                   numberOfLines={2}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Payment Details</Text>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputIcon}>💰</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Amount Due *"
//                   placeholderTextColor="#888"
//                   onChangeText={setAmountDue}
//                   value={amountDue}
//                   keyboardType="numeric"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputIcon}>📅</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Due Date (YYYY-MM-DD) *"
//                   placeholderTextColor="#888"
//                   onChangeText={setDueDate}
//                   value={dueDate}
//                 />
//               </View>

//               <TouchableOpacity
//                 style={styles.inputContainer}
//                 onPress={() => setShowPaymentModeModal(true)}>
//                 <Text style={styles.inputIcon}>💳</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Payment Mode *"
//                   placeholderTextColor="#888"
//                   value={paymentMode}
//                   editable={false}
//                 />
//                 <Text style={styles.dropdownIcon}>▼</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={[styles.button, loading && styles.disabledButton]}
//               onPress={handleAddCustomer}
//               disabled={loading}>
//               <Text style={styles.buttonText}>
//                 {loading ? 'Adding...' : 'Add Customer'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelActionButton}
//               onPress={() => navigation.goBack()}>
//               <Text style={styles.cancelActionButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {renderPaymentModeModal()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#333',
//   },
//   inputGroup: {
//     marginBottom: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   inputIcon: {
//     marginLeft: 10,
//     fontSize: 16,
//     width: 24,
//     textAlign: 'center',
//   },
//   dropdownIcon: {
//     marginRight: 10,
//     fontSize: 12,
//     color: '#666',
//   },
//   input: {
//     flex: 1,
//     padding: 12,
//     fontSize: 15,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   disabledButton: {
//     backgroundColor: '#88bdf7',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cancelActionButton: {
//     marginTop: 15,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelActionButtonText: {
//     color: '#007bff',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#333',
//   },
//   modalItem: {
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   modalItemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   selectedModalItem: {
//     color: '#007bff',
//     fontWeight: 'bold',
//   },
//   checkIcon: {
//     color: '#007bff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     marginTop: 15,
//     padding: 15,
//     alignItems: 'center',
//     backgroundColor: '#f2f2f2',
//     borderRadius: 8,
//   },
//   cancelButtonText: {
//     color: '#555',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default AddCustomerScreen;

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Modal,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {addCustomer} from '../services/customerService';
// import {useNavigation} from '@react-navigation/native';

// const AddCustomerScreen = () => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [amountDue, setAmountDue] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [paymentMode, setPaymentMode] = useState('Cash');
//   const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigation = useNavigation();

//   const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Check', 'Credit Card'];

//   const handleAddCustomer = async () => {
//     if (!name || !phone || !amountDue || !dueDate || !paymentMode) {
//       Alert.alert(
//         'Missing Information',
//         'Please fill in all required fields (Name, Phone, Amount Due, Due Date, and Payment Mode).',
//       );
//       return;
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phone)) {
//       Alert.alert(
//         'Invalid Phone',
//         'Please enter a valid 10-digit phone number.',
//       );
//       return;
//     }

//     if (email && !/^\S+@\S+\.\S+$/.test(email)) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }

//     try {
//       setLoading(true);
//       await addCustomer({
//         name,
//         phone,
//         email,
//         address,
//         amountDue: parseFloat(amountDue),
//         dueDate,
//         paymentMode,
//         paymentStatus: 'Pending',
//         createdAt: new Date().toISOString(),
//       });

//       setLoading(false);
//       Alert.alert('Customer Added', `${name} has been added successfully.`, [
//         {text: 'OK', onPress: () => navigation.goBack()},
//       ]);
//     } catch (error) {
//       setLoading(false);
//       Alert.alert('Error', error.message);
//     }
//   };

//   const renderPaymentModeModal = () => (
//     <Modal
//       visible={showPaymentModeModal}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowPaymentModeModal(false)}>
//       <TouchableWithoutFeedback onPress={() => setShowPaymentModeModal(false)}>
//         <View style={styles.modalOverlay}>
//           <TouchableWithoutFeedback>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Select Payment Mode</Text>
//               {paymentModes.map(mode => (
//                 <TouchableOpacity
//                   key={mode}
//                   style={styles.modalItem}
//                   onPress={() => {
//                     setPaymentMode(mode);
//                     setShowPaymentModeModal(false);
//                   }}>
//                   <Text
//                     style={[
//                       styles.modalItemText,
//                       paymentMode === mode && styles.selectedModalItem,
//                     ]}>
//                     {mode}
//                   </Text>
//                   {paymentMode === mode && (
//                     <Icon name="check" size={18} color="#007bff" />
//                   )}
//                 </TouchableOpacity>
//               ))}
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowPaymentModeModal(false)}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoidingView}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={styles.container}>
//             <Text style={styles.title}>Add New Customer</Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Customer Information</Text>
//               <View style={styles.inputContainer}>
//                 <Icon
//                   name="person"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Full Name *"
//                   placeholderTextColor="#888"
//                   onChangeText={setName}
//                   value={name}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Icon
//                   name="phone"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Phone Number (10 digits) *"
//                   placeholderTextColor="#888"
//                   onChangeText={setPhone}
//                   value={phone}
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Icon
//                   name="email"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Email Address"
//                   placeholderTextColor="#888"
//                   onChangeText={setEmail}
//                   value={email}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Icon
//                   name="location-on"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Address"
//                   placeholderTextColor="#888"
//                   onChangeText={setAddress}
//                   value={address}
//                   multiline={true}
//                   numberOfLines={2}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Payment Details</Text>
//               <View style={styles.inputContainer}>
//                 <Icon
//                   name="attach-money"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Amount Due *"
//                   placeholderTextColor="#888"
//                   onChangeText={setAmountDue}
//                   value={amountDue}
//                   keyboardType="numeric"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Icon
//                   name="event"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Due Date (YYYY-MM-DD) *"
//                   placeholderTextColor="#888"
//                   onChangeText={setDueDate}
//                   value={dueDate}
//                 />
//               </View>

//               <TouchableOpacity
//                 style={styles.inputContainer}
//                 onPress={() => setShowPaymentModeModal(true)}>
//                 <Icon
//                   name="payment"
//                   size={20}
//                   style={styles.inputIcon}
//                   color="#666"
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Payment Mode *"
//                   placeholderTextColor="#888"
//                   value={paymentMode}
//                   editable={false}
//                 />
//                 <Icon
//                   name="arrow-drop-down"
//                   size={20}
//                   style={styles.dropdownIcon}
//                   color="#666"
//                 />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={[styles.button, loading && styles.disabledButton]}
//               onPress={handleAddCustomer}
//               disabled={loading}>
//               <Text style={styles.buttonText}>
//                 {loading ? 'Adding...' : 'Add Customer'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelActionButton}
//               onPress={() => navigation.goBack()}>
//               <Text style={styles.cancelActionButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {renderPaymentModeModal()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#333',
//   },
//   inputGroup: {
//     marginBottom: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   inputIcon: {
//     marginLeft: 10,
//     width: 24,
//     textAlign: 'center',
//   },
//   dropdownIcon: {
//     marginRight: 10,
//     color: '#666',
//   },
//   input: {
//     flex: 1,
//     padding: 12,
//     fontSize: 15,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   disabledButton: {
//     backgroundColor: '#88bdf7',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cancelActionButton: {
//     marginTop: 15,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelActionButtonText: {
//     color: '#007bff',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#333',
//   },
//   modalItem: {
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   modalItemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   selectedModalItem: {
//     color: '#007bff',
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     marginTop: 15,
//     padding: 15,
//     alignItems: 'center',
//     backgroundColor: '#f2f2f2',
//     borderRadius: 8,
//   },
//   cancelButtonText: {
//     color: '#555',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default AddCustomerScreen;

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
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {addCustomer} from '../services/customerService';
import {useNavigation} from '@react-navigation/native';

const AddCustomerScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [showPaymentModeModal, setShowPaymentModeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Check', 'Credit Card'];

  const handleAddCustomer = async () => {
    if (!name || !phone || !amountDue || !dueDate || !paymentMode) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields (Name, Phone, Amount Due, Due Date, and Payment Mode).',
      );
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number.',
      );
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await addCustomer({
        name,
        phone,
        email,
        address,
        amountDue: parseFloat(amountDue),
        dueDate,
        paymentMode,
        paymentStatus: 'Pending',
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert('Customer Added', `${name} has been added successfully.`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const renderPaymentModeModal = () => (
    <Modal
      visible={showPaymentModeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPaymentModeModal(false)}>
      <TouchableWithoutFeedback onPress={() => setShowPaymentModeModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Payment Mode</Text>
              {paymentModes.map(mode => (
                <TouchableOpacity
                  key={mode}
                  style={styles.modalItem}
                  onPress={() => {
                    setPaymentMode(mode);
                    setShowPaymentModeModal(false);
                  }}>
                  <Text
                    style={[
                      styles.modalItemText,
                      paymentMode === mode && styles.selectedModalItem,
                    ]}>
                    {mode}
                  </Text>
                  {paymentMode === mode && (
                    <Icon name="check" size={18} color="#4A6FA5" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPaymentModeModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Add New Customer</Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Icon name="people" size={20} color="#4A6FA5" />
                <Text style={styles.label}>Customer Information</Text>
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="person"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
                  placeholderTextColor="#888"
                  onChangeText={setName}
                  value={name}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="phone"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (10 digits) *"
                  placeholderTextColor="#888"
                  onChangeText={setPhone}
                  value={phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="email"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#888"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="location-on"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#888"
                  onChangeText={setAddress}
                  value={address}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Icon name="credit-card" size={20} color="#4A6FA5" />
                <Text style={styles.label}>Payment Details</Text>
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="attach-money"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount Due *"
                  placeholderTextColor="#888"
                  onChangeText={setAmountDue}
                  value={amountDue}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="event"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Due Date (YYYY-MM-DD) *"
                  placeholderTextColor="#888"
                  onChangeText={setDueDate}
                  value={dueDate}
                />
              </View>

              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowPaymentModeModal(true)}>
                <Icon
                  name="payment"
                  size={20}
                  style={styles.inputIcon}
                  color="#4A6FA5"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Payment Mode *"
                  placeholderTextColor="#888"
                  value={paymentMode}
                  editable={false}
                />
                <Icon
                  name="arrow-drop-down"
                  size={20}
                  style={styles.dropdownIcon}
                  color="#4A6FA5"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleAddCustomer}
              disabled={loading}>
              {loading ? (
                <Icon
                  name="sync"
                  size={20}
                  color="white"
                  style={{marginRight: 8}}
                />
              ) : (
                <Icon
                  name="check-circle"
                  size={20}
                  color="white"
                  style={{marginRight: 8}}
                />
              )}
              <Text style={styles.buttonText}>
                {loading ? 'Adding...' : 'Add Customer'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelActionButton}
              onPress={() => navigation.goBack()}>
              <Icon
                name="cancel"
                size={18}
                color="#4A6FA5"
                style={{marginRight: 5}}
              />
              <Text style={styles.cancelActionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderPaymentModeModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8EEF4',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    backgroundColor: '#4A6FA5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#4A6FA5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F9FAFC',
  },
  inputIcon: {
    marginLeft: 10,
    width: 24,
    textAlign: 'center',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A6FA5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#8BA3C0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelActionButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelActionButtonText: {
    color: '#4A6FA5',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4A6FA5',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedModalItem: {
    color: '#4A6FA5',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddCustomerScreen;

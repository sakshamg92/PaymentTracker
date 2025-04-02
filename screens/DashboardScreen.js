import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  getAllCustomers,
  updatePaymentStatus,
} from '../services/customerService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CollectedPaymentsScreen from './CollectedPaymentsScreen';
import CustomerPaymentDetailsScreen from './CustomerPaymentDetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState([]);
  const [userName, setUserName] = useState('Payment Tracker');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'Please try again');
    }
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const customersData = await getAllCustomers();
      const pendingCustomers = customersData.filter(
        customer => customer.paymentStatus === 'Pending',
      );
      setCustomers(pendingCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Alert.alert('Error', 'Failed to load customers. Pull down to refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCustomers();
    }, []),
  );

  const markAsReceived = async customerId => {
    try {
      await updatePaymentStatus(customerId, 'paid');

      // Animated removal
      setCustomers(prevCustomers =>
        prevCustomers.filter(customer => customer._id !== customerId),
      );

      Alert.alert('Success', 'Payment marked as received!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark payment as received');
      console.error('Error marking payment as received:', error);
    }
  };

  const totalPayments = customers.reduce(
    (sum, customer) => sum + customer.amountDue,
    0,
  );
  const pendingPayments = customers.filter(
    customer => customer.paymentStatus === 'Pending',
  ).length;

  const renderCustomer = ({item}) => {
    // Calculate if payment is overdue
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today;

    const formattedDate = new Date(item.dueDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              isOverdue ? styles.statusOverdue : styles.statusPending,
            ]}>
            <Text style={styles.statusText}>
              {isOverdue ? 'OVERDUE' : 'PENDING'}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Icon name="phone" size={16} color="#666" />
            <Text style={styles.info}>{item.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={16} color="#666" />
            <Text style={styles.info}>Due: {formattedDate}</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount Due</Text>
            <Text style={styles.amountValue}>
              ₹{item.amountDue.toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.markButton}
          onPress={() => markAsReceived(item._id)}>
          <Icon name="check-circle" size={18} color="#fff" />
          <Text style={styles.markButtonText}>Mark as Received</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="check-circle" size={60} color="#28a745" />
      <Text style={styles.emptyTitle}>All Caught Up!</Text>
      <Text style={styles.emptyText}>No pending payments to collect</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>{userName}</Text>
          <Text style={styles.subTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.iconCircle, {backgroundColor: '#e6f2ff'}]}>
            <Icon name="people" size={24} color="#007bff" />
          </View>
          <Text style={styles.statLabel}>Customers</Text>
          <Text style={styles.statValue}>{customers.length}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconCircle, {backgroundColor: '#e6fff0'}]}>
            <Icon name="attach-money" size={24} color="#28a745" />
          </View>
          <Text style={styles.statLabel}>Total Due</Text>
          <Text style={styles.statValue}>
            ₹{totalPayments.toLocaleString()}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconCircle, {backgroundColor: '#ffebee'}]}>
            <Icon name="hourglass-empty" size={24} color="#dc3545" />
          </View>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>{pendingPayments}</Text>
        </View>
      </View>

      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeader}>Pending Payments</Text>
        <TouchableOpacity onPress={fetchCustomers} style={styles.refreshButton}>
          <Icon name="refresh" size={18} color="#555" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={customers}
        keyExtractor={item => item._id}
        renderItem={renderCustomer}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        refreshing={isLoading}
        onRefresh={fetchCustomers}
      />
    </SafeAreaView>
  );
};

const MainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HOME') {
            iconName = 'dashboard';
          } else if (route.name === 'CUSTOMERS') {
            iconName = 'people';
          } else if (route.name === 'CollectedPayments') {
            iconName = 'payments';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {fontSize: 12, fontWeight: '500'},
        tabBarStyle: {paddingVertical: 5, height: 60},
      })}>
      <Tab.Screen
        name="HOME"
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />
      <Tab.Screen
        name="CUSTOMERS"
        component={CustomerPaymentDetailsScreen}
        options={{tabBarLabel: 'Customers'}}
      />
      <Tab.Screen
        name="CollectedPayments"
        component={CollectedPaymentsScreen}
        options={{tabBarLabel: 'Collected'}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    padding: 16,
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fff8e1',
  },
  statusOverdue: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  amountContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 4,
  },
  markButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  markButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default MainScreen;

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {getAllCustomers, deleteCustomer} from '../services/customerService';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomerPaymentDetailsScreen = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Fetch customers on screen focus
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const customersData = await getAllCustomers();
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Alert.alert('Error', 'Failed to load customers. Pull down to refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, []),
  );

  const handleSearch = text => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        customer =>
          customer.name.toLowerCase().includes(text.toLowerCase()) ||
          customer.phone.includes(text) ||
          (customer.email &&
            customer.email.toLowerCase().includes(text.toLowerCase())),
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleDeleteCustomer = async id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this customer?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomer(id);

              // Update local state to remove customer immediately
              setCustomers(prevCustomers =>
                prevCustomers.filter(customer => customer._id !== id),
              );
              setFilteredCustomers(prevFiltered =>
                prevFiltered.filter(customer => customer._id !== id),
              );

              Alert.alert('Success', 'Customer deleted successfully');
            } catch (error) {
              console.error('Error deleting customer:', error);
              Alert.alert(
                'Error',
                'Could not delete customer. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'paid':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const renderCustomer = ({item}) => {
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const isOverdue =
      dueDate < today && item.paymentStatus.toLowerCase() === 'pending';

    const formattedDate = new Date(item.dueDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const formattedCreatedAt = new Date(item.createdAt).toLocaleDateString(
      'en-US',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: isOverdue ? '#ffebee' : '#f0f9ff'},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(item.paymentStatus)},
              ]}>
              {item.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icon name="phone" size={16} color="#6c7ee1" />
              <Text style={styles.infoText}>{item.phone}</Text>
            </View>

            {item.email && (
              <View style={styles.infoRow}>
                <Icon name="email" size={16} color="#6c7ee1" />
                <Text style={styles.infoText}>{item.email}</Text>
              </View>
            )}

            {item.address && (
              <View style={styles.infoRow}>
                <Icon name="location-on" size={16} color="#6c7ee1" />
                <Text style={styles.infoText}>{item.address}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Due:</Text>
              <Text style={styles.detailValue}>
                ₹{item.amountDue.toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Due Date:</Text>
              <Text style={[styles.detailValue, isOverdue && styles.overdue]}>
                {formattedDate}
                {isOverdue && <Text style={styles.overdueTag}> (OVERDUE)</Text>}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Mode:</Text>
              <Text style={styles.detailValue}>{item.paymentMode}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created:</Text>
              <Text style={styles.detailValue}>{formattedCreatedAt}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditCustomerScreen', {customer: item})
            }>
            <Icon name="edit" size={16} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCustomer(item._id)}>
            <Icon name="delete" size={16} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Icon name="people" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>No Customers Found</Text>
          <Text style={styles.emptyText}>
            {searchQuery.trim() !== ''
              ? 'Try a different search term'
              : 'Add your first customer by tapping the "+" button'}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone or email..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch('')}
            style={styles.clearButton}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item._id}
        renderItem={renderCustomer}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        refreshing={isLoading}
        onRefresh={fetchCustomers}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddCustomerScreen')}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  paymentDetails: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  overdue: {
    color: '#dc3545',
  },
  overdueTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CustomerPaymentDetailsScreen;

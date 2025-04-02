// import React, {useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
//   RefreshControl,
//   StatusBar,
// } from 'react-native';
// import {useFocusEffect} from '@react-navigation/native';
// import {getAllCustomers} from '../services/customerService';

// const CollectedPaymentsScreen = () => {
//   const [collectedPayments, setCollectedPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0);

//   const fetchCollectedPayments = async () => {
//     try {
//       setLoading(true);
//       const customersData = await getAllCustomers();
//       const collected = customersData.filter(
//         customer => customer.paymentStatus === 'Paid',
//       );

//       // Calculate total amount collected
//       const total = collected.reduce(
//         (sum, customer) => sum + (parseFloat(customer.amountDue) || 0),
//         0,
//       );

//       setCollectedPayments(collected);
//       setTotalAmount(total);
//       setLoading(false);
//       setRefreshing(false);
//     } catch (error) {
//       console.error('Error fetching collected payments:', error);
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Refresh data on screen focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchCollectedPayments();
//     }, []),
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchCollectedPayments();
//   };

//   const formatDate = dateString => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         // Handle invalid date format
//         return dateString;
//       }
//       // Format: Day Month, Year (e.g., 15 Apr, 2025)
//       return date.toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const renderCustomer = ({item, index}) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.name}>{item.name}</Text>
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>PAID</Text>
//         </View>
//       </View>

//       <View style={styles.cardBody}>
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>📱 Phone:</Text>
//           <Text style={styles.infoValue}>{item.phone}</Text>
//         </View>

//         {item.email && (
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>✉️ Email:</Text>
//             <Text style={styles.infoValue}>{item.email}</Text>
//           </View>
//         )}

//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>💰 Amount:</Text>
//           <Text style={styles.amountValue}>
//             ₹{parseFloat(item.amountDue).toLocaleString('en-IN')}
//           </Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>📅 Paid On:</Text>
//           <Text style={styles.infoValue}>{formatDate(item.dueDate)}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>💳 Mode:</Text>
//           <Text style={styles.infoValue}>
//             {item.paymentMode || 'Not specified'}
//           </Text>
//         </View>
//       </View>

//       {index !== collectedPayments.length - 1 && (
//         <View style={styles.divider} />
//       )}
//     </View>
//   );

//   const ListEmptyComponent = () => (
//     <View style={styles.emptyContainer}>
//       <Text style={styles.emptyIcon}>💸</Text>
//       <Text style={styles.emptyTitle}>No Payments Collected</Text>
//       <Text style={styles.emptySubtitle}>
//         When customers make payments, they will appear here.
//       </Text>
//       <TouchableOpacity
//         style={styles.refreshButton}
//         onPress={fetchCollectedPayments}>
//         <Text style={styles.refreshButtonText}>Refresh</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const ListHeaderComponent = () => (
//     <>
//       <View style={styles.headerContainer}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Collected Payments</Text>
//         </View>

//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>{collectedPayments.length}</Text>
//             <Text style={styles.statLabel}>Payments</Text>
//           </View>
//           <View style={styles.statDivider} />
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>
//               ₹{totalAmount.toLocaleString('en-IN')}
//             </Text>
//             <Text style={styles.statLabel}>Total Amount</Text>
//           </View>
//         </View>
//       </View>
//       {collectedPayments.length > 0 && (
//         <Text style={styles.listHeader}>Recent Payments</Text>
//       )}
//     </>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />

//       {loading && !refreshing ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#007bff" />
//           <Text style={styles.loadingText}>Loading payments...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={collectedPayments}
//           keyExtractor={(item, index) => item._id || index.toString()}
//           renderItem={renderCustomer}
//           ListEmptyComponent={ListEmptyComponent}
//           ListHeaderComponent={ListHeaderComponent}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#007bff']}
//               tintColor="#007bff"
//             />
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     // backgroundColor: '#f9f9f9',
//     backgroundColor: '#f5f5f5',
//   },
//   headerContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   header: {
//     padding: 10,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: '#eee',
//     marginHorizontal: 15,
//   },
//   listHeader: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginVertical: 10,
//     marginHorizontal: 20,
//     color: '#555',
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     borderRadius: 12,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   badge: {
//     backgroundColor: '#28a745',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   badgeText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   cardBody: {
//     paddingHorizontal: 15,
//     paddingBottom: 15,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#666',
//     width: 80,
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   amountValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#28a745',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginHorizontal: 15,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     marginTop: 50,
//   },
//   emptyIcon: {
//     fontSize: 50,
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   refreshButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   refreshButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default CollectedPaymentsScreen;

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getAllCustomers} from '../services/customerService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CollectedPaymentsScreen = () => {
  const [collectedPayments, setCollectedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCollectedPayments = async () => {
    try {
      setLoading(true);
      const customersData = await getAllCustomers();
      const collected = customersData.filter(
        customer => customer.paymentStatus === 'Paid',
      );

      // Calculate total amount collected
      const total = collected.reduce(
        (sum, customer) => sum + (parseFloat(customer.amountDue) || 0),
        0,
      );

      setCollectedPayments(collected);
      setTotalAmount(total);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching collected payments:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchCollectedPayments();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCollectedPayments();
  };

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Handle invalid date format
        return dateString;
      }
      // Format: Day Month, Year (e.g., 15 Apr, 2025)
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderCustomer = ({item, index}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.badge}>
          <Icon
            name="check-circle"
            size={12}
            color="#fff"
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeText}>PAID</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.labelContainer}>
            <Icon name="phone" size={16} color="#6c7ee1" />
            <Text style={styles.infoLabel}>Phone:</Text>
          </View>
          <Text style={styles.infoValue}>{item.phone}</Text>
        </View>

        {item.email && (
          <View style={styles.infoRow}>
            <View style={styles.labelContainer}>
              <Icon name="email" size={16} color="#6c7ee1" />
              <Text style={styles.infoLabel}>Email:</Text>
            </View>
            <Text style={styles.infoValue}>{item.email}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <View style={styles.labelContainer}>
            <Icon name="account-balance-wallet" size={16} color="#6c7ee1" />
            <Text style={styles.infoLabel}>Amount:</Text>
          </View>
          <Text style={styles.amountValue}>
            ₹{parseFloat(item.amountDue).toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.labelContainer}>
            <Icon name="event" size={16} color="#6c7ee1" />
            <Text style={styles.infoLabel}>Paid On:</Text>
          </View>
          <Text style={styles.infoValue}>{formatDate(item.dueDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.labelContainer}>
            <Icon name="payment" size={16} color="#6c7ee1" />
            <Text style={styles.infoLabel}>Mode:</Text>
          </View>
          <Text style={styles.infoValue}>
            {item.paymentMode || 'Not specified'}
          </Text>
        </View>
      </View>

      {index !== collectedPayments.length - 1 && (
        <View style={styles.divider} />
      )}
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="account-balance-wallet" size={60} color="#a0a0a0" />
      <Text style={styles.emptyTitle}>No Payments Collected</Text>
      <Text style={styles.emptySubtitle}>
        When customers make payments, they will appear here.
      </Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchCollectedPayments}>
        <Icon name="refresh" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Collected Payments</Text>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{collectedPayments.length}</Text>
            <Text style={styles.statLabel}>Payments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
        </View>
      </View>
      {collectedPayments.length > 0 && (
        <Text style={styles.listHeader}>Recent Payments</Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f4f7fe" barStyle="dark-content" />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c7ee1" />
          <Text style={styles.loadingText}>Loading payments...</Text>
        </View>
      ) : (
        <FlatList
          data={collectedPayments}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderCustomer}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6c7ee1']}
              tintColor="#6c7ee1"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#6c7ee1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c7ee1',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    marginHorizontal: 20,
    color: '#555',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardBody: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#6c7ee1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CollectedPaymentsScreen;

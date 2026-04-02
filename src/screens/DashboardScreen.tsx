// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';

// const DashboardScreen = ({ navigation }) => {
//   // Summary Data (Baad mein API se aayega)
//   const stats = [
//     { id: '1', title: 'Total Vendors', value: '0', color: '#4e73df' },
//     { id: '2', title: 'Active Invoices', value: '0', color: '#1cc88a' },
//     { id: '3', title: 'Pending Payments', value: 'PKR 0', color: '#f6c23e' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Royal Palm Dashboard</Text>
//         <Text style={styles.subTitle}>Welcome, Admin</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Summary Stats Cards */}
//         <View style={styles.statsGrid}>
//           {stats.map(item => (
//             <View
//               key={item.id}
//               style={[styles.statCard, { borderLeftColor: item.color }]}
//             >
//               <Text style={styles.statTitle}>{item.title}</Text>
//               <Text style={styles.statValue}>{item.value}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Quick Actions / Navigation */}
//         <Text style={styles.sectionTitle}>Quick Management</Text>

//         <TouchableOpacity
//           style={styles.menuItem}
//           onPress={() => navigation.navigate('VendorList')}
//         >
//           <View style={styles.iconPlaceholder} />
//           <View>
//             <Text style={styles.menuText}>Vendors Management</Text>
//             <Text style={styles.menuSubText}>View and add new vendors</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.menuItem}
//           onPress={() => navigation.navigate('Invoices')}
//         >
//           <View
//             style={[styles.iconPlaceholder, { backgroundColor: '#1cc88a' }]}
//           />
//           <View>
//             <Text style={styles.menuText}>Vendor Invoices</Text>
//             <Text style={styles.menuSubText}>Manage bills and payments</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.menuItem}
//           onPress={() => navigation.navigate('BankCash')}
//         >
//           <View
//             style={[styles.iconPlaceholder, { backgroundColor: '#f6c23e' }]}
//           />
//           <View>
//             <Text style={styles.menuText}>Bank & Cash</Text>
//             <Text style={styles.menuSubText}>
//               Check society accounts balance
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default DashboardScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fc' },
//   header: {
//     padding: 20,
//     backgroundColor: '#1a1a2e',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
//   subTitle: { color: '#ccc', fontSize: 14, marginTop: 5 },
//   content: { padding: 20 },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   statCard: {
//     backgroundColor: 'white',
//     width: '48%',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     elevation: 3,
//     borderLeftWidth: 5,
//   },
//   statTitle: { fontSize: 12, color: '#555', fontWeight: '600' },
//   statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     marginTop: 10,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 12,
//     elevation: 2,
//   },
//   iconPlaceholder: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#4e73df',
//     borderRadius: 8,
//     marginRight: 15,
//   },
//   menuText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   menuSubText: { fontSize: 12, color: '#777' },
// });

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import api from '../services/axious';  

const DashboardScreen = ({ navigation }) => {
  // 1. SAARE HOOKS TOP PAR
  const [vendors, setVendors] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false); 

  // Form State (DTO ke mutabiq) 
  const [formData, setFormData] = useState({ 
    vendor_number: '', 
    name: '',
    contact_person_name: '',
    vendor_type: 'Material',
    cnic: '',
    email: '',
    address: '',
    date_of_joining: new Date().toISOString(), 
  });

  // 2. DATA FETCH FUNCTION
  const fetchDashboardData = async () => {
    try { 


      const response = await api.get('/vendors');
      if (response && response.data && Array.isArray(response.data)) {
        setVendors(response.data);
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.log('Fetch Error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again.');
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 3. VENDOR SAVE FUNCTION
  const handleAddVendor = async () => {
  if (!formData.vendor_number || !formData.name || formData.cnic.length !== 13 || !formData.address) {
    Alert.alert("Error", "Please fill required fields (CNIC must be 13 digits)");
    return;
  }

  try {
    setSubmitting(true);

    const response = await api.post('/vendors', formData);

    // ✅ Instant UI update
    setVendors(prev => [response.data, ...prev]);

    Alert.alert("Success", "Vendor Added!");
    setModalVisible(false);

    // Reset form
    setFormData({
      vendor_number: '',
      name: '',
      contact_person_name: '',
      vendor_type: 'Material',
      cnic: '',
      email: '',
      address: '',
      date_of_joining: new Date().toISOString(),
    });
    
  } catch (error) {
    const msg = error.response?.data?.message;
    Alert.alert("Error", Array.isArray(msg) ? msg.join(", ") : msg || "Failed to add");
  } finally {
    setSubmitting(false);
  }
};

  // 4. STATS DATA (Hooks ke baad aur Loading se pehle)
  const stats = [
    {
      id: '1',
      title: 'Total Vendors',
      value: vendors ? vendors.length.toString() : '0',
      color: '#4e73df',
    },
    { id: '2', title: 'Active Status', value: 'Online', color: '#1cc88a' },
  ];

  // 5. LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={{ marginTop: 10 }}>Loading Data...</Text>
      </View>
    );
  }

  // 6. MAIN UI
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Royal Palm Dashboard</Text>
        <Text style={styles.subTitle}>Welcome, Admin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map(item => (
            <View
              key={item.id}
              style={[styles.statCard, { borderLeftColor: item.color }]}
            >
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Management</Text>

        {/* Add Vendor Button (Kholega Modal) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.iconPlaceholder} />
          <View>
            <Text style={styles.menuText}>Vendors Management</Text>
            <Text style={styles.menuSubText}>Add new business partners</Text>
          </View>
        </TouchableOpacity>

         <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BankCash')}
        >
          <View style={[styles.iconPlaceholder , { backgroundColor: '#f6c23e' }]} />
          <View>
            <Text style={styles.menuText}>Banks</Text>
            <Text style={styles.menuSubText}>Add new financial institutions</Text>
          </View>
        </TouchableOpacity>




         <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Invoices')}
        >
          <View style={[styles.iconPlaceholder , { backgroundColor: '#963b66' }]} />
          <View>
            <Text style={styles.menuText}>Invoices</Text>
            <Text style={styles.menuSubText}>Manage bills and payments</Text>
          </View>
        </TouchableOpacity>

        {/* List of Recent Vendors (The Payload) */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Recent Vendors List</Text>
          {vendors.length > 0 ? (
            vendors.slice(0, 5).map((v, i) => (
              <View key={i} style={styles.vendorListItem}>
                <Text style={styles.vendorName}>{v.name}</Text>
                <Text style={styles.vendorDetail}>
                  {v.vendor_number} - {v.vendor_type}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No vendors found in database.</Text>
          )}
        </View>
      </ScrollView>

      {/* --- ADD VENDOR MODAL --- */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fc' }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Vendor Form</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            <Text style={styles.label}>Vendor Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="V-001"
              value={formData.vendor_number}
              onChangeText={v => setFormData({ ...formData, vendor_number: v })}
            />

            <Text style={styles.label}>Vendor Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={formData.name}
              onChangeText={v => setFormData({ ...formData, name: v })}
            />

            <Text style={styles.label}>CNIC (13 digits) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={13}
              placeholder="42101..."
              value={formData.cnic}
              onChangeText={v => setFormData({ ...formData, cnic: v })}
            />

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Full address"
              value={formData.address}
              onChangeText={v => setFormData({ ...formData, address: v })}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleAddVendor}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Vendor</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  subTitle: { color: '#ccc', fontSize: 14, marginTop: 5 },
  content: { padding: 20 },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    borderLeftWidth: 5,
  },
  statTitle: { fontSize: 12, color: '#555', fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#4e73df',
    borderRadius: 8,
    marginRight: 15,
  },
  menuText: { fontSize: 16, fontWeight: 'bold' },
  menuSubText: { fontSize: 12, color: '#777' },
  // List Styles
  vendorListItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  vendorName: { fontWeight: 'bold', fontSize: 16 },
  vendorDetail: { color: '#666', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 14, color: '#555', marginBottom: 5, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  saveBtn: {
    backgroundColor: '#1a1a2e',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default DashboardScreen;

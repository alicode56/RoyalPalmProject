import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/axious';


const BusinessManagementScreen = () => {
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState([]);

  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    ntn: '',
  });

  // --- 1. AUTO-LOAD LIST ON MOUNT ---
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/businesses');
      setBusinesses(response.data || []);
    } catch (error) {
      console.log('GET ERROR:', error);
    }
  };

  // --- 2. FIXED ADD LOGIC (PREVENTS TRIM ERROR) ---
//   const handleAdd = async () => {
//     // Check if name exists as a string before trimming
//     const nameInput = formData.businessName || '';
//     if (!nameInput.trim()) {
//       return alert('Business Name is required');
//     }

//     try {
//       // Create payload ensuring NO field is undefined
//       const payload = {
//         businessName: nameInput.trim(),
//         address: (formData.address || '').trim(),
//         ntn: (formData.ntn || '').trim(),
//       };

//       console.log('Safe Payload:', payload);

//       const response = await api.post('/businesses', payload);

//       if (response.status === 200 || response.status === 201) {
//         await fetchBusinesses(); // Refresh list
//         setModalVisible(false); // Close modal
//         setFormData({ businessName: '', address: '', ntn: '' }); // Reset form
//       }
//     } catch (error) {
//       // If the error persists, it's coming from your backend code
//       console.log('SERVER ERROR:', error.response?.data);
//       const msg = error.response?.data?.message || error.message;
//       alert('Failed to save: ' + msg);
//     }
//   };



// const handleAdd = async () => {
//   if (!formData.businessName) {
//     return alert('Business Name is required');
//   }

//   try {
//     // const payload = {
//     //   businessName: formData.businessName,
//     //   address: formData.address || '',
//     //   ntn: formData.ntn || '',
//     // };


//     const payload = {
//   businessName: formData.businessName,
//   address: formData.address || '',
//   ntn: formData.ntn || '',
// };

//     console.log('Payload:', payload);

//     const response = await api.post('/businesses', payload);

//     //await fetchBusinesses(); // refresh list
// await create(); // refresh list


//     setModalVisible(false);
//     setFormData({ businessName: '', address: '', ntn: '' });

//   } catch (error) {
//     console.log('SERVER ERROR:', error.response?.data || error.message);
//     //alert('Failed to save');
//     alert(JSON.stringify(error.response?.data || error.message));
//   }
// };


const handleAdd = async () => {
  const name = formData.businessName?.trim();

  if (!name) {
    return alert('Business Name is required');
  }

  try {
    const payload = {
      name :formData.businessName,
      address: formData.address?.trim() || '',
      ntn: formData.ntn?.trim() || '',
    };

    console.log('Payload:', payload);

    const response = await api.post('/businesses', payload);

    if (response.status === 200 || response.status === 201) {
      await fetchBusinesses();
      setModalVisible(false);
      setFormData({ businessName: '', address: '', ntn: '' });
    }

  } catch (error) {
    console.log('SERVER ERROR:', error.response?.data || error.message);
    alert(JSON.stringify(error.response?.data || error.message));
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E14" />

      {/* --- HEADER (Margin fixed for suitability) --- */}
      <View style={styles.header}>
        <Text style={styles.title}>Businesses Management</Text>
        <Text style={styles.subtitle}>
          Manage all your business entities and information
        </Text>
      </View>

      {/* --- SEARCH & ADD --- */}
      <View style={styles.actionRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name, address, or NTN..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Business</Text>
        </TouchableOpacity>
      </View>

      {/* --- LOAN NAVIGATION --- */}
      <View style={styles.container2loan}>
        <TouchableOpacity
          style={styles.addBtnLoan}
          onPress={() => navigation.navigate('LoanManagementScreen')}
        >
          <Text style={styles.loanBtnText}>Loan Management</Text>
        </TouchableOpacity>
      </View>

      {/* --- LIST AREA --- */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Businesses</Text>

        {businesses.length === 0 ? (
          <View style={styles.emptyState}> 
            <Text style={styles.emptyText}>No business entity found</Text>
            <Text style={styles.emptySubText}>
              Create a new business entity to get started
            </Text>
          </View>
        ) : (
          <FlatList
            // data={businesses.filter(b =>
            //   b.businessName?.toLowerCase().includes(searchQuery.toLowerCase()),
            // )}
            data={businesses.filter(b =>
  b.name?.toLowerCase().includes(searchQuery.toLowerCase()),
)}
            keyExtractor={item =>
              item._id || item.id || Math.random().toString()
            }
            renderItem={({ item }) => (
              <View style={styles.businessCard}>
                <Text style={styles.cardTitle}>{item.businessName}</Text>
                <Text style={styles.cardInfo}>
                  Address: {item.address || 'N/A'}
                </Text>
                <Text style={styles.cardInfo}>NTN: {item.ntn || 'N/A'}</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* --- MODAL --- */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add New Business</Text>
                <Text style={styles.modalSubtitle}>
                  Create a new business entity
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Business Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter business name"
                  placeholderTextColor="#999"
                  value={formData.businessName}
                  onChangeText={v =>
                    setFormData({ ...formData, businessName: v })
                  }
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter address"
                  placeholderTextColor="#999"
                  value={formData.address}
                  onChangeText={v => setFormData({ ...formData, address: v })}
                />

                <Text style={styles.label}>NTN (Tax Number)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter NTN number"
                  placeholderTextColor="#999"
                  value={formData.ntn}
                  onChangeText={v => setFormData({ ...formData, ntn: v })}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                  <Text style={styles.saveBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0E14' },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 50, // Fixed: Header is no longer "attached" to top
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#161B22',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  addBtn: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addBtnText: { color: '#000', fontWeight: 'bold' },
  container2loan: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  addBtnLoan: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  loanBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  listContainer: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 200,
  },
  emptyText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptySubText: { color: '#666', fontSize: 12, marginTop: 5 },
  businessCard: {
    backgroundColor: '#161B22',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardInfo: { color: '#888', fontSize: 13, marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#0D1117',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalSubtitle: { color: '#888', fontSize: 12 },
  closeX: { color: '#888', fontSize: 20 },
  label: { color: '#FFF', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: { padding: 12 },
  cancelBtnText: { color: '#FFF', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  saveBtnText: { color: '#000', fontWeight: 'bold' },
});

export default BusinessManagementScreen;

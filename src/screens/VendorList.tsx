import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getVendors, createVendor } from '../api/vendors';
const vendorTypes = ['Material', 'Service', 'Construction', 'Other'];
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';
const VendorList = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal');

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [vendorNum, setVendorNum] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [vendorType, setVendorType] = useState('Material');

  // 1. GET API: for registerd venders list
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getVendors();
      setVendors(response.data);
      console.log('Fetched Vendors:', response.data);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // 2. POST API: for new added vender
  const handleCreateVendor = async () => {
    const payload = {
      vendor_number: vendorNum,
      name: vendorName,
      contact_person_name: contactPerson,
      vendor_type: vendorType,
      cnic: cnic,
      email: email || null,
      address: address,
      date_of_joining: new Date().toISOString().split('T')[0],

      phoneNumbers: [
        {
          phone_number: '03001234567',
        },
      ],

      bankAccounts: [
        {
          account_number: '1234567890',
          account_title: 'Test Account',
          iban: 'PK12XXX',
          bank_id: '1',
        },
      ],
    };

    try {
      setLoading(true);
      // API HERE: Naya vendor save karne ka endpoint yahan likhein
      // await createVendor(payload);
      // console.log('Vendor created:', response.data);
      const response = await createVendor(payload)
      console.log('Vendor created:', response.data);
      alert('Vendor Created Successfully!');
      setModalVisible(false);

      // fetchVendors(); // List refresh karne ke liye
      setVendors(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Create error:', error);
      alert('Error saving vendor');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Society: Vendors</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Vendor</Text>
        </TouchableOpacity>
      </View>

    //dearch bar
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, CNIC, or vendor number..."
        placeholderTextColor="#999"
      />
      {loading && <ActivityIndicator size="large" color="#1a1a2e" />}
      <FlatList
        data={vendors}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No vendors found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.vNum}>#{item.vendor_number}</Text>
              <Text style={styles.vType}>{item.type}</Text>
            </View>
            <Text style={styles.vName}>{item.name}</Text>
            <Text style={styles.vType}>{item.vendor_type}</Text>
            <Text style={styles.vInfo}>
              Contact: {item.contact_person_name}
            </Text>
          </View>
        )}
      />

      {/* Add Vendor Modal [cite: 1] */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Vendor</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>CANCEL</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs Section [cite: 1] */}
          <View style={styles.tabBar}>
            {['Personal', 'Contact', 'Financial'].map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                style={[styles.tab, activeTab === t && styles.activeTab]}
              >
                <Text
                  style={
                    activeTab === t ? styles.activeTabText : styles.tabText
                  }
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={{ padding: 20 }}>
            {activeTab === 'Personal' && (
              <View>
                <Text style={styles.label}>Vendor Number</Text>
                <TextInput
                  style={styles.input}
                  value={vendorNum}
                  onChangeText={setVendorNum}
                  placeholder="Enter number"
                />
                <Text style={styles.label}>Vendor Name</Text>
                <TextInput
                  style={styles.input}
                  value={vendorName}
                  onChangeText={setVendorName}
                  placeholder="Enter name"
                />
                <Text style={styles.label}>CNIC</Text>
                <TextInput
                  style={styles.input}
                  value={cnic}
                  onChangeText={setCnic}
                  placeholder="XXXXX-XXXXXXXXXXX-X"
                />
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                />
              </View>
            )}

            {activeTab === 'Contact' && (
              <View>
                <Text style={styles.label}>Contact Person Name</Text>
                <TextInput
                  style={styles.input}
                  value={contactPerson}
                  onChangeText={setContactPerson}
                  placeholder="Enter person name"
                />
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              </View>
            )}

            {activeTab === 'Financial' && (
              <View>
                <Text style={styles.label}>Vendor Type</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setVendorType('Material')}
                >
                  <Text>{vendorType} (Click to change)</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.saveBtn}
            //  onPress={() => setVendorType(vendorTypes[0])}>
            onPress={handleCreateVendor}
          >
            <Text style={styles.saveBtnText}>CREATE VENDOR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VendorList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#4e73df', padding: 10, borderRadius: 6 },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  searchBar: {
    backgroundColor: 'white',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vNum: { color: '#4e73df', fontWeight: 'bold' },
  vType: {
    fontSize: 10,
    backgroundColor: '#eef2ff',
    padding: 4,
    borderRadius: 4,
    color: '#4e73df',
  },
  vName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  vInfo: { fontSize: 13, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  modalContent: { flex: 1, backgroundColor: 'white' },
  modalHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#1a1a2e' },
  tabText: { color: '#888' },
  activeTabText: { color: '#1a1a2e', fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 15 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  saveBtn: {
    backgroundColor: '#1a1a2e',
    margin: 20,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

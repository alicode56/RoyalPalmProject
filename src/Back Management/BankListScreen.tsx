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
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/axious';

const BankListScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [banks, setBanks] = useState([]);

  const [formData, setFormData] = useState({
    bankName: '',
    branchName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    openingBalance: '',
    accountType: '',
  });

  // ✅ FETCH BANKS FROM API
  const fetchBanks = async () => {
    try {
      const response = await api.get('/banks/accounts/all');
      console.log('GET DATA:', response.data);

      setBanks(response.data); // adjust if needed
    } catch (error) {
      console.log('GET ERROR:', error.response?.data || error.message);
    }
  };

  // ✅ LOAD DATA ON SCREEN OPEN
  useEffect(() => {
    fetchBanks();
  }, []);

  // ✅ TOTAL CALCULATION
  const totalAvailable = banks.reduce(
    (sum, b) => sum + (Number(b.openingBalance) || 0),
    0,
  );

  // ✅ SAVE BANK (API)
  const handleSave = async () => {
    const payload = {
      alias: formData.bankName, // 🔥 important mapping
      bankId: 1, // temporary
      accountTitle: formData.accountTitle,
      accountNumber: formData.accountNumber,
      iban: formData.iban,
      openingDate: '2024-01-01', // required
      openingBalance: Number(formData.openingBalance),
    };

    if (!payload.alias || !payload.accountNumber) {
      Alert.alert('Error', 'Required fields missing');
      return;
    }

    try {
      await api.post('/banks/accounts/create', payload);

      Alert.alert('Success', 'Bank Added');

      fetchBanks(); // 🔥 refresh list
      setModalVisible(false);

      setFormData({
        bankName: '',
        branchName: '',
        accountTitle: '',
        accountNumber: '',
        iban: '',
        openingBalance: '',
        accountType: '',
      });
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Bank Management</Text>
        <TouchableOpacity
          style={styles.addBtnTop}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Bank</Text>
        </TouchableOpacity>
      </View>

// hear2 business manangement btn 
      <View style={styles.listContainer2}>
        <TouchableOpacity style={styles.addBtnBusinessmanagment}
          onPress={() => navigation.navigate('BusinessManagementScreen')}
        >
          <Text style={styles.listText2}>Business Management </Text>
        </TouchableOpacity>
      </View>


      //

      {/* TOTAL */}
      <View style={styles.statsRow}>
        <Text style={styles.totalText}>
          Total: Rs. {totalAvailable.toLocaleString()}
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={banks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.bankCard}>
            <Text style={styles.bankNameText}>
              {item.alias} {/* ✅ FIXED */}
            </Text>
            <Text style={styles.balanceText}>
              Rs. {Number(item.openingBalance).toLocaleString()}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* MODAL */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bank</Text>

            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                value={formData.bankName}
                onChangeText={v => setFormData({ ...formData, bankName: v })}
              />

              <TextInput
                style={styles.input}
                placeholder="Account Title"
                value={formData.accountTitle}
                onChangeText={v =>
                  setFormData({ ...formData, accountTitle: v })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Account Number"
                value={formData.accountNumber}
                onChangeText={v =>
                  setFormData({ ...formData, accountNumber: v })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="IBAN"
                value={formData.iban}
                onChangeText={v => setFormData({ ...formData, iban: v })}
              />

              <TextInput
                style={styles.input}
                placeholder="Opening Balance"
                value={formData.openingBalance}
                onChangeText={v =>
                  setFormData({ ...formData, openingBalance: v })
                }
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BankListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F7' },

  listContainer2: {
    flexDirection: 'row',
    //padding: 20,
    backgroundColor: '#fff',
  },
  listText2: {  
    padding: 10,
    borderRadius: 6, color: '#2b2727' },


 addBtnBusinessmanagment: {
    backgroundColor: '#cfc6c6a9',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    marginVertical: 5,
    marginHorizontal: 10,
  },


  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
 
  headerTitle: { fontSize: 20, fontWeight: 'bold' },

  addBtnTop: {
    backgroundColor: '#0056B3',
    padding: 10,
    borderRadius: 6,
  },

  addBtnText: { color: '#fff' },

  statsRow: {
    padding: 15,
  },

  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  bankCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  bankNameText: { fontSize: 16, fontWeight: 'bold' },

  balanceText: { fontSize: 18, color: 'green' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },

  submitBtn: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  submitBtnText: { color: '#fff', fontWeight: 'bold' },
});

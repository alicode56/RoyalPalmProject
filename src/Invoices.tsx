import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native'; 
import { getVendorInvoices, createVendorInvoice } from './services/invoicesServices';

const Invoices = () => {
  // 🔹 Dummy Data
  const [invoices, setInvoices] = useState([]);
  const [vendors] = useState([
    { id: 1, name: 'ABC Traders' },
    { id: 2, name: 'XYZ Suppliers' },
  ]);

  const fetchInvoices = async () => {
    try {
      const res = await getVendorInvoices();
      setInvoices(res);
    } catch (error) {
      console.log('error fetching invoices', error);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: '',
    invoice_number: '',
    date: 'April 2nd, 2026',
    amount: '',
    description: '',
    taxable: false,
  });

  // 🔹 ADD INVOICE (UI ONLY)
  const handleAddInvoice = async () => {
    if (!formData.vendorId || !formData.invoice_number || !formData.amount) {
      alert('Fill required fields');
      return;
    }

    try {
      const payload = {
        vendorId: formData.vendorId,
        invoiceNumber: formData.invoice_number,
        invoiceDate: new Date().toISOString(),
        amount: Number(formData.amount),
        description: formData.description,
        taxable: formData.taxable,
      };
      

      const res = await createVendorInvoice(payload);

      setInvoices(prev => [res, ...prev]);

      setModalVisible(false);

      setFormData({
        vendorId: '',
        invoice_number: '',
        date: 'April 2nd, 2026',
        amount: '',
        description: '',
        taxable: false,
      });
    } catch (error) {
      console.log(error.response?.data);
      alert('Error creating invoice');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Vendor Invoices</Text>
      <Text style={styles.subtitle}>Manage vendor invoices and payments</Text>

      {/* SEARCH */}
      <TextInput
        style={styles.search}
        placeholder="Search by vendor or invoice..."
        placeholderTextColor="#aaa"
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ Add Invoice</Text>
      </TouchableOpacity>

      {/* LIST */}
      <ScrollView style={{ marginTop: 10 }}>
        {invoices.length === 0 ? (
          <Text style={styles.empty}>No invoices found</Text>
        ) : (
          invoices.map(item => {
            const vendor = vendors.find(v => v.id === item.vendorId);
            return (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.invoice_number}</Text>
                <Text style={styles.cardSub}>
                  {vendor ? vendor.name : item.vendorId}
                </Text>
                <Text style={styles.cardAmount}>PKR {item.amount}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Invoice</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red' }}>X</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {/* Vendor */}
            <Text style={styles.label}>Vendor *</Text>
            {vendors.map(v => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.vendorItem,
                  formData.vendorId == v.id && { backgroundColor: '#dbeafe' },
                ]}
                onPress={() => setFormData({ ...formData, vendorId: v.id })}
              >
                <Text>{v.name}</Text>
              </TouchableOpacity>
            ))}

            {/* Invoice Number */}
            <Text style={styles.label}>Invoice Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="INV-001"
              value={formData.invoice_number}
              onChangeText={v =>
                setFormData({ ...formData, invoice_number: v })
              }
            />

            {/* Date */}
            <Text style={styles.label}>Invoice Date *</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={v => setFormData({ ...formData, date: v })}
            />

            {/* Amount */}
            <Text style={styles.label}>Amount (PKR) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              value={formData.amount}
              onChangeText={v => setFormData({ ...formData, amount: v })}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              placeholder="Add invoice description..."
              value={formData.description}
              onChangeText={v => setFormData({ ...formData, description: v })}
            />

            {/* Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() =>
                setFormData({ ...formData, taxable: !formData.taxable })
              }
            >
              <View
                style={[
                  styles.checkbox,
                  formData.taxable && styles.checkboxActive,
                ]}
              />
              <Text style={{ marginLeft: 10 }}>This invoice is taxable</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAddInvoice}
              >
                <Text style={{ color: '#fff' }}>Save Invoice</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Invoices;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },

  title: { color: '#000', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', marginBottom: 10 },

  search: {
    backgroundColor: '#b9c4d5',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    marginTop: 10,
  },

  addBtn: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  addBtnText: { color: '#fff', fontWeight: 'bold' },

  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 50 },

  card: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  cardTitle: { color: '#fff', fontWeight: 'bold' },
  cardSub: { color: '#94a3b8' },
  cardAmount: { color: '#22c55e', fontWeight: 'bold' },

  modalContainer: { flex: 1, backgroundColor: '#fff' },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: 'bold' },

  label: { marginTop: 10, marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },

  vendorItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 5,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
  },

  checkboxActive: {
    backgroundColor: '#3b82f6',
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  cancelBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
  },

  saveBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
  },
});

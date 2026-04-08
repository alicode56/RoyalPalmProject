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
  Platform,
} from 'react-native';
import api from '../services/axious'; // Ensure this path is correct

const BusinessLoansScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loans, setLoans] = useState([]);

  // Updated state keys to match DTO (businessId instead of businessName)
  const [formData, setFormData] = useState({
    businessId: '',
    type: 'Lending', // Strict enum value
    amount: '',
    loanDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    dueDate: '',
    paymentMode: 'Cash',
    description: '',
    remarks: '',
  });

  const handleCreateTransaction = async () => {
    // 1. Validation Logic
    if (
      !formData.businessId ||
      !formData.amount ||
      !formData.type ||
      !formData.loanDate
    ) {
      alert('Error: Please fill all fields marked with *');
      return;
    }

    try {
      // 2. Format Payload strictly for the Backend DTO
      const payload = {
        businessId: Number(formData.businessId), 
        type: formData.type,
        amount: Number(formData.amount), 
        loanDate: new Date(formData.loanDate).toISOString(), 
        description: formData.description || '',
        paymentMode: formData.paymentMode || 'Cash',
        remarks: formData.remarks || '',
        // dueDate and others are optional in DTO
        ...(formData.dueDate && {
          dueDate: new Date(formData.dueDate).toISOString(),
        }),
      };

      console.log('Sending Payload:', payload);

      const response = await api.post('/business-loans', payload);

      if (response.status === 200 || response.status === 201) {
        alert('Transaction Created Successfully!');
        // Ideally fetch list here: await fetchLoans();
        setModalVisible(false);
        resetForm();
      }
    } catch (error) {
      console.log('SERVER ERROR:', error.response?.data || error.message);
      // This will show you exactly which field failed validation
      const serverMessage =
        error.response?.data?.message || 'Check your inputs';
      alert('Validation Error: ' + JSON.stringify(serverMessage));
    }
  };

  const resetForm = () => {
    setFormData({
      businessId: '',
      type: 'Lending',
      amount: '',
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      paymentMode: 'Cash',
      description: '',
      remarks: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Business Loans & Borrowings</Text>
          <Text style={styles.subtitle}>
            Manage lending and borrowing transactions
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtnHeader}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {loans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No business loans found</Text>
        </View>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>ID: {item.businessId}</Text>
                <Text style={styles.cardTypeBadge}>{item.type}</Text>
              </View>
              <Text style={styles.cardAmount}>PKR {item.amount}</Text>
              <Text style={styles.cardDate}>Date: {item.loanDate}</Text>
            </View>
          )}
        />
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Add Business Loan/Borrowing
                </Text>
                <Text style={styles.modalSubtitle}>
                  Create a new transaction
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <Text style={styles.sectionHeading}>Basic Information</Text>

              <Text style={styles.label}>Business ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Numeric Business ID (e.g. 1)"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={formData.businessId.toString()}
                onChangeText={v => setFormData({ ...formData, businessId: v })}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Type (Lending/Borrowing) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Lending"
                    placeholderTextColor="#666"
                    value={formData.type}
                    onChangeText={v => setFormData({ ...formData, type: v })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Amount (PKR) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={formData.amount}
                    onChangeText={v => setFormData({ ...formData, amount: v })}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Loan Date *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#666"
                    value={formData.loanDate}
                    onChangeText={v =>
                      setFormData({ ...formData, loanDate: v })
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Due Date (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#666"
                    value={formData.dueDate}
                    onChangeText={v => setFormData({ ...formData, dueDate: v })}
                  />
                </View>
              </View>

              <Text style={styles.sectionHeading}>Payment Details</Text>
              <Text style={styles.label}>Payment Mode</Text>
              <TextInput
                style={styles.input}
                placeholder="Cash, Online, or Cheque"
                placeholderTextColor="#666"
                value={formData.paymentMode}
                onChangeText={v => setFormData({ ...formData, paymentMode: v })}
              />

              <Text style={styles.sectionHeading}>Additional Information</Text>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Enter description"
                placeholderTextColor="#666"
                multiline={true}
                value={formData.description}
                onChangeText={v => setFormData({ ...formData, description: v })}
              />

              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Additional notes"
                placeholderTextColor="#666"
                multiline={true}
                value={formData.remarks}
                onChangeText={v => setFormData({ ...formData, remarks: v })}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={handleCreateTransaction}
                >
                  <Text style={styles.createBtnText}>Create Transaction</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles remain identical to your original code
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'ios' ? 20 : 50,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D23',
  },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 11, marginTop: 2 },
  addBtnHeader: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0D1117',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '92%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  closeX: { color: '#FFF', fontSize: 22 },
  sectionHeading: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
    paddingBottom: 5,
  },
  label: { color: '#888', fontSize: 12, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 20,
  },
  row: { flexDirection: 'row' },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 15,
    alignItems: 'center',
  },
  cancelBtn: { paddingVertical: 10 },
  cancelBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  createBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  card: {
    backgroundColor: '#161B22',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardTypeBadge: {
    color: '#888',
    fontSize: 11,
    backgroundColor: '#0B0E14',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardAmount: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
  cardDate: { color: '#666', fontSize: 12, marginTop: 5 },
});

export default BusinessLoansScreen;

// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   TextInput,
//   ScrollView,
//   StatusBar,
//   Platform,
// } from 'react-native';

// const BusinessLoansScreen = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [loans, setLoans] = useState([]);

//   // DTO Credentials form data stste
//   const [formData, setFormData] = useState({
//     businessName: '',
//     type: 'Lending (We Lend)',
//     amount: '',
//     loanDate: '06/04/2026',
//     dueDate: '',
//     paymentMode: '',
//     description: '',
//     remarks: '',
//   });

//   const handleCreateTransaction = () => {
//     // Validation based on * markers in your screenshot
//     if (
//       !formData.businessName ||
//       !formData.amount ||
//       !formData.type ||
//       !formData.loanDate
//     ) {
//       alert('Error: Please fill all fields marked with *');
//       return;
//     }

//     const newTransaction = {
//       id: Math.random().toString(),
//       ...formData,
//     };

//     setLoans([...loans, newTransaction]);
//     setModalVisible(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       businessName: '',
//       type: 'Lending (We Lend)',
//       amount: '',
//       loanDate: '06/04/2026',
//       dueDate: '',
//       paymentMode: '',
//       description: '',
//       remarks: '',
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//     {/* //header area with tiltle add btn  */}
//       <View style={styles.headerTop}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.title}>Business Loans & Borrowings</Text>
//           <Text style={styles.subtitle}>
//             Manage lending and borrowing transactions
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={styles.addBtnHeader}
//           onPress={() => setModalVisible(true)}
//         >
//           <Text style={styles.addBtnText}>+ Add Transaction</Text>
//         </TouchableOpacity>
//       </View>

//       {/* List Area */}
//       {loans.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No business loans found</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={loans}
//           keyExtractor={item => item.id}
//           contentContainerStyle={{ padding: 15 }}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <View style={styles.cardRow}>
//                 <Text style={styles.cardTitle}>{item.businessName}</Text>
//                 <Text style={styles.cardTypeBadge}>{item.type}</Text>
//               </View>
//               <Text style={styles.cardAmount}>PKR {item.amount}</Text>
//               <Text style={styles.cardDate}>Date: {item.loanDate}</Text>
//             </View>
//           )}
//         />
//       )}

//       {/* --- MODAL (Strict Web Screenshot Mapping) --- */}
//       <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {/* Modal Header */}
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>
//                   Add Business Loan/Borrowing
//                 </Text>
//                 <Text style={styles.modalSubtitle}>
//                   Create a new lending or borrowing transaction
//                 </Text>
//               </View>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Text style={styles.closeX}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ paddingBottom: 40 }}
//             >
//               {/* SECTION: BASIC INFORMATION */}
//               <Text style={styles.sectionHeading}>Basic Information</Text>

//               <Text style={styles.label}>Business *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Select or enter business"
//                 placeholderTextColor="#666"
//                 value={formData.businessName}
//                 onChangeText={v =>
//                   setFormData({ ...formData, businessName: v })
//                 }
//               />

//               <View style={styles.row}>
//                 <View style={{ flex: 1, marginRight: 10 }}>
//                   <Text style={styles.label}>Type *</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.type}
//                     onChangeText={v => setFormData({ ...formData, type: v })}
//                   />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.label}>Amount (PKR) *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="0"
//                     placeholderTextColor="#666"
//                     keyboardType="numeric"
//                     value={formData.amount}
//                     onChangeText={v => setFormData({ ...formData, amount: v })}
//                   />
//                 </View>
//               </View>

//               <View style={styles.row}>
//                 <View style={{ flex: 1, marginRight: 10 }}>
//                   <Text style={styles.label}>Loan Date *</Text>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.loanDate}
//                     onChangeText={v =>
//                       setFormData({ ...formData, loanDate: v })
//                     }
//                   />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.label}>Due Date (Optional)</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="DD/MM/YYYY"
//                     placeholderTextColor="#666"
//                     value={formData.dueDate}
//                     onChangeText={v => setFormData({ ...formData, dueDate: v })}
//                   />
//                 </View>
//               </View>

//               {/* SECTION: PAYMENT DETAILS */}
//               <Text style={styles.sectionHeading}>Payment Details</Text>
//               <Text style={styles.label}>Payment Mode</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Select payment mode (e.g. Cash, Bank)"
//                 placeholderTextColor="#666"
//                 value={formData.paymentMode}
//                 onChangeText={v => setFormData({ ...formData, paymentMode: v })}
//               />

//               {/* SECTION: ADDITIONAL INFORMATION */}
//               <Text style={styles.sectionHeading}>Additional Information</Text>

//               <Text style={styles.label}>Description</Text>
//               <TextInput
//                 style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
//                 placeholder="Enter description or purpose of this transaction"
//                 placeholderTextColor="#666"
//                 multiline={true}
//                 value={formData.description}
//                 onChangeText={v => setFormData({ ...formData, description: v })}
//               />

//               <Text style={styles.label}>Remarks</Text>
//               <TextInput
//                 style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
//                 placeholder="Additional notes or comments"
//                 placeholderTextColor="#666"
//                 multiline={true}
//                 value={formData.remarks}
//                 onChangeText={v => setFormData({ ...formData, remarks: v })}
//               />

//               {/* STICKY ACTION BUTTONS */}
//               <View style={styles.modalFooter}>
//                 <TouchableOpacity
//                   style={styles.cancelBtn}
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <Text style={styles.cancelBtnText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.createBtn}
//                   onPress={handleCreateTransaction}
//                 >
//                   <Text style={styles.createBtnText}>Create Transaction</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#1a1a2e' },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//     paddingTop: Platform.OS === 'ios' ? 20 : 50, // Added extra margin for top suitability
//     borderBottomWidth: 1,
//     borderBottomColor: '#1A1D23',
//   },
//   title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//   subtitle: { color: '#888', fontSize: 11, marginTop: 2 },
//   addBtnHeader: {
//     backgroundColor: '#FFF',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//   },
//   addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },

//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   emptyText: { color: '#444', fontSize: 14 },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#0D1117',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: '92%',
//     padding: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 25,
//   },
//   modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
//   modalSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
//   closeX: { color: '#FFF', fontSize: 22 },

//   sectionHeading: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#30363D',
//     paddingBottom: 5,
//   },
//   label: { color: '#888', fontSize: 12, marginBottom: 8, fontWeight: '500' },
//   input: {
//     backgroundColor: '#161B22',
//     borderWidth: 1,
//     borderColor: '#30363D',
//     borderRadius: 8,
//     padding: 12,
//     color: '#FFF',
//     marginBottom: 20,
//   },
//   row: { flexDirection: 'row' },

//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//     gap: 15,
//     alignItems: 'center',
//   },
//   cancelBtn: { paddingVertical: 10 },
//   cancelBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
//   createBtn: {
//     backgroundColor: '#FFF',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   createBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },

//   card: {
//     backgroundColor: '#161B22',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 12,
//     marginHorizontal: 15,
//     borderWidth: 1,
//     borderColor: '#30363D',
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   cardTypeBadge: {
//     color: '#888',
//     fontSize: 11,
//     backgroundColor: '#0B0E14',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   cardAmount: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
//   cardDate: { color: '#666', fontSize: 12, marginTop: 5 },
// });

// export default BusinessLoansScreen;

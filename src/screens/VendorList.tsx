// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   ScrollView,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import axios from 'axios';

// const VendorList = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('Personal');
//   const [loading, setLoading] = useState(false);
//   const [vendors, setVendors] = useState([]); // API se aane wala data yahan save hoga

//   // Form States (Web dashboard ke fields ke mutabiq) [cite: 1]
//   const [vendorNum, setVendorNum] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [cnic, setCnic] = useState('');
//   const [address, setAddress] = useState('');
//   const [contactPerson, setContactPerson] = useState('');
//   const [email, setEmail] = useState('');
//   const [vendorType, setVendorType] = useState('Material');

//   // 1. GET API: Vendors ki list mangwane ke liye
//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       // API HERE: Neeche wala URL apni API se badal dein
//       const response = await axios.get('http://192.168.1.25:3000/api/vendors');
//       console.log('Fetched Vendors:', response.data);
//       setVendors(response.data);
//     } catch (error) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   // 2. POST API: Naya Vendor save karne ke liye [cite: 1]
//   const handleCreateVendor = async () => {
//     const payload = {
//       vendor_number: vendorNum,
//       name: vendorName,
//       cnic: cnic,
//       address: address,
//       contact_person: contactPerson,
//       email: email,
//       type: vendorType,
//     };
    

//     try {
//       setLoading(true);
//       // API HERE: Naya vendor save karne ka endpoint yahan likhein
//       await axios.post('http://192.168.1.25:3000/api/vendors/add', payload);

//       alert('Vendor Created Successfully!');
//       setModalVisible(false);
//       fetchVendors(); // List refresh karne ke liye
//     } catch (error) {
//       alert('Error saving vendor');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header [cite: 2] */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>My Society: Vendors</Text>
//         <TouchableOpacity
//           style={styles.addBtn}
//           onPress={() => setModalVisible(true)}
//         >
//           <Text style={styles.addBtnText}>+ Add Vendor</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar [cite: 2] */}
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by name, CNIC, or vendor number..."
//         placeholderTextColor='#999'
//       />

//       {loading && <ActivityIndicator size="large" color="#1a1a2e" />}

//       {/* Vendors Table/List [cite: 2] */}
//       <FlatList
//         data={vendors}
//         keyExtractor={item => item.id.toString()}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No vendors found</Text>
//         }
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.vNum}>#{item.vendor_number}</Text>
//               <Text style={styles.vType}>{item.type}</Text>
//             </View>
//             <Text style={styles.vName}>{item.name}</Text>
//             <Text style={styles.vInfo}>CNIC: {item.cnic}</Text>
//             <Text style={styles.vInfo}>Contact: {item.contact_person}</Text>
//           </View>
//         )}
//       />

//       {/* Add Vendor Modal [cite: 1] */}
//       <Modal visible={isModalVisible} animationType="slide">
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Add New Vendor</Text>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>  
//               <Text style={{ color: 'red', fontWeight: 'bold' }}>CANCEL</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Tabs Section [cite: 1] */}
//           <View style={styles.tabBar}>
//             {['Personal', 'Contact', 'Financial'].map(t => (
//               <TouchableOpacity
//                 key={t}
//                 onPress={() => setActiveTab(t)}
//                 style={[styles.tab, activeTab === t && styles.activeTab]}
//               >
//                 <Text
//                   style={
//                     activeTab === t ? styles.activeTabText : styles.tabText
//                   }
//                 >
//                   {t}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <ScrollView style={{ padding: 20 }}>
//             {activeTab === 'Personal' && (
//               <View>
//                 <Text style={styles.label}>Vendor Number</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={vendorNum}
//                   onChangeText={setVendorNum}
//                   placeholder="Enter number"
//                 />
//                 <Text style={styles.label}>Vendor Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={vendorName}
//                   onChangeText={setVendorName}
//                   placeholder="Enter name"
//                 />
//                 <Text style={styles.label}>CNIC</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={cnic}
//                   onChangeText={setCnic}
//                   placeholder="XXXXX-XXXXXXXXXXX-X"
//                 />
//                 <Text style={styles.label}>Address</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={address}
//                   onChangeText={setAddress}
//                   placeholder="Enter address"
//                 />
//               </View>
//             )}

//             {activeTab === 'Contact' && (
//               <View>
//                 <Text style={styles.label}>Contact Person Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={contactPerson}
//                   onChangeText={setContactPerson}
//                   placeholder="Enter person name"
//                 />
//                 <Text style={styles.label}>Email Address</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="Enter email"
//                   keyboardType="email-address"
//                 />
//               </View>
//             )}

//             {activeTab === 'Financial' && (
//               <View>
//                 <Text style={styles.label}>Vendor Type</Text> 
//                 <TouchableOpacity
//                   style={styles.input} 
//                   onPress={() => setVendorType('Material')} 
//                 > 
//                   <Text>{vendorType} (Click to change)</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </ScrollView>

//           <TouchableOpacity style={styles.saveBtn} onPress={handleCreateVendor}>
//             <Text style={styles.saveBtnText}>CREATE VENDOR</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default VendorList;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f0f2f5' },
//   header: {
//     backgroundColor: '#1a1a2e',
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//   addBtn: { backgroundColor: '#4e73df', padding: 10, borderRadius: 6 },
//   addBtnText: { color: 'white', fontWeight: 'bold' },
//   searchBar: {
//     backgroundColor: 'white',
//     margin: 15,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     color: '#000',
//   },
//   card: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginBottom: 12,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   vNum: { color: '#4e73df', fontWeight: 'bold' },
//   vType: {
//     fontSize: 10,
//     backgroundColor: '#eef2ff',
//     padding: 4,
//     borderRadius: 4,
//     color: '#4e73df',
//   },
//   vName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
//   vInfo: { fontSize: 13, color: '#666', marginTop: 4 },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
//   modalContent: { flex: 1, backgroundColor: 'white' },
//   modalHeader: {
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: { fontSize: 20, fontWeight: 'bold' },
//   tabBar: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: '#f9f9f9',
//   },
//   tab: { flex: 1, padding: 15, alignItems: 'center' },
//   activeTab: { borderBottomWidth: 3, borderBottomColor: '#1a1a2e' },
//   tabText: { color: '#888' },
//   activeTabText: { color: '#1a1a2e', fontWeight: 'bold' },
//   label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 15 },
//   input: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     paddingVertical: 8,
//     fontSize: 16,
//     color: '#000',
//   },
//   saveBtn: {
//     backgroundColor: '#1a1a2e',
//     margin: 20,
//     padding: 18,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
// });

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VendorList = () => {
  return (
    <View>
      <Text>VendorList</Text>
    </View>
  )
}

export default VendorList

const styles = StyleSheet.create({})
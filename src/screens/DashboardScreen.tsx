import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const DashboardScreen = ({ navigation }) => {
  // Summary Data (Baad mein API se aayega)
  const stats = [
    { id: '1', title: 'Total Vendors', value: '0', color: '#4e73df' },
    { id: '2', title: 'Active Invoices', value: '0', color: '#1cc88a' },
    { id: '3', title: 'Pending Payments', value: 'PKR 0', color: '#f6c23e' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Royal Palm Dashboard</Text>
        <Text style={styles.subTitle}>Welcome, Admin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Stats Cards */}
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

        {/* Quick Actions / Navigation */}
        <Text style={styles.sectionTitle}>Quick Management</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('VendorList')}
        >
          <View style={styles.iconPlaceholder} />
          <View>
            <Text style={styles.menuText}>Vendors Management</Text>
            <Text style={styles.menuSubText}>View and add new vendors</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Invoices')}
        >
          <View
            style={[styles.iconPlaceholder, { backgroundColor: '#1cc88a' }]}
          />
          <View>
            <Text style={styles.menuText}>Vendor Invoices</Text>
            <Text style={styles.menuSubText}>Manage bills and payments</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('BankCash')}
        >
          <View
            style={[styles.iconPlaceholder, { backgroundColor: '#f6c23e' }]}
          />
          <View>
            <Text style={styles.menuText}>Bank & Cash</Text>
            <Text style={styles.menuSubText}>
              Check society accounts balance
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    borderLeftWidth: 5,
  },
  statTitle: { fontSize: 12, color: '#555', fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
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
  menuText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  menuSubText: { fontSize: 12, color: '#777' },
});

// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (email.trim() === '' || password.trim() === '') {
//       alert('Please fill all fields');
//       return;
//     }

//     try {
//       console.log('Calling login API with:', email);
//       const response = await fetch('http://192.168.1.25:3000/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Login failed:', response.status, errorText);
//         alert('Login failed: ' + response.status);
//         return;
//       }

//       const data = await response.json();
//       console.log('Login successful:', data);
//       // TODO: store token and navigate to home/dashboard
//       // navigation.navigate('Dashboard');

//       alert('Login successful!');
//     } catch (error) {
//       console.error('Login API error:', error);
//       alert('Login API error: ' + error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.logoContainer}>
//           {/* Logo ki jagah text ya image laga sakte hain */}
//           <Text style={styles.logoText}>Royal Palm</Text>
//           <Text style={styles.subLogoText}>Society Management System</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.loginHeader}>Login to your account</Text>

//           <View style={styles.inputWrapper}>
//             <Text style={styles.label}>Email Address</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="enter email"
//               placeholderTextColor="#999"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputWrapper}>
//             <Text style={styles.label}>Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="enter password"
//               placeholderTextColor="#999"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//             />
//           </View>

//           <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Dashboard')}>
//             <Text style={styles.loginButtonText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.forgotBtn}>
//             <Text style={styles.forgotText}>Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1a1a2e', // Dark theme like your web dashboard
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 50,
//   },
//   logoText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   subLogoText: {
//     color: '#aaa',
//     fontSize: 14,
//   },
//   formContainer: {
//     backgroundColor: '#fff',
//     padding: 25,
//     borderRadius: 15,
//     elevation: 5,
//   },
//   loginHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 25,
//     color: '#333',
//     textAlign: 'center',
//   },
//   inputWrapper: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 8,
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#000',
//   },
//   loginButton: {
//     backgroundColor: '#1a1a2e',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   forgotBtn: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   forgotText: {
//     color: '#1a1a2e',
//     fontSize: 14,
//   },
// });

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/axious';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // const handleLogin = async () => {
  //   if (username.trim() === '' || password.trim() === '') {
  //     alert('Please fill all fields');
  //     return;
  //   }

  //   try {
  //     console.log('Calling login API with:', username);
  //     const response = await fetch('http://192.168.1.25:3000/api/users/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username: username, password: password }),
  //     });

  //     // if (!response.ok) {
  //     //   const errorText = await response.text();
  //     //   console.error('Login failed:', response.status, errorText);
  //     //   alert('Login failed: ' + response.status);
  //     //   return;
  //     // }

  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log('Login failed:', data);
  //       alert(data.message || 'Login failed');
  //       return;
  //     }

  //     console.log('Login successful:', data);
  //     // TODO: store token and navigate to home/dashboard
  //     // navigation.navigate('Dashboard');
  //     await AsyncStorage.setItem('userToken', data.token);

  //     alert('Login successful!');
  //     navigation.navigate('Dashboard');
  //   } catch (error) {
  //     console.error('API error:', error);
  //     alert('Server  error: ' + error);
  //   }
  // };


  const handleLogin = async () => {
  // ... (validation code)

 try {
  const response = await api.post('/users/login', {
    username: username,
    password: password,
  });

  const data = response.data;

  await AsyncStorage.setItem('userToken', data.token);

  console.log('Token Saved:', data.token);
  alert('Login successful!');
  navigation.navigate('Dashboard');

} catch (error) {
  console.log('Error:', error);
}
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          {/* Logo ki jagah text ya image laga sakte hain */}
          <Text style={styles.logoText}>Royal Palm</Text>
          <Text style={styles.subLogoText}>Society Management System</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.loginHeader}>Login to your account</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="enter email"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="enter password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Dark theme like your web dashboard
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subLogoText: {
    color: '#aaa',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    elevation: 5,
  },
  loginHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotBtn: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotText: {
    color: '#1a1a2e',
    fontSize: 14,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Map, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <UserIcon size={40} color="#78716c" />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyPlots')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#fff7ed' }]}>
                <Map size={20} color="#ea580c" />
              </View>
              <Text style={styles.menuItemText}>My Plots</Text>
            </View>
            <ChevronRight size={20} color="#d6d3d1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut color="#dc2626" size={20} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f4', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 22, fontWeight: '900', color: '#1c1917' },
  email: { fontSize: 14, color: '#78716c', marginTop: 4 },
  roleBadge: { backgroundColor: '#f5f5f4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 12 },
  roleText: { fontSize: 10, fontWeight: '900', color: '#444' },
  section: { marginBottom: 40 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'between', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f5f5f4' 
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuItemText: { fontSize: 16, fontWeight: '700', color: '#1c1917' },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#fee2e2',
    backgroundColor: '#fff'
  },
  logoutText: { color: '#dc2626', fontWeight: '700', marginLeft: 8 }
});

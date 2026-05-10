import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Map, ShieldCheck } from 'lucide-react-native';
import api from '../../api';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState({ users: 0, plots: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, l] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/lands')
        ]);
        setStats({ users: u.data.data.length, plots: l.data.data.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C2410C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Admin Dashboard</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users color="#3b82f6" size={32} />
            <Text style={styles.statValue}>{stats.users}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <Map color="#10b981" size={32} />
            <Text style={styles.statValue}>{stats.plots}</Text>
            <Text style={styles.statLabel}>Total Plots</Text>
          </View>
        </View>

        <View style={styles.systemCard}>
          <ShieldCheck color="#C2410C" size={24} />
          <Text style={styles.systemText}>All Systems Operational</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: '900', color: '#1c1917', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { 
    backgroundColor: '#fff', 
    width: '48%', 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e7e5e4',
    alignItems: 'center'
  },
  statValue: { fontSize: 24, fontWeight: '900', color: '#1c1917', marginTop: 10 },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#78716c', marginTop: 4 },
  systemCard: { 
    backgroundColor: '#1c1917', 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  systemText: { color: '#fff', marginLeft: 12, fontWeight: '700' }
});

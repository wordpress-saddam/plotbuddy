import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusCircle } from 'lucide-react-native';

export default function RegisterPlotScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <PlusCircle color="#C2410C" size={32} />
          <Text style={styles.title}>Register New Plot</Text>
        </View>
        <Text style={styles.description}>
          Follow the steps to list your property for commercial use.
        </Text>
        
        {/* Placeholder for form steps */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Form Implementation Coming Soon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '900', color: '#1c1917', marginLeft: 12 },
  description: { fontSize: 16, color: '#78716c', marginBottom: 24 },
  placeholderCard: { 
    height: 300, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderColor: '#e7e5e4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: { color: '#a8a29e', fontWeight: '700' }
});

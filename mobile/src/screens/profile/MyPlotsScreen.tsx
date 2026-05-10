import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import api from '../../api';
import PlotCard from '../../components/PlotCard';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function MyPlotsScreen() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const fetchMyPlots = async () => {
    try {
      const response = await api.get('/lands/my-plots');
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch my plots', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyPlots();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyPlots();
  };

  if (loading) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-stone-50">
        <ActivityIndicator size="large" color="#C2410C" />
      </StyledView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-stone-50" edges={['top']}>
      <StyledView className="px-6 py-4 flex-row justify-between items-center">
        <StyledView className="flex-row items-center">
          <StyledTouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ArrowLeft size={24} color="#1c1917" />
          </StyledTouchableOpacity>
          <StyledText className="text-2xl font-black text-stone-900">My Plots</StyledText>
        </StyledView>
        
        <StyledTouchableOpacity 
          onPress={() => navigation.navigate('List Plot')}
          className="bg-primary p-2 rounded-full"
        >
          <Plus size={20} color="#fff" />
        </StyledTouchableOpacity>
      </StyledView>

      <FlatList
        data={plots}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
          <PlotCard 
            plot={item} 
            onPress={() => navigation.navigate('PlotDetail', { plot: item })} 
          />
        )}
        ListEmptyComponent={() => (
          <StyledView className="flex-1 items-center justify-center pt-20 px-10">
            <StyledText className="text-stone-400 font-bold text-center text-lg">
              You haven't listed any plots yet.
            </StyledText>
            <StyledTouchableOpacity 
              onPress={() => navigation.navigate('List Plot')}
              className="mt-6 bg-stone-900 px-8 py-4 rounded-2xl"
            >
              <StyledText className="text-white font-black">Register Your First Plot</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C2410C" />
        }
      />
    </SafeAreaView>
  );
}

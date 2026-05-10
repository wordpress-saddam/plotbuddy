import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import api from '../../api';
import PlotCard from '../../components/PlotCard';
import { useNavigation } from '@react-navigation/native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function HomeScreen() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Filter states
  const [minArea, setMinArea] = useState('');
  const [maxRent, setMaxRent] = useState('');

  const navigation = useNavigation<any>();

  const fetchPlots = async () => {
    try {
      const response = await api.get('/lands');
      if (response.data.success) {
        setPlots(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch plots', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlots();
  };

  const filteredPlots = useMemo(() => {
    return plots.filter((plot: any) => {
      const matchesSearch = plot.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           plot.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArea = minArea ? plot.area >= parseFloat(minArea) : true;
      const matchesRent = maxRent ? plot.monthlyRent <= parseFloat(maxRent) : true;

      return matchesSearch && matchesArea && matchesRent;
    });
  }, [plots, searchQuery, minArea, maxRent]);

  if (loading) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-stone-50">
        <ActivityIndicator size="large" color="#C2410C" />
      </StyledView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-stone-50" edges={['top']}>
      {/* Search Header */}
      <StyledView className="px-5 pt-4 pb-2">
        <StyledView className="flex-row items-center space-x-3">
          <StyledView className="flex-1 flex-row items-center bg-white rounded-2xl px-4 h-14 border border-stone-200 shadow-sm">
            <Search size={20} color="#a8a29e" />
            <StyledTextInput 
              placeholder="Search by location or title..."
              className="flex-1 ml-3 font-bold text-stone-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#a8a29e"
            />
          </StyledView>
          
          <StyledTouchableOpacity 
            onPress={() => setIsFilterVisible(true)}
            className={`ml-3 h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm ${minArea || maxRent ? 'bg-primary border-primary' : 'bg-white border-stone-200'}`}
          >
            <SlidersHorizontal size={20} color={minArea || maxRent ? '#fff' : '#1c1917'} />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <FlatList
        data={filteredPlots}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
          <PlotCard 
            plot={item} 
            onPress={() => navigation.navigate('PlotDetail', { plot: item })} 
          />
        )}
        ListHeaderComponent={() => (
          <StyledView className="px-5 pt-4 pb-2">
            <StyledText className="text-stone-500 font-black text-xs uppercase tracking-widest">
              {filteredPlots.length} Plots Found
            </StyledText>
          </StyledView>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C2410C" />
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
      >
        <StyledView className="flex-1 justify-end bg-black/40">
          <StyledView className="bg-white rounded-t-[40px] px-8 pt-8 pb-12 shadow-2xl">
            <StyledView className="flex-row justify-between items-center mb-8">
              <StyledText className="text-2xl font-black text-stone-900">Filters</StyledText>
              <StyledTouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <X size={24} color="#1c1917" />
              </StyledTouchableOpacity>
            </StyledView>

            <ScrollView showsVerticalScrollIndicator={false}>
              <StyledView className="space-y-6">
                <StyledView>
                  <StyledText className="text-sm font-black text-stone-400 uppercase tracking-widest mb-3">Minimum Area (Sq Yards)</StyledText>
                  <StyledTextInput 
                    keyboardType="numeric"
                    placeholder="e.g. 500"
                    value={minArea}
                    onChangeText={setMinArea}
                    className="bg-stone-50 border border-stone-100 rounded-2xl p-5 font-bold text-stone-900"
                  />
                </StyledView>

                <StyledView className="mt-6">
                  <StyledText className="text-sm font-black text-stone-400 uppercase tracking-widest mb-3">Maximum Monthly Rent (₹)</StyledText>
                  <StyledTextInput 
                    keyboardType="numeric"
                    placeholder="e.g. 50000"
                    value={maxRent}
                    onChangeText={setMaxRent}
                    className="bg-stone-50 border border-stone-100 rounded-2xl p-5 font-bold text-stone-900"
                  />
                </StyledView>
              </StyledView>

              <StyledView className="flex-row space-x-4 mt-12">
                <StyledTouchableOpacity 
                  onPress={() => { setMinArea(''); setMaxRent(''); }}
                  className="flex-1 h-16 bg-stone-100 rounded-2xl justify-center items-center mr-2"
                >
                  <StyledText className="text-stone-900 font-black">Reset</StyledText>
                </StyledTouchableOpacity>
                
                <StyledTouchableOpacity 
                  onPress={() => setIsFilterVisible(false)}
                  className="flex-2 bg-stone-900 h-16 rounded-2xl justify-center items-center ml-2 px-12"
                >
                  <StyledText className="text-white font-black text-lg">Apply Filters</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </ScrollView>
          </StyledView>
        </StyledView>
      </Modal>
    </SafeAreaView>
  );
}

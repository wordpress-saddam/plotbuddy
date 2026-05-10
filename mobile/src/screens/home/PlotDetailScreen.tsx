import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { 
  ArrowLeft, 
  MapPin, 
  Maximize2, 
  Droplet, 
  Zap, 
  Shield,
  Phone,
  Share2
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PlotDetailScreen({ route }: any) {
  const { plot } = route.params;
  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this plot on PlotBuddy: ${plot.title} at ${plot.address}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const AmenityItem = ({ icon: Icon, label, available }: any) => (
    <StyledView className="flex-row items-center bg-stone-100 px-4 py-3 rounded-2xl mr-3 mb-3">
      <Icon size={18} color={available ? '#C2410C' : '#a8a29e'} />
      <StyledText className={`ml-2 font-bold ${available ? 'text-stone-900' : 'text-stone-400'}`}>
        {label}
      </StyledText>
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-white">
      {/* Custom Header */}
      <StyledView className="absolute top-12 left-6 right-6 z-10 flex-row justify-between items-center">
        <StyledTouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-white/90 p-3 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} color="#1c1917" />
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity 
          onPress={handleShare}
          className="bg-white/90 p-3 rounded-full shadow-sm"
        >
          <Share2 size={20} color="#1c1917" />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <StyledImage 
          source={{ uri: plot.images?.[0] || 'https://via.placeholder.com/600x400' }}
          className="w-full h-96 bg-stone-100"
          resizeMode="cover"
        />

        <StyledView className="px-6 pt-8 pb-32">
          <StyledView className="flex-row justify-between items-start">
            <StyledView className="flex-1">
              <StyledText className="text-3xl font-black text-stone-900 leading-tight">
                {plot.title}
              </StyledText>
              <StyledView className="flex-row items-center mt-3">
                <MapPin size={16} color="#C2410C" />
                <StyledText className="text-stone-500 font-bold ml-1 text-sm">
                  {plot.address}
                </StyledText>
              </StyledView>
            </StyledView>
            
            <StyledView className="bg-primary/10 px-4 py-2 rounded-2xl">
              <StyledText className="text-primary font-black text-lg">
                ₹ {plot.monthlyRent.toLocaleString()}
              </StyledText>
              <StyledText className="text-primary/60 text-[10px] font-black text-center">PER MONTH</StyledText>
            </StyledView>
          </StyledView>

          <StyledView className="flex-row mt-8 pt-8 border-t border-stone-100">
            <StyledView className="flex-1 items-center border-r border-stone-100">
              <Maximize2 size={24} color="#C2410C" />
              <StyledText className="text-stone-900 font-black text-lg mt-1">{plot.area}</StyledText>
              <StyledText className="text-stone-400 text-xs font-bold uppercase">Sq Yards</StyledText>
            </StyledView>
            
            <StyledView className="flex-1 items-center">
              <Shield size={24} color="#C2410C" />
              <StyledText className="text-stone-900 font-black text-lg mt-1">Verified</StyledText>
              <StyledText className="text-stone-400 text-xs font-bold uppercase">Security</StyledText>
            </StyledView>
          </StyledView>

          <StyledText className="text-xl font-black text-stone-900 mt-10 mb-4">Amenities</StyledText>
          <StyledView className="flex-row flex-wrap">
            <AmenityItem icon={Shield} label="Fencing" available={plot.amenities.fencing} />
            <AmenityItem icon={Droplet} label="Water" available={plot.amenities.water} />
            <AmenityItem icon={Zap} label="Electricity" available={plot.amenities.electricity} />
          </StyledView>

          <StyledText className="text-xl font-black text-stone-900 mt-10 mb-4">Location</StyledText>
          <StyledView className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
             <StyledText className="text-stone-600 font-medium leading-relaxed">
               {plot.address}
             </StyledText>
             {plot.googleMapsLink && (
               <StyledTouchableOpacity className="mt-4">
                 <StyledText className="text-primary font-black">Open in Google Maps</StyledText>
               </StyledTouchableOpacity>
             )}
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Floating Bottom Button */}
      <StyledView className="absolute bottom-10 left-6 right-6 flex-row">
        <StyledTouchableOpacity 
          className="flex-1 bg-stone-900 h-16 rounded-2xl flex-row justify-center items-center shadow-lg shadow-stone-400"
        >
          <Phone size={20} color="#fff" className="mr-2" />
          <StyledText className="text-white font-black text-lg ml-2">Contact Owner</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPin, Maximize2 } from 'lucide-react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface PlotCardProps {
  plot: any;
  onPress: () => void;
}

export default function PlotCard({ plot, onPress }: PlotCardProps) {
  return (
    <StyledTouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-3xl overflow-hidden border border-stone-200 mb-6 shadow-sm"
    >
      <StyledImage 
        source={{ uri: plot.images?.[0] || 'https://via.placeholder.com/400x200' }}
        className="w-full h-48 bg-stone-100"
        resizeMode="cover"
      />
      
      <StyledView className="p-5">
        <StyledView className="flex-row justify-between items-start">
          <StyledView className="flex-1">
            <StyledText className="text-xl font-black text-stone-900 leading-tight">
              {plot.title}
            </StyledText>
            <StyledView className="flex-row items-center mt-2">
              <MapPin size={14} color="#78716c" />
              <StyledText className="text-stone-500 text-xs ml-1 font-bold">
                {plot.address}
              </StyledText>
            </StyledView>
          </StyledView>
          
          <StyledView className="bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
            <StyledText className="text-primary font-black text-sm">
              ₹ {plot.monthlyRent.toLocaleString()}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledView className="flex-row items-center mt-4 pt-4 border-t border-stone-50">
          <StyledView className="flex-row items-center mr-4">
            <Maximize2 size={14} color="#78716c" />
            <StyledText className="text-stone-500 text-xs ml-1 font-bold">
              {plot.area} sq yards
            </StyledText>
          </StyledView>
          
          <StyledView className="bg-stone-100 px-2 py-1 rounded-lg">
            <StyledText className="text-[10px] font-black text-stone-500 uppercase tracking-tighter">
              {plot.isPublished ? 'Active' : 'Private'}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );
}

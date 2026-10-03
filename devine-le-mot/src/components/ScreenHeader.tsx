import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/theme';
import {feedback} from '../services/feedbackService';
import {useNavigation} from '../navigation/NavigationContext';

export function ScreenHeader({title}: {title: string}) {
  const nav = useNavigation();
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        style={({pressed}) => [styles.back, pressed && styles.backPressed]}
        onPress={() => {
          feedback.tap();
          nav.goBack();
        }}>
        <Text style={styles.backText}>‹</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.back} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12},
  back: {width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.anthracite},
  backPressed: {transform: [{scale: 0.94}], backgroundColor: COLORS.redDarker},
  backText: {color: COLORS.redLight, fontSize: 30, marginTop: -4, fontWeight: '700'},
  title: {color: COLORS.text, fontSize: 20, fontWeight: '800', letterSpacing: 1},
});

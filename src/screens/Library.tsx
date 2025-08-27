import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Library() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>홈 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});

export default Library;
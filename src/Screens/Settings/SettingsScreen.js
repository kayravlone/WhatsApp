import { View, Text, Button } from 'react-native'
import React from 'react';
import styles from './SettingsScreen.style';
import { Auth } from 'aws-amplify';

const SettingsScreen = () => {
    const onSignOut = () => {
        Auth.signOut();
    }
  return (
    <View style={styles.container} >
      <Button title='Sign Out' onPress={onSignOut} ></Button>
    </View>
  )
}

export default SettingsScreen
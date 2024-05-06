import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import { ProfileStackProps } from '../types/index';
import { rightArrowImage } from '../utils/image';
import { avatarImage } from '../utils/image';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileProps {
  navigation: ProfileStackProps['navigation']
};

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage 已清除');
    } catch (e) {
      console.error('清除 AsyncStorage 出错:', e);
    }
  };

  return (
    <Layout navigation={navigation}>
      {/* 这里是 Profile 页面特有的内容 */}
      <View style={styles.profileContain}>

        <View style={styles.profilePhoto}>
          <Image source={avatarImage} />
        </View>

        <Text style={styles.profileName}>名稱</Text>

        <View style={styles.profile}>
          <View style={styles.profileBox}>
            <Text style={styles.profileTitle}>歷史紀錄</Text>
            <Image source={rightArrowImage} style={styles.profileAngle} />
          </View>
          <View style={styles.profileBox}>
            <Text style={styles.profileTitle}>夜晚模式</Text>
            <Image source={rightArrowImage} style={styles.profileAngle} />
          </View>
          <View style={styles.profileBox}>
            <Text style={styles.profileTitle}>關於我們</Text>
            <Image source={rightArrowImage} style={styles.profileAngle} />
          </View>
          <TouchableOpacity
            style={styles.profileBox}
            onPress={() => clearAsyncStorage()}
          >
            <Text style={styles.profileTitle}>清除資料</Text>
            <Image source={rightArrowImage} style={styles.profileAngle} />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  profileContain: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  profilePhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 50,
    marginTop: 20,
  },
  profileName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  profile: {
    width: '95%',
  },
  profileBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 32,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileAngle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  }
});

export default Profile;
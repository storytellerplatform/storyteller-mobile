import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Layout from '../components/Layout';
import { ProfileStackProps } from '../types/index';
import { rightArrowImage } from '../utils/image';
import { avatarImage } from '../utils/image';

interface ProfileProps {
  navigation: ProfileStackProps['navigation']
};

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
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
    fontSize: 24,
    fontWeight: '500'
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
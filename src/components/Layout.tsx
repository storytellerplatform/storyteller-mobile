import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { LayoutStackProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookImage, homeImage, pBookImage, pHomeImage, pRankImage, pSearchImage, pSettingsImage, rankImage, searchImage, settingsImage } from '../utils/image';
import { useRoute } from '@react-navigation/native';

interface LayoutProps {
  navigation: LayoutStackProps['navigation']
  children?: ReactNode
  showBackButton?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, navigation, showBackButton }) => {
  const route = useRoute();

  const isCurrentRoute = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          {children}
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
            {
              isCurrentRoute('Home') ?
                <Image style={styles.image} source={pHomeImage} /> :
                <Image style={styles.image} source={homeImage} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Library')}>
            {
              isCurrentRoute('Library') ?
                <Image style={styles.image} source={pBookImage} /> :
                <Image style={styles.image} source={bookImage} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Search')}>
            {
              isCurrentRoute('Search') ?
                <Image style={styles.image} source={pSearchImage} /> :
                <Image style={styles.image} source={searchImage} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Rank')}>
            {
              isCurrentRoute('Rank') ?
                <Image style={styles.image} source={pRankImage} /> :
                <Image style={styles.image} source={rankImage} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
            {
              isCurrentRoute('Profile') ?
                <Image style={styles.image} source={pSettingsImage} /> :
                <Image style={styles.image} source={settingsImage} />
            }
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />
    </>
  );
};

export default Layout;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#ffffff', // 自定义颜色
    borderTopWidth: 2,
    borderTopColor: '#d6d6d6',
  },
  menuItem: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginBottom: 20
  },
  image: {
    width: 30,
    height: 30,
  },
});
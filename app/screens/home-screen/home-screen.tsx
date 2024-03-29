import React, { useEffect, useState } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { debounce } from 'lodash';
import { useStore } from '../../models/stores/root-store';
import ImageCell from '../../components/image-cell/image-cell';
import SearchBar from '../../components/search-bar/search-bar';
import ResetStore from './utils/reset-store';
import styles from './home-screen.style';
import NoNetwork from '../../components/no-network/no-network';
import Config from 'react-native-config';

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { userStore } = useStore();
  const NetInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    console.log(
      '🚀 ~ file: home-screen.tsx ~ line 28 ~ useEffect ~ Config.APP_ENV',
      Config.APP_ENV,
    );

    return () => {
      ResetStore();
    };
  }, []);

  useEffect(() => {
    setIsConnected(NetInfo.isConnected);
  }, [NetInfo]);

  const onPageFinish = debounce(() => {
    userStore.setPageNumber(userStore.getPageNumber() + 1);
    userStore.fetchImageAction({
      searchValue: userStore.getSearchValue(),
      page: userStore.getPageNumber().toString(),
      isPageRefreshing: false,
    });
  }, 1000);

  const onSearch = debounce((text: string, isPageRefreshing: boolean) => {
    userStore.fetchImageAction({
      searchValue: text,
      page: '1',
      isPageRefreshing,
    });
  }, 1000);

  const onChangeText = (
    text: string,
    onChangeLocalSearchValue: (text: string) => void,
  ) => {
    userStore.setSearchResult([]);
    userStore.setPageNumber(1);
    onChangeLocalSearchValue(text);

    if (text) {
      onSearch(text, false);
    }
  };

  const onPageRefresh = () => {
    if (userStore.getSearchValue()) {
      onSearch(userStore.getSearchValue(), true);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View>
        <SearchBar placeHolder="Search image" onChangeText={onChangeText} />
        <FlatList
          contentContainerStyle={styles.list}
          data={userStore.getSearchResult()}
          renderItem={props => <ImageCell item={props.item} />}
          keyExtractor={item => item.id}
          refreshing={userStore.getIsPageRefreshing()}
          onRefresh={onPageRefresh}
          ListEmptyComponent={
            <NoNetwork isVisible={isConnected} onChange={setIsConnected} />
          }
          onEndReached={() => {
            onPageFinish();
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            <ActivityIndicator
              animating={userStore.getIsSearching()}
              size="large"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

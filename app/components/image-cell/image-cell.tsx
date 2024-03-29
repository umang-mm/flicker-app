import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, Text } from 'react-native';
import { ImageDetailInterface } from '../../models/interfaces/image-detail-interface';
import { NavigatorParamList } from '../../navigators/app-navigator';
import styles from '../../screens/home-screen/home-screen.style';

interface ImageCellProps {
  item: ImageDetailInterface;
}

const ImageCell: React.FC<ImageCellProps> = ({ item }) => {
  const navigation = useNavigation<StackNavigationProp<NavigatorParamList>>();
  return (
    <Pressable
      style={styles.imageCellContainer}
      onPress={() => {
        navigation.navigate('ImageDetail', { id: item.id });
      }}>
      <Image
        source={{
          uri: `https://live.staticflickr.com/${item?.server}/${item?.id}_${item?.secret}_z.jpg`,
        }}
        style={styles.image}
      />
      <Text style={styles.text}>{item?.title || '-'}</Text>
    </Pressable>
  );
};

export default ImageCell;

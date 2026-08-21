import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Radar: undefined;
  Diary: undefined;
  Messages: { conversationId?: string } | undefined;
  Profile: undefined;
};

export type RadarScreenProps = BottomTabScreenProps<RootTabParamList, 'Radar'>;
export type DiaryScreenProps = BottomTabScreenProps<RootTabParamList, 'Diary'>;
export type MessagesScreenProps = BottomTabScreenProps<RootTabParamList, 'Messages'>;
export type ProfileScreenProps = BottomTabScreenProps<RootTabParamList, 'Profile'>;

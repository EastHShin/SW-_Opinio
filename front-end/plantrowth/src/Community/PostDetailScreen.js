import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
  Keyboard
} from 'react-native';

import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../Loader';
import { useIsFocused } from '@react-navigation/native';
import { getPost, deletePost, setResultState, createComment, setCommentResultState } from '../actions/CommunityActions';


import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AutoHeightImage from 'react-native-auto-height-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const PostDetailScreen = ({ route, navigation }) => {
  const { selectedId } = route.params;

  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState('');
  const [commentList, setCommentList] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [postCreateDate, setPostCreateDate] = useState('');
  const [postUpdateDate, setPostUpdateDate] = useState('');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const result = useSelector(state => state.CommunityReducer.result);
  const post = useSelector(state => state.CommunityReducer.post);
  const commentResult = useSelector(state => state.CommunityReducer.commentResult);

  const nowYear = new Date().getFullYear();
 
  useEffect(() => {
    if (isFocused) {
      AsyncStorage.getItem('userId').then(value => {
        if (value) {
          setUserId(JSON.parse(value));
          dispatch(getPost(selectedId, JSON.parse(value)));
        }
      })
    }
  }, [isFocused])

  useEffect(() => {
    setCommentList(post.comments);
    console.log(post);
    setPostCreateDate(new Date(post.createDate).getFullYear());
    if(post.updateDate){
    setPostUpdateDate(new Date(post.updateDate).getFullYear());
    }
  }, [post])


  useEffect(() => {
    if (result == 'success' && isFocused) {
      setLoading(false);
      dispatch(setResultState(''));
      setIsModalVisible(false);
      navigation.navigate('CommunityMainScreen');
    }
    else if (result == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setResultState(''));
      setIsModalVisible(false);
      alert('게시글 삭제 실패!');
    }
  }, [result])

  const deleteMode = () => {
    Alert.alert(
      "삭제", "게시글을 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => console.log("취소")
      },
      {
        text: "확인",
        onPress: () => {
          setLoading(true);
          dispatch(deletePost(selectedId))
        }
      }
    ]
    )
  }

  useEffect(() => {
    if (commentResult == 'success' && isFocused) {
      setLoading(false);
      dispatch(setCommentResultState(''));
    } else if (commentResult == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setCommentResultState(''));
      alert('댓글 작성 실패!');
    }
  }, [commentResult]);

  const renderComment = comment => {
    if (comment) {
      return comment.map((item, index) => {
        return (
          <View key={index} style={styles.commentWrapper}>
            <Text style={{ color: '#000000', fontWeight: 'bold' }}>
              {item.writer}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: Dimensions.get('window').height * 0.007,
                marginTop: Dimensions.get('window').height * 0.003,
              }}
            >
              {item.content}
            </Text>
            <Text style={{ fontSize: 11 }}>{item.date}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: Dimensions.get('window').width * 0.95,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }}
              />
            </View>
          </View>
        );
      });
    }
  };

  const SendHandler = (comment) => {
    if (!comment) {
      alert('아무 내용도 입력하지 않으셨어요!');
      return;
    }
    setLoading(true);
    dispatch(createComment(selectedId, userId, comment));
  }

  return (
    <SafeAreaView style={styles.body}>
      <Loader loading={loading} />

      <View style={styles.top}>
        <TouchableOpacity
          style={{ marginStart: Dimensions.get('window').width * 0.03 }}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-sharp" size={23} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            marginEnd: Dimensions.get('window').width * 0.01,
            fontFamily: 'NanumGothicBold',

            color: '#000000',
          }}
        >
          커뮤니티
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setIsModalVisible(true)}
          style={{ marginEnd: Dimensions.get('window').width * 0.02 }}
        >
          <Entypo name="dots-three-vertical" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            console.log('close');
            setIsModalVisible(false);
          }}
        >
          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPressOut={() => {
              setIsModalVisible(false);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <View
                style={
                  userId == post.userId ? styles.modal : styles.modalSmall
                }
              >
                {userId == post.userId ? (
                  <View>
                    <View style={styles.modalWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={deleteMode}
                      >
                        <Text style={styles.text}>삭제</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          setIsModalVisible(false);
                          navigation.navigate('PostEditScreen', {
                            selectedId: selectedId,
                          });
                        }}
                        style={{ flexDirection: 'row' }}
                      >
                        <Text style={styles.text}>수정</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                <View style={styles.modalWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      setIsModalVisible(false);
                      navigation.navigate('PostEditScreen', {
                        selectedId: selectedId,
                      });
                    }}
                    style={{ flexDirection: 'row' }}
                  >
                    <Text style={styles.text}>신고</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <View style={styles.postWrapper}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.userWrapper}>
              <Text
                style={{ fontSize: 15, fontWeight: 'bold', color: '#000000' }}
              >
                {post.writer}
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: 'bold', color: '#000000' }}
              >
                Lv. {post.level}
              </Text>
            </View>
            <View style={styles.date}>
              {nowYear == postCreateDate ?
               <Text style={{ fontSize: 10, marginLeft: Dimensions.get('window').width * 0.23 }}>
               최초 게시일 : {Moment(post.createDate).format("MM/DD HH:mm")}
             </Text>
             :
             <Text style={{ fontSize: 10, marginLeft: Dimensions.get('window').width * 0.15 }}>
             최초 게시일 : {Moment(post.createDate).format("YYYY/MM/DD HH:mm")}
           </Text>
           }
              {post.updateDate != null ? (
                <Text style={nowYear == postUpdateDate ? {fontSize:10, marginLeft: Dimensions.get('window').width * 0.23} : {fontSize:10, marginLeft: Dimensions.get('window').width * 0.15}}>
                  최근 수정일 : {nowYear == postUpdateDate ? Moment(post.updateDate).format("MM/DD HH:mm") : Moment(post.updateDate).format("YYYY/MM/DD HH:mm")}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
            {post.file_name != null ? (
              <View style={{ alignItems: 'center' }}>
                <AutoHeightImage
                  source={{ uri: post.file_name }}
                  width={Dimensions.get('window').width * 0.9}
                  style={{
                    marginBottom: Dimensions.get('window').height * 0.01,
                    marginTop: Dimensions.get('window').height * 0.01,
                  }}
                />
              </View>
            ) : null}
          </View>
          <View style={styles.likeAndComment}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={15}
              color="#DC143C"
              style={{ marginRight: Dimensions.get('window').width * 0.01 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: '#DC143C',
                marginRight: Dimensions.get('window').width * 0.02,
              }}
            >
              {post.countedLike}
            </Text>
            <SimpleLineIcons
              name="bubble"
              size={15}
              color="#00BFFF"
              style={{ marginRight: Dimensions.get('window').width * 0.01 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: '#00BFFF',
                marginRight: Dimensions.get('window').width * 0.02,
              }}
            >
              {post.countedComments}
            </Text>
          </View>
        </View>
        {renderComment(commentList)}
      </ScrollView>
      <KeyboardAvoidingView
        style={{ padding: 5, alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={styles.editScreen}>
          <TextInput
            multiline={true}
            placeholder={'내용을 입력하세요'}
            style={{
              width: screenWidth * 0.9,
            }}
            placeholderTextColor="#999999"
            underlineColorAndroid="#999999"
            onChangeText={comment => setComment(comment)}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}
            onPress={() => SendHandler(comment)}
          >
            <FontAwesome name={'send'} size={20} color={'#93d07d'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  top: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },
  content: {
    marginTop: Dimensions.get('window').height * 0.015,
    marginBottom: Dimensions.get('window').height * 0.015,
    color: '#000000',
  },
  postWrapper: {
    borderColor: '#C0C0C0',
    width: Dimensions.get('window').width * 0.95,
    marginTop: Dimensions.get('window').height * 0.015,
    marginBottom: Dimensions.get('window').height * 0.015,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 2,
  },
  userWrapper: {
    height: Dimensions.get('window').height * 0.07,
    width: Dimensions.get('window').width * 0.35,
    marginTop: Dimensions.get('window').height * 0.01,
    marginStart: Dimensions.get('window').width * 0.03,
  },
  textWrapper: {
    width: Dimensions.get('window').width * 0.9,
    marginTop: Dimensions.get('window').height * 0.005,
    marginStart: Dimensions.get('window').width * 0.02,
  },
  button: {
    marginTop: Dimensions.get('window').height * 0.005,
    marginStart: Dimensions.get('window').width * 0.02,
  },
  commentWrapper: {
    marginVertical: Dimensions.get('window').height * 0.01,
    width: Dimensions.get('window').width * 0.8,
    marginStart: Dimensions.get('window').width * 0.021,
  },
  likeAndComment: {
    flexDirection: 'row',
    marginStart: Dimensions.get('window').width * 0.015,
    marginVertical: Dimensions.get('window').height * 0.01,
  },
  date: {
    marginTop: Dimensions.get('window').height * 0.01,
  },
  modal: {
    marginTop: Dimensions.get('window').height * 0.01,
    marginLeft: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').height * 0.2,
    width: Dimensions.get('window').width * 0.47,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 10,
  },
  modalWrapper: {
    marginTop: Dimensions.get('window').height * 0.025,
  },
  text: {
    color: '#000000',
    fontSize: 17,
    marginLeft: Dimensions.get('window').width * 0.05,
  },
  modalSmall: {
    marginTop: Dimensions.get('window').height * 0.01,
    marginLeft: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width * 0.47,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  editScreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: '#e8ebed',
    width: '100%',
    padding: 5,
  },
})
export default PostDetailScreen;

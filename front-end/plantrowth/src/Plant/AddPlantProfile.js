import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import { addPlant, setAddPlantState } from '../actions/PlantActions';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import Loader from '../Loader';
import Modal from 'react-native-modal';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slider from '@react-native-community/slider';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

AddPlantProfile = ({ route }) => {
  const [loading, setLoading] = useState(false);

  const [plantName, setPlantName] = useState('');
  const [plantSpecies, setPlantSpecies] = useState('');
  const [plantBirth, setPlantBirth] = useState();
  const [plantTextBirth, setPlantTextBirth] = useState('');
  const [alarmCycle, setAlarmCycle] = useState();
  const [textAlarmCycle, setTextAlarmCycle] = useState('');
  const [lastWatering, setLastWatering] = useState('');
  const [textLastWatering, setTextLastWatering] = useState('');
  const [waterSupply, setWaterSupply] = useState(2);
  const [plantImage, setPlantImage] = useState('');

  const [validationPlantBirth, setValidationPlantBirth] = useState('');
  const [validationLastWatering, setValidationLastWatering] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [isDayPickerVisible, setDayPickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isWateringDatePickerVisible, setWateringDatePickerVisibility] =
    useState(false);

  const addPlantState = useSelector(state => state.PlantReducer.addResult);
  const isFocused = useIsFocused();
  const maximumDate = new Date();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const dayArray = [];
  for (let i = 0; i < 30; i++) {
    dayArray[i] = i + 1;
  }
  useEffect(() => {
  }, [plantImage]);

  useEffect(() => {
    console.log('addPlantState: ' + addPlantState + ' isFocused: ' + isFocused);
    if (addPlantState == 'success' && isFocused) {
      console.log('useEffect에서 success');
      setLoading(false);
      dispatch(setAddPlantState(''));
      navigation.navigate('HomeScreen');
    } else if (addPlantState == 'failure' && isFocused) {
      console.log('useEffec에서 failure');
      setLoading(false);
      dispatch(setAddPlantState(''));
    }
  }, [addPlantState]);

  const onPressHandler = () => {
    if (!plantImage) {
      Alert.alert('사진 업로드', '식물의 사진을 업로드 해주세요', [
        {
          text: '확인',
          onPress: () => { return }
        },
      ]);
      return;
    }
    if (!plantName) {
      Alert.alert('식물 이름 입력', '식물의 이름을 입력해주세요', [
        {
          text: '확인',
          onPress: () => { return }
        },
      ]);
      return;
    }
    if (!plantSpecies) {
      Alert.alert('식물 종 입력', '식물의 종을 입력해주세요', [
        {
          text: '확인',
          onPress: () => { return }
        },
      ]);
      return;
    }
    if (!plantBirth) {
      Alert.alert('키우기 시작한 날짜 입력', '식물을 키우기 시작한 날을 입력해주세요', [
        {
          text: '확인',
          onPress: () => { return }
        },
      ]);
      return;
    }
    if (!alarmCycle) {
      Alert.alert('물주는 주기 입력', '식물에게 물을 주는 주기를 입력해주세요', [
        {
          text: '확인',
          onPress: () => { return }
        },
      ]);
      return;
    }
    if (!lastWatering) {
      Alert.alert(
        '마지막으로 물 준 날을 입력해주세요',
        '아직 물을 주지 않으셨나요?',
        [
          {
            text: '네',
            onPress: () => {
              const fd = new FormData();

              console.log('네 눌렀음' + fd);

              fd.append('plant_species', plantSpecies);
              fd.append('plant_name', plantName);
              fd.append('plant_birth', plantBirth);

              fd.append('water_supply', waterSupply);
              fd.append('alarm_cycle', alarmCycle);
              fd.append('recent_watering', plantBirth);

              fd.append('file_name', {
                name: selectedImage.assets[0].fileName,
                uri: selectedImage.assets[0].uri,
                type: selectedImage.assets[0].type,
              });
              setLoading(true);
              dispatch(addPlant(fd, route.params.userId));
            },
          },
          {
            text: '입력할게요',
            onPress: () => {
              return;
            },
          },
        ],
      );
    } else {
      setLoading(true);

      const fd = new FormData();

      console.log('테스트전');
      console.log(fd);
      console.log('테스트후');
      const plant = {
        plant_species: plantSpecies,
        plant_name: plantName,
        plant_birth: plantBirth,

        water_supply: waterSupply,
        alarm_cycle: alarmCycle,
        recent_watering: lastWatering,
      };
      fd.append('plant_species', plantSpecies);
      fd.append('plant_name', plantName);
      fd.append('plant_birth', plantBirth);

      fd.append('water_supply', waterSupply);
      fd.append('alarm_cycle', alarmCycle);
      fd.append('recent_watering', lastWatering);

      fd.append('file_name', {
        name: selectedImage.assets[0].fileName,
        uri: selectedImage.assets[0].uri,
        type: selectedImage.assets[0].type,
      });

      dispatch(addPlant(fd, route.params.userId));
    }
  };

  const showDatePicker = value => {
    if (value === 'plantBirth') {
      setDatePickerVisibility(true);
    } else if (value === 'watering') {
      setWateringDatePickerVisibility(true);
    }
  };

  const hideDatePicker = value => {
    if (value === 'plantBirth') {
      setDatePickerVisibility(false);
    } else if (value === 'watering') {
      setWateringDatePickerVisibility(false);
    }
  };

  const handlePlantBirthConfirm = date => {
    setDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setValidationPlantBirth(date);
    setPlantBirth(year + '-' + month + '-' + day);
    setPlantTextBirth(year + '-' + month + '-' + day);
  };
  const handleLastWateringConfirm = date => {
    setWateringDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setValidationLastWatering(date);
    setLastWatering(year + '-' + month + '-' + day);
    setTextLastWatering(year + '-' + month + '-' + day);
  };

  const dateCalculator = (YYYYMMDD) => {
    console.log('dateCalculator: '+YYYYMMDD);

    let sYear = YYYYMMDD.substring(0, 4);
    let sMonth = YYYYMMDD.substring(5, 7);
    let sDate = YYYYMMDD.substring(8, 10);
    console.log('sYear : '+sYear);
    let date = new Date(
      Number(sYear),
      Number(sMonth)-1,
      Number(sDate),
    );
    date.setDate(date.getDate() + 1);
    console.log('dateCal date: '+ date);
    return date;
  }

  const photoUpload = async choice => {
    if (choice === 'take') {
      await takePicture();
    } else if (choice === 'pick') {
      await selectImage();
    }
  };

  const takePicture = () => {
    return new Promise((resolve, reject) => {
      launchCamera({ mediaType: 'photo' }, response => {
        if (!response.didCancel) {
          setPlantImage(response.assets[0].uri);
          setSelectedImage(response);
          resolve(response);
        }
      });
    });
  };
  const selectImage = () => {
    return new Promise((resolve, reject) => {
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (!response.didCancel) {
          setPlantImage(response.assets[0].uri);
          setSelectedImage(response);
          resolve(response);
        }
      });
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#BEE9B4',
      }}
    >
      <Loader loading={loading} />
      <View style={styles.sectionWrapper}>
        <KeyboardAwareScrollView>
          <Text
            style={{
              paddingTop: 10,
              fontFamily: 'NanumGothicExtraBold',
              color: '#556951',
              marginBottom: 10,
              textAlign: 'center',
            }}
          >
            식물 프로필 등록
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={styles.photoButton}
              activeOpacity={0.5}
              onPress={() => photoUpload('pick')}
            >
              <Icon name="image" size={35} color="#556951" />
            </TouchableOpacity>
            <View style={styles.imageWrapper}>
              {plantImage ? (
                <Image
                  style={{ width: screenWidth*0.3, height: screenWidth*0.3 }}
                  source={{ uri: plantImage }}
                />
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.photoButton}
              activeOpacity={0.5}
              onPress={() => photoUpload('take')}
            >
              <Icon name="camera" size={35} color="#556951" />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="pencil" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>식물 이름</Text>
              <TextInput
                style={styles.input}
                onChangeText={PlantName => setPlantName(PlantName)}
                underlineColorAndroid="#666666"
                placeholder="키우는 식물의 이름"
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
                maxLength={12}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="md-rose" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>식물 종</Text>
              <TextInput
                style={styles.input}
                onChangeText={PlantSpecies => setPlantSpecies(PlantSpecies)}
                underlineColorAndroid="#666666"
                placeholder="키우는 식물의 종"
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="md-calendar" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>키우기 시작한 날짜</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => showDatePicker('plantBirth')}
              >
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder="식물을 키우기 시작한 날짜"
                  placeholderTextColor="#808080"
                  underlineColorAndroid="#666666"
                  editable={false}
                  value={plantTextBirth}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handlePlantBirthConfirm}
              onCancel={() => hideDatePicker('plantBirth')}
              date={validationPlantBirth? validationPlantBirth: new Date()}
              minimumDate={new Date(1921, 0, 1)}
              maximumDate={
                validationLastWatering
                  ? validationLastWatering
                  : new Date(
                    maximumDate.getFullYear(),
                    maximumDate.getMonth(),
                    maximumDate.getDate(),
                  )
              }
            />
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="notifications" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>물 주기</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => setDayPickerVisibility(true)}
              >
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="#666666"
                  placeholder="식물에게 물을 주는 주기"
                  placeholderTextColor="#808080"
                  editable={false}
                  value={textAlarmCycle}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            isVisible={isDayPickerVisible}
            onBackButtonPress={() => setDayPickerVisibility(false)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                width: screenWidth * 0.6,
                height: screenHeight * 0.5,
                padding: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: 150, height: 250 }}>
                  <ScrollPicker
                    dataSource={dayArray}
                    selectedIndex={alarmCycle ? alarmCycle - 1 : 6}
                    onValueChange={selectedIndex => {
                      setAlarmCycle(selectedIndex);
                      setTextAlarmCycle(`물을 ${selectedIndex}일 마다 줘요`);
                    }}
                    wrapperHeight={250}
                    wrapperWidth={50}
                    itemHeight={50}
                    highlightColor="#BEE9B4"
                  />
                </View>
                <Text style={{ fontFamily: 'NanumGothicBold' }}> Days</Text>
              </View>
              <TouchableOpacity
                style={styles.ModalButton}
                onPress={() => {
                  setDayPickerVisibility(false);
                  console.log('alarm cycle: ' + alarmCycle);
                  if (alarmCycle == undefined) {
                    setAlarmCycle(7);
                    setTextAlarmCycle(`물을 7일 마다 줘요`);
                  }
                }}
              >
                <Text
                  style={{
                    fontFamily: 'NanumGothicBold',
                    textAlign: 'center',
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="water" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>물 주는 양</Text>
              <View
                style={{
                  backgroundColor: '#f7f8f9',
                  borderRadius: 5,
                  marginTop: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'space-between',
                    marginTop: 5,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      fontSize: 11,
                      paddingLeft: 5,
                    }}
                  >
                    조금만
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      fontSize: 11,
                      paddingRight: 10,
                    }}
                  >
                    적당히
                  </Text>
                  <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 11 }}>
                    많이
                  </Text>
                </View>

                <Slider
                  style={{
                    width: screenWidth * 0.6,
                    height: 20,
                    alignItems: 'center',
                  }}
                  minimumValue={1}
                  maximumValue={3}
                  step={1}
                  minimumTrackTintColor="#0067a3"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#0067a3"
                  value={2}
                  renderTrackMarkComponent={true}
                  onValueChange={value => {
                    setWaterSupply(value);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="md-calendar" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>마지막으로 물 준 날짜</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => showDatePicker('watering')}
              >
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder="식물에게 마지막으로 물을 준 날짜"
                  placeholderTextColor="#999999"
                  underlineColorAndroid="#666666"
                  editable={false}
                  value={textLastWatering}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isWateringDatePickerVisible}
              mode="date"
              onConfirm={handleLastWateringConfirm}
              onCancel={() => hideDatePicker('watering')}
              date={validationLastWatering ? validationLastWatering : new Date()}
              minimumDate={
                validationPlantBirth
                  ? validationPlantBirth
                  : new Date(1921, 0, 1)
              }
              maximumDate={
                new Date(
                  maximumDate.getFullYear(),
                  maximumDate.getMonth(),
                  maximumDate.getDate(),
                )
              }
            />
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            width: 400,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FontAwesome name={'close'} size={40} color={'#e3242b'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressHandler()}>
            <FontAwesome name={'check'} size={40} color={'#93d07d'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    backgroundColor: '#f1f3f5',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  sectionWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.9,
    padding: 10,
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  section: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: screenWidth * 0.66,
    height: screenHeight * 0.09,
    marginTop: 5,
    paddingTop: 5,
  },
  input: {
    color: '#222222',
    width: screenWidth * 0.6,
    borderRadius: 5,
    fontFamily: 'NanumGothic',
    padding: 5,
    marginTop: 5,
    backgroundColor: '#f7f8f9',
  },
  photoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalButton: {
    width: 50,
    height: 35,
    backgroundColor: '#93d07d',
    borderRadius: 3,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  infoLabel: {
    fontFamily: 'NanumGothicBold',
    fontSize: 12,
    marginLeft: 10,
  },
});

export default AddPlantProfile;

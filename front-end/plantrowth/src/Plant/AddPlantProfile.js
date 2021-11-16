import React, {useEffect, useState} from 'react';
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
import {addPlant, setAddPlantState} from '../actions/PlantActions';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import Loader from '../Loader';
import Modal from 'react-native-modal';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Slider from '@react-native-community/slider';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

AddPlantProfile = ({route}) => {
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

  const [validationPlantBirth, setValiationPlantBirth] = useState('');
  const [validationLastWatering, setValiationLastWatering] = useState('');
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
    //console.warn('이미지 등록');
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
      alert('식물 사진 입력');
      return;
    }
    if (!plantName) {
      alert('식물 이름 입력');
      return;
    }
    if (!plantSpecies) {
      alert('식물 종 입력');
      return;
    }
    if (!plantBirth) {
      alert('식물 키우기 시작한 날 입력');
      return;
    }
    if (!alarmCycle) {
      alert('Water Cycle 입력');
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
        
              console.log('네 눌렀음'+fd);

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
      //file_name: plantImage,
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
    //console.warn('date: '+date);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setValiationPlantBirth(date);
    setPlantBirth(year + '-' + month + '-' + day);
    setPlantTextBirth(year + '-' + month + '-' + day);
    //console.warn('palntbirth: '+plantBirth);
  };
  const handleLastWateringConfirm = date => {
    setWateringDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setValiationLastWatering(date);
    setLastWatering(year + '-' + month + '-' + day)
    setTextLastWatering(year + '-' + month + '-' + day);
    //console.warn('palntbirth: '+plantBirth);
  };

  const photoUpload = async choice => {
    if (choice === 'take') {
      await takePicture();
    } else if (choice === 'pick') {
      await selectImage();
    }
    //console.warn('after picture: ' + plantImage);
  };

  const takePicture = () => {
    return new Promise((resolve, reject) => {
      launchCamera({mediaType: 'photo'}, response => {
        if (!response.didCancel) {
          // console.warn(response);
          setPlantImage(response.assets[0].uri);
          setSelectedImage(response);
          resolve(response);
        }
      });
    });
  };
  const selectImage = () => {
    return new Promise((resolve, reject) => {
      launchImageLibrary({mediaType: 'photo'}, response => {
        if (!response.didCancel) {
          // console.warn(response);
          // console.warn(response.assets[0].base64);
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
      }}>
      <KeyboardAwareScrollView>
        <Loader loading={loading} />
        <View style={{alignItems: 'flex-start'}}>
          <Button
            title="Back"
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}
          />
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={{fontWeight: 'bold', color: '#556951'}}>
            식물 프로필 등록
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{margin: 20}}
              activeOpacity={0.5}
              onPress={() => photoUpload('pick')}>
              <Icon name="image" size={35} color="#556951" />
            </TouchableOpacity>
            <View style={styles.imageWrapper}>
              {plantImage ? (
                <Image
                  style={{width: 100, height: 100}}
                  source={{uri: plantImage}}
                />
              ) : null}
            </View>
            <TouchableOpacity
              style={{margin: 20}}
              activeOpacity={0.5}
              onPress={() => photoUpload('take')}>
              <Icon name="camera" size={35} color="#556951" />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Icon name="pencil" size={30} color="#BEE9B4" />
            <TextInput
              style={styles.input}
              onChangeText={PlantName => setPlantName(PlantName)}
              underlineColorAndroid="#f000"
              placeholder="식물 이름"
              placeholderTextColor="#808080"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <View style={styles.section}>
            <Icon name="md-rose" size={30} color="#BEE9B4" />
            <TextInput
              style={styles.input}
              onChangeText={PlantSpecies => setPlantSpecies(PlantSpecies)}
              underlineColorAndroid="#f000"
              placeholder="식물 종"
              placeholderTextColor="#808080"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <View style={styles.section}>
            <Icon name="md-calendar" size={30} color="#BEE9B4" />
            <TouchableOpacity
              style={{backgroundColor: '#fff'}}
              onPress={() => showDatePicker('plantBirth')}>
              <TextInput
                pointerEvents="none"
                style={styles.input}
                placeholder="키우기 시작한 날"
                placeholderTextColor="#808080"
                underlineColorAndroid="transparent"
                editable={false}
                value={plantTextBirth}
                onSubmitEditing={Keyboard.dismiss}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handlePlantBirthConfirm}
              onCancel={() => hideDatePicker('plantBirth')}
              minimumDate={new Date(1921, 0, 1)}
              maximumDate={
                validationLastWatering
                  ? validationLastWatering
                  : new Date(
                      maximumDate.getFullYear(),
                      maximumDate.getMonth(),
                      maximumDate.getDate() - 1,
                    )
              }
            />
          </View>
          <View style={styles.section}>
            <Icon name="notifications" size={30} color="#BEE9B4" />
            <TouchableOpacity
              style={{backgroundColor: '#fff'}}
              onPress={() => setDayPickerVisibility(true)}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="#f000"
                placeholder="Water Cycle"
                placeholderTextColor="#808080"
                editable={false}
                value={textAlarmCycle}
                onSubmitEditing={Keyboard.dismiss}
              />
            </TouchableOpacity>
          </View>
          <Modal
            isVisible={isDayPickerVisible}
            onBackButtonPress={() => setDayPickerVisibility(false)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                width: screenWidth * 0.6,
                height: screenHeight * 0.5,
                padding: 10,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'RED',
                }}>
                <Text> </Text>
                <View style={{width: 150, height: 250, backgroundColor: 'RED'}}>
                  <ScrollPicker
                    dataSource={dayArray}
                    selectedIndex={6}
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
                <Text style={{fontWeight: 'bold'}}> Days</Text>
              </View>

              <Button
                title="close"
                onPress={() => {
                  setDayPickerVisibility(false);
                }}
              />
            </View>
          </Modal>
          <View style={styles.section}>
            <Icon name="water" size={30} color="#BEE9B4" />

            {/* <TextInput
              style={styles.input}
              onChangeText={WaterSupply => setWaterSupply(WaterSupply)}
              underlineColorAndroid="#f000"
              placeholder="Water Supply"
              placeholderTextColor="#808080"
              onSubmitEditing={
                Keyboard.dismiss
              }
            /> */}
            <View style={{alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 12}}>물 주는 양</Text>
              <Text style={{fontWeight: 'bold', fontSize: 11}}>
                {
                  '적게                            적당히                            많이'
                }
              </Text>
              <Slider
                style={{width: screenWidth * 0.6, height: 20, marginLeft: 5}}
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
          <View style={styles.section}>
            <Icon name="md-calendar" size={30} color="#BEE9B4" />
            <TouchableOpacity
              style={{backgroundColor: '#fff'}}
              onPress={() => showDatePicker('watering')}>
              <TextInput
                pointerEvents="none"
                style={styles.input}
                placeholder="마지막 물 준 날"
                placeholderTextColor="#808080"
                underlineColorAndroid="transparent"
                editable={false}
                value={textLastWatering}
                onSubmitEditing={Keyboard.dismiss}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isWateringDatePickerVisible}
              mode="date"
              onConfirm={handleLastWateringConfirm}
              onCancel={() => hideDatePicker('watering')}
              minimumDate={
                validationPlantBirth
                  ? validationPlantBirth
                  : new Date(1921, 0, 1)
              }
              maximumDate={
                new Date(
                  maximumDate.getFullYear(),
                  maximumDate.getMonth(),
                  maximumDate.getDate() - 1,
                )
              }
            />
          </View>
        </View>
        <Button title="프로필 등록" onPress={onPressHandler} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    backgroundColor: '#f1f3f5',
    marginBottom: 5,
  },
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight * 0.78,
    width: screenWidth * 0.9,
    padding: 10,
    margin: 10,
    borderRadius: 15,
  },
  section: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: screenHeight * 0.07,
  },
  input: {
    color: '#000000',
    borderWidth: 2,
    borderColor: '#BEE9B4',
    width: screenWidth * 0.6,
    marginLeft: 5,
    borderRadius: 10,
  },
});

export default AddPlantProfile;

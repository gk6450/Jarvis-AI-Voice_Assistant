import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Animated, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/Features';
import Voice from '@react-native-community/voice';
import { openAIAPICall } from '../api/openAI';
import Tts from 'react-native-tts';

function HomeScreen() {

  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const scrollViewRef = useRef();

  const inputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchBoxWidth = useRef(new Animated.Value(wp(0))).current;
  const [searchText, setSearchText] = useState("");

  const handleSearchIconClick = () => {
    if (isExpanded) {
      // Collapse search box
      Animated.timing(searchBoxWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(false);
      });
    } else {
      // Expand search box
      Animated.timing(searchBoxWidth, {
        toValue: wp(50), // Set the desired search box width here
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(true);
        inputRef.current.focus();
      });
    }
  };

  const speechStartHandler = (e) => {
    console.log("Speech Start ", e);
  };

  const speechEndHandler = (e) => {
    setRecording(false);
    console.log("Speech End ", e);
  };

  const speechResultsHandler = (e) => {
    speech = e?.value[0];
    setSpeechResult(speech);
    console.log("Voice Event ", e);
  };

  const speechErrorHandler = (e) => {
    console.log("Speech Error ", e);
  };

  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start("en-US");
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  function handleSearch() {
    fetchResponse(searchText);
  }

  const fetchResponse = async (speech) => {
    if (speech.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({ role: "user", content: speech.trim() });
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);

      await openAIAPICall(speech.trim(), newMessages).then(res => {
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          setIsExpanded(false);
          setSpeechResult("");
          startTTF(res.data[res.data.length - 1]);
        }
        else {
          Alert.alert("Error", res.message.includes(429) ? "Rate Limit Exceeded. Please try again after few seconds or Contact Admin" : res.message);
        }
      });
    } else {
      Alert.alert("Error", "Speech Text is empty");
    }
  };

  function startTTF(message) {
    if (!message.content.includes("https")) {
      setSpeaking(true);
      Tts.speak(message.content);
    }
  }

  function stopSpeaking() {
    Tts.stop();
    setSpeaking(false);
  }


  function updateScrollView() {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true })
    }, 200);
  };

  function clear() {
    setMessages([]);
    setIsExpanded(false);
  };

  function activateSilentMode() {
    setSilentMode(true);
    stopSpeaking();
    setTimeout(() => {
      setSilentMode(false);
    }, 2000);
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;


    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-finish', (event) => { console.log("finish", event); setSpeaking(false) });
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

    return (() => {
      Voice.destroy().then(Voice.removeAllListeners);
    })
  }, []);

  useEffect(() => {
    if (speechResult.trim().length > 0) {
      fetchResponse(speechResult);
    }
  }, [speechResult]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>

      <SafeAreaView style={styles.outerContainer}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.jarvisIconContainer}>
            <Image source={silentMode ? require("../../assets/images/stopSpeaking.gif") : speaking ? require("../../assets/images/speaking.gif") : require("../../assets/images/JarvisIcon.png")} style={styles.botImage} />
          </View>
          {
            messages.length > 0 ? (
              <View style={styles.messageConatiner}>
                <View style={styles.chatBox}>
                  <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 16 }}
                    ref={scrollViewRef}>
                    {
                      messages.map((message, index) => {
                        if (message.role === "assistant") {
                          if (message.content.includes('https')) {
                            return (
                              <View key={index} style={styles.aiChatConatiner}>
                                <View style={styles.aiImageContainer}>
                                  <Image
                                    source={{ uri: message.content }}
                                    style={styles.aiImage} />
                                </View>
                              </View>
                            )
                          } else {
                            return (
                              <View key={index} style={styles.aiChatConatiner}>
                                <View style={styles.aiChat}>
                                  <Text style={{ lineHeight: 18, color: "black" }}>
                                    {message.content}
                                  </Text>
                                </View>
                              </View>)
                          }
                        } else {
                          return (
                            <View key={index} style={styles.userChatConatiner}>
                              <View style={styles.userChat}>
                                <Text style={{ lineHeight: 18, color: "black" }}>
                                  {message.content}
                                </Text>
                              </View>
                            </View>
                          )
                        }
                      })
                    }
                  </ScrollView>
                </View>
              </View>
            ) : (
              <Features />
            )
          }
          {
            loading ? (
              <View style={styles.loadingContainer}>
                <Image source={require("../../assets/images/loading.gif")} style={styles.loadingIcon} />
              </View>) : (
              speaking ? (
                <TouchableOpacity style={styles.loadingContainer} onPress={activateSilentMode}>
                  <Image source={require("../../assets/images/silent.png")} style={styles.silentIcon} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.buttonsContainer, { paddingHorizontal: messages.length > 0 ? 0 : isExpanded ? 0 : 20 }]}>
                  <TouchableOpacity onPress={handleSearchIconClick}>
                    <Image source={require("../../assets/images/search.png")} style={styles.searchIcon} />
                  </TouchableOpacity>

                  {
                    isExpanded && (

                      <Animated.View style={[styles.searchBox, { width: searchBoxWidth }]}>

                        <TextInput
                          onChangeText={(value) => setSearchText(value)}
                          ref={inputRef}
                          style={styles.input}
                          placeholder="Search..."
                          onBlur={handleSearchIconClick}
                          onSubmitEditing={handleSearch}
                        />
                      </Animated.View>
                    )
                  }

                  {
                    !isExpanded && (
                      recording ? (
                        <TouchableOpacity onPress={stopRecording}>
                          <Image source={require("../../assets/images/voiceLoading.gif")} style={styles.recordingIcon} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={startRecording}>
                          <Image source={require("../../assets/images/recordingIcon.jpg")} style={styles.recordingIcon} />
                        </TouchableOpacity>
                      )
                    )}

                  {
                    messages.length > 0 && (
                      <TouchableOpacity onPress={clear}>
                        <Image source={require("../../assets/images/clear.png")} style={styles.clearIcon} />
                      </TouchableOpacity>
                    )
                  }
                </View>
              )
            )
          }
        </KeyboardAvoidingView>
      </SafeAreaView>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    paddingVertical: 20
  },
  innerContainer: {
    justifyContent: "center"
  },
  botImage: {
    height: hp(15),
    width: hp(15)
  },
  messageConatiner: {
    flex: 1,
    marginTop: 8
  },
  assistantText: {
    color: "#374151",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: wp(5)
  },
  chatBox: {
    marginTop: 10,
    padding: 15,
    borderRadius: 24,
    height: hp(64),
    backgroundColor: "#e5e5e5"
  },
  userChatConatiner: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  aiChatConatiner: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  userChat: {
    width: wp(70),
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderTopRightRadius: 0
  },
  aiChat: {
    width: wp(70),
    backgroundColor: "#abdff7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderTopLeftRadius: 0
  },
  aiImageContainer: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#abdff7",
    borderTopLeftRadius: 0,
    marginBottom: 8,
  },
  aiImage: {
    borderRadius: 10,
    resizeMode: "contain",
    height: wp(50),
    width: wp(60)
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 20
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 20
  },
  recordingIcon: {
    width: hp(10),
    height: hp(10),
    borderRadius: 9999
  },
  clearIcon: {
    height: hp(6),
    width: hp(6),
  },
  searchIcon: {
    height: hp(6),
    width: hp(6)
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b9e7fa',
    borderRadius: 20,
    paddingHorizontal: 10,
    overflow: 'hidden',
    height: hp(7),

  },
  input: {
    flex: 1,
    padding: 5,
    color: "black"
  },
  loadingIcon: {
    height: hp(10),
    width: hp(10),
  },
  jarvisIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  silentIcon: {
    height: hp(7),
    width: hp(7),
  }
});

export default HomeScreen;
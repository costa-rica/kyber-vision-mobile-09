import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Switch,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import VwSettings from "./VwSettings";
import * as ScreenOrientation from "expo-screen-orientation";

export default function TemplateView(props) {
  const [modalVisible, setModalVisible] = useState(false);

  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get("window").width)
  );
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to visible position
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").width, // Slide out of view
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start(() => setModalVisible(false));
  };

  // Dynamic styles
  const styleVwTopGreyBand = {
    backgroundColor: props.noGrayBand ? null : "#A3A3A3",
    marginTop: 5,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "flex-end",
    width: "95%",
    padding: 5,
  };
  const styleVwTopGreyBandWithBackButton = {
    backgroundColor: props.noGrayBand ? null : "#A3A3A3",
    marginTop: 5,
    borderRadius: 35,
    justifyContent: "space-between",
    // alignItems: "flex-end",
    flexDirection: "row",
    width: "95%",
    padding: 5,
  };

  const handleBackPress = async (navigation) => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <View
          style={
            props.noBackButton
              ? styleVwTopGreyBand
              : styleVwTopGreyBandWithBackButton
          }
        >
          {props.noBackButton ? null : (
            <TouchableOpacity
              style={styles.touchOpCircle}
              // onPress={() => pressedGear()}
              onPress={() => {
                if (props.player) {
                  props.player.pause();
                }
                // props.navigation.goBack();
                handleBackPress(props.navigation);
              }}
            >
              {/* <Text> User: {userReducer.email}</Text> */}

              <Image
                style={styles.imgGearGray}
                source={require("../../assets/images/btnBackArrow.png")}
                alt="logo"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {props.hideSettings ? null : (
            <TouchableOpacity
              style={styles.touchOpCircle}
              // onPress={() => pressedGear()}
              onPress={openModal}
            >
              {/* <Text> User: {userReducer.email}</Text> */}
              <Image
                style={styles.imgGearGray}
                source={require("../../assets/images/btnGear.png")}
                alt="logo"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* -------- BOTTOM ----- */}
      <View style={styles.containerBottom}>{props.children}</View>

      {/* -------- MODAL ----- */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        // style={styles.modalStyle}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View style={styles.modalBackdrop}>
            <View style={styles.containerTop}>
              {/* <View style={styles.vwTopGreyBand}> */}
              <View style={styleVwTopGreyBand}>
                <TouchableOpacity
                  style={styles.touchOpCircle}
                  // onPress={() => pressedGear()}
                  onPress={closeModal}
                >
                  <Image
                    style={styles.imgGearGray}
                    source={require("../../assets/images/closeButton.png")}
                    alt="logo"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View
              style={[
                styles.modalContainerMiddle,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <VwSettings />
            </Animated.View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2EBF2",
  },
  // ----- TOP Container -----
  containerTop: {
    display: "flex",
    alignItems: "center",
    // height: "15%",
    paddingBottom: 5,
  },

  touchOpCircle: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25, // Makes it a circle
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
  },
  imgGearGray: {
    // width: "100%",
    // height: "100%",
    // borderRadius: 35, // Match circle's border radius
    width: "100%",
    height: "100%",
    borderRadius: 17, // Match circle's border radius
  },
  // imgCloseButton: {
  //   width: "100%",
  //   height: "100%",
  //   borderRadius: 35, // Match circle's border radius
  // },

  // ------ Bottom -------
  containerBottom: {
    flex: 1,
    // display: "flex",
    // alignItems: "center",
  },

  // --------- MODAL -----
  modalContainerMiddle: {
    flex: 1,
    borderTopWidth: 2, // Adjust thickness as needed
    borderTopColor: "gray", // Change color as desired
    borderStyle: "dashed",
    backgroundColor: "transparent",
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay
  },
});

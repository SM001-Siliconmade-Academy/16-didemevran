import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FaceDetector from "expo-face-detector";
import questions from "../data/questions.json";

const HomeScreen = () => {
  const [type, setType] = useState(CameraType.front);
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();

  const [bounds, setBounds] = useState({ origin: { x: 0, y: 0 } });
  const [yawAngle, setYawAngle] = useState(0);
  const [rollAngle, setRollAngle] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [isDOne, setIsDone] = useState(false);

  if (!cameraPermission) {
    // Camera permissions are still loading
    return (
      <Text style={{ textAlign: "center" }}>Permissions still loading</Text>
    );
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          izinlerinize ihtiyacımız var
        </Text>
        <Button onPress={requestCameraPermission} title="izin ver" />
      </SafeAreaView>
    );
  }

  const handleFacesDetected = ({ faces }) => {
    if (faces.length === 0) {
      return;
    }
    const face = faces[0];
    const { bounds, yawAngle, rollAngle } = face;
    setBounds(bounds);
    setYawAngle(yawAngle);
    setRollAngle(rollAngle);
    // console.log(rollAngle)
    if (rollAngle < 28 && rollAngle > 26) {
      handleAnswer("NO");
    } else if (rollAngle < 335 && rollAngle > 333) {
      handleAnswer("YES");
    }
  };

  const handleAnswer = (answer) => {
    if (answer === "YES") {
      setYesCount(yesCount + 1);
    } else if(answer === "NO") {
      setNoCount(noCount + 1);
    }

    if (questionNumber === questions.length - 1) {
      setIsDone(true);
    } else {
      setQuestionNumber(questionNumber + 1);
    }
  };

  const handleStartAgain = () => {
    setQuestionNumber(0);
    setIsDone(false);
    setYesCount(0);
    setNoCount(0);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        <View
          style={[
            styles.faceBorder,
            {
              left: bounds.origin.x - 65,
              top: bounds.origin.y - 130,
              transform: [
                { rotateX: `${0}deg` },
                { rotateY: `${0}deg` },
                { rotateZ: `${rollAngle}deg` },
              ],
            },
          ]}
        >
          {isDOne ? (
            yesCount > noCount ? (
              <View style={styles.textContainer}>
                <Text style={styles.questionText}>Toxic Iliski</Text>
                <TouchableOpacity
                  style={styles.again}
                  onPress={handleStartAgain}
                >
                  <Text style={styles.answer}>TEKRAR</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.textContainer}>
                <Text style={styles.questionText}>Normal Iliski</Text>
                <TouchableOpacity
                  style={styles.again}
                  onPress={handleStartAgain}
                >
                  <Text style={styles.answer}>TEKRAR</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <>
              <View style={styles.textContainer}>
                <Text style={styles.questionText}>
                  {questions[questionNumber].id}
                  {" - "}
                  {questions[questionNumber].text}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonYes}>
                  <Text style={styles.answer}>EVET</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonNo}>
                  <Text style={styles.answer}>HAYIR</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Camera>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  faceBorder: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  textContainer: {
    backgroundColor: "#1E91FF",
    width: 250,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  questionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  buttonYes: {
    backgroundColor: "#369E07",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    flex: 1,
  },
  buttonNo: {
    backgroundColor: "#F5242D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    flex: 1,
  },
  answer: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  again: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
  },
});

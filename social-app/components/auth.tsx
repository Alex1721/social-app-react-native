import {
  Pressable,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
} from "react-native";

import Colors from "@/constants/Colors";

import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import * as WebBrowser from "expo-web-browser";

import React from "react";

WebBrowser.maybeCompleteAuthSession();

enum Strategy {
  Google = "oauth_google",
}

const Authentication = () => {
  useWarmUpBrowser();

  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: Strategy.Google,
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      // The user has successfully logged in.
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error: ", err);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: themeColors.background,
      }}
    >
      <Pressable
        onPress={() => onSelectAuth(Strategy.Google)}
        style={[styles.container, { borderColor: themeColors.text }]}
      >
        <Image source={require("@/assets/images/authentication/google.png")} />
        <Text style={{ fontSize: 20, color: themeColors.text }}>
          Login with google
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 60,
    borderWidth: 0.5,
    borderRadius: 12,
  },
});

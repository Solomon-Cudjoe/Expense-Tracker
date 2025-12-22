import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "@/assets/styles/auth.styles.js";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors.js";
import { Image } from "expo-image";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else if (signInAttempt.status === "needs_second_factor") {
        // Prepare the email code for second factor
        await signInAttempt.prepareSecondFactor({
          strategy: "email_code",
        });
        setPendingVerification(true);
        setError("");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>
          {pendingVerification ? "Verify Your Email" : "Welcome Back"}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        {!pendingVerification ? (
          <>
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={password}
              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity onPress={onSignInPress} style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <Link href="/signUp" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.footerText}>
              Enter the verification code sent to your email
            </Text>
            <TextInput
              style={styles.verificationInput}
              value={code}
              placeholder="Enter code"
              placeholderTextColor="#9A8478"
              keyboardType="number-pad"
              onChangeText={(code) => setCode(code)}
            />
            <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
}

import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Header from "../../../components/Header";
import { hp } from "../../../utils";
import { tintColorDark } from "../../../constants/Colors";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useSignUpMutation } from "../../../redux/auth/authApiSlice";
import { TouchableOpacity } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import {
  useCheckRefillEligibityQuery,
  useRequestRefillCardsMutation,
} from "../../../redux/cards/cardsApiSlice";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";

export default function RequestCards(props) {
  const _formik = useRef();
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [cards_sold, setCardsSold] = useState(0);
  const [cards_pending, setCardsPending] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [requestRefillCards, { isLoading }] = useRequestRefillCardsMutation();
  const {
    data: refillEligibilityData,
    error: refillEligibilityError,
    isLoading: refillEligibilityLoading,
    isSuccess: refillEligibilitySuccess,
    refetch: refillEligibilityRefetch,
  } = useCheckRefillEligibityQuery();
  const isFocued = useIsFocused();

  useEffect(() => {
    refillEligibilityRefetch();
  }, [isFocued]);

  useEffect(() => {
    setCardsSold(refillEligibilityData?.cards_sold);
    setCardsPending(refillEligibilityData?.cards_pending);
  }, [isFocued, refillEligibilityData]);

  const percentage =
    cards_sold + cards_pending !== 0
      ? (cards_sold / (cards_sold + cards_pending)) * 100
      : 0;

  const validationSchema = yup.object().shape({
    country: yup.string("Required").required("Country is required"),
    address1: yup.string("Required").required("Address1 is required"),
    address2: yup.string("Required").required("Address2 is required"),
    city: yup.string("Required").required("City is required"),
    zip: yup
      .string("Required")
      .required("Zip code is required")
      .length(5, "Zip code length must be 5"),
    cards_amount: yup.string("Required").required("Card amount is required"),
  });

  const createCardReuest = async (values: object) => {
    try {
      console.log("fff");
      if (values?.cards_amount <= 50) {
        const resp = await requestRefillCards(values);

        if (resp?.data === null) {
          Toast.show("Your card is created successfully.", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
          props.navigation.goBack();
        }
      } else {
        Toast.show("Cards amount must be less than or equal to 50", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (e) {
      console.log("creatCardError--->", e);
    }
  };

  //
  return refillEligibilityData?.eligible === true ? (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <Header title={t("Create New Request Card")} />
      <View style={styles.inputContainer}>
        <Formik
          innerRef={_formik}
          key={countryCode} // add this prop for changes the country value
          initialValues={{
            country: countryCode,
            address1: "",
            address2: "",
            city: "",
            zip: "",
            cards_amount: "",
          }}
          validationSchema={validationSchema}
          validateOnBlur={false}
          onSubmit={(values) => createCardReuest(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <Text style={styles.credsFont}>Country</Text>
              <TouchableOpacity
                style={styles.inputViewStyle}
                onPress={() => setShow(true)}
              >
                {countryCode ? (
                  <Text style={{ width: "20%", marginLeft: 10 }}>
                    {countryFlag}
                  </Text>
                ) : (
                  <Text style={{ width: "15%", marginLeft: 10 }}>🏳️ </Text>
                )}
                <Input
                  // onChangeText={handleChange("country")}
                  editable={false}
                  onBlur={handleBlur("country")}
                  value={values.country}
                  style={{
                    ...styles.inputField,
                    width: countryCode ? "95%" : "90%",
                  }}
                  icon
                  iconColor={"#ccc"}
                  iconName="city-variant"
                  inputViewStyle={{
                    ...styles.inputViewStyle,

                    marginTop: 10,
                    width: countryCode ? "70%" : "80%",
                  }}
                  autoCapitalize={"none"}
                  placeholder={t("select your country")}
                  // onPressIn={() => setShow(true)}
                />
              </TouchableOpacity>
              {errors.phone && touched.phone && (
                <Text style={styles.errorText}>{t(errors.phone)}</Text>
              )}
              <Text style={styles.credsFont}>{t("Address 1")}</Text>
              <Input
                onChangeText={(text) => handleChange("address1")(text)}
                onBlur={handleBlur("address1")}
                value={values.address1}
                style={styles.inputField}
                icon
                iconName="map-marker"
                inputViewStyle={styles.inputViewStyle}
                iconColor={"#ccc"}
                autoCapitalize={"none"}
                placeholder={t("Enter your address")}
              />
              {errors.address1 && touched.address1 && (
                <Text style={styles.errorText}>{errors.address1}</Text>
              )}
              <Text style={styles.credsFont}>{t("Address 2")}</Text>
              <Input
                onChangeText={(text) => handleChange("address2")(text)}
                onBlur={handleBlur("address2")}
                value={values.address2}
                style={styles.inputField}
                icon
                iconName="map-marker"
                inputViewStyle={styles.inputViewStyle}
                iconColor={"#ccc"}
                autoCapitalize={"none"}
                placeholder={t("Enter your address")}
              />
              {errors.address2 && touched.address2 && (
                <Text style={styles.errorText}>{errors.address2}</Text>
              )}
              <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                {t("City")}
              </Text>
              <Input
                onChangeText={(text) => handleChange("city")(text)}
                onBlur={handleBlur("city")}
                value={values.city}
                style={styles.inputField}
                icon
                iconName="city"
                inputViewStyle={styles.inputViewStyle}
                iconColor={"#ccc"}
                autoCapitalize={"none"}
                placeholder={t("Enter your city")}
              />
              {errors.city && touched.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
              <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                {t("Zip Code")}
              </Text>
              <Input
                onChangeText={(text) => handleChange("zip")(text)}
                onBlur={handleBlur("zip")}
                value={values.zip}
                style={styles.inputField}
                icon
                iconName="math-norm-box"
                inputViewStyle={styles.inputViewStyle}
                iconColor={"#ccc"}
                autoCapitalize={"none"}
                keyboardType="number-pad"
                placeholder={t("Enter your zip code")}
              />
              {errors.zip && touched.zip && (
                <Text style={styles.errorText}>{errors.zip}</Text>
              )}
              <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                {t("Cards Amount")}
              </Text>
              <Input
                onChangeText={(text) => handleChange("cards_amount")(text)}
                onBlur={handleBlur("cards_amount")}
                value={values.cards_amount}
                style={styles.inputField}
                icon
                iconName="numeric"
                inputViewStyle={styles.inputViewStyle}
                iconColor={"#ccc"}
                autoCapitalize={"none"}
                keyboardType="number-pad"
                placeholder={t("Enter the card amount")}
              />
              {errors.cards_amount && touched.cards_amount && (
                <Text style={styles.errorText}>{errors.cards_amount}</Text>
              )}
            </View>
          )}
        </Formik>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={() => {
              _formik.current.handleSubmit();
              console.log("ddaa", _formik.current.values);
            }}
            isLoading={isLoading}
            disabled={isLoading}
            loaderColor={{ color: "white" }}
          >
            <Text style={styles.buttonText}>{t("Create")}</Text>
          </Button>
        </View>
      </View>

      <CountryPicker
        show={show}
        style={{
          modal: {
            height: 500,
          },
        }}
        onBackdropPress={() => setShow(false)}
        onRequestClose={() => setShow(false)}
        pickerButtonOnPress={(item) => {
          console.log("item here", item);
          setCountryCode(item?.name?.en);
          setCountryFlag(item.flag);
          setShow(false);
        }}
      />
    </ScrollView>
  ) : (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <Header title={t("Create New Request Card")} />
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>
          {t("You need to sell")} {cards_pending}{" "}
          {t(
            "more cards in order to request new cards. Only paid sales are taken into account.",
          )}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 50,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ color: "green", fontSize: 12, fontWeight: "600" }}>
            {t("Sold")}: {cards_sold}
          </Text>
          <Text style={{ color: "red", fontSize: 12, fontWeight: "600" }}>
            {t("Pending")}: {cards_pending}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Progress.Bar
            progress={percentage !== null && percentage/100}
            width={300}
            height={8}
            color={tintColorDark}
            unfilledColor={"#d1d1d1"}
            borderWidth={0}
          />
          <Text style={{ color: "black", fontSize: 12, fontWeight: "600" }}>
            {percentage.toFixed(2)}% {t("sold")}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.buttonContainer,
          { marginTop: 400, marginHorizontal: 15 },
        ]}
      >
        <Button
          style={styles.button}
          onPress={() => {
            props.navigation.goBack();
          }}
          isLoading={isLoading}
          disabled={isLoading}
          loaderColor={{ color: "white" }}
        >
          <Text style={styles.buttonText}>{t("Go Back")}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginBottom: hp(1),
  },
  inputField: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    height: hp(6),

    width: "90%",
    color: "black",
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: hp(1),
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: hp(1),
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(3),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  buttonBelow: {
    backgroundColor: tintColorDark,
    borderRadius: hp(1),
    height: hp(4),
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderColor: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
  },
});
